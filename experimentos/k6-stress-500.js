// experimentos/k6-stress-500.js
//
// Prueba de ESTRÉS (no de línea base): busca encontrar el punto de
// quiebre real de UAgenda corriendo en el servidor de desarrollo de
// Flask, no confirmar que cumple un SLA cómodo. Ver ESC-PERF-03 en
// 04-escenarios-calidad.md.
//
// ADVERTENCIA sobre datos: cada iteración exitosa inserta una fila
// real en la tabla Traza. A esta escala, la corrida puede generar
// varios miles de filas. Si te importa una base local limpia después,
// correr en MySQL Workbench: TRUNCATE TABLE Traza;
//
// Cómo correr (repetir 3 veces mínimo — descartar la primera corrida
// como "calentamiento" y reportar la mediana de p95 de error de las
// corridas restantes, tal como pide la checklist):
//   k6 run -e TEST_EMAIL=tu_correo_de_prueba -e TEST_PASSWORD=tu_password_de_prueba k6-stress-500.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 500 },   // rampa hasta 500 VUs
    { duration: '30s', target: 500 },  // sostenido en el pico
    { duration: '30s', target: 0 },    // bajada
  ],
  thresholds: {
    // A esta escala NO se exige un p95 estricto (ver nota metodológica
    // en ESC-PERF-03) — lo que importa es que el sistema no colapse
    // por completo. Se deja el umbral de latencia como referencia,
    // sin marcar la corrida como "fallida" si se excede.
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.05'],
  },
};

const EMAIL = __ENV.TEST_EMAIL;
const PASSWORD = __ENV.TEST_PASSWORD;

export default function () {
  const res = http.post('http://localhost:5000/loginAccess', {
    txtEmail: EMAIL,
    txtPassword: PASSWORD,
  });

  check(res, {
    'status es 200': (r) => r.status === 200,
  });

  sleep(1);
}