// experimentos/k6-baseline.js
//
// Medición de línea base de tiempo de respuesta para UAgenda.
// Apunta a la ruta "/" (página de login) deliberadamente: no toca
// MySQL, así que esta primera medición aísla el rendimiento del
// servidor Flask en sí, sin mezclar el tiempo de consultas a la base
// de datos. Mediciones futuras pueden apuntar a rutas autenticadas
// para medir el impacto de las consultas SQL.

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // rampa de subida a 10 usuarios virtuales
    { duration: '1m', target: 10 },   // sostenido en 10 usuarios
    { duration: '30s', target: 0 },   // rampa de bajada
  ],
  thresholds: {
    // Umbral de referencia inicial — ajustar con el equipo una vez
    // visto el resultado real de la primera corrida.
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('http://localhost:5000/');

  check(res, {
    'status es 200': (r) => r.status === 200,
  });

  sleep(1);
}