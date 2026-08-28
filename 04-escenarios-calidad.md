# 04 — Escenarios de calidad: UAgenda

## 1. Propósito

Este documento transforma los requerimientos no funcionales y drivers de calidad identificados para UAgenda en escenarios verificables.

Cada escenario especifica una situación, el componente involucrado, la respuesta esperada y una medida que permita comprobar el cumplimiento del atributo de calidad.

---

## 2. Escenarios de seguridad

### ESC-SEG-01 — Protección de consultas a la base de datos

| Elemento                | Descripción                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fuente**              | Estudiante                                                                                                                                                  |
| **Estímulo**            | Ingresa información en un formulario que posteriormente es utilizada para realizar una consulta.                                                            |
| **Entorno**             | Sistema funcionando normalmente.                                                                                                                            |
| **Artefacto**           | Backend Flask y módulo de acceso a MySQL.                                                                                                                   |
| **Respuesta**           | El sistema procesa la información mediante consultas parametrizadas y evita interpretar la entrada del usuario como parte de la consulta SQL.               |
| **Medida de respuesta** | El 100 % de las consultas que reciben datos del usuario deben utilizar consultas parametrizadas, sin concatenación o interpolación directa de dichos datos. |

### ESC-SEG-02 — Control de acceso

| Elemento                | Descripción                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **Fuente**              | Usuario no autenticado                                                                                    |
| **Estímulo**            | Intenta acceder directamente a una funcionalidad restringida.                                             |
| **Entorno**             | Sistema funcionando normalmente.                                                                          |
| **Artefacto**           | Módulo de autenticación y control de sesiones.                                                            |
| **Respuesta**           | El sistema rechaza el acceso y redirige al usuario hacia el proceso de autenticación.                     |
| **Medida de respuesta** | El 100 % de las rutas protegidas debe rechazar solicitudes realizadas por usuarios sin una sesión válida. |

---

## 3. Escenarios de mantenibilidad

### ESC-MAN-01 — Modificación de componentes compartidos

| Elemento                | Descripción                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Fuente**              | Desarrollador                                                                                                                                    |
| **Estímulo**            | Necesita modificar un componente visual compartido, como el sidebar.                                                                             |
| **Entorno**             | Durante el mantenimiento o evolución del sistema.                                                                                                |
| **Artefacto**           | Plantillas, CSS y componentes compartidos de la interfaz.                                                                                        |
| **Respuesta**           | El cambio se realiza en un único componente reutilizado por las páginas correspondientes.                                                        |
| **Medida de respuesta** | Una modificación de un componente compartido debe realizarse en un único componente reutilizable, sin editar copias duplicadas del mismo código. |

### ESC-MAN-02 — Consistencia del esquema de datos

| Elemento                | Descripción                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fuente**              | Desarrollador                                                                                                                                                 |
| **Estímulo**            | Realiza una modificación relacionada con la estructura de la base de datos.                                                                                   |
| **Entorno**             | Desarrollo local.                                                                                                                                             |
| **Artefacto**           | Código de la aplicación y archivo SQL del proyecto.                                                                                                           |
| **Respuesta**           | La estructura documentada en el archivo SQL permanece sincronizada con la utilizada por la aplicación.                                                        |
| **Medida de respuesta** | El 100 % de las tablas y columnas requeridas por el código actual debe estar presente y ser compatible con el esquema SQL utilizado para instalar el sistema. |

---

## 4. Escenarios de disponibilidad

### ESC-DIS-01 — Fallo de conexión con MySQL

| Elemento                | Descripción                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Fuente**              | Base de datos MySQL                                                                                                                |
| **Estímulo**            | La conexión con MySQL falla durante una operación del usuario.                                                                     |
| **Entorno**             | Sistema funcionando y usuario realizando una consulta o registro.                                                                  |
| **Artefacto**           | Módulo de acceso a datos.                                                                                                          |
| **Respuesta**           | El sistema captura la excepción y muestra un mensaje controlado al usuario.                                                        |
| **Medida de respuesta** | El 100 % de los errores de conexión con MySQL debe ser manejado sin mostrar stacktraces ni información técnica interna al usuario. |

---

## 5. Escenarios de testabilidad

### ESC-TST-01 — Ejecución de pruebas después de un cambio

| Elemento                | Descripción                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Fuente**              | Desarrollador                                                                                                                        |
| **Estímulo**            | Realiza un cambio en el código del sistema.                                                                                          |
| **Entorno**             | Ambiente de desarrollo local.                                                                                                        |
| **Artefacto**           | Suite de pruebas automatizadas.                                                                                                      |
| **Respuesta**           | Las pruebas se ejecutan para comprobar que las funcionalidades cubiertas continúan funcionando.                                      |
| **Medida de respuesta** | El 100 % de la suite de pruebas definida debe ejecutarse antes de integrar el cambio y cualquier caso fallido debe quedar reportado. |

### ESC-TST-02 — Prueba de humo

| Elemento                | Descripción                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Fuente**              | Desarrollador                                                                                                           |
| **Estímulo**            | Se inicia una nueva versión local del sistema.                                                                          |
| **Entorno**             | Instalación local de UAgenda.                                                                                           |
| **Artefacto**           | Funcionalidades principales cubiertas por `test_smoke.py`.                                                              |
| **Respuesta**           | El sistema supera las comprobaciones básicas de funcionamiento.                                                         |
| **Medida de respuesta** | El 100 % de las pruebas definidas en `test_smoke.py` debe finalizar exitosamente antes de considerar válida la versión. |

---

## 6. Escenarios de accesibilidad y diseño responsive

### ESC-ACC-01 — Visualización en diferentes tamaños de pantalla

| Elemento                | Descripción                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fuente**              | Estudiante                                                                                                                                        |
| **Estímulo**            | Accede a UAgenda desde un dispositivo con una resolución diferente a la utilizada durante el desarrollo.                                          |
| **Entorno**             | Navegador web.                                                                                                                                    |
| **Artefacto**           | Interfaz web de UAgenda.                                                                                                                          |
| **Respuesta**           | La interfaz adapta su distribución y mantiene disponibles sus funciones principales.                                                              |
| **Medida de respuesta** | El 100 % de las resoluciones soportadas debe permitir utilizar los elementos principales de navegación y contenido sin desplazamiento horizontal. |

### ESC-ACC-02 — Elementos accesibles

| Elemento                | Descripción                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fuente**              | Estudiante                                                                                                                                                |
| **Estímulo**            | Interactúa con elementos de la interfaz.                                                                                                                  |
| **Entorno**             | Navegador web.                                                                                                                                            |
| **Artefacto**           | Componentes de la interfaz.                                                                                                                               |
| **Respuesta**           | Los elementos proporcionan información suficiente para comprender su función.                                                                             |
| **Medida de respuesta** | El 100 % de las imágenes informativas debe contar con texto alternativo y el 100 % de los controles interactivos debe tener una identificación accesible. |

---

## 7. Resumen de escenarios

| ID         | Atributo       | Escenario                   | Prioridad  |
| ---------- | -------------- | --------------------------- | ---------- |
| ESC-SEG-01 | Seguridad      | Protección de consultas SQL | Crítica    |
| ESC-SEG-02 | Seguridad      | Control de acceso           | Crítica    |
| ESC-MAN-01 | Mantenibilidad | Componentes compartidos     | Alta       |
| ESC-MAN-02 | Mantenibilidad | Consistencia del esquema    | Alta       |
| ESC-DIS-01 | Disponibilidad | Fallo de conexión con MySQL | Alta       |
| ESC-TST-01 | Testabilidad   | Pruebas después de cambios  | Media-Alta |
| ESC-TST-02 | Testabilidad   | Prueba de humo              | Media-Alta |
| ESC-ACC-01 | Accesibilidad  | Diseño responsive           | Media      |
| ESC-ACC-02 | Accesibilidad  | Elementos accesibles        | Media      |

## 8. Relación con los drivers arquitectónicos

Los escenarios definidos permiten convertir los drivers arquitectónicos de UAgenda en condiciones concretas que pueden ser verificadas durante la evolución del sistema.

La prioridad inicial se mantiene en seguridad, seguida de mantenibilidad, disponibilidad, testabilidad y accesibilidad. Los escenarios podrán utilizarse posteriormente como referencia para validar las mejoras arquitectónicas realizadas sobre el sistema base.
