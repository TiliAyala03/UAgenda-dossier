# Método de medición de rendimiento — UAgenda

## 1. Objetivo

Establecer una línea base del tiempo de respuesta de UAgenda bajo carga
concurrente moderada, para poder contrastar mejoras futuras contra un
dato de referencia, no contra impresiones subjetivas de "se siente
lento" o "se siente rápido".

## 2. Herramienta y procedimiento

- **Herramienta:** k6, eligiendo por simplicidad de instalación en
  Windows (binario único, sin dependencias de Java ni entorno Python
  adicional).
- **Ruta bajo prueba:** `GET /` — la página de login. Se eligió
  deliberadamente por no requerir autenticación ni tocar la base de
  datos, para que la primera medición aísle el rendimiento del
  servidor Flask en sí mismo, sin mezclar el tiempo de las consultas
  SQL como variable adicional.
- **Perfil de carga:** rampa de 0 a 10 usuarios virtuales en 30
  segundos, sostenido en 10 usuarios durante 1 minuto, y bajada a 0 en
  30 segundos. Este perfil es intencionalmente modesto: el objetivo de
  esta fase es obtener una primera línea base, no un test de estrés.

## 3. Qué invalidaría esta medición

Es importante documentar esto explícitamente para que nadie interprete
el número obtenido como "el rendimiento real de UAgenda en producción".
Los siguientes factores hacen que esta medición sea, en el mejor de los
casos, una aproximación:

- **Servidor de desarrollo, no de producción:** `main.py` corre con
  `app.run(debug=True, threaded=True)` — el servidor de desarrollo de
  Flask/Werkzeug, que la propia documentación de Flask advierte no usar
  en producción. Un WSGI real (Gunicorn, uWSGI) con múltiples workers
  tendría un comportamiento distinto bajo carga, probablemente mejor.
- **`debug=True` agrega overhead:** el modo debug activa el
  reloader y el debugger interactivo de Werkzeug, que consumen recursos
  adicionales no presentes en un despliegue real.
- **Generador de carga y servidor en la misma máquina:** k6 y Flask
  compiten por el mismo CPU y la misma memoria. En un entorno de
  prueba de carga real, el generador de tráfico corre en una máquina
  separada del sistema bajo prueba.
- **Sin aislamiento de recursos:** no se usó ninguna forma de
  contenedor o límite de recursos (Docker, cgroups) — cualquier otro
  proceso corriendo en la laptop (navegador, editor, antivirus) puede
  introducir ruido en la medición.
- **Una sola corrida:** una medición aislada puede ser un outlier. Lo
  correcto para una línea base confiable sería correr el mismo test
  varias veces y promediar, o al menos reportar la variabilidad entre
  corridas.
- **Ruta elegida es la más liviana del sistema:** `/` no consulta la
  base de datos. Rutas que sí lo hacen (por ejemplo, `/admin` con
  sesión activa) casi con certeza van a tener tiempos de respuesta
  peores — esta línea base representa un piso, no un promedio
  representativo de toda la aplicación.

## 4. Qué SÍ es válido concluir de esta medición

A pesar de las limitaciones anteriores, esta línea base sirve para:

- Detectar regresiones evidentes: si una ejecución futura, en las mismas
  condiciones aproximadas, da resultados sensiblemente peores, es una
  señal real de que algo empeoró.
- Tener un primer número de referencia para conversaciones de equipo,
  en vez de partir de cero cada vez que se discuta rendimiento.