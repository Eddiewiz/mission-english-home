# Mission English Home v1.3.2

Esta versión incorpora localmente los 21 alumnos de 4.º A y combina la lista local con la recibida desde Google Sheets. Así, 4.º aparece incluso si el Web App publicado todavía devuelve una lista anterior.

# Mission English Home 1.2.4 — solución final

Se corrigió el error de inicio que dejaba la pantalla permanentemente en:

“Buscando la lista de alumnos…”

La causa era que la función `loadBootstrap()` existía, pero no se ejecutaba al abrir la aplicación.

No hace falta modificar Google Sheets ni Apps Script.

# Mission English Home 1.2.4 — corrección estable

Corrección del bloqueo “Buscando la lista de alumnos…”.

La lista de 5.º y 6.º queda incluida dentro de la aplicación para que la pantalla de alumnos abra de inmediato. La aplicación continúa consultando Google Sheets para obtener el progreso y cualquier actualización disponible.

No hay que modificar Apps Script ni la planilla.

# Mission English Home 1.2.4 — versión estable

Cambios finales de Fase 1:
- Corrige definitivamente la carga de alumnos usando el callback JSONP comprobado.
- Misión 4: desafío de opción múltiple para elegir “Toilet”.
- Elimina “Actualizar progreso” del mapa de misiones.
- Evita que vuelva a aparecer “Guardando…” después de confirmar el envío.
- “Continuar” actualiza el progreso y vuelve directamente al mapa de misiones.

No es necesario modificar Google Apps Script.


## Versión v1.3
Incluye Misiones 5–8, recursos visuales, guardado local de progreso y documentación del proyecto.


## Build anterior 1.3.1
- Nueva Misión 5: repaso de Misiones 1–4.
- Colors, Numbers, Weather & Temperature y Repaso general pasan a Misiones 6–9.
- Variación de preguntas y opciones para disminuir copia y memorización por posición.
- Barra de recorrido actualizada en tiempo real.
- Trazabilidad mediante identificadores de contenido estables y revisión.


## Actualización Home v1.3.2
- La aplicación del alumno se identifica como **Mission English Home**, componente de **Mission English World**.
- Misión 5: repaso de 1–4; Misión 6: Colors; Misión 7: Numbers 1–10; Misión 8: Weather & Temperature; Misión 9: repaso de las misiones 6–8.
- Se mantiene variación de opciones y contenido para disminuir copia y memorización de posiciones.
- La escritura de números varía entre 1 y 10.
- El recorrido visual se actualiza al responder.
- Pendiente posterior a estabilizar Home: incorporar Mission English Home e integrar el entorno docente (actual ESL Teacher Manager) dentro de Mission English World.
