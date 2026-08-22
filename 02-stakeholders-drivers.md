# 02 — Stakeholders y Drivers Arquitectónicos: UAgenda

## 1. Stakeholders

| Actor | Rol frente al sistema | Interés principal |
|---|---|---|
| Estudiante (usuario final) | Usa la app día a día | Que funcione, sea rápida, no pierda sus datos |
| Equipo de desarrollo (nosotros) | Mantiene y evoluciona el sistema | Poder trabajar sobre el código sin miedo a romper cosas |
| Docente / evaluador | Evalúa el proceso y el resultado | Evidencia de decisiones arquitectónicas justificadas |

## 2. Drivers arquitectónicos priorizados

Un driver es cualquier factor —requerimiento clave, atributo de calidad
o restricción— que empuja hacia decisiones de diseño específicas. Se
listan de mayor a menor prioridad para esta fase del proyecto.

### 1. Seguridad — prioridad más alta

- **Por qué:** se encontró inyección SQL explotable en rutas de
  `main.py` que arman queries con f-strings interpolando input del
  usuario sin sanitizar. No es un riesgo hipotético — es reproducible
  hoy con datos de prueba.
- **Impacto en la arquitectura:** obliga a introducir queries
  parametrizadas (o migrar a un ORM) antes de sumar cualquier feature
  nueva sobre las rutas afectadas, y a revisar las rutas que hacen
  borrado vía `GET` en vez de `POST`/`DELETE`.

### 2. Mantenibilidad

- **Por qué:** el equipo va a seguir modificando este código el resto
  del semestre. La deuda técnica actual (sidebar y estilos duplicados
  entre páginas, nomenclatura inconsistente español/inglés, tablas del
  esquema SQL desincronizadas del código) ya generó tiempo perdido real
  documentado en el proceso de retomar el proyecto.
- **Impacto en la arquitectura:** favorece extraer componentes
  compartidos (CSS, funciones JS repetidas como `mostrarVentana`/
  `ocultarVentana`) a un solo lugar en vez de reescribirlos por página,
  y mantener el `.sql` del repo como fuente de verdad sincronizada con
  el código.

### 3. Disponibilidad

- **Por qué:** no hay manejo de reconexión si MySQL se cae a mitad de
  sesión — el usuario ve un stacktrace crudo de Flask en vez de un
  error controlado.
- **Impacto en la arquitectura:** empuja a introducir manejo de
  excepciones alrededor de las operaciones de base de datos, con
  mensajes de error legibles para el usuario en vez de dejar pasar la
  excepción sin capturar.

### 4. Testabilidad / Verificabilidad

- **Por qué:** el proyecto no tenía ni una sola prueba automatizada
  antes de esta fase. Sin pruebas, no hay forma barata de confirmar que
  un cambio no rompió algo que funcionaba.
- **Impacto en la arquitectura:** ya se introdujo una primera suite de
  humo (`test_smoke.py`) como línea base; motiva mantener el código
  desacoplado lo suficiente como para poder probarlo sin depender
  siempre de una base de datos real corriendo.

### 5. Accesibilidad y diseño responsive

- **Por qué:** relevante para la calidad general del producto, pero de
  menor urgencia que los cuatro anteriores para esta fase — no hay
  vulnerabilidades ni bloqueos funcionales asociados, es deuda de
  calidad acumulada (falta de `alt` en imágenes, tooltips solo
  accesibles con mouse, ausencia casi total de media queries).
- **Impacto en la arquitectura:** no exige cambios estructurales
  urgentes; se puede abordar de forma incremental página por página.
