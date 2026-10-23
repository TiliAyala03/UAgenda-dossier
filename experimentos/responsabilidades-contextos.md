# Responsabilidades de los contextos de UAgenda

## 1. Objetivo

Este documento define las responsabilidades de los contextos identificados en el mapa de contexto de UAgenda. Su propósito es establecer qué información administra cada contexto y cómo se relaciona con los demás, evitando confusiones entre sus funciones.

## 2. Responsabilidades por contexto

### 2.1. Usuarios y autenticación

Es responsable de identificar a los estudiantes y gestionar el acceso al sistema.

**Responsabilidades:**
- Gestionar la información básica del usuario.
- Permitir el inicio de sesión.
- Gestionar la recuperación de contraseña.
- Identificar al estudiante propietario de la información.

No administra horarios, recordatorios, cuadernos ni flashcards.

### 2.2. Organización académica

Es responsable de organizar la información académica del estudiante.

**Responsabilidades:**
- Gestionar las materias.
- Organizar la información académica.
- Relacionar las actividades con las materias cuando corresponda.
- Proporcionar información académica a otros contextos cuando sea necesario.

### 2.3. Recordatorios

Es responsable de gestionar los recordatorios asociados a las actividades del estudiante.

**Responsabilidades:**
- Registrar los recordatorios.
- Gestionar sus fechas y horas.
- Relacionarlos con el estudiante correspondiente.
- Utilizar información de actividades académicas cuando sea necesario.

### 2.4. Gestión del estudio

Es responsable de organizar los recursos que el estudiante utiliza para estudiar.

**Responsabilidades:**
- Gestionar cuadernos y apuntes.
- Administrar mazos de flashcards.
- Gestionar preguntas y respuestas de las tarjetas.
- Mantener la relación entre el contenido y su propietario.

### 2.5. Trazabilidad y actividad

Es responsable de registrar las acciones realizadas en el sistema, siempre que esta funcionalidad esté implementada en el código.

**Responsabilidades:**
- Identificar al usuario que realiza una acción.
- Registrar actividades relevantes del sistema.
- Facilitar el seguimiento de las acciones registradas.

Este contexto no debe considerarse una funcionalidad implementada si el proyecto todavía no cuenta con mecanismos de registro de actividad.

## 3. Relaciones entre contextos

- **Usuarios y autenticación → Organización académica:** permite identificar al estudiante que administra la información académica.
- **Usuarios y autenticación → Recordatorios:** permite asociar los recordatorios con su propietario.
- **Usuarios y autenticación → Gestión del estudio:** permite identificar al propietario de los cuadernos y las flashcards.
- **Usuarios y autenticación → Trazabilidad y actividad:** permite asociar una acción con el usuario que la realizó.
- **Organización académica → Recordatorios:** proporciona información de actividades académicas que pueden requerir seguimiento.
- **Organización académica → Trazabilidad y actividad:** permite registrar actividades académicas cuando corresponda.
- **Recordatorios → Trazabilidad y actividad:** permite registrar acciones relacionadas con los recordatorios.
- **Gestión del estudio → Trazabilidad y actividad:** permite registrar acciones sobre cuadernos y flashcards.

Estas relaciones representan responsabilidades conceptuales. No implican que cada contexto sea un servicio independiente.

## 4. Tipo de comunicación

Para las operaciones normales de UAgenda se propone una comunicación **síncrona**, porque el estudiante espera una respuesta inmediata al iniciar sesión, consultar información o gestionar su contenido.

Actualmente, UAgenda se desarrolla como un monolito con Flask y una base de datos MySQL. Por lo tanto, las relaciones entre contextos representan una organización conceptual de responsabilidades y no necesariamente comunicación entre servicios separados.

La comunicación asíncrona podría considerarse en el futuro para tareas que no necesiten una respuesta inmediata, pero no debe afirmarse que existe mientras no esté implementada y comprobada en el código.

## 5. Conclusión

La separación de responsabilidades permite comprender qué función cumple cada contexto y cómo se relaciona con los demás. Esta organización sirve como referencia para documentar la arquitectura de UAgenda, sin afirmar que los contextos corresponden a módulos físicos independientes.