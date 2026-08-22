
const APP_VERSION = "Home v1.5.9";
const CONTENT_VERSION = "Mission English Home v1.5.0 — Identidad web Home";
const STORAGE_KEY = "mission_english_home_state_v13";
const QUEUE_KEY = "mission_english_home_results_queue_v11";
const CONFIG_KEY = "mission_english_home_config_v11";
const LOCAL_PROGRESS_KEY = "mission_english_home_local_progress_v13";
const HOME_INTRO_SEEN_KEY = "mission_english_home_intro_seen_v1";
const HOME_SCHOOL_KEY = "mission_english_home_school";
let homeAudioRate = 1;
let preferredEnglishVoice = null;

function chooseNaturalEnglishVoice_() {
  const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  if (!voices.length) return null;
  const preferredNames = [
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Google US English",
    "Samantha",
    "Karen",
    "Moira",
    "Daniel"
  ];
  for (const name of preferredNames) {
    const v = voices.find(x => String(x.name||"").toLowerCase() === name.toLowerCase());
    if (v) return v;
  }
  return voices.find(v => /^en[-_](US|GB|AU)/i.test(v.lang||"")) || voices.find(v => /^en/i.test(v.lang||"")) || null;
}

function refreshNaturalEnglishVoice_() {
  preferredEnglishVoice = chooseNaturalEnglishVoice_();
}

if ("speechSynthesis" in window) {
  refreshNaturalEnglishVoice_();
  speechSynthesis.addEventListener?.("voiceschanged", refreshNaturalEnglishVoice_);
}

function playUsefulEnglishAudio() {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  speechSynthesis.resume();
  const u = new SpeechSynthesisUtterance("Can I go to the toilet, please?");
  u.lang = "en-US";
  u.rate = homeAudioRate;
  u.pitch = 1;
  u.volume = 1;
  const voice = preferredEnglishVoice || chooseNaturalEnglishVoice_();
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

let quickVoteStats = { total: 0, choices: {}, myChoice: "" };
// Mission IDs are stable content identifiers. Display numbers may change without rewriting historical results.
const SYNC_ENDPOINT = "https://script.google.com/macros/s/AKfycbyUt9Wm6VS9NQoCuc6hBhH6QgJHzv6KFETQX7or9YJg6WdQvkDlMddlm-fub5FyF6soRg/exec"; // Mission English Classroom receiver.
const LOCAL_STUDENTS = [{"id":"ALU-4-001","officialName":"Almada, Francisco","displayName":"Almada, Francisco","nickname":"","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-002","officialName":"Alvarez, Iker Mariano","displayName":"Alvarez, Iker Mariano","nickname":"Iker","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-003","officialName":"Churaira, Alison Tamara","displayName":"Churaira, Alison Tamara","nickname":"Alison","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-004","officialName":"Cruz, Angel Alexis","displayName":"Cruz, Angel Alexis","nickname":"Angel","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-005","officialName":"Gonzalez Reyes, Maria Pia","displayName":"Gonzalez Reyes, Maria Pia","nickname":"Pia","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-006","officialName":"Hualpa Diaz, Sofia Alisson","displayName":"Hualpa Diaz, Sofia Alisson","nickname":"Sofia","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-007","officialName":"Lobos, Alexis Agustin","displayName":"Lobos, Alexis Agustin","nickname":"Alexis","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-008","officialName":"Lopez Bustamante, Julieta Tatiana","displayName":"Lopez Bustamante, Julieta Tatiana","nickname":"Julieta","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-009","officialName":"Lujan Cabrera, Milo Santino","displayName":"Lujan Cabrera, Milo Santino","nickname":"Milo","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-010","officialName":"Marcelo La Cruz, Wendy Nicole","displayName":"Marcelo La Cruz, Wendy Nicole","nickname":"Wendy","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-011","officialName":"Munoz Massa, Noah German","displayName":"Munoz Massa, Noah German","nickname":"Noah","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-012","officialName":"Nievas, Santino Benjamin","displayName":"Nievas, Santino Benjamin","nickname":"Santino","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-013","officialName":"Ocampo, Ivan Hernan","displayName":"Ocampo, Ivan Hernan","nickname":"Ivan","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-014","officialName":"Ontivero, Alina Yasmin","displayName":"Ontivero, Alina Yasmin","nickname":"Alina","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-015","officialName":"Peredo Corrales, Abril Britany","displayName":"Peredo Corrales, Abril Britany","nickname":"Abril","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-016","officialName":"Perez Miranda, Morena Yuliana","displayName":"Perez Miranda, Morena Yuliana","nickname":"Morena","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-017","officialName":"Ramallo Ledesma, Agustin S","displayName":"Ramallo Ledesma, Agustin S","nickname":"Agustin","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-018","officialName":"Reyes, Santino Leonel","displayName":"Reyes, Santino Leonel","nickname":"Santino","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-019","officialName":"Tabares, Laureano","displayName":"Tabares, Laureano","nickname":"Laureano","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-020","officialName":"Traico, Nicole Franchesca","displayName":"Traico, Nicole Franchesca","nickname":"Nicole","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-4-021","officialName":"Villegas, Aylen Melodi","displayName":"Villegas, Aylen Melodi","nickname":"Aylen","schoolYear":"2026","grade":"4","division":"A"},{"id":"ALU-5-001","officialName":"Acuña Cabral, Paz","displayName":"Acuña Cabral, Paz","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-002","officialName":"Andrada, Noha Valentino","displayName":"Andrada, Noha Valentino","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-003","officialName":"Andrada Moreyra, Theo Yeremias","displayName":"Andrada Moreyra, Theo Yeremias","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-004","officialName":"Andreo, Alvaro Benjamin","displayName":"Andreo, Alvaro Benjamin","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-005","officialName":"Ariza Rojas, Benjamin","displayName":"Ariza Rojas, Benjamin","nickname":"Benja","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-006","officialName":"Bastidos Cerron, Dilan","displayName":"Bastidos Cerron, Dilan","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-007","officialName":"Caceres, Misael Ezequias","displayName":"Caceres, Misael Ezequias","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-008","officialName":"De Toro Romero, Thiago Valentin","displayName":"De Toro Romero, Thiago Valentin","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-009","officialName":"Faotto, Eliseo Damian","displayName":"Faotto, Eliseo Damian","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-010","officialName":"Faraig, Franchesca Charlot","displayName":"Faraig, Franchesca Charlot","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-011","officialName":"Ferreyra, Benjamin Nicolas","displayName":"Ferreyra, Benjamin Nicolas","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-012","officialName":"Garcia, Mirko Alejandro","displayName":"Garcia, Mirko Alejandro","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-013","officialName":"Ignacio Champi, Rishell Briana","displayName":"Ignacio Champi, Rishell Briana","nickname":"Briana","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-014","officialName":"Lopez, Francisco Tomas","displayName":"Lopez, Francisco Tomas","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-015","officialName":"Lopez, Ian Alejandro","displayName":"Lopez, Ian Alejandro","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-016","officialName":"Lopez, Sofia Luz","displayName":"Lopez, Sofia Luz","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-017","officialName":"Mantilla Anchante, Iker Sebastian","displayName":"Mantilla Anchante, Iker Sebastian","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-018","officialName":"Olivera, Noa","displayName":"Olivera, Noa","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-019","officialName":"Pagnetto, Lara Jazmin","displayName":"Pagnetto, Lara Jazmin","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-020","officialName":"Palomino Checcllo, Damaris Avigai","displayName":"Palomino Checcllo, Damaris Avigai","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-021","officialName":"Rios Tejeda, Angel Rodrigo","displayName":"Rios Tejeda, Angel Rodrigo","nickname":"Rodrigo","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-022","officialName":"Rodriguez, Catalehia","displayName":"Rodriguez, Catalehia","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-023","officialName":"Rodriguez, Luz Victoria","displayName":"Rodriguez, Luz Victoria","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-024","officialName":"Saldano, Jeremias Simon","displayName":"Saldano, Jeremias Simon","nickname":"Simon","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-5-025","officialName":"Traico, Onur Boran Jesus","displayName":"Traico, Onur Boran Jesus","nickname":"","schoolYear":"2026","grade":"5","division":""},{"id":"ALU-6-001","officialName":"Agustin","displayName":"Agustin","nickname":"Agus","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-002","officialName":"Allamano, Dylan Francisco","displayName":"Allamano, Dylan Francisco","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-003","officialName":"Andrada, Ruben Bautista","displayName":"Andrada, Ruben Bautista","nickname":"Bautista","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-004","officialName":"Arguello, Melody Nahiara","displayName":"Arguello, Melody Nahiara","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-005","officialName":"Britez Allauca, Yamile Mercedes","displayName":"Britez Allauca, Yamile Mercedes","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-006","officialName":"Contreras Corbalan, Theo Azahel","displayName":"Contreras Corbalan, Theo Azahel","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-007","officialName":"Drago Traico, Thiago Isaias","displayName":"Drago Traico, Thiago Isaias","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-008","officialName":"Escobar Centeno, Samira","displayName":"Escobar Centeno, Samira","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-009","officialName":"Faotto, Felipe David","displayName":"Faotto, Felipe David","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-010","officialName":"Gonzales Gallardo, Mayco","displayName":"Gonzales Gallardo, Mayco","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-011","officialName":"Gonzalez Reyes, Martina","displayName":"Gonzalez Reyes, Martina","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-012","officialName":"Gutierrez Domingo, Mateo Ismael","displayName":"Gutierrez Domingo, Mateo Ismael","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-013","officialName":"Guzman Rinaldi, Thiago Franco","displayName":"Guzman Rinaldi, Thiago Franco","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-014","officialName":"Lopez Ronaldo, Augusto","displayName":"Lopez Ronaldo, Augusto","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-015","officialName":"Mamani Arze, Thiago Franco","displayName":"Mamani Arze, Thiago Franco","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-016","officialName":"Marcelo La Cruz, Andres","displayName":"Marcelo La Cruz, Andres","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-017","officialName":"Marigliano, Valentino Emmanuel","displayName":"Marigliano, Valentino Emmanuel","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-018","officialName":"Moreyra, Eimi Antonella","displayName":"Moreyra, Eimi Antonella","nickname":"Antonella","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-019","officialName":"Ortiz, Josefina Paz","displayName":"Ortiz, Josefina Paz","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-020","officialName":"Pavez, Ruth Abigael","displayName":"Pavez, Ruth Abigael","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-021","officialName":"Perez, Felipe Javier","displayName":"Perez, Felipe Javier","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-022","officialName":"Pistoia, Isabella","displayName":"Pistoia, Isabella","nickname":"Isa","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-023","officialName":"Pucheta, Lorenzo Bautista","displayName":"Pucheta, Lorenzo Bautista","nickname":"Bautista","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-024","officialName":"Reyes, Thiago Valentin","displayName":"Reyes, Thiago Valentin","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-025","officialName":"Salas, Cecile Guadalupe","displayName":"Salas, Cecile Guadalupe","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-026","officialName":"Santillan Gonzales, Lucas Simon","displayName":"Santillan Gonzales, Lucas Simon","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-027","officialName":"Tabares, Julian","displayName":"Tabares, Julian","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-028","officialName":"Traico, Miguel Angel","displayName":"Traico, Miguel Angel","nickname":"","schoolYear":"2026","grade":"6","division":""},{"id":"ALU-6-029","officialName":"Vedia Soto, Rosalinda","displayName":"Vedia Soto, Rosalinda","nickname":"","schoolYear":"2026","grade":"6","division":""}];

const missions = [
  {
    "id": "m1",
    "number": 1,
    "contentKey": "date",
    "revision": 2,
    "icon": "📅",
    "title": "MISIÓN 1 – La fecha (Date)",
    "intro": "🚀 ¡Ahora sí! Comienza la primera misión.",
    "sections": [
      {
        "title": "📖 Aprende",
        "html": "<p>Hoy vamos a recordar cómo escribimos la fecha.</p>\n        <p>En inglés siempre escribimos la fecha de esta forma:</p>\n        <div class=\"notice\"><strong>Today is Monday, June 29th.</strong></div>\n        <p>Primero escribimos el día de la semana. Después el mes. Y por último el número del día.</p>\n        <p>Si necesitas ayuda, puedes consultar tu carpeta.</p>"
      },
      {
        "title": "👀 Observa",
        "html": "<div class=\"notice\"><strong>Today is Monday, June 29th.</strong></div>\n        <p><strong>Today</strong> significa <em>hoy</em>.</p>\n        <p><strong>Is</strong> viene del verbo <em>to be</em>, que quiere decir ser o estar. En esta oración significa: <strong>Hoy es…</strong></p>"
      },
      {
        "title": "🌟 ¿Sabías que...?",
        "html": "<p>En inglés la fecha se escribe en un orden diferente al español.</p>"
      }
    ],
    "questions": [
      {
        "id": "h1q1",
        "topic": "Meaning of Today",
        "review": "significado de Today",
        "points": 1,
        "text": "¿Qué significa Today?",
        "options": [
          "Hoy",
          "Ayer",
          "Mañana"
        ],
        "correct": "Hoy"
      },
      {
        "id": "h1q2",
        "topic": "Date order",
        "review": "orden de la fecha",
        "points": 1,
        "text": "En “Today is Wednesday, September 9th”, ¿qué aparece después de Wednesday?",
        "options": [
          "September",
          "9th",
          "Today"
        ],
        "correct": "September"
      },
      {
        "id": "h1q3",
        "topic": "Correct date structure",
        "review": "estructura de la fecha",
        "points": 1,
        "text": "¿Cuál está escrita como la estructura que practicamos?",
        "options": [
          "Today is Thursday, October 8th.",
          "Today October is Thursday 8th.",
          "Thursday is Today October."
        ],
        "correct": "Today is Thursday, October 8th."
      },
      {
        "id": "h1q4",
        "topic": "Date sentence",
        "review": "escribir la fecha",
        "points": 1,
        "text": "Completa: Today ___ Monday.",
        "type": "text",
        "accepted": [
          "is"
        ],
        "displayCorrect": "is"
      },
      {
        "id": "h1q5",
        "topic": "Starting a date",
        "review": "comenzar una fecha",
        "points": 1,
        "text": "Una pregunta más: ¿Con qué expresión puedes comenzar la fecha de hoy?",
        "options": [
          "Today is...",
          "Good night...",
          "Can I...?"
        ],
        "correct": "Today is..."
      }
    ],
    "closing": "🎉 ¡Muy bien! Practicaste la fecha con ejemplos nuevos."
  },
  {
    "id": "m2",
    "number": 2,
    "contentKey": "greetings",
    "revision": 2,
    "icon": "👋",
    "title": "MISIÓN 2 – Greetings",
    "intro": "🚀 ¡Excelente trabajo! Continuemos con la siguiente misión.",
    "sections": [
      {
        "title": "📖 Aprende",
        "html": "<p>Hoy vamos a recordar cómo saludamos y nos despedimos en inglés.</p>\n        <p>Algunos saludos se usan cuando llegamos. Otros se usan cuando nos vamos. Saber cuál usar en cada momento nos ayuda a comunicarnos mejor.</p>"
      },
      {
        "title": "👀 Observa",
        "html": "<p><strong>Miramos primero el momento del día:</strong></p>\n        <div class=\"greeting-visual-grid\">\n          <figure><img src=\"images/approved/good-morning.jpg\" alt=\"Good morning\"><figcaption>por la mañana</figcaption></figure>\n          <figure><img src=\"images/approved/good-afternoon.jpg\" alt=\"Good afternoon\"><figcaption>por la tarde</figcaption></figure>\n          <figure><img src=\"images/approved/good-evening.jpg\" alt=\"Good evening\"><figcaption>cuando llegás por la tarde-noche</figcaption></figure>\n          <figure><img src=\"images/approved/good-night.jpg\" alt=\"Good night\"><figcaption>cuando te despedís / antes de dormir</figcaption></figure>\n        </div>\n        <p><strong>Saludos (cuando llegas):</strong></p>\n        <p>Hello! → Hola.<br>Hi! → Hola.<br>Good morning! → Buenos días.<br>Good afternoon! → Buenas tardes.<br>Good evening! → Buenas tardes / Buenas noches (al llegar).</p>\n        <p><strong>Despedidas (cuando te vas):</strong></p>\n        <p>Goodbye! → Adiós.<br>Bye! → Chau.<br>See you! → Nos vemos.<br>Good night! → Buenas noches (al despedirte o antes de dormir).</p>"
      },
      {
        "title": "🌟 ¿Sabías que...?",
        "html": "<p>Aunque en español decimos “Buenas noches”, en inglés usamos dos expresiones diferentes:</p>\n        <p><strong>Good evening</strong> → cuando llegas o saludas por la tarde o la noche.<br>\n        <strong>Good night</strong> → cuando te despides o antes de ir a dormir.</p>"
      }
    ],
    "questions": [
      {
        "id": "h2q1",
        "topic": "Morning greeting",
        "review": "Good morning",
        "points": 1,
        "text": "Son las 8:15 y llegas a la escuela. ¿Qué dices?",
        "options": [
          "Good morning!",
          "Good night!",
          "Goodbye!"
        ],
        "correct": "Good morning!"
      },
      {
        "id": "h2q2",
        "topic": "Afternoon greeting",
        "review": "Good afternoon",
        "points": 1,
        "text": "Llegas a las 15:00. ¿Qué saludo corresponde?",
        "options": [
          "Good afternoon!",
          "Good night!",
          "Bye!"
        ],
        "correct": "Good afternoon!"
      },
      {
        "id": "h2q3",
        "topic": "Night farewell",
        "review": "Good night",
        "points": 1,
        "text": "Te despides antes de dormir. ¿Qué dices?",
        "options": [
          "Good evening!",
          "Good night!",
          "Hello!"
        ],
        "correct": "Good night!"
      },
      {
        "id": "h2q4",
        "topic": "See you",
        "review": "See you",
        "points": 1,
        "text": "¿Cuál significa “Nos vemos”?",
        "options": [
          "See you!",
          "Good morning!",
          "Listen!"
        ],
        "correct": "See you!"
      },
      {
        "id": "h2q5",
        "topic": "Evening greeting",
        "review": "Good evening",
        "points": 1,
        "text": "Una pregunta más: Llegas a cenar y saludas. ¿Qué opción es mejor?",
        "options": [
          "Good evening!",
          "Good night!",
          "Goodbye!"
        ],
        "correct": "Good evening!"
      }
    ],
    "closing": "🎉 ¡Excelente! Elegiste saludos según distintas situaciones."
  },
  {
    "id": "m3",
    "number": 3,
    "contentKey": "classroom-english",
    "revision": 2,
    "icon": "🏫",
    "title": "MISIÓN 3 – Classroom English",
    "intro": "🚀 ¡Muy bien! Ya completaste dos misiones. ¡Vamos por la tercera!",
    "sections": [
      {
        "title": "📖 Aprende",
        "html": "<p>En la clase de inglés, el teacher usa muchas instrucciones en inglés.</p>\n        <p>Si las comprendes, podrás participar mejor y seguir la clase con más facilidad. Hoy vamos a recordarlas.</p>"
      },
      {
        "title": "👀 Observa",
        "html": "<p><strong>Listen</strong> → Escucha.<br>\n        <strong>Look</strong> → Mira.<br>\n        <strong>Stand up</strong> → Ponte de pie.<br>\n        <strong>Sit down</strong> → Siéntate.<br>\n        <strong>Copy</strong> → Copia.<br>\n        <strong>Stop</strong> → Detente.<br>\n        <strong>Let's go!</strong> → ¡Vamos!<br>\n        <strong>Silence, please.</strong> → Silencio, por favor.</p>"
      },
      {
        "title": "🌟 ¿Sabías que...?",
        "html": "<p>Aunque no entiendas todas las palabras de una oración, muchas veces puedes comprender lo que el teacher quiere decir por el contexto o por sus gestos.</p>\n        <p>Por ejemplo, si el teacher dice <strong>“Stand up”</strong> mientras se pone de pie, es más fácil recordar qué significa.</p>"
      }
    ],
    "questions": [
      {
        "id": "h3q1",
        "topic": "Listen",
        "review": "Listen",
        "points": 1,
        "text": "El teacher quiere que prestes atención a lo que dice. ¿Qué instrucción puede usar?",
        "options": [
          "Listen.",
          "Copy.",
          "Stand up."
        ],
        "correct": "Listen."
      },
      {
        "id": "h3q2",
        "topic": "Look",
        "review": "Look",
        "points": 1,
        "text": "El teacher señala el pizarrón. ¿Qué palabra puede decir?",
        "options": [
          "Look.",
          "Stop.",
          "Sit down."
        ],
        "correct": "Look."
      },
      {
        "id": "h3q3",
        "topic": "Copy",
        "review": "Copy",
        "points": 1,
        "text": "¿Qué significa Copy?",
        "options": [
          "Copiar.",
          "Escuchar.",
          "Pararse."
        ],
        "correct": "Copiar."
      },
      {
        "id": "h3q4",
        "topic": "Stop",
        "review": "Stop",
        "points": 1,
        "text": "¿Qué haces si escuchas Stop?",
        "options": [
          "Me detengo.",
          "Me pongo de pie.",
          "Empiezo a copiar."
        ],
        "correct": "Me detengo."
      },
      {
        "id": "h3q5",
        "topic": "Following instructions",
        "review": "instrucciones de clase",
        "points": 1,
        "text": "Una pregunta más: Si escuchas “Sit down, please”, ¿qué haces?",
        "options": [
          "Me siento.",
          "Miro.",
          "Salgo."
        ],
        "correct": "Me siento."
      }
    ],
    "closing": "🎉 ¡Muy bien! Practicaste instrucciones reales de clase."
  },
  {
    "id": "m4",
    "number": 4,
    "contentKey": "asking-permission",
    "revision": 2,
    "icon": "🚻",
    "title": "MISIÓN 4 – Pedir permiso",
    "intro": "🚀 ¡Llegaste a la cuarta misión! Ahora practicaremos cómo pedir permiso de manera educada.",
    "sections": [
      {
        "title": "📖 Aprende",
        "html": "<p>Hoy vamos a recordar cómo pedir permiso en inglés de manera educada.</p>\n        <div class=\"notice\"><strong>Can I...?</strong> = ¿Puedo...?</div>\n        <p>Para hacer el pedido más amable, agregamos <strong>please</strong> = por favor.</p>\n        <p>Para llamar la atención del teacher antes de hablar, podemos decir <strong>Excuse me.</strong> = Permiso.</p>"
      },
      {
        "title": "👀 Observa",
        "html": "<div class=\"notice\"><strong>🙋 Excuse me. Can I go to the restroom / toilet, please?</strong></div>\n        <p>👍 <strong>Yes, you can.</strong> → Sí, puedes.<br>\n        ✋ <strong>No, please wait.</strong> → No, por favor espera.</p>"
      },
      {
        "title": "🌟 ¿Sabías que...?",
        "html": "<p>En inglés, decir <strong>please</strong> hace que un pedido sea más amable y respetuoso.</p>"
      }
    ],
    "questions": [
      {
        "id": "h4q1",
        "topic": "Can I meaning",
        "review": "Can I...?",
        "points": 1,
        "text": "¿Qué significa Can I...?",
        "options": [
          "¿Puedo...?",
          "¿Cómo estás?",
          "¿Qué hora es?"
        ],
        "correct": "¿Puedo...?"
      },
      {
        "id": "h4q2",
        "topic": "Excuse me",
        "review": "Excuse me",
        "points": 1,
        "text": "Antes de pedir permiso, ¿qué puedes decir para llamar la atención con respeto?",
        "options": [
          "Excuse me.",
          "Goodbye.",
          "Stand up."
        ],
        "correct": "Excuse me."
      },
      {
        "id": "h4q3",
        "topic": "Polite requests",
        "review": "please",
        "points": 1,
        "text": "¿Qué palabra hace el pedido más amable?",
        "options": [
          "Please",
          "Hello",
          "Stop"
        ],
        "correct": "Please"
      },
      {
        "id": "h4q4",
        "topic": "Bathroom vocabulary",
        "review": "restroom / toilet",
        "points": 1,
        "text": "Completa: Can I go to the ________, please?",
        "type": "text",
        "accepted": [
          "restroom",
          "toilet"
        ],
        "displayCorrect": "restroom / toilet"
      },
      {
        "id": "h4q5",
        "topic": "Polite full request",
        "review": "pedido completo",
        "points": 1,
        "text": "Una pregunta más: ¿Cuál es un pedido completo y amable?",
        "options": [
          "Can I go to the toilet, please?",
          "Toilet!",
          "Go toilet."
        ],
        "correct": "Can I go to the toilet, please?"
      }
    ],
    "closing": "🎉 ¡Excelente! Ya puedes practicar un pedido que realmente puedes usar en la escuela."
  },
  {
    "id": "review-1-4-v1",
    "number": 5,
    "contentKey": "review-1-4",
    "revision": 2,
    "icon": "🔄",
    "title": "MISIÓN 5 – Repaso de las misiones 1–4",
    "intro": "Antes de comenzar temas nuevos, vamos a recordar algunas cosas que ya practicamos en las primeras cuatro misiones.",
    "sections": [
      {
        "title": "🧠 Recordemos sin mirar respuestas",
        "html": "<p>Esta misión es un repaso. Lee con calma y piensa antes de responder. Si algo no sale, no pasa nada: nos ayuda a saber qué conviene practicar un poco más.</p>"
      }
    ],
    "questions": [
      {
        "id": "h5q1",
        "topic": "Date review",
        "review": "fecha",
        "points": 1,
        "text": "¿Qué significa Today?",
        "options": [
          "Hoy",
          "Ayer",
          "Mañana"
        ],
        "correct": "Hoy"
      },
      {
        "id": "h5q2",
        "topic": "Greeting review",
        "review": "saludos",
        "points": 1,
        "text": "Llegas por la mañana. ¿Qué saludo corresponde?",
        "options": [
          "Good morning!",
          "Good night!",
          "See you!"
        ],
        "correct": "Good morning!"
      },
      {
        "id": "h5q3",
        "topic": "Classroom English review",
        "review": "Classroom English",
        "points": 1,
        "text": "¿Qué significa Listen?",
        "options": [
          "Escucha.",
          "Copia.",
          "Siéntate."
        ],
        "correct": "Escucha."
      },
      {
        "id": "h5q4",
        "topic": "Permission review",
        "review": "pedir permiso",
        "points": 1,
        "text": "Completa una palabra posible: Can I go to the ________, please?",
        "type": "text",
        "accepted": [
          "restroom",
          "toilet"
        ],
        "displayCorrect": "restroom / toilet"
      },
      {
        "id": "h5q5",
        "topic": "Integrated review",
        "review": "usar lo leído",
        "points": 1,
        "text": "Una pregunta más: Si no recuerdas una respuesta, ¿qué conviene revisar primero?",
        "options": [
          "La explicación de la misión",
          "Un buscador",
          "La respuesta de otro alumno"
        ],
        "correct": "La explicación de la misión"
      }
    ],
    "closing": "🎉 ¡Repaso completado! Tus resultados muestran qué ya está firme y qué puedes practicar más."
  },
  {
    "id": "colors-v1",
    "number": 6,
    "contentKey": "colors",
    "revision": 2,
    "icon": "🎨",
    "title": "MISIÓN 6 – Colors",
    "intro": "Hoy repasaremos los colores que vimos en clase para reconocerlos, recordarlos y comenzar a escribirlos con más seguridad.",
    "sections": [
      {
        "title": "📖 Recordemos",
        "html": "<div class=\"vocab-grid color-grid\">\n          <span><img src=\"images/mission6/red.svg\" alt=\"Pincelada roja\"><strong>red</strong></span>\n          <span><img src=\"images/mission6/blue.svg\" alt=\"Pincelada azul\"><strong>blue</strong></span>\n          <span><img src=\"images/mission6/green.svg\" alt=\"Pincelada verde\"><strong>green</strong></span>\n          <span><img src=\"images/mission6/yellow.svg\" alt=\"Pincelada amarilla\"><strong>yellow</strong></span>\n          <span><img src=\"images/mission6/gray.svg\" alt=\"Pincelada gris\"><strong>gray</strong></span>\n          <span><img src=\"images/mission6/pink.svg\" alt=\"Pincelada rosa\"><strong>pink</strong></span>\n          <span><img src=\"images/mission6/purple.svg\" alt=\"Pincelada violeta\"><strong>purple</strong></span>\n          <span><img src=\"images/mission6/black.svg\" alt=\"Pincelada negra\"><strong>black</strong></span>\n          <span><img src=\"images/mission6/white.svg\" alt=\"Pincelada blanca\"><strong>white</strong></span>\n          <span><img src=\"images/mission6/brown.svg\" alt=\"Pincelada marrón\"><strong>brown</strong></span>\n          <span><img src=\"images/mission6/orange.svg\" alt=\"Pincelada naranja\"><strong>orange</strong></span>\n        </div>"
      },
      {
        "title": "🌟 ¿Sabías que...?",
        "html": "<p>Hasta ahora venimos usando un inglés mayormente neutral. En dos palabras elegimos la forma de <strong>American English</strong>: <strong>color</strong> y <strong>gray</strong>.</p><p>En <strong>British English (inglés británico)</strong>, esas dos palabras se escriben así: <strong>colour</strong> y <strong>grey</strong>.</p>"
      }
    ],
    "questions": [
      {
        "id": "h6q1",
        "topic": "Color recognition",
        "review": "colores",
        "points": 1,
        "text": "¿Cuál de estas palabras es un color?",
        "options": [
          "brown",
          "eleven",
          "listen",
          "rainy"
        ],
        "correct": "brown"
      },
      {
        "id": "h6q2",
        "topic": "Color spelling",
        "review": "escribir colores",
        "points": 1,
        "text": "Escribe el color azul en inglés.",
        "type": "text",
        "accepted": [
          "blue"
        ],
        "displayCorrect": "blue"
      },
      {
        "id": "h6q3",
        "topic": "Gray spelling",
        "review": "gray / grey",
        "points": 1,
        "text": "Escribe una forma correcta para gris.",
        "type": "text",
        "accepted": [
          "gray",
          "grey"
        ],
        "displayCorrect": "gray / grey"
      },
      {
        "id": "h6q4",
        "topic": "Color category",
        "review": "reconocer colores",
        "points": 1,
        "text": "¿Cuál NO es un color?",
        "options": [
          "purple",
          "orange",
          "pencil",
          "green"
        ],
        "correct": "pencil"
      },
      {
        "id": "h6q5",
        "topic": "Color context",
        "review": "color en una oración",
        "points": 1,
        "text": "Una pregunta más: En “It’s a big brown pencil”, ¿qué palabra es el color?",
        "options": [
          "big",
          "brown",
          "pencil",
          "it’s"
        ],
        "correct": "brown"
      }
    ],
    "closing": "🎉 ¡Muy bien! Practicaste colores de otra manera."
  },
  {
    "id": "numbers-1-10-v1",
    "number": 7,
    "contentKey": "numbers-1-10",
    "revision": 2,
    "icon": "🔢",
    "title": "MISIÓN 7 – Numbers 1–10",
    "intro": "Ahora repasaremos los números del 1 al 10 para reconocerlos y escribirlos con más seguridad.",
    "sections": [
      {
        "title": "📖 Recordemos",
        "html": "<div class=\"number-strip\"><span>1 · one</span><span>2 · two</span><span>3 · three</span><span>4 · four</span><span>5 · five</span><span>6 · six</span><span>7 · seven</span><span>8 · eight</span><span>9 · nine</span><span>10 · ten</span></div>"
      },
      {
        "title": "👀 Observa",
        "html": "<p>No siempre veremos el número escrito. A veces tendrás que <strong>contar</strong> y recordar la palabra en inglés.</p>"
      }
    ],
    "questions": [
      {
        "id": "h7q1",
        "topic": "Number recognition",
        "review": "números 1–10",
        "points": 1,
        "text": "¿Cómo se dice 8?",
        "options": [
          "eight",
          "five",
          "ten",
          "three"
        ],
        "correct": "eight"
      },
      {
        "id": "h7q2",
        "topic": "Number spelling",
        "review": "escribir números",
        "points": 1,
        "text": "Escribe 6 en inglés.",
        "type": "text",
        "accepted": [
          "six"
        ],
        "displayCorrect": "six"
      },
      {
        "id": "h7q3",
        "topic": "Number sequence",
        "review": "secuencia de números",
        "points": 1,
        "text": "¿Qué número viene después de four?",
        "options": [
          "five",
          "three",
          "seven",
          "nine"
        ],
        "correct": "five"
      },
      {
        "id": "h7q4",
        "topic": "Number category",
        "review": "reconocer números",
        "points": 1,
        "text": "¿Cuál NO es un número?",
        "options": [
          "seven",
          "blue",
          "two",
          "ten"
        ],
        "correct": "blue"
      },
      {
        "id": "h7q5",
        "topic": "Number context",
        "review": "números en contexto",
        "points": 1,
        "text": "Una pregunta más: Si tienes 9 lápices, ¿qué palabra representa 9?",
        "options": [
          "nine",
          "five",
          "one",
          "ten"
        ],
        "correct": "nine"
      }
    ],
    "closing": "🎉 ¡Excelente! Los números se recuerdan mejor cuando aparecen en situaciones distintas."
  },
  {
    "id": "weather-temperature-v1",
    "number": 8,
    "contentKey": "weather-temperature",
    "revision": 2,
    "icon": "🌦️",
    "title": "MISIÓN 8 – Weather & Temperature",
    "intro": "Hoy repasaremos dos temas que usamos juntos: el clima y la temperatura.",
    "sections": [
      {
        "title": "📖 Weather",
        "html": "<div class=\"vocab-grid weather-grid\">\n          <span><img src=\"images/mission8/sunny.svg\" alt=\"Día soleado\"><strong>sunny</strong></span>\n          <span><img src=\"images/mission8/cloudy.svg\" alt=\"Día nublado\"><strong>cloudy</strong></span>\n          <span><img src=\"images/mission8/windy.svg\" alt=\"Día ventoso\"><strong>windy</strong></span>\n          <span><img src=\"images/mission8/rainy.svg\" alt=\"Día lluvioso\"><strong>rainy</strong></span>\n          <span><img src=\"images/mission8/stormy.svg\" alt=\"Tormenta\"><strong>stormy</strong></span>\n          <span><img src=\"images/mission8/snowy.svg\" alt=\"Día con nieve\"><strong>snowy</strong></span>\n        </div>"
      },
      {
        "title": "🌡️ Temperature",
        "html": "<div class=\"vocab-grid temperature-grid\">\n          <span><img src=\"images/mission8/hot.svg\" alt=\"Temperatura muy alta\"><strong>hot</strong></span>\n          <span><img src=\"images/mission8/warm.svg\" alt=\"Temperatura cálida\"><strong>warm</strong></span>\n          <span><img src=\"images/mission8/cool.svg\" alt=\"Temperatura fresca\"><strong>cool</strong></span>\n          <span><img src=\"images/mission8/cold.svg\" alt=\"Temperatura fría\"><strong>cold</strong></span>\n        </div>"
      },
      {
        "title": "🌟 ¿Sabías que...?",
        "html": "<p><strong>Weather</strong> habla del clima y <strong>temperature</strong> de qué tan caliente o frío está. Muchas veces usamos los dos para describir el mismo día.</p>"
      }
    ],
    "questions": [
      {
        "id": "h8q1",
        "topic": "Weather recognition",
        "review": "weather",
        "points": 1,
        "text": "Hay sol y pocas nubes. ¿Qué palabra corresponde?",
        "options": [
          "sunny",
          "rainy",
          "snowy",
          "stormy"
        ],
        "correct": "sunny"
      },
      {
        "id": "h8q2",
        "topic": "Weather category",
        "review": "weather",
        "points": 1,
        "text": "¿Cuál palabra pertenece al clima?",
        "options": [
          "windy",
          "purple",
          "seven",
          "copy"
        ],
        "correct": "windy"
      },
      {
        "id": "h8q3",
        "topic": "Temperature",
        "review": "temperature",
        "points": 1,
        "text": "¿Cuál palabra indica mucho frío?",
        "options": [
          "cold",
          "hot",
          "sunny",
          "brown"
        ],
        "correct": "cold"
      },
      {
        "id": "h8q4",
        "topic": "Weather spelling",
        "review": "escribir weather",
        "points": 1,
        "text": "Escribe en inglés: lluvioso.",
        "type": "text",
        "accepted": [
          "rainy"
        ],
        "displayCorrect": "rainy"
      },
      {
        "id": "h8q5",
        "topic": "Temperature contrast",
        "review": "hot / cold",
        "points": 1,
        "text": "Una pregunta más: ¿Cuál palabra expresa lo contrario de hot?",
        "options": [
          "cold",
          "warm",
          "rainy",
          "blue"
        ],
        "correct": "cold"
      }
    ],
    "closing": "🎉 ¡Muy bien! Practicaste clima y temperatura con ejemplos nuevos."
  },
  {
    "id": "numbers-11-20-v1",
    "number": 9,
    "contentKey": "numbers-11-20",
    "revision": 2,
    "icon": "🔢",
    "title": "MISIÓN 9 – Numbers 11–20",
    "intro": "Ahora vamos a avanzar con los números del 11 al 20. Mirá cómo se escriben: varias palabras se parecen, pero cada una tiene su propia forma.",
    "sections": [
      {
        "title": "📖 Recordemos y aprendamos",
        "html": "<div class=\"number-strip\"><span>11 · eleven</span><span>12 · twelve</span><span>13 · thirteen</span><span>14 · fourteen</span><span>15 · fifteen</span><span>16 · sixteen</span><span>17 · seventeen</span><span>18 · eighteen</span><span>19 · nineteen</span><span>20 · twenty</span></div>"
      },
      {
        "title": "👀 Observa",
        "html": "<p>Del <strong>13 al 19</strong>, muchas palabras terminan en <strong>-teen</strong>. El número <strong>20</strong> se escribe <strong>twenty</strong>.</p>"
      }
    ],
    "questions": [
      {
        "id": "h9q1",
        "topic": "Eleven",
        "review": "eleven",
        "points": 1,
        "text": "¿Cuál palabra es 11?",
        "options": [
          "eleven",
          "twelve",
          "twenty",
          "six"
        ],
        "correct": "eleven"
      },
      {
        "id": "h9q2",
        "topic": "Fifteen",
        "review": "fifteen",
        "points": 1,
        "text": "Escribe 15 en inglés.",
        "type": "text",
        "accepted": [
          "fifteen"
        ],
        "displayCorrect": "fifteen"
      },
      {
        "id": "h9q3",
        "topic": "Teen numbers",
        "review": "-teen",
        "points": 1,
        "text": "¿Cuál de estas palabras está entre 13 y 19?",
        "options": [
          "eighteen",
          "eight",
          "twenty",
          "ten"
        ],
        "correct": "eighteen"
      },
      {
        "id": "h9q4",
        "topic": "Twenty",
        "review": "twenty",
        "points": 1,
        "text": "¿Cómo se dice 20?",
        "options": [
          "twenty",
          "twelve",
          "two",
          "nineteen"
        ],
        "correct": "twenty"
      },
      {
        "id": "h9q5",
        "topic": "Number sequence 11-20",
        "review": "secuencia 11–20",
        "points": 1,
        "text": "Una pregunta más: ¿Qué viene después de seventeen?",
        "options": [
          "eighteen",
          "sixteen",
          "nineteen",
          "twenty"
        ],
        "correct": "eighteen"
      }
    ],
    "closing": "🎉 ¡Muy bien! Ya estás ampliando los números que puedes reconocer y escribir."
  },
  {
    "id": "mixed-review-colors-numbers-weather-v1",
    "number": 10,
    "contentKey": "review-6-9",
    "revision": 3,
    "icon": "🧭",
    "title": "MISIÓN 10 – Repaso de las misiones 6–9",
    "intro": "Llegaste a una misión integradora. Vamos a mezclar colores, números del 1 al 20, clima y temperatura para ver qué ya quedó firme y qué conviene practicar un poco más.",
    "sections": [
      {
        "title": "🧠 Recordemos",
        "html": "<p>Esta misión no busca que memorices posiciones. Pensá en lo que aprendiste en las misiones 6, 7, 8 y 9. Las opciones pueden aparecer en distinto orden cada vez.</p>"
      }
    ],
    "questions": [
      {
        "id": "h10q1",
        "topic": "Color review",
        "review": "colores",
        "points": 1,
        "text": "¿Cuál es un color?",
        "options": [
          "orange",
          "eleven",
          "rainy",
          "listen"
        ],
        "correct": "orange"
      },
      {
        "id": "h10q2",
        "topic": "Number review",
        "review": "números 1–10",
        "points": 1,
        "text": "¿Cómo se dice 4?",
        "options": [
          "four",
          "five",
          "fourteen",
          "ten"
        ],
        "correct": "four"
      },
      {
        "id": "h10q3",
        "topic": "Weather review",
        "review": "weather",
        "points": 1,
        "text": "¿Cuál palabra describe lluvia?",
        "options": [
          "rainy",
          "sunny",
          "cold",
          "brown"
        ],
        "correct": "rainy"
      },
      {
        "id": "h10q4",
        "topic": "Numbers 11-20 review",
        "review": "números 11–20",
        "points": 1,
        "text": "¿Cómo se dice 13?",
        "options": [
          "thirteen",
          "three",
          "thirty",
          "twelve"
        ],
        "correct": "thirteen"
      },
      {
        "id": "h10q5",
        "topic": "Integrated learning",
        "review": "usar lo aprendido",
        "points": 1,
        "text": "Una pregunta más: Si dudas, ¿qué conviene hacer primero?",
        "options": [
          "Volver a leer la explicación",
          "Buscar la respuesta afuera",
          "Copiar"
        ],
        "correct": "Volver a leer la explicación"
      }
    ],
    "closing": "🎉 ¡Repaso completado! Ahora Home puede ayudarte a reforzar exactamente lo que necesites practicar."
  }
];



const DIFFERENTIATED_COLORS = [
  {word:"red",hex:"#e53935"},{word:"blue",hex:"#2f73d9"},{word:"green",hex:"#43a047"},
  {word:"yellow",hex:"#f4cf32"},{word:"gray",hex:"#8b9299"},{word:"pink",hex:"#ef7da7"},
  {word:"purple",hex:"#8e57c7"},{word:"black",hex:"#25282c"},{word:"white",hex:"#ffffff"},
  {word:"brown",hex:"#8b5a3c"},{word:"orange",hex:"#f28c28"}
];
const DIFFERENTIATED_NUMBERS = [
  [1,"one"],[2,"two"],[3,"three"],[4,"four"],[5,"five"],[6,"six"],[7,"seven"],[8,"eight"],[9,"nine"],[10,"ten"],
  [11,"eleven"],[12,"twelve"],[13,"thirteen"],[14,"fourteen"],[15,"fifteen"],[16,"sixteen"],[17,"seventeen"],[18,"eighteen"],[19,"nineteen"],[20,"twenty"]
].map(([value,word])=>({value,word}));
let differentiatedPractice = {type:"", mode:"audio", index:0, items:[], attempts:0, correct:0, feedback:"", locked:false};
let guidedPractice = {
  type:"",
  stage:0,
  index:0,
  order:[],
  target:null,
  options:[],
  locked:false
};

function shufflePractice_(items){
  const a=[...items];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function speakPracticeWord_(word){
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel(); speechSynthesis.resume();
  const u=new SpeechSynthesisUtterance(String(word||"")); u.lang="en-US"; u.rate=.82; u.pitch=1;
  const voice=preferredEnglishVoice||chooseNaturalEnglishVoice_(); if(voice)u.voice=voice;
  speechSynthesis.speak(u);
}

function guidedPracticeSource_(type){
  if(type==="colors") return DIFFERENTIATED_COLORS;
  // Primera etapa de Numbers: solamente 1–10.
  return DIFFERENTIATED_NUMBERS.filter(x=>Number(x.value)>=1 && Number(x.value)<=10);
}
function startGuidedPractice_(type){
  const source=guidedPracticeSource_(type);
  guidedPractice={
    type:type,
    stage:1,
    index:0,
    order:source.map((_,i)=>i),
    target:null,
    options:[],
    locked:false
  };
  state.route="practice-guided";
  saveState();
  render();
}
function guidedCurrent_(){
  const source=guidedPracticeSource_(guidedPractice.type);
  const idx=guidedPractice.order[guidedPractice.index];
  return source[idx] || null;
}
function guidedMakeStage2Order_(){
  const source=guidedPracticeSource_(guidedPractice.type);
  // En la actividad 2 se trabajan TODOS una vez, pero fuera de orden.
  guidedPractice.order=shufflePractice_(source.map((_,i)=>i));
  guidedPractice.index=0;
  guidedPractice.target=null;
  guidedPractice.options=[];
  guidedPractice.locked=false;
}
function guidedPrepareQuestion_(){
  const source=guidedPracticeSource_(guidedPractice.type);
  const idx=guidedPractice.order[guidedPractice.index];
  const target=source[idx];
  const key=x=>guidedPractice.type==="colors"?x.word:String(x.value);
  const distractor=shufflePractice_(source.filter(x=>key(x)!==key(target)))[0];
  guidedPractice.target=target;
  guidedPractice.options=shufflePractice_([target,distractor]);
  guidedPractice.locked=false;
}
function guidedVisual_(item, compact=false){
  if(guidedPractice.type==="colors"){
    return `<span class="${compact?'guided-color-choice':'guided-color-large'}" style="background:${item.hex}"></span>`;
  }
  return `<span class="${compact?'guided-number-choice':'guided-number-large'}">${numberDots_(item.value)}</span>`;
}
function guidedPracticeView(){
  const source=guidedPracticeSource_(guidedPractice.type);
  if(!guidedPractice.type || !source.length){
    state.route="practice-menu";
    return differentiatedPracticeMenuView();
  }

  if(guidedPractice.stage===1){
    const item=guidedCurrent_();
    const total=source.length;
    const spoken=item.word;
    return `<section class="card guided-practice-card">
      <div class="practice-progress">1 / 3 &nbsp; · &nbsp; ${guidedPractice.index+1} / ${total}</div>
      <div class="practice-kind">${guidedPractice.type==="colors"?'🎨 Colors':'🔢 Numbers 1–10'}</div>
      <div class="guided-single-visual">${guidedVisual_(item,false)}</div>
      <button class="practice-listen-button guided-speaker" data-action="guided-listen" data-word="${escapeHtml(spoken)}" aria-label="Escuchar">🔊</button>
      <div class="guided-nav">
        <button class="secondary-button" data-action="guided-exit">←</button>
        <button class="practice-next-button" data-action="guided-next-stage1" aria-label="Siguiente">▶</button>
      </div>
    </section>`;
  }

  if(guidedPractice.stage===2){
    if(!guidedPractice.target) guidedPrepareQuestion_();
    const target=guidedPractice.target;
    const total=source.length;
    const options=guidedPractice.options.map(o=>{
      const value=guidedPractice.type==="colors"?o.word:String(o.value);
      return `<button class="guided-two-choice" data-action="guided-answer" data-value="${escapeHtml(value)}" ${guidedPractice.locked?'disabled':''}>
        ${guidedVisual_(o,true)}
      </button>`;
    }).join("");
    return `<section class="card guided-practice-card">
      <div class="practice-progress">2 / 3 &nbsp; · &nbsp; ${guidedPractice.index+1} / ${total}</div>
      <div class="practice-kind">${guidedPractice.type==="colors"?'🎨 Colors':'🔢 Numbers 1–10'}</div>
      <div class="guided-listen-row">
        <button class="practice-listen-button guided-speaker" data-action="guided-listen" data-word="${escapeHtml(target.word)}" aria-label="Escuchar">🔊</button>
      </div>
      <div class="guided-two-grid">${options}</div>
      <div id="guidedFeedback" class="practice-feedback"></div>
      <div class="button-row"><button class="secondary-button" data-action="guided-exit">←</button></div>
    </section>`;
  }

  // Paso 3: conserva la práctica creada originalmente en v1.5.7.
  return `<section class="card differentiated-menu">
    <div class="practice-progress">3 / 3</div>
    <div class="practice-kind">${guidedPractice.type==="colors"?'🎨 Colors':'🔢 Numbers 1–10'}</div>
    <h2>Practice</h2>
    <div class="differentiated-choice-grid">
      <article class="differentiated-choice-card">
        <div class="practice-big-icon">🔊</div>
        <button class="primary-button" data-action="guided-final-start" data-mode="audio">▶</button>
      </article>
      <article class="differentiated-choice-card">
        <div class="practice-big-icon">ABC</div>
        <button class="secondary-button" data-action="guided-final-start" data-mode="word">▶</button>
      </article>
    </div>
    <div class="button-row"><button class="secondary-button" data-action="guided-exit">←</button></div>
  </section>`;
}

function startDifferentiatedPractice(type,mode="audio"){
  const source=type==="colors"
    ? DIFFERENTIATED_COLORS
    : DIFFERENTIATED_NUMBERS.filter(x=>Number(x.value)>=1 && Number(x.value)<=10);
  differentiatedPractice={type,mode,index:0,items:shufflePractice_(source).slice(0,6),attempts:0,correct:0,feedback:"",locked:false};
  state.route="practice-differentiated"; saveState(); render();
}
function practiceTarget_(){return differentiatedPractice.items[differentiatedPractice.index]||null;}
function practiceOptions_(){
  const target=practiceTarget_(); if(!target)return[];
  const source=differentiatedPractice.type==="colors"?DIFFERENTIATED_COLORS:DIFFERENTIATED_NUMBERS.filter(x=>Number(x.value)>=1&&Number(x.value)<=10);
  const key=x=>differentiatedPractice.type==="colors"?x.word:String(x.value);
  const others=shufflePractice_(source.filter(x=>key(x)!==key(target))).slice(0,3);
  return shufflePractice_([target,...others]);
}
function numberDots_(n){
  let html=''; for(let i=0;i<n;i++) html+='<span class="practice-dot"></span>'; return html;
}
function differentiatedPracticeMenuView(){
  return `<section class="card differentiated-menu">
    <div class="eyebrow">Practice · Práctica</div>
    <h2>👀 🔊 Mirá y escuchá</h2>
    <div class="differentiated-choice-grid">
      <article class="differentiated-choice-card">
        <div class="practice-big-icon">🎨</div><h3>Colors</h3>
        <button class="primary-button" data-action="guided-start" data-type="colors">▶</button>
      </article>
      <article class="differentiated-choice-card">
        <div class="practice-big-icon">● ● ●</div><h3>Numbers 1–10</h3>
        <button class="primary-button" data-action="guided-start" data-type="numbers">▶</button>
      </article>
    </div>
    <div class="button-row"><button class="secondary-button" data-action="back-map">← Volver</button></div>
  </section>`;
}

function differentiatedPracticeView(){
  const target=practiceTarget_();
  if(!target){state.route="practice-menu";return differentiatedPracticeMenuView();}
  const options=practiceOptions_();
  const isColors=differentiatedPractice.type==="colors";
  const promptWord=target.word;
  const prompt=differentiatedPractice.mode==="audio"
    ? `<button class="practice-listen-button" data-action="practice-listen" aria-label="Escuchar">🔊</button>`
    : `<div class="practice-word-prompt">${escapeHtml(promptWord.toUpperCase())}</div>`;
  const optionHtml=options.map(o=>{
    const value=isColors?o.word:String(o.value);
    const visual=isColors
      ? `<span class="practice-color-swatch" style="background:${o.hex}"></span>`
      : `<span class="practice-number-dots">${numberDots_(o.value)}</span>`;
    return `<button class="practice-answer" data-action="practice-answer" data-value="${escapeHtml(value)}" ${differentiatedPractice.locked?'disabled':''}>${visual}</button>`;
  }).join('');
  const total=differentiatedPractice.items.length;
  return `<section class="card differentiated-practice-card">
    <div class="practice-progress">${differentiatedPractice.index+1} / ${total}</div>
    <div class="practice-kind">${isColors?'🎨 Colors':'🔢 Numbers'}</div>
    <div class="practice-prompt">${prompt}</div>
    <div class="practice-answer-grid">${optionHtml}</div>
    <div class="practice-feedback ${differentiatedPractice.feedback==='ok'?'ok':differentiatedPractice.feedback?'retry':''}">
      ${differentiatedPractice.feedback==='ok'?`✓ <strong>${escapeHtml(promptWord)}</strong>`:differentiatedPractice.feedback==='retry'?'↻ 🔊':''}
    </div>
    ${differentiatedPractice.locked?`<button class="practice-next-button" data-action="practice-next" aria-label="Siguiente">▶</button>`:''}
    <div class="button-row"><button class="secondary-button" data-action="practice-exit">←</button></div>
  </section>`;
}
function differentiatedPracticeResultView(){
  const total=differentiatedPractice.items.length||6;
  return `<section class="card differentiated-result">
    <div class="practice-big-result">⭐</div><h2>Practice complete!</h2>
    <p><strong>${differentiatedPractice.correct} / ${total}</strong></p>
    <p class="small">Esta práctica observa reconocimiento por ${differentiatedPractice.mode==='audio'?'audio':'palabra escrita'}. No reemplaza el puntaje de las Missions.</p>
    <div class="button-row"><button class="primary-button" data-action="practice-again">Otra vez</button><button class="secondary-button" data-action="practice-exit">Volver</button></div>
  </section>`;
}

let state = loadState();
let deviceConfig = loadDeviceConfig();
let deferredInstallPrompt = null;
let bootstrapData = { students: [], progress: {}, classroomProgress:{}, homeProgress:{}, missionPermissions:{}, homeVideos:[], loaded: false, error: "" };

function freshState() {
  return {
    route: "home",
    student: { id:"", firstName:"", lastName:"", officialName:"", displayName:"", nickname:"", institution:"", grade:"", level:"", schoolYear:String(new Date().getFullYear()), mode:"individual", partnerId:"", partner:"" },
    identityError:"", selectedGradeKey:"", currentMission:0, answers:{}, optionOrders:{}, questionVariants:{}, missionStartedAt:"",
    reviewConfirmed:false, missionExitCount:0, inactivityLogged:false, sessionNotice:"", lastMissionResult:null, forceHomeIntro:false,
    teacher:"Teacher Eddie", contentVersion:CONTENT_VERSION
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return freshState();
    const merged = { ...freshState(), ...saved };
    if (merged.student?.id && !["home","identify","confirm"].includes(merged.route)) merged.route = "session-check";
    return merged;
  } catch {
    return freshState();
  }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function introSeenForStudent(studentId) {
  if (!studentId) return false;
  try {
    const seen = JSON.parse(localStorage.getItem(HOME_INTRO_SEEN_KEY) || "{}");
    return !!seen[studentId];
  } catch {
    return false;
  }
}
function markIntroSeenForStudent(studentId) {
  if (!studentId) return;
  try {
    const seen = JSON.parse(localStorage.getItem(HOME_INTRO_SEEN_KEY) || "{}");
    seen[studentId] = true;
    localStorage.setItem(HOME_INTRO_SEEN_KEY, JSON.stringify(seen));
  } catch {}
}
function savedHomeSchool() {
  return String(localStorage.getItem(HOME_SCHOOL_KEY) || "").trim();
}
function saveHomeSchool(value) {
  const school = String(value || "").trim();
  if (school) localStorage.setItem(HOME_SCHOOL_KEY, school);
}
function gradeLabel(grade) {
  const g = String(grade || "").trim();
  return g ? `${g}.º grado` : "";
}
function firstNameOrNickname(student) {
  if (!student) return "";
  if (student.nickname) return student.nickname;
  const parts = splitOfficialName(student);
  return (parts.first.split(/\s+/)[0] || student.displayName || student.officialName || "").trim();
}
function findHomeStudentSimple(identifier, lastName, grade) {
  const wanted = normalizeText(identifier);
  const surname = normalizeText(lastName);
  const ng = normalizeText(grade).replace(/[^0-9a-z]/g, "");
  if (!wanted || !ng) return { student:null, ambiguous:false };

  let matches = rosterStudents().filter(student => {
    const sg = normalizeText(student.grade).replace(/[^0-9a-z]/g, "");
    if (sg !== ng) return false;

    const parts = splitOfficialName(student);
    const firstFull = normalizeText(parts.first);
    const firstToken = firstFull.split(" ")[0] || "";
    const nick = normalizeText(student.nickname || "");
    const display = normalizeText(student.displayName || "");
    const official = normalizeText(student.officialName || "");

    return wanted === firstFull ||
      wanted === firstToken ||
      (nick && wanted === nick) ||
      wanted === display ||
      wanted === official;
  });

  if (surname) {
    matches = matches.filter(student => {
      const parts = splitOfficialName(student);
      const fullLast = normalizeText(parts.last);
      const lastTokens = fullLast.split(" ").filter(Boolean);
      return fullLast === surname || lastTokens.includes(surname);
    });
  }

  return {
    student: matches.length === 1 ? matches[0] : null,
    ambiguous: matches.length > 1
  };
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  state = freshState();
  render();
}
function normalizeText(value) {
  return String(value || "").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!,.;:]/g, "").replace(/\s+/g, " ");
}

function rosterStudents() {
  return bootstrapData.students && bootstrapData.students.length ? bootstrapData.students : LOCAL_STUDENTS;
}

function splitOfficialName(student) {
  const raw = String(student?.officialName || "").trim();
  const parts = raw.split(",");
  return {
    last: (parts[0] || "").trim(),
    first: (parts.slice(1).join(",") || "").trim()
  };
}

function findHomeStudent(firstName, lastName, grade) {
  const nf = normalizeText(firstName);
  const nl = normalizeText(lastName);
  const ng = normalizeText(grade).replace(/[^0-9a-z]/g, "");
  if (!nf || !nl || !ng) return null;

  const matches = rosterStudents().filter(student => {
    const name = splitOfficialName(student);
    const studentGrade = normalizeText(student.grade).replace(/[^0-9a-z]/g, "");
    if (studentGrade !== ng || normalizeText(name.last) !== nl) return false;

    const fullFirst = normalizeText(name.first);
    const firstToken = fullFirst.split(" ")[0] || "";
    const nick = normalizeText(student.nickname || "");
    const display = normalizeText(student.displayName || "");
    return nf === fullFirst || nf === firstToken || (nick && nf === nick) || display === nf;
  });

  return matches.length === 1 ? matches[0] : null;
}
function loadDeviceConfig() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY)) || {
      computerName: "", location: "", configuredAt: ""
    };
  } catch {
    return { computerName: "", location: "", configuredAt: "" };
  }
}
function saveDeviceConfig(config) {
  deviceConfig = config;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(deviceConfig));
  updateDeviceBadge();
}
function updateDeviceBadge() {
  const badge = document.getElementById("deviceStatus");
  if (!badge) return;
  badge.textContent = deviceConfig.computerName || "Equipo sin configurar";
  badge.className = `device-pill ${deviceConfig.computerName ? "configured" : "unconfigured"}`;
}

function setupView() {
  return `<section class="card setup-card">
    <div class="eyebrow">Configuración inicial del docente</div>
    <h2>Configurar esta computadora</h2>
    <p>Este paso se realiza una sola vez en cada equipo. Los alumnos no tendrán que completarlo.</p>
    <form id="deviceForm" class="form-grid">
      <div class="field full">
        <label for="computerName">Nombre de esta computadora</label>
        <input id="computerName" name="computerName" required maxlength="30"
          value="${escapeHtml(deviceConfig.computerName)}" placeholder="Por ejemplo: PC-01" />
        <span class="small">Usa un nombre diferente en cada equipo: PC-01, PC-02, PC-03…</span>
      </div>
      <div class="field full">
        <label for="location">Aula o ubicación (opcional)</label>
        <input id="location" name="location" maxlength="50"
          value="${escapeHtml(deviceConfig.location)}" placeholder="Por ejemplo: Sala de informática" />
      </div>
      <div class="field full"><div class="notice">
        Esta identificación se adjuntará automáticamente a cada misión enviada.
      </div></div>
      <div class="field full"><div class="button-row">
        ${deviceConfig.computerName ? '<button type="button" class="secondary-button" data-action="cancel-settings">Cancelar</button>' : ''}
        <button type="submit" class="primary-button">Guardar configuración</button>
      </div></div>
    </form>
  </section>`;
}

function render() {
  const app = document.getElementById("app");
  if (state.route === "home") app.innerHTML = homeView();
  else if (state.route === "about-home") app.innerHTML = aboutHomeView();
  else if (state.route === "identify") app.innerHTML = identifyView();
  else if (state.route === "confirm") app.innerHTML = confirmView();
  else if (state.route === "home-intro") app.innerHTML = homeIntroView();
  else if (state.route === "session-check") app.innerHTML = sessionCheckView();
  else if (state.route === "map") app.innerHTML = mapView();
  else if (state.route === "mission-intro") app.innerHTML = missionIntroView();
  else if (state.route === "mission") app.innerHTML = missionView();
  else if (state.route === "mission-result") app.innerHTML = missionResultView();
  else if (state.route === "practice-menu") app.innerHTML = differentiatedPracticeMenuView();
  else if (state.route === "practice-guided") app.innerHTML = guidedPracticeView();
  else if (state.route === "practice-differentiated") app.innerHTML = differentiatedPracticeView();
  else if (state.route === "practice-result") app.innerHTML = differentiatedPracticeResultView();
  bindEvents();
  updateNetworkStatus();

  if (["about-home","home-intro","mission-intro","mission","mission-result","map"].includes(state.route)) {
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }
}

function homeView() {
  return `<section class="home-landing-approved" aria-label="Mission English Home">
    <img src="images/approved/home-landing-approved.jpg" alt="Mission English Home" class="home-approved-image">
    <button class="home-hotspot home-hotspot-start" data-action="start-home" aria-label="Iniciar sesión">
      <span>INICIAR SESIÓN</span>
    </button>
    <button class="home-hotspot home-hotspot-first" data-action="first-time-home" aria-label="Primera vez">
      <span>¿PRIMERA VEZ?</span>
    </button>
  </section>`;
}

function aboutHomeView() {
  return `<section class="card home-about-card">
    <div class="eyebrow">Mission English Home</div>

    <div class="about-home-header">
      <img src="mission-english-home-logo.png" alt="Mission English Home" class="about-home-logo" />
      <div>
        <h2>¿Qué es Mission English Home?</h2>
        <p class="about-home-lead">Una extensión de Mission English para practicar desde casa.</p>
      </div>
    </div>

    <div class="read-first-banner">
      <div class="read-first-icon">🏠</div>
      <div>
        <div class="read-first-title">PARA ALUMNOS Y FAMILIAS</div>
        <div class="read-first-subtitle">Esta explicación puede ser leída por el alumno o por un adulto que lo acompañe.</div>
      </div>
    </div>

    <div class="welcome-points home-about-points">
      <p>🎯 <strong>¿Para qué sirve?</strong> Para volver a practicar contenidos trabajados en inglés y avanzar con algunas actividades desde casa.</p>
      <p>📚 <strong>No reemplaza la clase.</strong> Mission English Home acompaña lo trabajado con el teacher y puede ofrecer práctica adicional.</p>
      <p>🧩 <strong>Cada grado puede tener actividades diferentes.</strong> Las misiones se adaptan a lo que los alumnos vienen aprendiendo.</p>
      <p>🔁 <strong>Se puede practicar nuevamente.</strong> Repetir una misión puede ayudar a recordar y comprender mejor.</p>
      <p>🌱 <strong>El objetivo no es obtener un puntaje perfecto.</strong> Lo importante es practicar, comprender y aprender.</p>
      <p>👨‍👩‍👧 <strong>En casa puede haber ayuda.</strong> Por eso los resultados de Home son información complementaria; Classroom sigue siendo la referencia principal para el teacher.</p>
    </div>

    <div class="learning-goal-note">
      💡 <strong>Primera vez:</strong> después de esta explicación, el alumno se identifica y verá una introducción breve sobre cómo usar Home.
    </div>

    <div class="button-row">
      <button class="secondary-button" data-action="go-home">← Volver</button>
      <button class="primary-button" data-action="about-home-continue">Continuar</button>
    </div>
  </section>`;
}

function homeIntroView() {
  const name = firstNameOrNickname(state.student) || "estudiante";
  return `<section class="card home-intro-card">
    <div class="eyebrow">Mission English Home</div>
    <div class="read-first-banner" style="margin-bottom:1rem">
      <div class="read-first-icon">📖</div>
      <div>
        <div class="read-first-title">IMPORTANTE: LEÉ ESTA INTRODUCCIÓN</div>
        <div class="read-first-subtitle">Home se parece a Classroom, pero no funciona exactamente igual.</div>
      </div>
    </div>

    <h2>🏠 Hi, ${escapeHtml(name)}! Welcome Home</h2>

    <p>En <strong>Mission English Home</strong> podés practicar desde casa, con calma y a tu ritmo.</p>

    <div class="welcome-points">
      <p>✅ Podés elegir cualquier misión que esté habilitada.</p>
      <p>🔁 Podés repetir una misión si querés practicarla otra vez.</p>
      <p>🌱 Si hay algo que conviene reforzar, aparecerá en <strong>Practice for you</strong>. Ese refuerzo también puede venir de lo que hiciste en Classroom.</p>
      <p>🔊 Cuando haya audio, podés escucharlo a velocidad normal o más lenta.</p>
      <p>📖 Antes de responder, leé la explicación de cada misión: está hecha para ayudarte.</p>
      <p>🏠 En Home no importa si tenés que salir un momento o ayudar en casa. Volvé cuando puedas y seguí.</p>
    </div>

    <div class="learning-goal-note">
      🎯 <strong>Lo importante no es terminar rápido.</strong> Lo importante es entender, practicar y aprender.
    </div>

    <div class="button-row">
      <button class="primary-button" data-action="finish-home-intro">✓ Leí la introducción — Ir a misiones</button>
    </div>
  </section>`;
}

function courseKey(student) {
  return [student.schoolYear || "", student.grade || "", student.division || ""].join("|");
}
function courseLabel(student) { return student.grade ? `${student.grade}${student.level ? ` · ${student.level}` : ""}` : ""; }
function availableCourses() {
  const map = new Map();
  bootstrapData.students.forEach(s => {
    const key = courseKey(s);
    if (!map.has(key)) map.set(key, { key, label: `${courseLabel(s)} · ${s.schoolYear}` });
  });
  return [...map.values()].sort((a,b) => a.label.localeCompare(b.label, "es"));
}
function studentsForSelectedCourse() {
  return bootstrapData.students
    .filter(s => courseKey(s) === state.selectedGradeKey)
    .sort((a,b) => a.officialName.localeCompare(b.officialName, "es"));
}

function identifyView() {
  const grades = [...new Set(rosterStudents().map(s => String(s.grade || "").trim()).filter(Boolean))]
    .sort((a,b) => a.localeCompare(b, "es", { numeric:true }));
  const gradeOptions = grades.map(g => `<option value="${escapeHtml(g)}" ${String(state.student.grade)===g?"selected":""}>${escapeHtml(g)}</option>`).join("");
  const schoolValue = state.student.institution || savedHomeSchool();

  return `<section class="card identity-entry-card">
    <div class="eyebrow">Home</div>
    <h2>¿Quién va a practicar?</h2>
    <p>Podés escribir <strong>tu primer nombre</strong> y, si tenés uno registrado, también tu <strong>apodo</strong>.</p>

    ${state.identityError ? `<div class="notice" style="border-color:var(--danger);margin-bottom:1rem"><strong>No pudimos identificarte.</strong><br>${escapeHtml(state.identityError)}</div>` : ""}

    <form id="studentForm" class="identity-form-grid">
      <div class="field">
        <label for="firstName">Nombre</label>
        <input id="firstName" name="firstName" autocomplete="given-name"
          value="${escapeHtml(state.student.firstName || "")}" placeholder="Por ejemplo: Maria">
      </div>

      <div class="field">
        <label for="nickname">Apodo</label>
        <input id="nickname" name="nickname"
          value="${escapeHtml(state.student.nickname || "")}" placeholder="Por ejemplo: Pia">
      </div>

      <div class="field">
        <label for="lastName">Apellido <span class="small">(si hace falta)</span></label>
        <input id="lastName" name="lastName"
          value="${escapeHtml(state.student.lastName || "")}" placeholder="Para distinguir nombres iguales">
      </div>

      <div class="field">
        <label for="institution">Colegio / Institución</label>
        <input id="institution" name="institution"
          value="${escapeHtml(schoolValue)}" placeholder="Por ejemplo: Yapeyú">
      </div>

      <div class="field identity-grade-field">
        <label for="grade">Grado</label>
        <select id="grade" name="grade" required>
          <option value="">Seleccioná</option>${gradeOptions}
        </select>
      </div>

      <div class="field full"><div class="notice">👤 Home es individual. Elegí siempre tus propios datos.</div></div>
      <div class="field full">
        <div class="button-row">
          <button type="button" class="secondary-button" data-action="go-home">Volver</button>
          <button type="submit" class="primary-button">Continuar</button>
        </div>
      </div>
    </form>
  </section>`;
}

function confirmView() {
  const display = firstNameOrNickname(state.student) || state.student.firstName || "Alumno";
  return `<section class="card identity-card">
    <div class="eyebrow">Confirma tus datos</div>
    <h2>Hi, ${escapeHtml(display)}! Is this you? <span class="small">(¿Sos vos?)</span></h2>
    <p><strong>Institución:</strong> ${escapeHtml(state.student.institution || "—")}</p>
    <p><strong>Grado:</strong> ${escapeHtml(gradeLabel(state.student.grade))}</p>
    <div class="notice">Confirmá antes de continuar para que tu práctica quede registrada con tu nombre.</div>
    <div class="button-row">
      <button class="secondary-button" data-action="change-student">No, cambiar</button>
      <button class="primary-button" data-action="confirm-student">Sí, soy yo</button>
    </div>
  </section>`;
}

function getLocalProgress() {
  try { return JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY)) || {}; }
  catch { return {}; }
}
function saveLocalMissionProgress(result) {
  const all = getLocalProgress();
  const studentId = result.student?.id;
  if (!studentId) return;
  all[studentId] = all[studentId] || {};
  const previous = all[studentId][result.mission.id];
  if (!previous || result.earned >= Number(previous.bestEarned || 0)) {
    all[studentId][result.mission.id] = {
      bestEarned: result.earned, possible: result.possible, completedAt: result.completedAt, local: true
    };
  }
  localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(all));
}
function studentProgress() {
  const server = bootstrapData.progress[state.student.id] || {};
  const local = getLocalProgress()[state.student.id] || {};
  return { ...server, ...local };
}
function firstPendingMissionIndex() {
  const progress = studentProgress();
  const idx = missions.findIndex(m => !progress[m.id]);
  return idx === -1 ? 0 : idx;
}
function greetingForStudent() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const first = state.student.nickname || state.student.displayName || state.student.officialName.split(/[ ,]/)[0];
  const partnerRaw = state.student.partner || "";
  const partner = partnerRaw ? partnerRaw.split(",")[1]?.trim().split(" ")[0] || partnerRaw.split(" ")[0] : "";
  return partner ? `${greeting}, ${first} and ${partner}!` : `${greeting}, ${first}!`;
}

function sessionCheckView() {
  const name = state.student?.nickname || state.student?.firstName || state.student?.displayName || state.student?.officialName || "";
  return `<section class="card identity-card">
    <div class="eyebrow">Home</div>
    <h2>👋 Hi${name ? `, ${escapeHtml(name)}` : ""}! Is this you?</h2>
    <p>Si este dispositivo lo usa otra persona, cambien de estudiante antes de practicar.</p>
    <div class="button-row">
      ${name ? `<button class="primary-button" data-action="continue-student">Sí, soy yo</button>` : ""}
      <button class="secondary-button" data-action="change-student">Cambiar estudiante</button>
    </div>
  </section>`;
}


function homePracticeForYouHtml() {
  const id = state.student?.id;
  if (!id) return "";

  const topics = {};
  const sources = [
    { weight: 3, data: bootstrapData.classroomProgress?.[id] || {} },
    { weight: 1, data: bootstrapData.homeProgress?.[id] || {} }
  ];

  sources.forEach(source => {
    Object.values(source.data).forEach(mission => {
      Object.entries(mission.reviewCounts || {}).forEach(([topic,count]) => {
        topics[topic] = (topics[topic] || 0) + Number(count || 0) * source.weight;
      });
    });
  });

  const list = Object.entries(topics)
    .sort((a,b) => b[1] - a[1])
    .slice(0,5);

  if (!list.length) {
    return `<div class="practice-for-you">
      <strong>🌱 Practice for you · Práctica para vos</strong>
      <p class="small">Cuando tengas algo que reforzar, aparecerá acá. <strong>Pero siempre podés elegir cualquier misión disponible.</strong></p>
    </div>`;
  }

  return `<div class="practice-for-you">
    <strong>🌱 Practice for you · Práctica para vos</strong>
    <p class="small">Según lo que practicaste, estos temas conviene repasarlos un poco más. Para decidirlo, Classroom tiene más peso que Home:</p>
    <div class="practice-chips">${list.map(x=>`<span>${escapeHtml(x[0])}</span>`).join("")}</div>
  </div>`;
}


function quickVoteResultsHtml() {
  if (quickVoteStats.myChoice) {
    const labels = { blue:"Blue", red:"Red", green:"Green", yellow:"Yellow", purple:"Purple", orange:"Orange" };
    const picked = labels[quickVoteStats.myChoice] || quickVoteStats.myChoice;
    return `<div class="quick-vote-private-status">✓ Tu voto fue registrado: <strong>${escapeHtml(picked)}</strong>.<br><span class="small">El resultado lo contará el teacher en clase.</span></div>`;
  }
  return `<div class="quick-vote-empty small">Todavía no votaste.</div>`;
}

function refreshQuickVoteResults() {
  return jsonpRequestHome("quickVoteStats", {
    grade: state.student?.grade || "",
    division: state.student?.division || "",
    studentId: state.student?.id || ""
  }).then(data => {
    if (data?.ok) {
      quickVoteStats = {
        total: Number(data.total)||0,
        choices: data.choices || {},
        myChoice: data.myChoice || ""
      };
      const box = document.getElementById("quickVoteResults");
      if (box) box.innerHTML = quickVoteResultsHtml();
    }
  }).catch(()=>{});
}

function submitQuickVote(choice) {
  if (!state.student?.id || !choice) return;
  if (quickVoteStats.myChoice) {
    alert("Cada persona puede votar una sola vez. Tu voto ya fue registrado.");
    return;
  }

  const payload = {
    type: "quickVote",
    id: crypto.randomUUID ? crypto.randomUUID() : `vote-${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
    origin: "Home",
    pollId: "favorite-color-v1",
    question: "What's your favorite color?",
    choice,
    student: state.student,
    device: { computerName:"Home", location:"Fuera del aula" }
  };

  try {
    fetch(SYNC_ENDPOINT, {
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(payload),
      keepalive:true
    });
  } catch {}

  quickVoteStats.myChoice = choice;
  document.querySelectorAll(".poll-choice").forEach(btn => btn.disabled = true);
  const box = document.getElementById("quickVoteResults");
  if (box) box.innerHTML = quickVoteResultsHtml();
  setTimeout(refreshQuickVoteResults, 700);
}

function jsonpRequestHome(action, params={}) {
  return new Promise((resolve,reject) => {
    const callbackName = `mewHome_${Date.now()}_${Math.floor(Math.random()*100000)}`;
    const script = document.createElement("script");
    let finished = false;

    const finish = (error,data) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      script.remove();
      try { delete window[callbackName]; } catch {}
      if (error) reject(error); else resolve(data);
    };

    window[callbackName] = data => finish(null,data);
    const search = new URLSearchParams({ action, callback:callbackName, t:String(Date.now()), ...params });
    script.onerror = () => finish(new Error("No se pudo consultar Mission English World."));
    script.src = `${SYNC_ENDPOINT}?${search.toString()}`;
    const timer = setTimeout(() => finish(new Error("La consulta tardó demasiado.")), 8000);
    document.head.appendChild(script);
  });
}

function missionEnabledForStudent(mission) {
  const key=courseKey(state.student);
  const course=bootstrapData.missionPermissions?.[key];
  if(!course)return true;
  const value=course[String(mission.number||state.currentMission+1)];
  return value!==false;
}



function normalizeMissionVideoUrl(rawUrl) {
  const raw=String(rawUrl||"").trim(); if(!/^https:\/\//i.test(raw)) return null;
  try { const u=new URL(raw),host=u.hostname.replace(/^www\./,"").toLowerCase(); let id="";
    if(host==="youtu.be") id=u.pathname.split("/").filter(Boolean)[0]||"";
    if(host.endsWith("youtube.com")){ if(u.pathname==="/watch") id=u.searchParams.get("v")||""; else if(/^\/(shorts|embed)\//.test(u.pathname)) id=u.pathname.split("/")[2]||""; }
    if(id) return {type:"iframe",url:`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&playsinline=1`};
    if(host==="vimeo.com"||host.endsWith(".vimeo.com")){const vid=u.pathname.split("/").filter(Boolean).find(x=>/^\d+$/.test(x));if(vid)return{type:"iframe",url:`https://player.vimeo.com/video/${vid}`};}
    if(host==="drive.google.com"&&/\/file\/d\/[^/]+\/preview/.test(u.pathname)) return {type:"iframe",url:raw};
    if(/\.(mp4|webm|ogg)(?:$|\?)/i.test(raw)) return {type:"video",url:raw};
    return null;
  } catch { return null; }
}
function renderMissionVideo_(container,rawUrl){const info=normalizeMissionVideoUrl(rawUrl);if(!container||!info)return false;container.innerHTML=info.type==="video"?`<video controls playsinline preload="metadata" style="width:100%;max-height:440px;border-radius:10px;background:#111"><source src="${escapeHtml(info.url)}"></video>`:`<iframe title="Mission English Short Video" src="${escapeHtml(info.url)}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen style="width:100%;min-height:300px;border:0;border-radius:10px;background:#111"></iframe>`;return true;}

function homeVideosForStudent() {
  const grade = String(state.student?.grade || "").trim();
  const division = String(state.student?.division || "").trim();

  return (bootstrapData.homeVideos || [])
    .filter(v => v.enabled !== false)
    .filter(v => !v.grade || String(v.grade) === grade)
    .filter(v => !v.division || String(v.division) === division);
}

function shortVideosHtml() {
  const videos = homeVideosForStudent();

  if (!videos.length) {
    return `<div class="short-video-empty small">
      Todavía no hay videos habilitados para tu grado.
    </div>`;
  }

  return videos.map((v, index) => `
    <div class="short-video-item">
      <strong>${escapeHtml(v.title || "Short video")}</strong>
      ${v.translation ? `<span class="small">(${escapeHtml(v.translation)})</span>` : ""}
      ${v.note ? `<span class="small">${escapeHtml(v.note)}</span>` : ""}
      <button class="primary-button" data-action="open-teacher-video" data-video-index="${index}">
        ▶ Ver video
      </button>
    </div>
  `).join("");
}

function openTeacherVideo(index) {
  const videos=homeVideosForStudent(),video=videos[Number(index)]; if(!video||!video.embedUrl)return;
  const panel=document.getElementById("shortVideoPlayer"),title=document.getElementById("shortVideoTitle"),host=document.getElementById("shortVideoFrameHost"); if(!panel||!host)return;
  if(title)title.textContent=video.title||"Short video";
  if(!renderMissionVideo_(host,video.embedUrl))host.innerHTML=`<div class="short-video-empty"><strong>Este video no es compatible con Mission English.</strong><br><span class="small">El teacher debe elegir un video que se reproduzca dentro de la aplicación.</span></div>`;
  panel.hidden=false;panel.scrollIntoView({behavior:"smooth",block:"center"});
}

function mapView() {
  const progress = studentProgress();
  const school = state.student.institution || savedHomeSchool() || "Mission English";
  const grade = gradeLabel(state.student.grade);
  const shortVideoTitle = ["4","5"].includes(String(state.student.grade))
    ? "Short videos (Videos cortos)"
    : "Short videos";

  return `<section class="card">
    <div class="home-map-header">
      <div>
        <div class="eyebrow">Home · Tus misiones</div>
        <h2>🌎 ${escapeHtml(greetingForStudent())}</h2>
      </div>
      <div class="home-school-badge">
        <strong>${escapeHtml(school)}</strong>
        <span>${escapeHtml(grade)}</span>
      </div>
    </div>

    <p>Elegí una misión para seguir practicando. <strong>Podés elegir todas las misiones que quieras, cuando quieras, y repetirlas si querés.</strong></p>

    <div class="home-exit-guide">
      <strong>🚪 Cuando termines por hoy</strong>
      <span>El botón <strong>Salir de Mission English Home</strong> está al final de esta página.</span>
    </div>

    ${homePracticeForYouHtml()}

    <div class="mission-grid">
      ${missions.map((m, i) => {
        const p = progress[m.id],enabled=missionEnabledForStudent(m);
        return `<article class="mission-card ${enabled?"available":"future-card"}">
          <div class="mission-icon">${enabled?m.icon:"🔒"}</div>
          <h3>${m.title}</h3>
          <p class="mission-status">${enabled?(p ? `✓ Completada · Mejor: ${p.bestEarned}/${p.possible}` : "Pendiente"):"Bloqueada por el teacher"}</p>
          <button class="${enabled?"primary-button":"secondary-button"}" ${enabled?`data-action="open-mission" data-index="${i}"`:"disabled"}>
            ${enabled?(p ? "Practicar otra vez" : (i === firstPendingMissionIndex() ? "Continuar aquí" : "Comenzar")):"🔒 Bloqueada"}
          </button>
        </article>`;
      }).join("")}
    </div>

    <section class="home-discovery">
      <h3>✨ Explore & Practice</h3>
      <p class="small">Estas actividades son opcionales. Sirven para practicar de otras maneras.</p>

      <div class="home-extra-grid">
        <article class="home-extra-card differentiated-home-card">
          <div class="mode-icon">👀 🔊</div>
          <h4>Practice <span class="small">(Práctica)</span></h4>
          <p><strong>Colors & Numbers</strong></p>
          <p class="small">Mirá, escuchá y elegí. También podés practicar reconociendo la palabra escrita.</p>
          <button class="primary-button" data-action="open-practice">Practicar</button>
        </article>

        <article class="home-extra-card">
          <div class="mode-icon">🔊</div>
          <h4>Useful English</h4>
          <p><strong>Can I go to the toilet, please?</strong><br><span class="small">¿Puedo ir al baño, por favor?</span></p>
          <div class="audio-controls">
            <button class="secondary-button" data-action="speak-useful">▶ Escuchar</button>
            <button class="secondary-button audio-rate ${homeAudioRate===1?"selected":""}" data-action="audio-rate" data-rate="1">1× Normal</button>
            <button class="secondary-button audio-rate ${Math.abs(homeAudioRate-0.75)<0.01?"selected":""}" data-action="audio-rate" data-rate="0.75">🐢 0.75× Lento</button>
          </div>
          <div class="audio-speed-help"><strong>0.75× Lento</strong> reproduce la voz al 75% de la velocidad normal.<br>Para volver a la velocidad normal, tocá <strong>1× Normal</strong>.</div>
        </article>

        <article class="home-extra-card" id="quickVoteCard">
          <div class="mode-icon">🗳️</div>
          <h4>Quick Vote <span class="small">(Voto rápido)</span></h4>
          <p><strong>What’s your favorite color?</strong><br><span class="small">(¿Cuál es tu color favorito?)</span></p>
          <div class="quick-vote-rule"><strong>⚠️ Cada persona solo puede votar una vez.</strong><br><span class="small">Pensá bien antes de votar. Después no se puede cambiar.</span></div>
          <div class="poll-buttons">
            ${["blue","red","green","yellow","purple","orange"].map(c=>`<button class="secondary-button poll-choice" data-action="poll-vote" data-choice="${c}" ${quickVoteStats.myChoice?"disabled":""}>${c.charAt(0).toUpperCase()+c.slice(1)}</button>`).join("")}
          </div>
          <p class="small">El resultado se conocerá en clase. Después podrán conversar sobre qué color votó cada uno usando las palabras en inglés.</p>
          <div id="quickVoteResults">${quickVoteResultsHtml()}</div>
        </article>

        <article class="home-extra-card">
          <div class="mode-icon">🎬</div>
          <h4>${shortVideoTitle}</h4>
          <p class="small">Videos breves elegidos por el teacher y que se reproducen dentro de Mission English.</p>
          <div id="shortVideoList">${shortVideosHtml()}</div>

          <div id="shortVideoPlayer" class="short-video-player" hidden>
            <div class="short-video-head">
              <strong id="shortVideoTitle">🎬 Short video</strong>
              <button class="secondary-button" data-action="close-short-video">Cerrar</button>
            </div>
            <div id="shortVideoFrameHost"></div>
          </div>
        </article>

        <article class="home-extra-card future-card">
          <div class="mode-icon">💬</div>
          <h4>Mission English Assistant <span class="small">(Asistente)</span></h4>
          <p><strong>Under construction (En construcción)</strong></p>
          <p class="small">La idea es que sea un asistente real con el que puedas conversar sobre temas ya trabajados. Se activará cuando pueda responder de forma útil y coherente.</p>
        </article>
      </div>
    </section>

    <div class="button-row map-footer-actions">
      <button class="secondary-button" data-action="sign-out">Salir de Mission English Home</button>
    </div>
  </section>`;
}

function missionIntroView() {
  const m = missions[state.currentMission];
  return `<section class="card" id="missionReviewTop">
    <div class="read-first-banner">
      <div class="read-first-icon">📖</div>
      <div><div class="read-first-title">LEÉ ESTO PRIMERO</div>
      <div class="read-first-subtitle">Te ayudará a responder las preguntas que están al final.</div></div>
    </div>
    <h2>${m.icon} ${m.title}</h2>
    <p class="mission-intro-copy">${m.intro}</p>
    ${m.sections.map(s => `<section class="section-block"><h3 class="section-title">${s.title}</h3>${s.html}</section>`).join("")}
    <div class="learning-goal-note">🎯 <strong>La meta es aprender.</strong> Antes de buscar una respuesta afuera, volvé a mirar lo que acabás de leer.</div>
    <div class="read-confirm-box">
      <h3>¿Terminaste de leer?</h3>
      <div class="button-row">
        <button class="secondary-button" data-action="read-again">↩ Quiero leerlo otra vez</button>
        <button class="primary-button" data-action="confirm-read">✓ Ya lo leí — Continuar</button>
        <button class="secondary-button" data-action="back-map">← Volver al mapa de misiones</button>
      </div>
    </div>
  </section>`;
}

function shuffledCopy(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function resolvedQuestion(q) {
  const variantIndex = state.questionVariants?.[q.id];
  if (Array.isArray(q.variants) && Number.isInteger(variantIndex) && q.variants[variantIndex]) {
    return { ...q, ...q.variants[variantIndex], variants: q.variants };
  }
  return q;
}

function prepareMissionQuestionSet() {
  const mission = missions[state.currentMission];
  state.optionOrders = state.optionOrders || {};
  state.questionVariants = state.questionVariants || {};
  mission.questions.forEach(q => {
    if (Array.isArray(q.variants) && q.variants.length) {
      state.questionVariants[q.id] = Math.floor(Math.random() * q.variants.length);
    } else {
      delete state.questionVariants[q.id];
    }
    const rq = resolvedQuestion(q);
    if (Array.isArray(rq.options)) state.optionOrders[q.id] = shuffledCopy(rq.options);
  });
}

function optionsForQuestion(q) {
  const saved = state.optionOrders?.[q.id];
  return Array.isArray(saved) && saved.length === q.options?.length ? saved : (q.options || []);
}

function missionView() {
  const m = missions[state.currentMission];
  if (!state.reviewConfirmed) {
    state.route = "mission-intro"; saveState(); return missionIntroView();
  }
  const answered = m.questions.filter(q => state.answers[q.id] !== undefined && state.answers[q.id] !== "").length;
  const pct = Math.round((answered / m.questions.length) * 100);
  const notice = state.sessionNotice ? `<div class="focus-return-notice">👀 ${escapeHtml(state.sessionNotice)}</div>` : "";
  return `<section class="card mission-with-journey">
    ${notice}
    <aside class="journey-side" aria-label="Tu recorrido"><strong>Tu recorrido</strong><div class="journey-track-vertical"><div id="journeyLine" class="journey-line-vertical" style="height:${pct}%"></div><div id="journeyMarker" class="journey-marker-vertical" style="bottom:${pct}%">●</div></div><span id="journeyPct">${pct}%</span></aside>
    <h2 style="margin-top:1.2rem">${m.title}</h2>
    <div class="learning-goal-note compact">🌱 Practicá para aprender. No es obligatorio llegar a 100% ni repetir muchas veces.</div>
    <section class="section-block">
      <h3 class="section-title">✏️ ¡Es tu turno!</h3>
      <form id="missionForm">
        ${m.questions.map((q, idx) => questionHtml(resolvedQuestion(q), idx)).join("")}
        <div class="button-row">
          <button type="button" class="secondary-button" data-action="leave-mission">Salir de la misión</button>
          <button type="submit" class="primary-button">Finalizar y guardar misión</button>
        </div>
      </form>
    </section>
  </section>`;
}

function questionHtml(q, idx) {
  const value = state.answers[q.id] ?? "";
  const questionText = q.promptWord ? `${q.text} <strong>${escapeHtml(q.promptWord)}</strong>` : q.text;
  const imageHtml = q.image
    ? `<div class="question-image-wrap"><img class="question-image" src="${q.image}" alt="${escapeHtml(q.imageAlt || "Imagen para responder")}" /></div>`
    : "";

  if (q.type === "text") {
    return `<fieldset class="question"><legend>${questionText} <span class="small">(${q.points} punto)</span></legend>
      ${imageHtml}
      <input name="${q.id}" value="${escapeHtml(value)}" required autocomplete="off" autocapitalize="none" spellcheck="false" /></fieldset>`;
  }

  const options = optionsForQuestion(q);
  return `<fieldset class="question"><legend>${questionText} <span class="small">(${q.points} ${q.points===1?"punto":"puntos"})</span></legend>
    ${imageHtml}
    <div class="option-grid ${q.optionImages ? "image-options" : ""}">
    ${options.map((opt, optionIndex) => `<label class="option ${q.optionImages?.[opt] ? "option-with-image" : ""}">
      <input type="radio" name="${q.id}" value="${escapeHtml(opt)}" ${value===opt?"checked":""} required />
      ${q.optionImages?.[opt] ? `<img src="${q.optionImages[opt]}" alt="Opción visual ${optionIndex + 1}" /><span class="visually-hidden">Opción ${optionIndex + 1}</span>` : `<span>${opt}</span>`}
      </label>`).join("")}
    </div>
  </fieldset>`;
}


const REVIEW_LABELS = {
  "Meaning of Today": "significado de Today",
  "Date order": "orden de la fecha",
  "Date sentence": "escribir la fecha",
  "Correct date structure": "estructura de la fecha",
  "Morning greeting": "saludo de la mañana",
  "Night farewell": "despedida de la noche",
  "See you": "despedidas",
  "Afternoon greeting": "saludo de la tarde",
  "Stand up": "Stand up",
  "Listen": "Listen",
  "Copy": "Copy",
  "Sit down": "Sit down",
  "Following instructions": "instrucciones de clase",
  "Can I meaning": "significado de Can I...?",
  "Polite requests": "pedidos amables",
  "Excuse me": "Excuse me",
  "Restroom request": "pedir permiso para ir al baño",
  "Toilet spelling": "cómo escribir toilet",
  "Bathroom vocabulary": "palabras para baño",
  "Red": "red",
  "Purple": "purple",
  "Yellow": "yellow",
  "Color category": "reconocer los colores",
  "Gray spelling": "cómo escribir gray",
  "Orange": "orange",
  "Seven": "seven",
  "Counting three": "contar hasta three",
  "Five": "five",
  "Number category": "reconocer los números",
  "Eight spelling": "cómo escribir eight",
  "Number spelling": "escribir números del 1 al 10",
  "Number recognition": "reconocer números en inglés",
  "Color pairs": "reconocer dos colores juntos",
  "Counting six": "contar hasta six",
  "Sunny": "sunny",
  "Rainy": "rainy",
  "Cold": "cold",
  "Warm": "warm",
  "Weather category": "vocabulario del clima",
  "Windy spelling": "cómo escribir windy",
  "Color review": "colores",
  "Number review": "números",
  "Weather review": "clima",
  "Temperature review": "temperatura",
  "Color writing": "escribir colores",
  "Weather writing": "escribir palabras del clima"
};

function reviewLabel(topic) {
  return REVIEW_LABELS[topic] || topic;
}

function calculateMissionResult() {
  const mission = missions[state.currentMission];
  const details = [];
  let earned = 0, possible = 0;
  mission.questions.forEach(q => {
    const rq = resolvedQuestion(q);
    const response = state.answers[q.id] ?? "";
    const normalizedResponse = normalizeText(response);
    const correct = rq.type === "text"
      ? (rq.accepted || []).map(normalizeText).includes(normalizedResponse)
      : response === rq.correct;
    possible += rq.points;
    if (correct) earned += rq.points;
    const acceptedFeedback = correct && rq.acceptedFeedback
      ? rq.acceptedFeedback[normalizedResponse] || ""
      : "";
    details.push({
      missionId: mission.id, missionTitle: mission.title, questionId: rq.id, topic: rq.topic,
      review: rq.review || reviewLabel(rq.topic), question: rq.text, response,
      correctAnswer: rq.type === "text" ? rq.displayCorrect : rq.correct,
      acceptedFeedback, feedbackCorrect: rq.feedbackCorrect || "",
      correct, pointsEarned: correct ? rq.points : 0, pointsPossible: rq.points
    });
  });
  const now = new Date();
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `result-${Date.now()}`,
    createdAt: now.toISOString(),
    appVersion: APP_VERSION,
    contentVersion: CONTENT_VERSION,
    teacher: state.teacher,
    origin: "Home",
    mission: { id: mission.id, number: mission.number || state.currentMission + 1, contentKey: mission.contentKey || mission.id, revision: mission.revision || 1, title: mission.title },
    device: { computerName: "Home", location: "Fuera del aula" },
    student: state.student,
    startedAt: state.missionStartedAt || now.toISOString(),
    completedAt: now.toISOString(),
    durationSeconds: Math.max(0, Math.round((now.getTime() - new Date(state.missionStartedAt || now).getTime()) / 1000)),
    earned, possible, details,
    conceptsToReview: [...new Set(details.filter(d => !d.correct).map(d => d.review))],
    attention: { exitCount:Number(state.missionExitCount||0), inactivityLogged:!!state.inactivityLogged },
    syncStatus: "pending"
  };
}
function encouragement(result) {
  const ratio = result.possible ? result.earned / result.possible : 0;
  if (ratio >= .9) return "🌟 Great job!";
  if (ratio >= .65) return "👍 Keep going!";
  return "💪 Good effort!";
}
function missionResultView() {
  const r = state.lastMissionResult;
  const msg = encouragement(r);
  const incorrect = r.details.filter(d => !d.correct);
  const correctCount = r.details.filter(d => d.correct).length;
  const totalCount = r.details.length;
  const queued = getQueue().some(item => item.id === r.id);
  let syncTitle = "✓ Guardado.";
  let syncText = "La misión fue enviada correctamente.";
  if (r.syncStatus === "failed") {
    syncTitle = "Guardado en esta computadora.";
    syncText = "No se pudo enviar todavía. Se intentará nuevamente cuando haya conexión.";
  } else if (queued) {
    syncTitle = navigator.onLine ? "Guardando…" : "Guardado en esta computadora.";
    syncText = navigator.onLine
      ? "Puedes continuar. El envío se completa automáticamente."
      : "Se enviará automáticamente cuando vuelva Internet.";
  }
  return `<section class="card result-card">
    <p class="teacher-message"><strong>Teacher Eddie dice:</strong><br>${msg}</p>

    <div class="result-summary">
      <p><strong>Respondiste correctamente ${correctCount} de ${totalCount} actividades.</strong></p>
    </div>

    <p>${missions[state.currentMission].closing}</p>

    ${r.details.filter(d => d.acceptedFeedback).map(d => `<div class="notice"><strong>💡 Recuerda:</strong> ${escapeHtml(d.acceptedFeedback)}</div>`).join("")}

    ${incorrect.length ? `<div class="notice"><strong>Para seguir practicando:</strong> ${escapeHtml(r.conceptsToReview.join(", "))}</div>` :
      `<div class="notice"><strong>¡Todas las respuestas fueron correctas!</strong></div>`}

    <div class="sync-box">
      <strong id="syncHeading">${syncTitle}</strong>
      <p id="syncCopy" class="small">${syncText}</p>
      <button class="secondary-button" data-action="sync-now">Comprobar envío</button>
    </div>

    <div class="button-row">
      <button class="secondary-button" data-action="review-mission">Revisar lo aprendido</button>
      <button class="primary-button" data-action="return-home">Volver a mis misiones</button>
    </div>
  </section>`;
}

function updateJourneyProgress() {
  const mission = missions[state.currentMission];
  if (!mission) return;
  const answered = mission.questions.filter(q => state.answers[q.id] !== undefined && state.answers[q.id] !== "").length;
  const pct = Math.round((answered / mission.questions.length) * 100);
  const line = document.getElementById("journeyLine");
  const marker = document.getElementById("journeyMarker");
  if (line) line.style.height = `${pct}%`;
  if (marker) marker.style.bottom = `${pct}%`;
  const pctEl = document.getElementById("journeyPct");
  if (pctEl) pctEl.textContent = `${pct}%`;
}


let missionIdleTimer=null, lastAttentionInteraction=Date.now(), hiddenAt=0;
function isMissionActive(){ return state.route==="mission" && !!state.student?.id && !!state.missionStartedAt; }
function sendActivityEvent(eventType, extra={}) {
  if (!state.student?.id) return;
  const m=missions[state.currentMission]||{};
  const payload={type:"activityEvent",id:crypto.randomUUID?crypto.randomUUID():`event-${Date.now()}-${Math.random()}`,createdAt:new Date().toISOString(),origin:"Home",eventType,teacher:state.teacher,device:{computerName:"Home",location:"Fuera del aula"},student:state.student,mission:{id:m.id||"",number:m.number||"",title:m.title||""},...extra};
  try{fetch(SYNC_ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload),keepalive:true});}catch{}
}
function resetMissionIdleTimer(){
  lastAttentionInteraction=Date.now(); if(missionIdleTimer)clearTimeout(missionIdleTimer); if(!isMissionActive())return;
  missionIdleTimer=setTimeout(()=>{if(!isMissionActive()||state.inactivityLogged)return; state.inactivityLogged=true; state.sessionNotice="Hace unos minutos que no hay actividad. Cuando estés listo/a, continuá desde donde estabas."; saveState(); sendActivityEvent("inactivity",{inactiveSeconds:Math.round((Date.now()-lastAttentionInteraction)/1000)}); render();},4*60*1000);
}
function startMissionAttentionTracking(){resetMissionIdleTimer();}
["click","keydown","input","change","touchstart"].forEach(name=>document.addEventListener(name,()=>{if(isMissionActive())resetMissionIdleTimer();},{passive:true}));
document.addEventListener("visibilitychange",()=>{if(!isMissionActive())return;if(document.hidden){hiddenAt=Date.now();}else if(hiddenAt){const seconds=Math.max(1,Math.round((Date.now()-hiddenAt)/1000));hiddenAt=0;state.missionExitCount=Number(state.missionExitCount||0)+1;saveState();sendActivityEvent("left_app",{awaySeconds:seconds,exitCount:state.missionExitCount});}});
window.addEventListener("beforeunload",event=>{if(!isMissionActive())return;sendActivityEvent("attempted_close",{});event.preventDefault();event.returnValue="";});

function bindEvents() {
  document.querySelectorAll("[data-action]").forEach(el => el.addEventListener("click", async event => {
    const action = event.currentTarget.dataset.action;
    if (action && action.startsWith("dp-") && dpHandleAction(action, event.currentTarget)) return;
    if (action === "start-home") { state.forceHomeIntro=false; state.route = "identify"; saveState(); render(); }
    if (action === "first-time-home") { state.forceHomeIntro=true; state.route = "about-home"; saveState(); render(); }
    if (action === "about-home-continue") { state.forceHomeIntro=true; state.route = "identify"; saveState(); render(); }
    if (action === "go-home") { state.route = "home"; saveState(); render(); }
    if (action === "reload-roster") { await loadBootstrap(true); }
    if (action === "change-student") {
      state.student = freshState().student; state.selectedGradeKey = ""; state.route = "identify";
      state.reviewConfirmed=false; state.sessionNotice=""; saveState(); render();
    }
    if (action === "continue-student") {
      state.route = (state.forceHomeIntro || !introSeenForStudent(state.student?.id)) ? "home-intro" : "map";
      state.sessionNotice = "";
      saveState();
      render();
      await loadBootstrap(true,true);
      if (state.route === "map") refreshQuickVoteResults();
    }
    if (action === "confirm-student") {
      state.currentMission = firstPendingMissionIndex();
      saveHomeSchool(state.student.institution);
      state.route = (state.forceHomeIntro || !introSeenForStudent(state.student?.id)) ? "home-intro" : "map";
      saveState();
      render();
    }
    if (action === "finish-home-intro") {
      markIntroSeenForStudent(state.student?.id);
      state.forceHomeIntro=false;
      state.route = "map";
      saveState();
      render();
      await loadBootstrap(true,true);
      refreshQuickVoteResults();
    }
    if (action === "open-mission") {
      state.currentMission = Number(event.currentTarget.dataset.index);
      clearCurrentMissionAnswers(); prepareMissionQuestionSet();
      state.reviewConfirmed=false; state.missionExitCount=0; state.inactivityLogged=false; state.sessionNotice="";
      state.route="mission-intro"; saveState(); render();
    }
    if (action === "read-again") document.getElementById("missionReviewTop")?.scrollIntoView({behavior:"smooth",block:"start"});
    if (action === "confirm-read") {
      state.reviewConfirmed=true; state.missionStartedAt=new Date().toISOString(); state.route="mission"; saveState(); render(); startMissionAttentionTracking();
    }
    if (action === "speak-useful") {
      playUsefulEnglishAudio();
      event.currentTarget.blur();
    }
    if (action === "audio-rate") {
      homeAudioRate = Number(event.currentTarget.dataset.rate || 1);
      document.querySelectorAll(".audio-rate").forEach(btn => {
        const rate = Number(btn.dataset.rate || 1);
        btn.classList.toggle("selected", Math.abs(rate-homeAudioRate) < 0.01);
      });
      event.currentTarget.blur();
    }
    if (action === "open-teacher-video") {
      openTeacherVideo(event.currentTarget.dataset.videoIndex || "0");
      event.currentTarget.blur();
    }
    if (action === "close-short-video") {
      const player = document.getElementById("shortVideoPlayer");
      const host = document.getElementById("shortVideoFrameHost");
      if (host) host.innerHTML = "";
      if (player) player.hidden = true;
    }
    if (action === "back-map") { state.route = "map"; saveState(); render(); refreshQuickVoteResults(); }
    if (action === "open-practice") { state.route="practice-menu"; saveState(); render(); }
    if (action === "guided-start") {
      startGuidedPractice_(event.currentTarget.dataset.type);
    }
    if (action === "guided-listen") {
      speakPracticeWord_(event.currentTarget.dataset.word||"");
    }
    if (action === "guided-next-stage1") {
      const source=guidedPracticeSource_(guidedPractice.type);
      if(guidedPractice.index+1 < source.length){
        guidedPractice.index++;
        render();
      } else {
        guidedPractice.stage=2;
        guidedMakeStage2Order_();
        guidedPrepareQuestion_();
        render();
      }
    }
    if (action === "guided-answer") {
      if(guidedPractice.locked)return;
      const target=guidedPractice.target;
      const expected=guidedPractice.type==="colors"?String(target.word):String(target.value);
      const got=String(event.currentTarget.dataset.value||"");
      const fb=document.getElementById("guidedFeedback");
      if(got!==expected){
        if(fb) fb.innerHTML='<span class="retry">↻ 🔊</span>';
        setTimeout(()=>speakPracticeWord_(target.word),120);
        return;
      }
      guidedPractice.locked=true;
      if(fb) fb.innerHTML='<span class="ok">✓</span>';
      speakPracticeWord_(target.word);
      setTimeout(()=>{
        const source=guidedPracticeSource_(guidedPractice.type);
        guidedPractice.index++;
        if(guidedPractice.index>=source.length){
          guidedPractice.stage=3;
          guidedPractice.target=null;
          guidedPractice.options=[];
        }else{
          guidedPractice.target=null;
          guidedPrepareQuestion_();
        }
        guidedPractice.locked=false;
        render();
      },650);
    }
    if (action === "guided-final-start") {
      startDifferentiatedPractice(guidedPractice.type,event.currentTarget.dataset.mode||"audio");
    }
    if (action === "guided-exit") {
      guidedPractice={type:"",stage:0,index:0,order:[],target:null,options:[],locked:false};
      state.route="practice-menu"; saveState(); render();
    }

    if (action === "practice-start") { startDifferentiatedPractice(event.currentTarget.dataset.type, event.currentTarget.dataset.mode||"audio"); }
    if (action === "practice-listen") { const t=practiceTarget_(); if(t)speakPracticeWord_(t.word); }
    if (action === "practice-answer") {
      if(differentiatedPractice.locked)return;
      const t=practiceTarget_(); if(!t)return;
      differentiatedPractice.attempts++;
      const expected=differentiatedPractice.type==="colors"?t.word:String(t.value);
      const got=String(event.currentTarget.dataset.value||"");
      if(got===expected){
        differentiatedPractice.correct++; differentiatedPractice.feedback="ok"; differentiatedPractice.locked=true;
        speakPracticeWord_(t.word); render();
      } else {
        differentiatedPractice.feedback="retry"; render();
        setTimeout(()=>speakPracticeWord_(t.word),120);
      }
    }
    if (action === "practice-next") {
      differentiatedPractice.index++; differentiatedPractice.feedback=""; differentiatedPractice.locked=false;
      if(differentiatedPractice.index>=differentiatedPractice.items.length){state.route="practice-result";saveState();render();}
      else {render(); if(differentiatedPractice.mode==="audio")setTimeout(()=>{const t=practiceTarget_();if(t)speakPracticeWord_(t.word)},180);}
    }
    if (action === "practice-again") { startDifferentiatedPractice(differentiatedPractice.type,differentiatedPractice.mode); }
    if (action === "practice-exit") { state.route="map"; saveState(); render(); refreshQuickVoteResults(); }
    if (action === "sign-out") {
      if (confirm("¿Querés salir de Mission English Home?")) {
        const school = state.student?.institution || savedHomeSchool();
        state = freshState();
        state.student.institution = school;
        state.route = "home";
        saveState();
        render();
      }
    }
    if (action === "leave-mission") {
      if (confirm("Esta misión no se guardará. ¿Quieres salir?")) {
        clearCurrentMissionAnswers(); state.route = "map"; saveState(); render();
      }
    }
    if (action === "return-home") {
      state.route = "map";
      saveState();
      render();
      loadBootstrap(true, true).then(() => {
        if (state.route === "map") render();
      });
    }
    if (action === "review-mission") { state.reviewConfirmed=false; state.route="mission-intro"; saveState(); render(); }
    if (action === "refresh-progress") { await loadBootstrap(true); }
    if (action === "sync-now") syncQueue(true);
    if (action === "open-settings") { state.route = "settings"; saveState(); render(); }
    if (action === "cancel-settings") { state.route = "home"; saveState(); render(); }
  }));

  const deviceForm = document.getElementById("deviceForm");
  if (deviceForm) deviceForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(deviceForm);
    saveDeviceConfig({
      computerName: String(data.get("computerName") || "").trim(),
      location: String(data.get("location") || "").trim(),
      configuredAt: deviceConfig.configuredAt || new Date().toISOString()
    });
    state.route = "home"; saveState(); render();
  });

  const studentForm = document.getElementById("studentForm");
  if (studentForm) studentForm.addEventListener("submit", event => {
    event.preventDefault();

    const form = new FormData(studentForm);
    const firstName = String(form.get("firstName") || "").trim();
    const nickname = String(form.get("nickname") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const institution = String(form.get("institution") || "").trim() || savedHomeSchool();
    const grade = String(form.get("grade") || "").trim();

    if (!firstName && !nickname) {
      state.identityError = "Escribí tu nombre o tu apodo.";
      saveState();
      render();
      return;
    }

    let match = nickname ? findHomeStudentSimple(nickname, lastName, grade) : {student:null,ambiguous:false};
    if (!match.student && firstName) {
      const byName = findHomeStudentSimple(firstName, lastName, grade);
      match = byName.student ? byName : {student:null, ambiguous: match.ambiguous || byName.ambiguous};
    }

    if (!match.student) {
      state.student = {
        ...state.student,
        firstName,
        nickname,
        lastName,
        institution,
        grade
      };

      state.identityError = match.ambiguous
        ? "Hay más de un alumno con esos datos en tu grado. Escribí también tu apellido para distinguirte."
        : "No encontramos ese nombre o apodo en el grado seleccionado. Revisalo y volvé a intentar.";

      saveState();
      render();
      return;
    }

    const matched = match.student;
    const official = splitOfficialName(matched);

    state.identityError = "";
    state.student = {
      ...matched,
      firstName: official.first.split(" ")[0] || firstNameOrNickname(matched) || firstName || nickname,
      lastName: official.last || lastName,
      institution,
      level: "Primaria",
      mode:"individual",
      partnerId:"",
      partner:""
    };

    saveHomeSchool(institution);
    state.route = "confirm";
    saveState();
    render();
  });

  const missionForm = document.getElementById("missionForm");
  if (missionForm) {
    const handleMissionProgress = () => {
      captureMissionAnswers();
      saveState();
      updateJourneyProgress();
    };
    missionForm.addEventListener("input", handleMissionProgress);
    missionForm.addEventListener("change", handleMissionProgress);
    missionForm.addEventListener("submit", event => {
      event.preventDefault();
      captureMissionAnswers();
      const result = calculateMissionResult();
      state.lastMissionResult = result;
      saveLocalMissionProgress(result);
      enqueueResult(result);
      state.route = "mission-result";
      saveState(); render();
      syncQueue(false);
    });
  }
}

function clearCurrentMissionAnswers() {
  const mission = missions[state.currentMission];
  state.optionOrders = state.optionOrders || {};
  mission.questions.forEach(q => {
    delete state.answers[q.id];
    delete state.optionOrders[q.id];
    delete state.questionVariants[q.id];
  });
  state.missionStartedAt = "";
  state.reviewConfirmed=false; state.missionExitCount=0; state.inactivityLogged=false; state.sessionNotice="";
}
function captureMissionAnswers() {
  const form = document.getElementById("missionForm");
  if (!form) return;
  const data = new FormData(form);
  for (const [key, value] of data.entries()) state.answers[key] = value;
}
function enqueueResult(result) {
  const queue = getQueue();
  if (!queue.some(x => x.id === result.id)) queue.push(result);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}
function getQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; }
  catch { return []; }
}
async function syncQueue(manual) {
  const queue = getQueue();
  if (!queue.length) {
    return showSyncMessage("✓ Envío confirmado.", "Tu misión ya está registrada.");
  }
  if (!navigator.onLine) {
    return showSyncMessage("Sin conexión.", "La misión quedó guardada y se enviará automáticamente.");
  }
  try {
    for (const item of queue) {
      await fetch(SYNC_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(item)
      });
    }
    localStorage.setItem(QUEUE_KEY, "[]");
    if (state.lastMissionResult) {
      state.lastMissionResult.syncStatus = "sent";
      saveState();
    }
    showSyncMessage("✓ Guardado.", "La misión fue enviada correctamente.");
  } catch {
    if (state.lastMissionResult) {
      state.lastMissionResult.syncStatus = "failed";
      saveState();
    }
    showSyncMessage("Guardado en esta computadora.", "No se pudo enviar todavía. Se intentará nuevamente cuando haya conexión.");
  }
}
function showSyncMessage(title, copy) {
  const heading = document.getElementById("syncHeading");
  const text = document.getElementById("syncCopy");
  if (heading) heading.textContent = title;
  if (text) text.textContent = copy;
}
function loadBootstrap(force=false, silent=false) {
  if (bootstrapData.loaded && !force) {
    if (!silent) render();
    return Promise.resolve(bootstrapData);
  }

  bootstrapData = {
    students: LOCAL_STUDENTS,
    progress: bootstrapData.progress || {},
    classroomProgress: bootstrapData.classroomProgress || {},
    homeProgress: bootstrapData.homeProgress || {},
    missionPermissions: bootstrapData.missionPermissions || {},
    homeVideos: bootstrapData.homeVideos || [],
    loaded: true,
    error: ""
  };
  if (!silent) render();

  if (!navigator.onLine) {
    bootstrapData.error = "offline";
    return Promise.resolve(bootstrapData);
  }

  return jsonpBootstrap()
    .then(data => {
      if (!data || data.ok === false) {
        throw new Error(data?.error || "Respuesta inválida");
      }
      bootstrapData = {
        students: Array.isArray(data.students) && data.students.length
          ? [...new Map([...LOCAL_STUDENTS, ...data.students].map(student => [student.id, student])).values()]
          : LOCAL_STUDENTS,
        progress: data.progress && typeof data.progress === "object" ? data.progress : {},
        missionPermissions: data.missionPermissions && typeof data.missionPermissions === "object" ? data.missionPermissions : {},
        classroomProgress: data.classroomProgress && typeof data.classroomProgress === "object" ? data.classroomProgress : {},
        homeProgress: data.homeProgress && typeof data.homeProgress === "object" ? data.homeProgress : {},
        homeVideos: Array.isArray(data.homeVideos) ? data.homeVideos : [],
        loaded: true,
        error: ""
      };
      if (!silent) render();
      return bootstrapData;
    })
    .catch(error => {
      console.error("Mission English Home bootstrap error:", error);
      bootstrapData = {
        students: LOCAL_STUDENTS,
        progress: bootstrapData.progress || {},
        classroomProgress: bootstrapData.classroomProgress || {},
        homeProgress: bootstrapData.homeProgress || {},
        missionPermissions: bootstrapData.missionPermissions || {},
        homeVideos: bootstrapData.homeVideos || [],
        loaded: true,
        error: String(error?.message || error || "No se pudo consultar Google Sheets.")
      };
      if (!silent) render();
      return bootstrapData;
    });
}

function jsonpBootstrap() {
  return new Promise((resolve, reject) => {
    const callbackName = `mewRoster_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement("script");
    script.id = callbackName;

    let finished = false;
    const finish = (error, data) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      script.remove();
      try { delete window[callbackName]; }
      catch (_) { window[callbackName] = undefined; }
      if (error) reject(error);
      else resolve(data);
    };

    window[callbackName] = data => finish(null, data);
    script.onerror = () => finish(new Error("No se pudo consultar Google Sheets."));
    script.src = `${SYNC_ENDPOINT}?action=bootstrap&origin=Home&callback=${encodeURIComponent(callbackName)}&t=${Date.now()}`;

    const timer = setTimeout(
      () => finish(new Error("La consulta a Google Sheets tardó demasiado.")),
      8000
    );

    document.head.appendChild(script);
  });
}
function formatDuration(seconds) {
  const total = Number(seconds) || 0;
  const minutes = Math.floor(total / 60), remaining = total % 60;
  return minutes ? `${minutes} min ${remaining} s` : `${remaining} s`;
}
function updateNetworkStatus() {
  const el = document.getElementById("networkStatus");
  if (!el) return;
  el.textContent = navigator.onLine ? "● Online" : "● Offline";
  el.className = `status-pill ${navigator.onLine ? "online" : "offline"}`;
}
window.addEventListener("online", () => { updateNetworkStatus(); syncQueue(false); });
window.addEventListener("offline", updateNetworkStatus);
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); deferredInstallPrompt = e;
  const button = document.getElementById("installButton");
  if (button) {
    button.hidden = false;
    button.onclick = async () => {
      deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null; button.hidden = true;
    };
  }
});
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./service-worker.js").catch(console.error);
}
render();
syncQueue(false);
