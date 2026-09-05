# 08 — Tabla de Trazabilidad: Modelo C4 vs. Código Real

Aplicando la pregunta de control a cada elemento y relación de los
diagramas C4 (`05-c4-contexto.md`, `06-c4-componentes.md`,
`07-c4-componentes.md`): **¿qué evidencia hace verdadera esta flecha?**
Esta tabla no es un inventario de todo el código — solo traza los
elementos que el equipo decidió representar como arquitectónicamente
relevantes.

| Elemento C4 | Responsabilidad declarada | Archivo/módulo real | Clase o símbolo verificable | Relación comprobada | Estado |
|---|---|---|---|---|---|
| UAgenda (Sistema, Nivel 1) | HUB estudiantil, punto de entrada de todas las funcionalidades | `main.py` | `app = Flask(__name__, template_folder="templates")` | Estudiante → UAgenda (uso vía HTTP) | ✅ Verificado |
| TinyMCE (Sistema externo, Nivel 1) | Editor de texto enriquecido para la sección de notas | `templates/cuaderno.html` | `<script src="https://cdn.tiny.cloud/.../tinymce.min.js">` + `tinymce.init(...)` | Cuaderno → TinyMCE (carga el editor) | 🔧 Corregido — en `05-c4-contexto.md` figura como "API de procesamiento de texto"; se verificó que el símbolo real es un editor WYSIWYG del lado del cliente, no una API que procese texto. Pendiente renombrar en el diagrama. |
| MySQL (ContainerDb, Nivel 2) | Persistencia de toda la información de la app | `main.py` | `app.config["MYSQL_HOST"/"MYSQL_USER"/...]`, `mysql = MySQL(app)` | Aplicación web → MySQL (lee/escribe) | ✅ Verificado |
| Servidor SMTP (Sistema externo, Nivel 2) | Envío de correos de recuperación de contraseña | `main.py`, ruta `/recuperacion` | `Message(...)`, `mail.send(msg)` | Aplicación web → SMTP | ✅ Verificado — la integración está implementada de verdad, no es solo configuración sin uso |
| Componente: Autenticación y Sesión | Login, registro, recuperación de contraseña, control de acceso | `main.py` | `login()`, `register()`, `recuperacion()`, decorador `login_required` (usado 5 veces en el archivo) | Auth → MySQL (`usuario`, `password_reset_tokens`) | ✅ Verificado |
| Componente: Recordatorios | CRUD de recordatorios | `main.py` | rutas `/remindAdd`, `/remindEdit`, `/remindRemove` | Recordatorios → Auth (requiere sesión) | ⚠️ Verificado, con advertencia ya documentada en el inventario de riesgos: `/remindRemove` borra vía `GET`, no `POST` |
| Componente: Horario | CRUD de eventos del horario semanal | `main.py` | `/eventAdd`, `/eventRemove`, `/eventRemove2` | Horario → Auth | 🔧 Corregido — `eventRemove2` en realidad **edita** un evento, no lo elimina (confirmado leyendo el JS que la invoca). El nombre de la ruta no coincide con su responsabilidad real. |
| Componente: Calculadora de Promedios | Gestión de grupos de notas y cálculo de promedio ponderado | `main.py` | ruta `/calculator`, función `calculator()` | Calculadora → Auth | ✅ Verificado |
| Componente: Cuaderno | CRUD de notas de texto enriquecido | `main.py` | ruta `/cuaderno`, `obtener_cuadernos()` | Cuaderno → TinyMCE | ✅ Verificado — `obtener_cuadernos()` sí tiene su llamador real en `static/js/gestorCuaderno.js` (`fetch('/obtener_cuadernos')`) |
| `actualizar_modo_oscuro` (endpoint, no representado en el diagrama) | Se declaró para persistir la preferencia de modo oscuro del cuaderno | `main.py` (línea 1092) | `def actualizar_modo_oscuro():` | Sin llamador en el frontend actual | 🗑️ Eliminado (huérfano) — ningún template ni JS invoca este endpoint tras la limpieza del frontend del Cuaderno (se removió el toggle de modo oscuro del lado del cliente). Candidato a remover en un futuro PR, o a documentarse explícitamente como deuda técnica. |
| `/obtener_modo_oscuro` (referencia en código legado) | Se planeaba una consulta para leer el modo oscuro guardado en base de datos | — | — | No hallado | 🗑️ Eliminado — nunca existió como ruta real de Flask; solo aparecía como un `fetch` comentado en el `cuaderno.html` original, ya removido durante el rediseño. |
| Componente: Flashcards | CRUD de mazos y tarjetas de estudio | `main.py` | `/newDeck`, `/cardAdd`, `/saveStudyDate` | Flashcards → Auth | ✅ Verificado |
