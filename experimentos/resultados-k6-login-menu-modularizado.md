# Resultados — Login + carga del menú principal (k6), versión modularizada

## Condiciones de la medición

- **Fecha y hora:** 06/11/2026 - 16:14 p.m.
- **Máquina:** Portatil ASUS - 12 GB RAM
- **Versión del código:** modularizada (blueprints), con el SQL de
  `recordatorios` consolidado en **1 SELECT** (antes eran 7)
- **Ruta medida:** flujo completo en **2 requests** por iteración:
  1. `POST /loginAccess` (autenticación + `INSERT` de traza; responde con
     redirect 302, no seguido por k6)
  2. `GET /admin` (1 SELECT a `recordatorios` + render de `admin.html`)

  En la medición anterior todo ocurría en una sola petición. La métrica
  `login_menu_total` suma la duración de ambos requests, por lo que es el
  equivalente directo del `http_req_duration` de aquella medición.
- **Carga aplicada:** rampa 0→10 VUs en 30s, sostenido 1 min, bajada 30s
  (mismo perfil que el baseline y que la medición anterior, para que la
  comparación sea justa)
- **Efecto secundario conocido:** cada iteración inserta una fila real
  en la tabla `Traza` — 808 filas nuevas al final de esta corrida.

## Resultado crudo de k6

```
THRESHOLDS

http_req_failed
✓ 'rate<0.01' rate=0.00%

login_menu_total
✓ 'p(95)<1000' p(95)=192.58ms


TOTAL RESULTS

checks_total.......: 2424   20.104975/s
checks_succeeded...: 100.00% 2424 out of 2424
checks_failed......: 0.00%   0 out of 2424

✓ login redirige (302)
✓ status es 200
✓ devuelve el menu principal

CUSTOM
login_menu_total...............: avg=138.49ms min=120.06ms med=129.4ms max=351.75ms p(90)=156.44ms p(95)=192.58ms

HTTP
http_req_duration..............: avg=69.24ms  min=2.05ms   med=62.61ms max=348.34ms p(90)=138.95ms p(95)=152.75ms
  { expected_response:true }...: avg=69.24ms  min=2.05ms   med=62.61ms max=348.34ms p(90)=138.95ms p(95)=152.75ms
http_req_failed................: 0.00%  0 out of 1616
http_reqs......................: 1616   13.403317/s

EXECUTION
iteration_duration.............: avg=1.13s    min=1.12s    med=1.13s   max=1.35s    p(90)=1.15s    p(95)=1.19s
iterations.....................: 808    6.701658/s
vus............................: 1      min=1         max=10
vus_max........................: 10     min=10        max=10

NETWORK
data_received..................: 10 MB  85 kB/s
data_sent......................: 322 kB 2.7 kB/s
```

## Resumen de métricas clave

| Métrica | Valor obtenido |
|---|---|
| p50 (mediana) del flujo completo | 129.40 ms |
| p95 del flujo completo | 192.58 ms |
| Máximo observado (flujo completo) | 351.75 ms |
| Tasa de error | 0.00% |
| Requests totales | 1616 (808 iteraciones × 2) |
| Throughput | 13.40 req/s (6.70 iteraciones/s) |

`http_req_duration` (avg 69.24 ms, p95 152.75 ms) es por request y mezcla el
POST con el GET /admin, por lo que no es comparable con la medición
anterior; para eso se usa `login_menu_total`.

## Contraste contra el escenario formulado (ESC-PERF-02)

| | Medida esperada | Dato real obtenido | ¿Cumple? |
|---|---|---|---|
| p95 tiempo de respuesta | < 1000 ms | 192.58 ms | ✅ Sí, con margen amplio (~5.2x mejor que el umbral) |
| Tasa de error | 0% | 0.00% | ✅ Sí |

## Comparación contra la medición anterior (7 SELECT, 1 request)

| Métrica del flujo completo | Antes (7 SELECT) | Ahora (1 SELECT + redirect) | Diferencia |
|---|---|---|---|
| Promedio | 172.01 ms | 138.49 ms | −33.5 ms (−19%) |
| Mediana (p50) | 165.37 ms | 129.40 ms | −36.0 ms (−22%) |
| p90 | 204.93 ms | 156.44 ms | −48.5 ms (−24%) |
| p95 | 220.97 ms | 192.58 ms | −28.4 ms (−13%) |
| Mínimo | 139.42 ms | 120.06 ms | −19.4 ms (−14%) |
| Máximo | 294.94 ms | 351.75 ms | +56.8 ms (+19%, peor) |
| Tasa de error | 0.00% | 0.00% | igual |
| Iteraciones/s | 6.51 | 6.70 | sin cambio relevante* |

\* El throughput lo fija el `sleep(1)` con 10 VUs, no el servidor, así que no
sirve como indicador de mejora.

**Conclusión: mejora moderada, pero no concluyente.** Todas las métricas de
tendencia central bajaron entre 13% y 24% (≈ 30–50 ms), y también bajó el
mínimo. El máximo empeoró, aunque es un solo valor extremo y es el menos
estable de todos. Dos cautelas:

- **Variabilidad entre corridas.** Una corrida preliminar de esta misma
  versión del código (con un script que aún no sumaba bien los dos requests)
  dio un promedio de ~165 ms, es decir, solo −4% frente a la medición
  anterior. Que el mismo código varíe ~27 ms entre corridas es del mismo
  orden que la mejora medida. Para afirmar la mejora con seguridad hay que
  repetir cada versión al menos 3 veces y comparar medianas.
- **Comparación entre días.** Las dos versiones se midieron en fechas
  distintas, con otro estado de la máquina.

## Comparación contra el baseline sin autenticar (`/`)

| | `GET /` (sin DB) | Login + menú (con DB, versión modularizada) | Diferencia |
|---|---|---|---|
| p95 | 3.73 ms | 192.58 ms | ~52x más lento |
| Iteraciones o requests/s | 7.61 req/s | 6.70 iteraciones/s | ~12% menos |

## Interpretación

La consolidación de 7 SELECT en 1 parece haber ayudado, pero el costo
dominante del flujo no está en las consultas:

- El `GET /admin` (1 SELECT + render) tardó en el mínimo 2.05 ms
  (`http_req_duration` min) y ~4 ms en promedio en una corrida preliminar de
  esta misma versión. Si ese valor se mantiene, el `POST /loginAccess`
  explica ~135 ms de los 138 ms promedio del flujo, es decir, cerca del 97%.
- Ese piso de ~120–135 ms es consistente con la verificación de la
  contraseña con `check_password_hash` de Werkzeug, que es costosa a
  propósito (hash scrypt/PBKDF2) y se ejecuta una vez por login. Es una
  hipótesis derivada de estos números, no una medición directa; se puede
  confirmar midiendo `check_password_hash` de forma aislada.
- La caída del mínimo de 139 ms a 120 ms (~19 ms) sugiere que el conjunto
  de 7 SELECT + render de la versión anterior costaba del orden de varios
  milisegundos adicionales por login, un efecto real pero pequeño frente al
  hash.

Por tanto, el salto frente a `GET /` (3.73 ms → ~193 ms) se debe sobre todo
al costo del hash de contraseña, que es deseable por seguridad, y solo en
una parte menor a las consultas a la base de datos.
