# Mission English World – Manual de Diseño

## Versión 1.0

### Propósito
Mission English World es un ecosistema de aprendizaje de inglés que conecta aula, hogar y docente mediante misiones breves que refuerzan lo visto en clase y buscan despertar el deseo de seguir aprendiendo.

### Fundamentos transversales
- **Simplicidad:** cada palabra y cada elemento de interfaz debe ayudar al alumno y reducir la carga cognitiva.
- **Positividad:** el error se trata como una oportunidad de aprendizaje; la tecnología no debe generar frustración.
- **Sentido común:** las decisiones nacen de la experiencia real, la observación del aula y las necesidades concretas.

### Filosofía del aprendizaje
- Mission English World no reemplaza al docente: amplifica su trabajo.
- El docente guía el recorrido; el alumno participa activamente y puede reforzar contenidos dentro de límites pedagógicos claros.
- Mission English World personaliza el recorrido sin separar al alumno de su grupo.
- El alumno nunca debe sentirse “atrasado” por recibir una misión adicional.
- El programa acompaña lo ya visto en clase; no se diseña como sustituto de la enseñanza presencial.

### Contenido
- Las instrucciones son principalmente en español, con exposición natural y gradual al inglés.
- Se utiliza por ahora un inglés mayormente neutral. Cuando una elección entre variantes sea necesaria, se prioriza American English; por ejemplo, **color** y **gray**, aclarando que en British English se escriben **colour** y **grey**.
- Se desarrollan progresivamente lectura, escucha, habla y escritura.
- Las actividades deben incluir reconocimiento y producción; la escritura aparece desde las primeras misiones de forma gradual.
- Se evitan contenidos vinculados con política, religión y sexualidad.

### Experiencia del alumno
- El progreso debe motivar y no apurar.
- No se enfatizan contadores del tipo “4 de 6”; se prefiere un recorrido visual discreto.
- Cada misión debe terminar con sensación de avance y curiosidad por la siguiente.
- El feedback al alumno debe ser positivo, claro y breve.
- La misión debe quedar guardada localmente antes de depender de Internet.
- El alumno nunca debería preguntarse si el programa funcionó.

### Teacher Eddie
- Teacher Eddie aparece en momentos importantes, no constantemente.
- Puede saludar de manera contextual: “Good morning, Tomás!” o “Good morning, Tomás and Sofía!”.
- Los saludos cotidianos sirven como exposición natural al idioma, aunque luego puedan tener una misión propia.
- El avatar y sus expresiones se incorporarán de forma consistente cuando se apruebe el recurso base.

### Misiones
- Las misiones siguen inicialmente una secuencia lógica, pero el docente puede asignar misiones a un curso, grupo o alumno.
- Estados previstos: Bloqueada, Disponible, Completada y Repaso disponible.
- El modo secuencial es el predeterminado; también habrá modo asignado por docente y modo repaso.
- Las misiones personalizadas deben presentarse de forma discreta y positiva.
- Cada bloque de cuatro misiones tendrá feedback simple del alumno.

### Imágenes
- A partir de Mission 5, las imágenes forman parte de la experiencia.
- Deben ser creativas y coherentes entre sí; se evitan recursos excesivamente genéricos cuando una alternativa más original aporta valor.
- La imagen nunca debe resolver por el alumno aquello que la actividad busca que piense. Tampoco debe mostrar accidentalmente la palabra o respuesta esperada.
- El orden de las respuestas de opción múltiple puede variar entre intentos para reducir la copia y evitar el aprendizaje por posición.

### Origen y evolución
Mission English World nace como creación propia basada en años de experiencia docente y profesional, incluida la creación durante cinco años de bases, reglas y actividades para un campamento de inmersión reconocido. Su desarrollo sigue el ciclo: experiencia → idea propia → diseño → implementación → uso real → observación y feedback → mejora.


## Identidad y trazabilidad de las misiones
- El número visible de una misión indica su posición actual en el recorrido, pero no es su identidad técnica.
- Cada misión tiene un identificador interno estable (`contentKey`/`id`) y una revisión. Así, si se inserta una misión nueva antes de otra, los resultados históricos siguen indicando qué contenido realizó realmente el alumno.
- Las opciones de respuesta deben rotar de posición entre intentos. Cuando sea pedagógicamente adecuado, también debe variar el estímulo o la respuesta correcta para evitar que el alumno memorice ubicaciones.
- El feedback de refuerzo debe indicar el contenido específico que conviene practicar (por ejemplo, `color: purple`, `clima: rainy`), no etiquetas técnicas en inglés que el alumno todavía no conoce.


## Actualización Classroom v1.3.2
- La aplicación del alumno se identifica como **Mission English Classroom**, componente de **Mission English World**.
- Misión 5: repaso de 1–4; Misión 6: Colors; Misión 7: Numbers 1–10; Misión 8: Weather & Temperature; Misión 9: repaso de las misiones 6–8.
- Se mantiene variación de opciones y contenido para disminuir copia y memorización de posiciones.
- La escritura de números varía entre 1 y 10.
- El recorrido visual se actualiza al responder.
- Pendiente posterior a estabilizar Classroom: incorporar Mission English Home e integrar el entorno docente (actual ESL Teacher Manager) dentro de Mission English World.
