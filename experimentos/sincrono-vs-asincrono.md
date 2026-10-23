# Contrato de integración de UAgenda

## 1. Objetivo

Este documento define cómo se intercambia la información entre las responsabilidades de UAgenda. Su objetivo es establecer qué información necesita cada contexto, qué resultados espera y qué tipo de comunicación se utilizará.

UAgenda es una aplicación web desarrollada con Flask y MySQL. Por esta razón, las relaciones descritas en este contrato representan una propuesta lógica de integración dentro del monolito y no necesariamente una comunicación entre servicios independientes.

## 2. Contextos involucrados

| Contexto | Responsabilidad |
|---|---|
| Usuarios y autenticación | Gestionar la identidad y el acceso de los estudiantes. |
| Organización académica | Gestionar la información de las materias y la organización académica. |
| Recordatorios | Gestionar recordatorios, fechas y horas, si estas funcionalidades están implementadas. |
| Gestión del estudio | Gestionar cuadernos, apuntes y flashcards. |
| Trazabilidad y actividad | Registrar acciones relevantes, si existe esta funcionalidad en el código. |

## 3. Contratos de integración

### 3.1. Usuarios y autenticación → Organización académica

**Propósito:** identificar al estudiante que consulta o administra su información académica.

- **Información intercambiada:** identificador del usuario autenticado.
- **Resultado esperado:** asociar la operación académica con el usuario correspondiente.
- **Tipo de comunicación:** síncrona.
- **Condición:** solo se permite acceder a información autorizada para el usuario.

### 3.2. Usuarios y autenticación → Gestión del estudio

**Propósito:** identificar al propietario de los cuadernos y las flashcards.

- **Información intercambiada:** identificador del usuario autenticado.
- **Resultado esperado:** consultar o gestionar el contenido correspondiente al estudiante.
- **Tipo de comunicación:** síncrona.
- **Condición:** el sistema debe verificar los permisos antes de acceder o modificar el contenido.

### 3.3. Organización académica → Recordatorios

**Propósito:** relacionar una actividad académica con un recordatorio cuando esta funcionalidad esté disponible.

- **Información intercambiada:** identificador de la actividad o materia, fecha y hora, según las necesidades de la operación.
- **Resultado esperado:** asociar el recordatorio con la actividad correspondiente.
- **Tipo de comunicación:** síncrona como propuesta inicial.
- **Condición:** los datos deben validarse antes de guardar el recordatorio.

### 3.4. Contextos funcionales → Trazabilidad y actividad

**Propósito:** registrar acciones relevantes realizadas por los estudiantes.

- **Información intercambiada:** usuario, acción realizada, fecha y resultado, según los datos que el sistema registre.
- **Resultado esperado:** disponer de un registro que permita consultar la actividad.
- **Tipo de comunicación:** síncrona como propuesta inicial.
- **Condición:** el registro debe respetar las reglas de privacidad y seguridad.

Esta integración es una propuesta de diseño y debe verificarse contra el código existente antes de considerarse implementada.

## 4. Decisión de integración: síncrona frente a asíncrona

Se comparan dos alternativas para definir cómo intercambiar información entre contextos.

### Alternativa A. Comunicación síncrona

Un contexto solicita información y espera una respuesta antes de continuar.

**Ventajas:**
- Permite obtener resultados inmediatamente.
- Facilita la validación de los datos antes de completar una operación.
- Es sencilla de implementar dentro del monolito actual.

**Riesgos:**
- Una operación puede verse afectada si falla una dependencia necesaria.
- Si se introduce comunicación HTTP entre servicios, puede aparecer una dependencia temporal entre ellos.

### Alternativa B. Comunicación asíncrona mediante eventos

Un contexto publica un evento y otro lo procesa posteriormente, sin que el primero tenga que esperar a que termine todo el procesamiento.

**Ventajas:**
- Reduce la dependencia temporal entre los contextos.
- Puede ser útil para notificaciones o procesos en segundo plano.

**Riesgos:**
- La información puede tardar en actualizarse.
- Es necesario controlar eventos duplicados, errores y reintentos.
- Puede requerir infraestructura adicional, como una cola de mensajes.

## 5. Decisión arquitectónica

Para la versión actual de UAgenda se propone mantener la comunicación síncrona en las operaciones que necesitan una respuesta inmediata, utilizando las llamadas internas de la aplicación y el acceso a MySQL según la implementación existente.

No se propone introducir eventos asíncronos como mecanismo general de integración en esta etapa, porque añadirían complejidad que debe justificarse mediante una necesidad concreta.

Esta decisión no significa que la comunicación síncrona sea siempre superior. Si en el futuro se necesitan notificaciones en segundo plano o procesos independientes, se podrá evaluar la incorporación de eventos asíncronos.

**Estado de la decisión:** propuesta pendiente de validación mediante el Spike 1.

## 6. Manejo de errores y validaciones

Las operaciones de integración deben contemplar:

- Validación de los datos recibidos.
- Verificación de la identidad y los permisos del usuario.
- Manejo de errores de acceso a la base de datos.
- Evitar que una operación fallida se presente como exitosa.
- Mantener la consistencia de los datos cuando una operación modifica varias entidades.

Los mecanismos específicos deberán corresponder a los que realmente existan en el código de UAgenda.

## 7. Relación con el Spike 1 y el ADR 3

El Spike 1 permitirá comprobar si la comunicación interna del monolito es suficiente para la operación seleccionada.

El ADR 3 documentará la decisión final, incluyendo:

- Las alternativas consideradas.
- Los criterios de comparación.
- Los resultados observados en la prueba.
- La alternativa elegida y su justificación.
- Los riesgos y las limitaciones identificadas.

La decisión propuesta en este contrato podrá mantenerse o modificarse según los resultados del experimento.

## 8. Conclusión

El contrato de integración establece una base para organizar la comunicación entre las responsabilidades de UAgenda. La propuesta inicial consiste en mantener operaciones síncronas dentro del monolito y evaluar alternativas más complejas únicamente cuando exista evidencia de que aportan un beneficio real.