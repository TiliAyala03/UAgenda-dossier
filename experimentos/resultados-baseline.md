# Resultados — Medición de línea base (k6)

## Condiciones de la medición

- **Fecha y hora:** 28/08/2026 15:02 p.m.
- **Máquina:** Portatil ASUS - 12 GB RAM
- **Otras apps corriendo en simultáneo:** VS Code / Google Chrome / Spotify / MySQLWorkbench
- **Modo del servidor:** Flask dev server, `debug=True`, `threaded=True` (ver `main.py`)
- **Base de datos:** MySQL local — [COMPLETAR: ¿estaba siendo usada por algo más en simultáneo?]
- **Ruta medida:** `GET /` (página de login, sin consulta a base de datos)
- **Carga aplicada:** rampa 0→10 usuarios virtuales en 30s, sostenido 1 min, bajada 30s

## Resultado crudo de k6

```
THRESHOLDS

http_req_duration
✓ 'p(95)<500' p(95)=3.73ms

http_req_failed
✓ 'rate<0.01' rate=0.00%


TOTAL RESULTS

checks_total.......: 917    7.613488/s
checks_succeeded...: 100.00% 917 out of 917
checks_failed......: 0.00%   0 out of 917

✓ status es 200

HTTP
http_req_duration..............: avg=2.4ms  min=506.7µs  med=2.08ms  max=16.33ms  p(90)=3.14ms  p(95)=3.73ms
  { expected_response:true }...: avg=2.4ms  min=506.7µs  med=2.08ms  max=16.33ms  p(90)=3.14ms  p(95)=3.73ms
http_req_failed.................: 0.00%   0 out of 917
http_reqs........................: 917     7.613488/s

EXECUTION
iteration_duration..............: avg=1s   min=1s   med=1s   max=1.03s  p(90)=1s  p(95)=1s
iterations.......................: 917    7.613488/s
vus..............................: 1      min=1    max=10
vus_max..........................: 10     min=10   max=10

NETWORK
data_received....................: 1.6 MB  14 kB/s
data_sent........................: 64 kB   533 B/s
```

## Resumen de métricas clave

| Métrica | Valor obtenido |
|---|---|
| p50 (mediana) tiempo de respuesta | 2.08 ms |
| p95 tiempo de respuesta | 3.73 ms |
| p99 tiempo de respuesta | no reportado por k6 en este resumen (máximo observado: 16.33 ms) |
| Tasa de error (`http_req_failed`) | 0.00% |
| Requests totales | 917 |
| Requests por segundo (throughput) | 7.61 req/s |

## Contraste contra el escenario formulado (ESC-PERF-01)

| | Medida esperada (escenario) | Dato real obtenido | ¿Cumple? |
|---|---|---|---|
| p95 tiempo de respuesta | < 500 ms | 3.73 ms | ✅ Sí, con amplísimo margen (~134x mejor que el umbral) |
| Tasa de error | 0% | 0.00% | ✅ Sí |

