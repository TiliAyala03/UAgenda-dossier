# Resultados — Login + carga del menú principal (k6)

## Condiciones de la medición

- **Fecha y hora:** 28/08/2026 - 16:27 p.m.
- **Máquina:** Portatil ASUS - 12 GB RAM
- **Ruta medida:** `POST /loginAccess` (autenticación + 7 consultas SELECT
  a `recordatorios` + `INSERT` de traza + render de `admin.html`, todo
  en una sola petición)
- **Carga aplicada:** rampa 0→10 VUs en 30s, sostenido 1 min, bajada 30s
  (idéntico perfil al baseline, para que la comparación sea justa)
- **Efecto secundario conocido:** cada iteración inserta una fila real
  en la tabla `Traza` — 785 filas nuevas al final de esta corrida.

## Resultado crudo de k6

```
THRESHOLDS

http_req_duration
✓ 'p(95)<1000' p(95)=220.97ms

http_req_failed
✓ 'rate<0.01' rate=0.00%


TOTAL RESULTS

checks_total.......: 1570   13.028305/s
checks_succeeded...: 100.00% 1570 out of 1570
checks_failed......: 0.00%   0 out of 1570

✓ status es 200
✓ devuelve el menu principal (no la pantalla de login)

HTTP
http_req_duration..............: avg=172.01ms  min=139.42ms  med=165.37ms  max=294.94ms  p(90)=204.93ms  p(95)=220.97ms
  { expected_response:true }...: avg=172.01ms  min=139.42ms  med=165.37ms  max=294.94ms  p(90)=204.93ms  p(95)=220.97ms
http_req_failed.................: 0.00%   0 out of 785
http_reqs........................: 785     6.514152/s

EXECUTION
iteration_duration..............: avg=1.17s  min=1.13s  med=1.16s  max=1.29s  p(90)=1.2s  p(95)=1.22s
iterations.......................: 785    6.514152/s
vus...............................: 1     min=1   max=10
vus_max...........................: 10    min=10  max=10

NETWORK
data_received.....................: 9.6 MB  79 kB/s
data_sent.........................: 159 kB  1.3 kB/s
```

## Resumen de métricas clave

| Métrica | Valor obtenido |
|---|---|
| p50 (mediana) tiempo de respuesta | 165.37 ms |
| p95 tiempo de respuesta | 220.97 ms |
| Máximo observado | 294.94 ms |
| Tasa de error | 0.00% |
| Requests totales | 785 |
| Throughput | 6.51 req/s |

## Contraste contra el escenario formulado (ESC-PERF-02)

| | Medida esperada | Dato real obtenido | ¿Cumple? |
|---|---|---|---|
| p95 tiempo de respuesta | < 1000 ms | 220.97 ms | ✅ Sí, con margen razonable (~4.5x mejor que el umbral) |
| Tasa de error | 0% | 0.00% | ✅ Sí |

## Comparación contra el baseline sin autenticar (`/`)

| | `GET /` (sin DB) | `POST /loginAccess` (con DB) | Diferencia |
|---|---|---|---|
| p95 | 3.73 ms | 220.97 ms | ~59x más lento |
| Throughput | 7.61 req/s | 6.51 req/s | ~14% menos |

## Interpretación

A diferencia del primer baseline (que pasó tan fácil que casi no decía
nada), esta medición sí es diagnóstica: aísla con claridad el costo de
tocar la base de datos. El salto de 3.73ms a 220.97ms es enteramente
atribuible al trabajo que hace `/loginAccess` — particularmente las
**7 consultas SELECT separadas** a `recordatorios` (una por columna),
que en teoría podrían combinarse en una sola consulta que traiga todas
las columnas de una vez.