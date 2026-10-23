# Eventos candidatos de UAgenda

> Generado con apoyo de IA (Claude) a partir **exclusivamente** de las rutas y escrituras a base de datos de `main.py`. Es materia prima para **auditar y rechazar**, no una lista de eventos adoptados.
>
> Clases: **A** respaldada directamente por evidencia · **B** inferencia plausible · **C** especulativa.
> Las referencias de línea corresponden a `main.py` y pueden desplazarse en commits posteriores.

## 1. Candidatos

| ID | Evento | Hecho que representa | Evidencia en el repositorio | Productor | Interesados potenciales | Información mínima | Clase / confianza |
|---|---|---|---|---|---|---|---|
| EV-01 | UsuarioRegistrado | Un estudiante creó su cuenta | `/register` (l. 608); `INSERT INTO Traza` l. 655 | Usuarios y autenticación | Trazabilidad | idUsuario, momento | A / alta |
| EV-02 | SesionIniciada | Un estudiante se autenticó con éxito | `/loginAccess` (l. 491); Traza l. 540 | Usuarios y autenticación | Trazabilidad | idUsuario, momento | A / alta |
| EV-03 | RecuperacionDeContrasenaSolicitada | Se generó un token y se envió un correo de recuperación | `/recuperacion` (l. 54–85): token en `password_reset_tokens`, `mail.send` (l. 71–77) | Usuarios y autenticación | Servicio SMTP (externo) | correo, token, expiración | A / alta |
| EV-04 | ContrasenaRestablecida | Se actualizó la contraseña de un usuario | `/reset_password` (l. 86–133): `UPDATE usuario SET contrasena` | Usuarios y autenticación | — | correo/idUsuario, momento | A / alta |
| EV-05 | EventoDeHorarioCreado | Se agregó un evento al horario | `/eventAdd` (l. 259); Traza l. 293 ("Ha creado el evento") | Organización académica | Trazabilidad | idUsuario, evento, día, hora inicio/fin | A / alta |
| EV-06 | EventoDeHorarioEditado | Se modificó un evento del horario | `/eventAdd` en modo edición; Traza l. 289 ("Ha editado el evento") | Organización académica | Trazabilidad | idUsuario, evento, datos nuevos | A / alta |
| EV-07 | EventoDeHorarioEliminado | Se eliminó un evento del horario | `/eventRemove` (l. 339); Traza l. 381 | Organización académica | Trazabilidad | idUsuario, evento | A / alta |
| EV-08 | RecordatorioCreado | Se creó un recordatorio | `/remindAdd` (l. 1127); Traza l. 1172 | Recordatorios | Trazabilidad | idUsuario, nombre, fecha/hora | A / alta |
| EV-09 | RecordatorioEliminado | Se eliminó un recordatorio | `/remindRemove` (l. 1180); Traza l. 1216 | Recordatorios | Trazabilidad | idUsuario, recordatorio | A / alta |
| EV-10 | RecordatorioEditado | Se modificó un recordatorio | `/remindEdit` (l. 1225); Traza l. 1299 | Recordatorios | Trazabilidad | idUsuario, datos nuevos | A / alta |
| EV-11 | CuadernoCreado | Se creó un cuaderno | `/cuaderno` POST (l. 940); Traza l. 972 | Gestión del estudio | Trazabilidad | idUsuario, nombre | A / alta |
| EV-12 | CuadernoGuardado | Se guardó el contenido de un cuaderno | `/cuaderno`; Traza l. 1013 ("Ha editado el cuaderno") | Gestión del estudio | Trazabilidad | idUsuario, id_cuaderno | A / alta |
| EV-13 | CuadernoEliminado | Se eliminó un cuaderno | `/cuaderno`; Traza l. 1036 | Gestión del estudio | Trazabilidad | idUsuario, id_cuaderno | A / alta |
| EV-14 | MazoCreado | Se creó un mazo de flashcards | `/newDeck` (l. 1323); Traza l. 1346 | Gestión del estudio | Trazabilidad | idUsuario, nombre del mazo | A / alta |
| EV-15 | TarjetaAgregada | Se añadió una tarjeta a un mazo | `/cardAdd` (l. 1418); Traza l. 1439 | Gestión del estudio | Trazabilidad | idUsuario, mazo, tarjeta | A / alta |
| EV-16 | TarjetaEditada | Se modificó una tarjeta | `/editFlashcard` (l. 1386); Traza l. 1411 | Gestión del estudio | Trazabilidad | idUsuario, mazo, tarjeta | A / alta |
| EV-17 | TarjetaEliminada | Se eliminó una tarjeta | `/deleteFlashcard` (l. 1355); Traza l. 1378 | Gestión del estudio | Trazabilidad | idUsuario, mazo, tarjeta | A / alta |
| EV-18 | FechaDeEstudioRegistrada | Se guardó la fecha en que se estudió un mazo | `/saveStudyDate` (l. 1447); **sin** inserción en Traza dentro de la ruta | Gestión del estudio | — | idUsuario, mazo, fecha | A / media |
| EV-19 | NotaRegistrada | Se agregó una calificación a un grupo | `/calculator` (l. 665–939): `INSERT INTO grupoNotas` | Calificaciones (**sin contexto asignado en el Context Map**) | Trazabilidad | idUsuario, grupo, nota | B / media |
| EV-20 | NotaEliminada | Se borró una calificación | `/calculator`: `DELETE FROM grupoNotas WHERE idNota` | Calificaciones (sin contexto asignado) | Trazabilidad | idUsuario, idNota | B / media |
| EV-21 | GrupoDeNotasCreado | Se creó un grupo de evaluación | `/calculator`: `INSERT INTO grupoNotas` con nuevo `numGrupo`; Traza l. 845 | Calificaciones (sin contexto asignado) | Trazabilidad | idUsuario, numGrupo, porcentaje | B / media |
| EV-22 | GrupoDeNotasEliminado | Se eliminó un grupo completo | `/calculator`: `DELETE FROM grupoNotas WHERE numGrupo` | Calificaciones (sin contexto asignado) | Trazabilidad | idUsuario, numGrupo | B / media |
| EV-23 | PonderacionesActualizadas | Cambiaron los porcentajes de los grupos | `/calculator`: múltiples `UPDATE grupoNotas SET porcentaje` | Calificaciones (sin contexto asignado) | Trazabilidad | idUsuario, porcentajes | B / media |
| EV-24 | CuadernoCambiado | El usuario cambió de cuaderno | `/obtener_cuadernos` (l. 1064–1085): es un `SELECT` de listado que inserta en Traza "Ha cambiado de cuaderno" (l. 1080) | Gestión del estudio | Trazabilidad | idUsuario | B / baja |
| EV-25 | SesionFinalizada | El usuario cerró sesión | `/logout` (l. 134); no se encontró inserción en Traza | Usuarios y autenticación | — | idUsuario, momento | B / media |
| EV-26 | RecordatorioVencido | Un recordatorio llegó a su fecha | `/admin` clasifica hoy/mañana/otros **al renderizar**; no existe proceso que emita un hecho | Recordatorios | — | — | C / baja |
| EV-27 | MateriaCreada | Se registró una materia | **No existe** entidad `materia` en `main.py` ni en `prflask_local.sql` | Organización académica (según `subdominios.md`) | — | — | C / sin evidencia |
| EV-28 | PromedioFinalCalculado | Se calculó el promedio del estudiante | `promedioFinal` se calcula al renderizar `/calculator`; no se persiste | Calificaciones (sin contexto asignado) | — | — | C / baja |

## 2. Observaciones para la auditoría (no son decisiones)

1. **Un solo consumidor interno.** Los 17 candidatos A con "Interesados: Trazabilidad" tienen el mismo consumidor, y hoy se sirve con un `INSERT INTO Traza` síncrono dentro de la misma petición (18 inserciones en 7 módulos).
2. **El único interesado externo real es SMTP** (EV-03), y `mail.send` hoy ocurre dentro de la petición HTTP.
3. **EV-24 parece navegación, no dominio**, y se dispara desde una ruta de lectura. Es el candidato más claro a rechazar o corregir.
4. **EV-26, EV-27 y EV-28 muestran lo que el código no demuestra:** no hay scheduler de recordatorios, no existe la entidad materia y el promedio es un cálculo de vista, no un hecho persistido.
5. **Granularidad de `/calculator` no verificada:** la ruta contiene varias operaciones sobre `grupoNotas` pero solo dos inserciones a Traza (l. 738 y 845); la correspondencia exacta entre acción del usuario y escritura es inferencia (de ahí la clase B).
6. **Traza guarda texto libre** en `Descripcion`, sin carga estructurada. Un evento de dominio real necesitaría explícitos los datos de la columna "Información mínima".

## 3. Información faltante

- Si algún stakeholder necesita reaccionar a estos hechos (hoy no hay consumidores distintos de Traza y SMTP).
