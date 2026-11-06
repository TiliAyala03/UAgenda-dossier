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
//   k6 run -e TEST_EMAIL=usuario1@example.com -e TEST_PASSWORD=usuario1 k6-login-menu.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const flujoCompleto = new Trend('login_menu_total', true);

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    login_menu_total: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

const EMAIL = __ENV.TEST_EMAIL;
const PASSWORD = __ENV.TEST_PASSWORD;

export default function () {
  const login = http.post(
    'http://localhost:5000/loginAccess',
    { txtEmail: EMAIL, txtPassword: PASSWORD },
    { redirects: 0, tags: { paso: 'login' } }
  );
  const menu = http.get('http://localhost:5000/admin', { tags: { paso: 'admin' } });

  check(login, { 'login redirige (302)': (r) => r.status === 302 });
  check(menu, {
    'status es 200': (r) => r.status === 200,
    'devuelve el menu principal': (r) => r.body && r.body.includes('bueno verte de nuevo'),
  });

  flujoCompleto.add(login.timings.duration + menu.timings.duration);
  sleep(1);
}