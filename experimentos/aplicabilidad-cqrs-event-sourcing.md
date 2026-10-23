# Aplicabilidad de CQRS, Event Sourcing y eventos asíncronos

> Análisis generado con apoyo de IA (Claude) como **opciones, no recomendaciones**. Usa solo datos del sistema real. La decisión y su redacción final son del equipo (sección 5).
> Etiquetas: **HECHO** (verificable en el repositorio o en mediciones), **INFERENCIA**, **FALTANTE**.

## 1. Datos de entrada utilizados

- **HECHO** — `/loginAccess` ejecuta una validación de contraseña, **7 `SELECT` sobre `recordatorios`** y **1 `INSERT INTO Traza` con commit** en la misma petición (`main.py`). Una ruta de lectura contiene una escritura.
- **HECHO** — Medición con 10 VUs (`resultados-login-menu.md`): p95 = 220.97 ms, 0% de error; cumple ESC-PERF-02 (< 1000 ms).
- **HECHO** — Prueba de estrés con 500 VUs, corrida 1 (`resultados-stress-500.md`): p95 = 7.02 s y 50.95% de error. La consola del servidor no mostró errores de MySQL durante la corrida.
- **INFERENCIA** — Que el límite esté en la capacidad de conexión del servidor de desarrollo (no en la base de datos) es una hipótesis no aislada experimentalmente.
- **HECHO** — El estado vive en tablas relacionales modificadas con `UPDATE`/`DELETE` destructivos (p. ej. `UPDATE usuario SET contrasena`, `DELETE FROM grupoNotas`). `Traza` registra acciones como texto libre, sin carga estructurada.
- **HECHO** — Drivers priorizados (`02-stakeholders-drivers.md`) y escenarios (`04-escenarios-calidad.md`) no incluyen un requerimiento de auditoría histórica ni de reconstrucción de estado.
- **HECHO** — Restricciones del equipo: 3 integrantes, ~6 h/semana, sin experiencia previa con estos patrones.
- **HECHO** — Decisión previa: Monolito Modular con aislamiento de persistencia acotado (ADR 0001 y 0002).

## 2. CQRS

1. **Problema concreto que podría resolver:** contención o escalado distinto entre lecturas y escrituras, y modelos de lectura optimizados.
2. **Evidencia de que el problema existe en mis inputs:**
   - Hay una mezcla lectura/escritura en `/loginAccess` (HECHO), pero **no hay medición** que separe cuánto tarda cada parte.
   - La transformación hoy/mañana/otros de recordatorios se hace en Python al renderizar (INFERENCIA de un modelo de lectura embrionario), sobre un volumen pequeño.
   - **NO JUSTIFICADO TODAVÍA POR LA EVIDENCIA DISPONIBLE** como problema de escalado de lecturas o de contención lectura/escritura.
3. **Beneficios potenciales:** consultas de lectura dedicadas (p. ej. una sola vista en lugar de 7 `SELECT`), escalar lecturas de forma independiente, modelos más simples por lado.
4. **Complejidad nueva:** dos modelos que mantener sincronizados; si se separan almacenes, consistencia eventual; más código y más pruebas.
5. **Riesgos:** sobreingeniería respecto a la carga medida; un usuario podría no ver de inmediato lo que acaba de escribir; capacidad del equipo.
6. **Supuestos necesarios:** que la lectura sea el cuello de botella; que el volumen o los usuarios crezcan; que exista necesidad real de escalar lecturas por separado.
7. **Evidencia que faltaría reunir:**
   - medición aislada del costo de los 7 `SELECT` frente al `INSERT` de traza;
   - proporción lectura/escritura del uso esperado;
   - volumen de datos esperado y requisito de crecimiento por parte de los stakeholders;
   - **FALTANTE / INFERENCIA:** si consolidar las 7 consultas en una mejora lo suficiente la latencia, existiría una alternativa más simple que no se ha medido.

## 3. Event Sourcing

1. **Problema concreto que podría resolver:** reconstruir el estado a cualquier momento, auditoría completa y reproducción de la historia.
2. **Evidencia de que el problema existe en mis inputs:**
   - `Traza` responde a "quién hizo qué" con texto libre; no permite reconstruir estado, y las tablas se modifican destructivamente (HECHO).
   - No hay un requerimiento documentado de historial o recuperación (p. ej. restaurar un recordatorio borrado) en drivers ni escenarios (HECHO).
   - **NO JUSTIFICADO TODAVÍA POR LA EVIDENCIA DISPONIBLE.**
3. **Beneficios potenciales:** auditoría íntegra, depuración temporal, múltiples proyecciones sobre los mismos hechos.
4. **Complejidad nueva:** almacén de eventos, versionado de esquemas de eventos, proyecciones, reconstrucción, migración de datos CRUD existentes.
5. **Riesgos:** cambio profundo del modelo de persistencia; dificultad de consulta; curva de aprendizaje del equipo; riesgo de introducirlo sin consumidores que lo necesiten.
6. **Supuestos necesarios:** que algún stakeholder requiera historial completo; que los eventos del dominio sean estables.
7. **Evidencia que faltaría reunir:** requerimientos de auditoría/recuperación de los stakeholders; resultado de la auditoría de eventos (`/docs/uso-ia/auditoria-eventos.md`); estimación de esfuerzo frente a las horas disponibles.

## 4. Eventos asíncronos como mecanismo de integración

1. **Problema concreto que podría resolver:** desacoplar trabajo que no necesita respuesta inmediata de la petición del usuario.
2. **Evidencia de que el problema existe en mis inputs:**
   - Único consumidor interno de los hechos candidatos: `Trazabilidad`, servido hoy con un `INSERT` síncrono en la misma petición (HECHO, ver `eventos-candidatos.md`).
   - Único sistema externo con el que se interactúa: SMTP, y `mail.send` se ejecuta dentro de la petición `/recuperacion` (HECHO).
   - No hay medición del costo de esas dos operaciones sobre el tiempo de respuesta (FALTANTE).
   - **NO JUSTIFICADO TODAVÍA POR LA EVIDENCIA DISPONIBLE.**
3. **Beneficios potenciales:** menor dependencia temporal; respuestas más rápidas si esas operaciones fueran costosas.
4. **Complejidad nueva:** cola o broker, reintentos, duplicados, observabilidad, consistencia eventual.
5. **Riesgos:** infraestructura adicional en un monolito de un solo proceso; trazas que podrían perderse o retrasarse.
6. **Supuestos necesarios:** que el tiempo de la escritura de traza o del envío de correo sea significativo en la petición.
7. **Evidencia que faltaría reunir:** medición del costo de `INSERT Traza + commit` y de `mail.send` dentro de sus peticiones (conecta directamente con la decisión síncrono/asíncrono y con el Spike 1).
