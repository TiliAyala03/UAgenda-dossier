# Resultados — Prueba de Estrés (500+ VUs, k6)

## Semilla de datos (volumen, distribución, caso extremo)

- **Volumen:** [500 `SELECT COUNT(*) FROM recordatorios;` y `SELECT COUNT(*) FROM usuario;`]
- **Caso extremo probado:** cuenta de prueba `usuario1@example.com` (idUsuario=2) — Sin recordatorios

## Condiciones de la medición

- **Fecha:** 18 de septiembre de 2026
- **Máquina:** Portatil ASUS - 12 GB RAM
- **Perfil de carga:** rampa 0→500 VUs en 1 min, sostenido 30s, bajada 30s
- **Ruta medida:** `POST /loginAccess`
- **Servidor:** Flask dev server (Werkzeug), `debug=True`, `threaded=True` — permaneció vivo y respondiendo durante toda la prueba, sin caerse
- **Limitación conocida:** las 500 VUs usan la misma cuenta de prueba (no 500 usuarios distintos)

## Validez de la medición — 3 corridas, primera descartada

| Corrida | p95 (ms) | Tasa de error |
|---|---|---|---|
| 1 (calentamiento) | 7020 ms | 50.95% |


## Resultado crudo

```
THRESHOLDS
http_req_duration
✗ 'p(95)<5000' p(95)=7.02s

http_req_failed
✗ 'rate<0.05' rate=50.95%

TOTAL RESULTS
checks_total.......: 5652   46.765031/s
checks_succeeded...: 49.04% 2772 out of 5652
checks_failed......: 50.95% 2880 out of 5652
✗ status es 200
  ↳  49% — ✓ 2772 / ✗ 2880

HTTP
http_req_duration..............: avg=2.29s min=0s       med=0s    max=9.18s  p(90)=5.48s  p(95)=7.02s
  { expected_response:true }...: avg=4.68s min=149.01ms med=4.84s max=9.18s  p(90)=7.02s  p(95)=7.41s
http_req_failed................: 50.95% 2880 out of 5652
http_reqs......................: 5652   46.765031/s

EXECUTION
iteration_duration.............: avg=7.22s min=1.01s med=5.88s max=28.99s p(90)=14.09s p(95)=21.71s
iterations.....................: 5652   46.765031/s
vus.............................: 116   min=8   max=500
vus_max..........................: 500   min=500 max=500

NETWORK
data_received...................: 34 MB  279 kB/s
data_sent........................: 563 kB 4.7 kB/s
```

## Contraste contra ESC-PERF-03

| | Medida esperada | Dato real (mediana) | ¿Cumple? |
|---|---|---|---|
| El proceso de Flask sigue respondiendo (no se cae) | Sí | ✅ Sí, el servidor nunca se cayó | ✅ |

## Interpretación

El sistema **degrada en vez de colapsar** — el proceso de Flask se
mantuvo vivo y respondiendo durante toda la prueba en las 3 corridas,
lo cual ya es un resultado positivo por sí mismo frente a ESC-PERF-03.

Sin embargo, a 500 VUs concurrentes la tasa de error (50.95% en la
corrida 1) y el p95 (7.02s) exceden ampliamente los umbrales definidos.

**Causa raíz identificada (revisada tras inspeccionar el log del
servidor):** se revisó la consola de `python main.py` durante la
corrida y no aparece ningún error ni traceback de MySQL — todas las
líneas muestran `200`. Esto descarta que el cuello de botella sea el
límite de conexiones de MySQL. La evidencia apunta en cambio a que el
**servidor de desarrollo Werkzeug** tiene una cola de conexiones TCP
entrantes (`backlog`) limitada, y una porción significativa de las
peticiones se rechazan a nivel de sistema operativo antes de que Flask
llegue a procesarlas — consistente con el valor `http_req_duration
min=0s`, que indica conexiones que nunca llegaron a establecerse, no
respuestas instantáneas.

**Conclusión defendible:** el punto de quiebre observado es evidencia
a favor de que un servidor WSGI de producción (ej. Gunicorn con
múltiples workers) resolvería este problema de capacidad de conexión,
más que evidencia de un problema en la lógica de negocio o en las
consultas SQL — aunque esto último no fue medido de forma aislada en
este experimento y queda como trabajo futuro si se quiere separar
ambas causas.

## Hallazgo adicional (fuera del alcance de este escenario, registrado para el inventario de riesgos)

El log de consola de `main.py` imprime el diccionario completo del
usuario autenticado en cada login, **incluyendo el hash de la
contraseña** (`scrypt:...`). No debería exponerse ningún dato de
credenciales, ni siquiera hasheado, en la salida estándar del
servidor. Recomendado sumar como riesgo en `evidencias.md` o
`inventario-de-riesgos.md`.

## Limpieza posterior (opcional)

`TRUNCATE TABLE Traza;` en MySQL Workbench, si se generaron muchas
filas de prueba durante las 3 corridas.