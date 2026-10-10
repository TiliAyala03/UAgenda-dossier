# Modelo del dominio de UAgenda

## 1. Introducción

UAgenda es una aplicación web que busca facilitar la organización académica de los estudiantes de la Universidad Jorge Tadeo Lozano. El sistema reúne herramientas para gestionar materias, consultar horarios, calcular promedios, guardar apuntes y estudiar mediante tarjetas de memoria (*flashcards*).

El modelo del dominio permite identificar las principales responsabilidades del sistema y establecer límites entre los conceptos que pertenecen a cada área funcional.

## 2. Identificación de los subdominios

### 2.1. Usuarios y acceso

**Tipo:** subdominio genérico.

Se encarga de gestionar las cuentas de los estudiantes y permitir el acceso a la plataforma.

- **Conceptos principales:** usuario, correo electrónico, contraseña y recuperación de contraseña.
- **Responsabilidad:** identificar al usuario y permitirle acceder a sus herramientas personales.
- **Límite:** no administra las materias, las calificaciones ni el contenido académico.

### 2.2. Organización académica

**Tipo:** subdominio principal.

Permite organizar la información académica del estudiante a partir de sus materias.

- **Conceptos principales:** materia, nombre, código y datos de identificación de la materia.
- **Responsabilidad:** mantener organizadas las materias que utiliza el estudiante en las diferentes herramientas de UAgenda.
- **Límite:** no se encarga directamente de calcular promedios, editar apuntes ni gestionar las sesiones de estudio.

### 2.3. Horarios y recordatorios

**Tipo:** subdominio de apoyo.

Permite organizar el tiempo académico y consultar las actividades programadas.

- **Conceptos principales:** horario, evento, día, hora de inicio, hora de finalización y recordatorio.
- **Responsabilidad:** administrar la programación académica y los recordatorios relacionados.
- **Límite:** no administra las calificaciones ni el contenido de los apuntes.

### 2.4. Calificaciones y promedios

**Tipo:** subdominio de apoyo.

Permite registrar calificaciones y calcular el promedio de una materia teniendo en cuenta el peso de sus evaluaciones.

- **Conceptos principales:** grupo de nota, calificación, porcentaje de ponderación y promedio.
- **Responsabilidad:** realizar los cálculos académicos utilizando las notas y ponderaciones registradas.
- **Límite:** no administra los horarios ni las credenciales del usuario.

### 2.5. Cuaderno y apuntes

**Tipo:** subdominio de apoyo.

Permite guardar, consultar y editar información escrita por el estudiante.

- **Conceptos principales:** cuaderno, título y contenido.
- **Responsabilidad:** conservar y facilitar la edición de los apuntes personales.
- **Límite:** no administra las calificaciones numéricas ni las tarjetas de estudio.

### 2.6. Estudio con flashcards

**Tipo:** subdominio de apoyo.

Facilita el repaso de temas mediante tarjetas de estudio organizadas en mazos.

- **Conceptos principales:** mazo, tarjeta, pregunta o pista y respuesta.
- **Responsabilidad:** organizar las tarjetas y permitir que el estudiante repase su contenido.
- **Límite:** no administra los apuntes del cuaderno ni calcula los promedios de las materias.

## 3. Relación entre los subdominios

Los subdominios se complementan para ofrecer una experiencia de organización académica integrada.

El contexto de Usuarios y acceso permite identificar al estudiante. Organización académica mantiene las materias, que pueden servir como referencia para relacionar horarios, calificaciones, cuadernos y mazos de estudio.

Cada área conserva una responsabilidad definida para evitar que todas las operaciones queden concentradas en una sola responsabilidad de negocio.

## 4. Consideraciones de arquitectura

Los subdominios representan una separación conceptual de las responsabilidades del negocio. No implican que cada uno sea un servicio independiente.

Actualmente, UAgenda se plantea como un monolito web desarrollado con Flask y una base de datos MySQL. Por ello, las fronteras del dominio pueden documentarse sin afirmar que ya existen microservicios o módulos físicos independientes.

La clasificación de los subdominios y sus límites debe mantenerse alineada con las funcionalidades y entidades presentes en el código fuente del proyecto.