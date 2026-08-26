# 03 — Atributos de calidad: UAgenda

## 1. Propósito

Este documento identifica y prioriza los principales atributos de calidad de UAgenda a partir de los stakeholders, restricciones técnicas y drivers arquitectónicos identificados previamente.

Los atributos se priorizan de acuerdo con su impacto sobre la seguridad, operación, evolución y verificabilidad del sistema.

## 2. Atributos de calidad identificados

| Prioridad | Atributo                          | Situación identificada                                                                                                           | Justificación                                                                                                           |
| --------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1         | Seguridad                         | Se identificaron consultas SQL construidas mediante f-strings con datos proporcionados por el usuario.                           | Es una vulnerabilidad real y reproducible que puede comprometer la información del sistema.                             |
| 2         | Mantenibilidad                    | Existe código duplicado en estilos, sidebar y funciones JavaScript, además de inconsistencias de nomenclatura y del esquema SQL. | El sistema continuará evolucionando durante el semestre y estas condiciones aumentan la dificultad de realizar cambios. |
| 3         | Disponibilidad                    | No existe un manejo adecuado de errores cuando la conexión con MySQL falla.                                                      | Una falla de la base de datos puede interrumpir el funcionamiento y mostrar errores técnicos al usuario.                |
| 4         | Testabilidad / verificabilidad    | El proyecto no contaba inicialmente con pruebas automatizadas; actualmente existe una prueba de humo como línea base.            | Permite verificar que los cambios realizados no introduzcan regresiones en funcionalidades existentes.                  |
| 5         | Accesibilidad y diseño responsive | Se identificaron elementos sin alternativas accesibles y poca adaptación a diferentes tamaños de pantalla.                       | Mejora la experiencia de uso, pero representa una prioridad menor frente a los problemas de seguridad y operación.      |

## 3. Priorización

### 3.1 Seguridad — Prioridad crítica

La seguridad es el atributo de mayor prioridad debido a la existencia de una vulnerabilidad de inyección SQL identificada en el código actual. La arquitectura debe favorecer el uso de consultas parametrizadas y evitar la construcción de consultas mediante concatenación o interpolación de entradas del usuario.

### 3.2 Mantenibilidad — Prioridad alta

La mantenibilidad es importante debido a que UAgenda continuará siendo modificado durante el desarrollo de la asignatura. La existencia de código duplicado, nomenclatura inconsistente y diferencias entre el esquema SQL y el código dificulta la evolución del sistema.

### 3.3 Disponibilidad — Prioridad alta

La disponibilidad es relevante porque el sistema depende de MySQL para almacenar y consultar la información. Actualmente, una falla en la conexión puede producir errores no controlados. Se requiere un manejo adecuado de excepciones y mensajes controlados.

### 3.4 Testabilidad / verificabilidad — Prioridad media-alta

La testabilidad permite comprobar que las modificaciones realizadas no afecten funcionalidades existentes. La incorporación de pruebas de humo establece una primera línea base para verificar el funcionamiento del sistema.

### 3.5 Accesibilidad y diseño responsive — Prioridad media

La accesibilidad y adaptación a diferentes dispositivos contribuyen a una mejor experiencia para los estudiantes. Sin embargo, durante esta fase se consideran de menor prioridad frente a los riesgos de seguridad, disponibilidad y mantenibilidad.

## 4. Estructura utilizada para los escenarios

Los escenarios de calidad se estructuran mediante los siguientes elementos:

* **Fuente:** actor que genera el estímulo.
* **Estímulo:** evento que ocurre en el sistema.
* **Entorno:** condiciones bajo las cuales ocurre el evento.
* **Artefacto:** componente del sistema afectado.
* **Respuesta:** comportamiento esperado del sistema.
* **Medida de respuesta:** condición que permite verificar si la respuesta fue satisfactoria.

## 5. Relación entre atributos y drivers

| Driver arquitectónico             | Atributo de calidad        |
| --------------------------------- | -------------------------- |
| Seguridad                         | Seguridad                  |
| Mantenibilidad                    | Mantenibilidad             |
| Disponibilidad                    | Disponibilidad             |
| Testabilidad / verificabilidad    | Testabilidad               |
| Accesibilidad y diseño responsive | Accesibilidad / Usabilidad |

## 6. Conclusión

Los atributos de calidad priorizados permiten orientar las decisiones arquitectónicas de UAgenda hacia los problemas que actualmente representan mayor impacto. La seguridad constituye la prioridad principal debido a la vulnerabilidad identificada, seguida por mantenibilidad, disponibilidad, testabilidad y accesibilidad. Estos atributos serán utilizados como base para definir escenarios verificables y posteriormente orientar las mejoras arquitectónicas del sistema.
