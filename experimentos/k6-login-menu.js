// experimentos/k6-login-menu.js
//
// Mide el flujo más pesado de la aplicación: /loginAccess valida la
// contraseña, inserta un registro de traza, ejecuta 7 consultas SELECT
// a la tabla recordatorios (una por columna), arma las listas de
// recordatorios y devuelve admin.html renderizado — todo en una sola
// petición POST. No hace falta un segundo request a /admin: esta
// misma respuesta YA es la carga del menú principal.
//
// Credenciales NUNCA hardcodeadas en el script: se pasan por variables
// de entorno al ejecutar k6, para no comprometer una cuenta real (ni
// siquiera de prueba) en el repositorio del dossier.
//
// Cómo correr:
//   k6 run -e TEST_EMAIL=tu_correo_de_prueba -e TEST_PASSWORD=tu_password_de_prueba k6-login-menu.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // Umbral más exigente que el del baseline anterior, porque esta
    // ruta sí toca la base de datos varias veces — es razonable
    // esperar algo más lento que servir una página estática, pero
    // igual debería responder rápido en una carga liviana como esta.
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
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
    'devuelve el menu principal (no la pantalla de login)': (r) =>
      r.body && r.body.includes('bueno verte de nuevo'),
  });

  sleep(1);
}