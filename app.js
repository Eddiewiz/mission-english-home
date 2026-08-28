
const HOME_RELEASE_VERSION = "v1.6.10";

function homeworkReminderKey_(){
  const sid=String(state?.student?.id||state?.student?.displayName||"student").trim()||"student";
  const assignment=`${HOME_ASSIGNMENT.deadlineLabel}|${HOME_ASSIGNMENT.requiredMissionIds.join(",")}|${HOME_ASSIGNMENT.requireQuickVote}|${HOME_ASSIGNMENT.requireListening}|${HOME_ASSIGNMENT.requireVideo}`;
  let hash=0;
  for(let i=0;i<assignment.length;i++) hash=((hash<<5)-hash+assignment.charCodeAt(i))|0;
  return `mission_english_home_homework_reminder_${sid}_${Math.abs(hash)}`;
}
function homeworkReminderApplies_(){
  return !!(HOME_ASSIGNMENT.enabled && homeGradeAllowed_());
}
function homeworkReminderNeedsPopup_(){
  if(!homeworkReminderApplies_()) return false;
  try{return localStorage.getItem(homeworkReminderKey_())!=="closed";}catch{return true;}
}
function closeHomeworkReminder_(){
  try{localStorage.setItem(homeworkReminderKey_(),"closed");}catch{}
}

(function prepareFreshHomeRelease_(){
  try{
    const marker="mission_english_home_release_marker";
    if(localStorage.getItem(marker)===HOME_RELEASE_VERSION) return;
    const prefixes=[
      "mission_english","missionEnglish","mission-english",
      "home_student","homeStudent","quickVote","quick_vote",
      "guidedPractice","guided_practice"
    ];
    Object.keys(localStorage).forEach(key=>{
      const lower=String(key).toLowerCase();
      if(prefixes.some(p=>lower.includes(p.toLowerCase())) && key!==marker){
        localStorage.removeItem(key);
      }
    });
    sessionStorage.clear();
    localStorage.setItem(marker,HOME_RELEASE_VERSION);
  }catch{}
})();


const APP_VERSION = "Home v1.6.8";

/* Home v1.6.0 — first take-home rollout.
   Fill requiredMissionIds and deadlineLabel once the teacher selects the two compulsory Missions. */
const HOME_ASSIGNMENT = {
  enabled: true,
  allowedGrades: ["6"],
  title: "📌 Tarea de Mission English Home · 6.º grado",
  requiredMissionIds: ["m2","classroom-objects-g6-v1"],
  requireQuickVote: true,
  requireListening: true,
  requireVideo: true,
  deadlineLabel: "Martes 1.º de septiembre · 12:00 PM (mediodía)"
};
const HOME_MISSIONS_LANGUAGE_KEY = "mission_english_home_missions_language_v1__v1.6.0";
function missionsPageLanguage_(){
  try{
    const saved=String(localStorage.getItem(HOME_MISSIONS_LANGUAGE_KEY)||"").toLowerCase();
    return saved==="es" ? "es" : "en";
  }catch{return "en";}
}
function missionsText_(en,es){ return missionsPageLanguage_()==="es" ? es : en; }
function setMissionsPageLanguage_(lang){
  try{ localStorage.setItem(HOME_MISSIONS_LANGUAGE_KEY, lang==="es" ? "es" : "en"); }catch{}
}
const HOME_TESTER_PIN_HASHES = [
  "71dfaa6e56a7bc85ee7e637421afd86f53a74b4623e33dc6f82af973ecc9975b", // METHOME26 · Tester 1 · no backend tracking
  "425aa0c1f69a2c8f9b70d76b26eff43d53895dfddb13b3ab8b330804959d4bfb", // METHOME27 · Tester 2 · backend tracking
  "d723db1445ae53f4f4bbd07efe4db50d6a7005ee15bf98c6d58b3a68aab39c66"  // METHOME28 · Tester 3 · backend tracking
];
let homeTesterAuthorized = false;
let homeTesterAuthorizedIndex = -1;
async function testerPinIndex_(value){
  const bytes=new TextEncoder().encode(String(value||"").trim().toUpperCase());
  const digest=await crypto.subtle.digest("SHA-256",bytes);
  const hex=[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("");
  return HOME_TESTER_PIN_HASHES.indexOf(hex);
}
const HOME_TESTERS = [
  {id:"TESTER-HOME-01",officialName:"Tester Home 1",displayName:"Tester Home 1",nickname:"Tester 1",grade:"6",division:"TEST",schoolYear:"2026",institution:"Mission English Testing",isTester:true,recordBackend:false},
  {id:"TESTER-HOME-02",officialName:"Tester Home 2",displayName:"Tester Home 2",nickname:"Tester 2",grade:"6",division:"TEST",schoolYear:"2026",institution:"Mission English Testing",isTester:true,recordBackend:true},
  {id:"TESTER-HOME-03",officialName:"Tester Home 3",displayName:"Tester Home 3",nickname:"Tester 3",grade:"6",division:"TEST",schoolYear:"2026",institution:"Mission English Testing",isTester:true,recordBackend:true}
];
function testerBackendTrackingEnabled_(){ return !isHomeTester_() || state.student?.recordBackend===true; }
function isHomeTester_(){ return !!state.student?.isTester || String(state.student?.id||"").startsWith("TESTER-HOME-"); }
function homeGradeAllowed_(){ return isHomeTester_() || HOME_ASSIGNMENT.allowedGrades.includes(String(state.student?.grade||"").trim()); }
function homeworkPanelHtml_(){
  if(!HOME_ASSIGNMENT.enabled || !homeGradeAllowed_()) return "";
  const catalog=studentMissionCatalog_();
  const selected=HOME_ASSIGNMENT.requiredMissionIds.map(id=>catalog.find(m=>m.id===id)).filter(Boolean);
  const missions=selected.length ? selected.map(m=>`<li><strong>Mission ${m.number}</strong> · ${escapeHtml(m.title.replace(/^MISIÓN\s*\d+\s*[–-]\s*/i,""))}</li>`).join("") : `<li><strong>2 Missions obligatorias</strong> · el teacher las indicará.</li>`;
  return `<section class="home-assignment-card">
    <div class="assignment-title">${HOME_ASSIGNMENT.title}</div>
    <div class="assignment-deadline">⏰ ${escapeHtml(HOME_ASSIGNMENT.deadlineLabel)}</div>
    <ul>${missions}${HOME_ASSIGNMENT.requireQuickVote?"<li>📣 Completar <strong>Quick Vote</strong>.</li>":""}${HOME_ASSIGNMENT.requireListening?"<li>🎧 Escuchar el <strong>Listening</strong>.</li>":""}${HOME_ASSIGNMENT.requireVideo?"<li>🎬 Ver el <strong>Short Video</strong>.</li>":""}</ul>
  </section>`;
}

const CONTENT_VERSION = "Mission English Home v1.6.10 — mobile phone layout hotfix";
const STORAGE_KEY = "mission_english_home_state_v13__v1.6.8";
const QUEUE_KEY = "mission_english_home_results_queue_v11__v1.6.0";
const CONFIG_KEY = "mission_english_home_config_v11__v1.6.0";
const LOCAL_PROGRESS_KEY = "mission_english_home_local_progress_v13__v1.6.0";
const MISSION_DRAFTS_KEY = "mission_english_home_drafts_v1__v1.6.0";
const HOME_INTRO_SEEN_KEY = "mission_english_home_intro_seen_v1__v1.6.0";
const HOME_SCHOOL_KEY = "mission_english_home_school__v1.6.0";
const HOME_AVATAR_KEY = "mission_english_home_avatar_v1__v1.6.0";
const HOME_AVATARS = ["🐯","🦊","🐼","🐨","🐧","🦁","🐸","🐵","🐙","🦋","🐬","🦜","⭐","🌈","🚀","⚽","🎸","🎨"];
function avatarStorageId_(student=state.student){
  return String(student?.id || [student?.firstName||"",student?.nickname||"",student?.lastName||"",student?.grade||""].join("|"));
}
function savedAvatar_(student=state.student){
  try{
    const all=JSON.parse(localStorage.getItem(HOME_AVATAR_KEY)||"{}");
    return all[avatarStorageId_(student)] || "";
  }catch{return "";}
}
function saveAvatar_(emoji,student=state.student){
  try{
    const all=JSON.parse(localStorage.getItem(HOME_AVATAR_KEY)||"{}");
    all[avatarStorageId_(student)] = String(emoji||"");
    localStorage.setItem(HOME_AVATAR_KEY,JSON.stringify(all));
  }catch{}
}

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
        "html": "<p>Hoy vamos a recordar cómo escribimos la fecha.</p>\n        <p>En inglés en general escribimos la fecha de esta forma:</p>\n        <div class=\"notice\"><strong>Today is Monday, June 29th.</strong></div>\n        <p>Primero escribimos el día de la semana. Después el mes. Y por último el número del día.</p>\n        <p>Si necesitas ayuda, puedes consultar tu carpeta.</p>"
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
          "Mes",
          "Número",
          "Día"
        ],
        "correct": "Mes"
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
        "text": "Completa en el recuadro de abajo con la palabra faltante: Today ___ Monday.",
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
        "html": "<p>Hoy vamos a recordar cómo saludamos y nos despedimos en inglés. Acuérdate que hay saludos formales e informales. Si no te acuerdas, consulta en tu carpeta.</p><div class=\"greeting-groups\"><div><strong>👋 Cuando llego · When I arrive</strong><span>Hello!</span><span>Hi!</span><span>Good morning!</span><span>Good afternoon!</span><span>Good evening!</span></div><div><strong>👋 Cuando me voy · When I leave</strong><span>Goodbye!</span><span>Bye!</span><span>Bye-bye!</span><span>See you!</span><span>See you later!</span><span>Good night!</span></div></div><div class=\"greetings-farewell-meanings\"><strong>👋 Despedidas (cuando te vas):</strong><span><b>Goodbye!</b> → Adiós.</span><span><b>Bye!</b> → Chau.</span><span><b>See you!</b> → Nos vemos.</span><span><b>Good night!</b> → Buenas noches (al despedirte o antes de dormir).</span></div><div class=\"classroom-greeting\"><strong>🏫 Saludo estándar del aula</strong><p><b>Teacher:</b> Hello. How are you?<br><b>Student:</b> Fine. Thank you. And you?<br><b>Teacher:</b> Fine. Thanks.</p></div><div class=\"mission-context-tip\"><strong>💡 Formal e informal:</strong> <strong>Hello</strong> es un saludo más formal o neutral. <strong>Hi</strong> es informal y se usa mucho entre personas que ya conocemos. <strong>Good morning, Good afternoon</strong> y <strong>Good evening</strong> pueden usarse como saludos formales o respetuosos según la situación.</div><p><strong>Fuera del aula también podés variar el saludo:</strong> Hi, how are you? · Good afternoon. · Good afternoon. How are you?</p><p><strong>Otras respuestas posibles:</strong> Excellent! · Fantastic! · Great! · Very good! · Good!</p>"
      },
      {
        "title": "👀 Observa",
        "html": "<img class=\"greetings-observe-image\" src=\"images/home-missions/approved-cards/m2-greetings.jpg\" alt=\"Good morning, good afternoon, good evening and good night\"><div class=\"greetings-recap-row\"><span><strong>Good morning</strong><small>Buenos días</small></span><span><strong>Good afternoon</strong><small>Buenas tardes</small></span><span><strong>Good evening</strong><small>Buenas tardes/noches al saludar</small></span><span><strong>Good night</strong><small>Buenas noches al despedirse</small></span></div>"
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
        "html": "<div class=\"classroom-observe-icons\"><span><b>Escuchá</b><i>👂</i></span><span><b>Mirá</b><i>👁️</i></span><span><b>Parate</b><i>🧍</i></span><span><b>Sentate</b><i>🪑</i></span><span><b>Copiá</b><i>✍️</i></span><span><b>Detenete</b><i>✋</i></span><span><b>¡Vamos!</b><i>👉</i></span><span><b>Silencio</b><i>🤫</i></span></div><div class=\"classroom-translation-list\"><p><strong>Listen</strong> = Escuchá · <strong>Look</strong> = Mirá · <strong>Stand up</strong> = Parate · <strong>Sit down</strong> = Sentate</p><p><strong>Copy</strong> = Copiá · <strong>Stop</strong> = Detenete · <strong>Let\'s go!</strong> = ¡Vamos! · <strong>Silence, please.</strong> = Silencio, por favor.</p></div>"
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
        "html": "<div class=\"notice\"><strong>🙋 Excuse me. Can I go to the restroom / toilet, please?</strong></div>\n        <img class=\"school-places-image\" src=\"images/home-missions/approved-cards/m4-permission-dashboard.jpg\" alt=\"Restroom, office, library and kitchen at school\">\n        <p>Podés usar la misma estructura con distintos lugares de la escuela: <strong>Can I go to the office / library / kitchen, please?</strong></p>\n        <p>👍 <strong>Yes, you can.</strong> → Sí, puedes. También podés responder simplemente <strong>Yes.</strong><br>\n        ✋ <strong>No, please wait.</strong> → No, por favor espera. También podés responder simplemente <strong>No.</strong></p>"
      },
      {
        "title": "🌟 ¿Sabías que...?",
        "html": "<p>En inglés, decir <strong>please</strong> hace que un pedido sea más amable y respetuoso. Por ejemplo: Can I go to the library, <strong>please</strong>?</p>"
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
        "text": "Completa: Can I go to the ________, please? 🚻",
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
        "html": "<div class=\"number-strip\"><span>1 · one</span><span>2 · two</span><span>3 · three</span><span>4 · four</span><span>5 · five</span><span>6 · six</span><span>7 · seven</span><span>8 · eight</span><span>9 · nine</span><span>10 · ten</span></div><div class=\"mission-context-tip\"><strong>💡 Importante:</strong> recordá cómo se deletrea cada número. <strong>Eight (8)</strong> suele ser el más difícil.</div>"
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
        "html": "<p>Del <strong>13 al 19</strong>, la mayoría de las palabras terminan en <strong>-teen</strong>. El número <strong>20</strong> se escribe <strong>twenty</strong>.</p><p>En muchos números terminados en <strong>-teen</strong>, podés reconocer el número base y agregar <strong>teen</strong>: <strong>seven + teen = seventeen</strong>, <strong>nine + teen = nineteen</strong>.</p>"
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
  },
  {
    "id": "days-of-week-v1",
    "number": 11,
    "contentKey": "days-of-week",
    "revision": 1,
    "icon": "📆",
    "title": "MISIÓN 11 – Days of the Week",
    "intro": "Vamos a aprender los días de la semana y a reconocer una pista que te ayuda a recordarlos.",
    "sections": [
      {
        "title": "📖 Aprende",
        "html": '<p>Primero mirá los siete días en inglés:</p><div class="week-days-grid"><span>MON<span>DAY</span></span><span>TUES<span>DAY</span></span><span>WEDNES<span>DAY</span></span><span>THURS<span>DAY</span></span><span>FRI<span>DAY</span></span><span>SATUR<span>DAY</span></span><span>SUN<span>DAY</span></span></div><p>Ahora comparalos con el español:</p><div class="week-days-meaning-grid"><span><strong>Monday</strong> = lunes</span><span><strong>Tuesday</strong> = martes</span><span><strong>Wednesday</strong> = miércoles</span><span><strong>Thursday</strong> = jueves</span><span><strong>Friday</strong> = viernes</span><span><strong>Saturday</strong> = sábado</span><span><strong>Sunday</strong> = domingo</span></div><div class="mission-context-tip"><strong>💡 Una pista importante:</strong> todos los días terminan con <strong>DAY</strong>. <strong>Choose the ending shared by every day of the week.</strong> = <em>Elegí la terminación que comparten todos los días de la semana.</em></div>'
      },
      {
        "title": "👀 Observa",
        "html": "<p>Si reconocés <strong>DAY</strong> al final, ya sabés que probablemente estás mirando el nombre de un día de la semana.</p><p><strong>Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.</strong></p><div class=\"mission-context-tip\"><strong>💡 Curiosidad:</strong> en inglés, los días de la semana se escriben <strong>SIEMPRE</strong> con la primera letra en mayúscula.</div>"
      }
    ],
    "questions": [
      {"id":"h11q1","topic":"Day ending","review":"DAY","points":1,"text":"Choose the ending shared by every day of the week. <span class=\"small\">(Elegí la terminación que comparten todos los días de la semana.)</span>","options":["DAY","MONTH","WEEK"],"correct":"DAY"},
      {"id":"h11q2","topic":"Monday","review":"Monday","points":1,"text":"Which word means lunes? <span class=\"small\">(¿Qué palabra significa lunes?)</span>","options":["Monday","January","Blue"],"correct":"Monday"},
      {"id":"h11q3","topic":"Friday","review":"Friday","points":1,"text":"Which day means viernes? <span class=\"small\">(¿Qué día significa viernes?)</span>","options":["Friday","June","Ten"],"correct":"Friday"},
      {"id":"h11q4","topic":"Weekend","review":"Saturday and Sunday","points":1,"text":"Which option contains two days of the week? <span class=\"small\">(¿Qué opción contiene dos días de la semana?)</span>","options":["Saturday and Sunday","March and April","Red and green"],"correct":"Saturday and Sunday"},
      {"id":"h11q5","topic":"Days order","review":"days of the week","points":1,"text":"Which day comes after Wednesday? <span class=\"small\">(¿Qué día viene después de Wednesday / miércoles?)</span>","options":["Thursday","October","Seven"],"correct":"Thursday"}
    ],
    "closing": "🎉 ¡Muy bien! Ya reconocés los siete días y la pista DAY."
  },
  {
    "id": "months-of-year-v1",
    "number": 12,
    "contentKey": "months-of-year",
    "revision": 1,
    "icon": "🗓️",
    "title": "MISIÓN 12 – Months of the Year",
    "intro": "Vamos a aprender los meses del año aprovechando algo que ya sabés en español.",
    "sections": [
      {
        "title": "📖 Aprende",
        "html": '<p>Muchos meses en inglés se parecen mucho a sus nombres en español. Eso los convierte en palabras transparentes o fáciles de reconocer. <strong>No hace falta traducir todos los meses al español uno por uno.</strong></p><div class="months-grid"><span>January</span><span>February</span><span>March</span><span>April</span><span>May</span><span>June</span><span>July</span><span>August</span><span>September</span><span>October</span><span>November</span><span>December</span></div><div class="mission-context-tip"><strong>💡 Una ventaja:</strong> la mayoría de los meses son palabras transparentes o muy parecidas al español. Prestale especial atención a <strong>January = enero</strong>, porque es el que más se diferencia.</div>' 
      },
      {
        "title": "👀 Observa",
        "html": "<p>No necesitás memorizar todo de una vez. Primero buscá qué meses te resultan transparentes porque se parecen al español.</p><p><strong>January = enero.</strong> Prestale especial atención porque su forma es menos transparente.</p><div class=\"mission-context-tip\"><strong>💡 Curiosidad:</strong> en inglés, los meses del año se escriben <strong>SIEMPRE</strong> con la primera letra en mayúscula.</div>"
      }
    ],
    "questions": [
      {"id":"h12q1","topic":"January","review":"January","points":1,"text":"How do you say enero in English? <span class=\"small\">(¿Cómo se dice enero en inglés?)</span>","options":["January","June","July"],"correct":"January"},
      {"id":"h12q2","topic":"Transparent month","review":"October","points":1,"text":"Which word clearly looks like octubre? <span class=\"small\">(¿Cuál se parece claramente a octubre?)</span>","options":["October","January","May"],"correct":"October"},
      {"id":"h12q3","topic":"August","review":"August","points":1,"text":"Which month corresponds to agosto? <span class=\"small\">(¿Qué mes corresponde a agosto?)</span>","options":["August","April","December"],"correct":"August"},
      {"id":"h12q4","topic":"December","review":"December","points":1,"text":"Choose diciembre in English. <span class=\"small\">(Elegí diciembre en inglés.)</span>","options":["December","September","February"],"correct":"December"},
      {"id":"h12q5","topic":"Month recognition","review":"months of the year","points":1,"text":"Which one is a month of the year? <span class=\"small\">(¿Cuál es un mes del año?)</span>","options":["March","Monday","Green"],"correct":"March"}
    ],
    "closing": "🎉 ¡Excelente! Usaste las semejanzas con el español para reconocer los meses."
  }
];



const PARTS_FACE_BASE = {
  contentKey:"parts-head-face", revision:1, icon:"🙂",
  intro:"Vamos a aprender y repasar las partes de la cabeza y la cara.",
  sections:[
    {title:"📖 Aprende",html:'<div class="face-vocab-grid"><span>Head <small>cabeza</small></span><span>Face <small>cara</small></span><span>Hair <small>cabello</small></span><span>Eyes <small>ojos</small></span><span>Nose <small>nariz</small></span><span>Mouth <small>boca</small></span><span>Teeth <small>dientes</small></span><span>Ears <small>orejas</small></span></div><div class="mission-context-tip"><strong>💡 ¿Sabías que...?</strong> Un diente se dice <strong>tooth</strong>; varios dientes se dicen <strong>teeth</strong>. Además, <strong>eyebrows</strong> significa <strong>cejas</strong>: es una palabra nueva para sumar al vocabulario.</div>'},
    {title:"👀 Observa",html:'<div class="mission-character-observe face-character-observe"><div class="face-character-crop"><img src="parts-head-face-card.jpg" alt="Personaje de Mission English para Parts of the Head and Face"></div><div class="character-word-list"><b>head · cabeza</b><b>face · cara</b><b>hair · cabello</b><b>eyes · ojos</b><b>nose · nariz</b><b>mouth · boca</b><b>teeth · dientes</b><b>ears · orejas</b><b class="bonus-word">eyebrows · cejas</b></div></div><p class="small">Observá la cabeza y la cara del personaje de Mission English y relacioná cada palabra con la parte correspondiente.</p>'}
  ],
  questions:[
    {id:"faceq1",topic:"Eyes",review:"parts of the face",points:1,text:'Which word means ojos? <span class="small">(¿Qué palabra significa ojos?)</span>',options:["eyes","ears","teeth"],correct:"eyes"},
    {id:"faceq2",topic:"Nose",review:"parts of the face",points:1,text:'Which part do you use to smell? <span class="small">(¿Qué parte usás para oler?)</span>',options:["nose","mouth","teeth"],correct:"nose"},
    {id:"faceq3",topic:"Mouth",review:"parts of the face",points:1,text:'Choose boca in English. <span class="small">(Elegí boca en inglés.)</span>',options:["mouth","face","teeth"],correct:"mouth"},
    {id:"faceq4",topic:"Ears",review:"parts of the face",points:1,text:'Which word means orejas? <span class="small">(¿Qué palabra significa orejas?)</span>',options:["ears","eyes","head"],correct:"ears"},
    {id:"faceq5",topic:"Teeth",review:"parts of the face",points:1,text:'One tooth or many teeth? <span class="small">(¿Un diente o varios dientes?)</span>',options:["One tooth","Many teeth"],correct:"Many teeth"}
  ],
  closing:"🎉 ¡Muy bien! Repasaste las partes de la cabeza y la cara."
};

const PARTS_BODY_BASE = {
  contentKey:"parts-body", revision:2, icon:"🧍",
  intro:"Vamos a aprender las partes principales del cuerpo y, al mismo tiempo, repasar algunas palabras de Head and Face.",
  sections:[
    {title:"📖 Aprende",html:'<p><strong>Repaso de Head and Face:</strong> head, eyes, ear, nose, mouth y hair también son partes del cuerpo.</p><div class="body-vocab-grid"><span>Head <small>cabeza</small></span><span>Eyes <small>ojos</small></span><span>Ear <small>oreja</small></span><span>Nose <small>nariz</small></span><span>Mouth <small>boca</small></span><span>Hair <small>cabello</small></span><span>Neck <small>cuello</small></span><span>Shoulder <small>hombro</small></span><span>Back <small>espalda</small></span><span>Arm <small>brazo</small></span><span>Elbow <small>codo</small></span><span>Hand <small>mano</small></span><span>Finger <small>dedo de la mano</small></span><span>Chest <small>pecho</small></span><span>Stomach <small>panza / estómago</small></span><span>Leg <small>pierna</small></span><span>Knee <small>rodilla</small></span><span>Ankle <small>tobillo</small></span><span>Foot <small>pie</small></span></div>'},
    {title:"🌟 Connections · Conexiones",html:'<p><strong>Back</strong> = espalda. Esa palabra también aparece en <strong>backpack</strong>.</p><p><strong>Knee</strong> se pronuncia aproximadamente como <em>“ni”</em>: la letra <strong>k</strong> no se pronuncia.</p><p><strong>Foot</strong> = un pie. Su plural irregular es <strong>feet</strong> = pies.</p>'},
    {title:"👀 Observa",html:'<div class="mission-character-observe body-character-observe"><div class="body-character-full"><img src="parts-body-card.jpg" alt="Personaje de Mission English para Parts of the Body"></div><div class="character-word-list body-word-list"><b>head · cabeza</b><b>hair · cabello</b><b>eyes · ojos</b><b>ear · oreja</b><b>nose · nariz</b><b>mouth · boca</b><b>neck · cuello</b><b>shoulder · hombro</b><b>back · espalda</b><b>arm · brazo</b><b>elbow · codo</b><b>hand · mano</b><b>finger · dedo</b><b>chest · pecho</b><b>stomach · estómago</b><b>leg · pierna</b><b>knee · rodilla</b><b>ankle · tobillo</b><b>foot · pie</b></div></div><p class="small">Usá el personaje de cuerpo entero para ubicar cada parte. Las palabras de Head and Face aparecen nuevamente como repaso.</p>'}
  ],
  questions:[
    {id:"bodyq1",topic:"Shoulder",review:"parts of the body",points:1,text:'Which word means hombro? <span class="small">(¿Qué palabra significa hombro?)</span>',options:["shoulder","finger","ankle"],correct:"shoulder"},
    {id:"bodyq2",topic:"Hand",review:"parts of the body",points:1,text:'Which part has fingers? <span class="small">(¿Qué parte tiene dedos?)</span>',options:["hand","knee","back"],correct:"hand"},
    {id:"bodyq3",topic:"Knee",review:"parts of the body",points:1,text:'Choose rodilla in English. <span class="small">(Elegí rodilla en inglés.)</span>',options:["knee","neck","foot"],correct:"knee"},
    {id:"bodyq4",topic:"Foot",review:"parts of the body",points:1,text:'One foot, two...? <span class="small">(Un pie: foot. Dos pies: ¿...?)</span>',options:["feet","foots","fingers"],correct:"feet"},
    {id:"bodyq5",topic:"Back",review:"parts of the body",points:1,text:'Which word in backpack also means espalda? <span class="small">(¿Qué palabra de backpack también significa espalda?)</span>',options:["back","pack","bag"],correct:"back"}
  ],
  closing:"🎉 ¡Excelente! Practicaste las partes del cuerpo y repasaste Head and Face."
};

function cloneMissionBase_(base, extra){
  return {...base,...extra,sections:(base.sections||[]).map(x=>({...x})),questions:(base.questions||[]).map(q=>({...q,id:`${extra.id}-${q.id}`}))};
}
const GRADE45_EXTENDED_MISSIONS = [
  cloneMissionBase_(PARTS_FACE_BASE,{id:"parts-face-g45-v1",number:13,title:"MISIÓN 13 – Parts of the Head and Face",visual:"face",defaultLocked:false}),
  cloneMissionBase_(PARTS_BODY_BASE,{id:"parts-body-g45-v1",number:14,title:"MISIÓN 14 – Parts of the Body",visual:"body",defaultLocked:false}),
  {id:"review-11-14-g45-v1",number:15,title:"MISIÓN 15 – Review Missions 11–14",contentKey:"review-11-14",revision:2,icon:"✅",visual:"review-11-14",defaultLocked:true,intro:"Vamos a repasar Days of the Week, Months of the Year, Parts of the Head and Face y Parts of the Body.",sections:[{title:"🧠 Recordemos",html:'<div class="review-topics-grid"><span>📅 <strong>Days of the Week</strong></span><span>🗓️ <strong>Months of the Year</strong></span><span>🙂 <strong>Head and Face</strong></span><span>🧍 <strong>Body</strong></span></div><p>Leé cada pregunta con calma. Si algo no sale, podés volver a la Mission correspondiente y practicar otra vez.</p>'}],questions:[{id:"r151",topic:"Days review",review:"Days of the Week",points:1,text:'Which word is a day of the week? <span class="small">(¿Cuál palabra es un día de la semana?)</span>',options:["Wednesday","January","shoulder"],correct:"Wednesday"},{id:"r152",topic:"Months review",review:"Months of the Year",points:1,text:'Which word is a month? <span class="small">(¿Cuál palabra es un mes?)</span>',options:["October","Friday","ankle"],correct:"October"},{id:"r153",topic:"Face review",review:"Parts of the Head and Face",points:1,text:'Which part is on your face? <span class="small">(¿Qué parte está en tu cara?)</span>',options:["nose","knee","shoulder"],correct:"nose"},{id:"r154",topic:"Body review",review:"Parts of the Body",points:1,text:'Which part bends in the middle of your leg? <span class="small">(¿Qué parte se dobla en el medio de la pierna?)</span>',options:["knee","ear","mouth"],correct:"knee"},{id:"r155",topic:"Integrated review",review:"Missions 11–14",points:1,text:'Choose the group with one day, one month and one body part. <span class="small">(Elegí el grupo con un día, un mes y una parte del cuerpo.)</span>',options:["Monday · March · hand","January · April · June","nose · ear · foot"],correct:"Monday · March · hand"}],closing:"🎉 ¡Review completado! Podés volver a practicar cualquiera de las Missions 11–14 cuando quieras."}
];
const GRADE6_EXTENDED_MISSIONS = [
  {
 id:"classroom-objects-g6-v1",number:13,grades:["5","6"],
 title:"MISIÓN 13 – Classroom Objects",icon:"🎒",visual:"objects",defaultLocked:false,
 intro:"Repasamos los objetos del aula que ya conocés.",
 sections:[{title:"👀 Observa y recordá",html:`<p><strong>Hoy vamos a repasar Classroom Objects.</strong> Mirá cada ilustración y recordá qué significa cada palabra. Primero repasamos solamente el vocabulario.</p>
 <div class="classroom-vocab-grid">
 <div class="vocab-tile"><div class="vocab-illustration"><img class="classroom-object-img" src="images/classroom-objects/pen.jpg" alt="Pen"></div><b>pen</b><span>lapicera</span></div><div class="vocab-tile"><div class="vocab-illustration">📄</div><b>paper</b><span>papel</span></div><div class="vocab-tile"><div class="vocab-illustration">✏️</div><b>pencil</b><span>lápiz</span></div><div class="vocab-tile"><div class="vocab-illustration">📕</div><b>book</b><span>libro</span></div>
 <div class="vocab-tile"><div class="vocab-illustration"><img class="classroom-object-img marker-img" src="images/classroom-objects/marker.png" alt="Marker"></div><b>marker</b><span>marcador / fibrón</span></div><div class="vocab-tile"><div class="vocab-illustration">📏</div><b>ruler</b><span>regla</span></div><div class="vocab-tile"><div class="vocab-illustration"><span class="obj-draw obj-eraser"></span></div><b>eraser</b><span>goma de borrar</span></div><div class="vocab-tile"><div class="vocab-illustration">🖍️</div><b>crayon</b><span>crayón</span></div>
 <div class="vocab-tile"><div class="vocab-illustration"><img class="classroom-object-img liquid-paper-img" src="images/classroom-objects/liquid-paper.jpg" alt="Liquid paper"></div><b>liquid paper</b><span>corrector líquido</span></div><div class="vocab-tile"><div class="vocab-illustration"><img class="classroom-object-img" src="images/classroom-objects/pencil-sharpener.jpg" alt="Pencil sharpener"></div><b>pencil sharpener</b><span>sacapuntas</span></div><div class="vocab-tile"><div class="vocab-illustration"><img class="classroom-object-img" src="images/classroom-objects/pencil-case.jpg" alt="Pencil case"></div><b>pencil case</b><span>cartuchera</span></div><div class="vocab-tile"><div class="vocab-illustration"><span class="obj-draw obj-colored-pencil"></span></div><b>colored pencil</b><span>lápiz de color</span></div>
 <div class="vocab-tile"><div class="vocab-illustration">🎒</div><b>backpack</b><span>mochila</span></div><div class="vocab-tile"><div class="vocab-illustration">✂️</div><b>scissors</b><span>tijera / tijeras</span></div><div class="vocab-tile"><div class="vocab-illustration"><img class="classroom-object-img plasticola-img" src="images/classroom-objects/plasticola.jpg" alt="Plasticola"></div><b>glue</b><span>plasticola</span></div>
 <div class="vocab-tile"><div class="vocab-illustration"><span class="obj-draw obj-table"></span></div><b>table</b><span>mesa</span></div><div class="vocab-tile"><div class="vocab-illustration">🪑</div><b>chair</b><span>silla</span></div><div class="vocab-tile"><div class="vocab-illustration"><img class="classroom-object-img desk-img" src="images/classroom-objects/desk.jpg" alt="Desk"></div><b>desk</b><span>escritorio del teacher</span></div></div>
 <div class="did-you-know-card"><strong>💡 ¿Sabías que...?</strong>
<p>Después de recordar el vocabulario, hay algo importante que vamos a empezar a practicar.</p>
<p><strong>A</strong> se usa cuando podemos contar un objeto, como por ejemplo: <strong>a pen</strong> (una lapicera), <strong>a book</strong> (un libro), etc.</p>
<p>Y <strong>AN</strong> se usa cuando la palabra que le sigue comienza con una vocal, como por ejemplo: <strong>an eraser</strong>.</p>
<p>Algunas palabras funcionan diferente. Como la palabra <strong>glue</strong>, como no se puede contar, decimos <strong>glue</strong>; al igual que agua, se dice <strong>water</strong>.</p>
<p>Y <strong>scissors</strong> se usa en plural.</p>
<div class="countability-mini"><div><b>Contable</b><span>a table</span><span>an eraser</span></div><div><b>Incontable</b><span>glue</span><small>Puedo contar el envase, pero no la plasticola que está adentro.</small></div><div><b>Plural</b><span>scissors</span><small>Como en español, decimos: “Tengo tijeras”.</small></div></div>
<p><strong>Luego lo seguiremos practicando.</strong></p>
<p class="read-tip">👀 <strong>¡RECORDÁ leer siempre los tips!</strong> Pueden ayudarte a responder las preguntas.</p></div>`}],
 questions:[
 {id:"m13-q1",topic:"Vocabulary",review:"classroom objects",points:1,text:'Which word means <strong>lapicera</strong>? <span class="small">(¿Qué palabra significa lapicera?)</span>',options:["pen","pencil","marker"],correct:"pen"},
 {id:"m13-q2",topic:"Transparent words",review:"transparent words",points:1,text:'Which classroom object is a <strong>transparent word</strong>? <span class="small">(¿Cuál se parece mucho al español?)</span>',options:["crayon","ruler","glue"],correct:"crayon"},
 {id:"m13-q3",topic:"Transparent words",review:"transparent words",points:1,text:'Which other expression is similar to Spanish? <span class="small">(¿Cuál otra expresión se parece al español?)</span>',options:["liquid paper","pencil case","backpack"],correct:"liquid paper"},
 {id:"m13-q4",topic:"Recognition",review:"scissors",points:1,type:"truefalse",visual:"✂️",text:'These are scissors. <span class="small">(Estas son scissors.)</span>',correct:"True"},
 {id:"m13-q5",topic:"A or AN",review:"a/an",points:1,text:'Choose the correct option. <span class="small">(Elegí la opción correcta.)</span>',options:["an eraser","a eraser","eraser a"],correct:"an eraser"},
 {id:"m13-q6",topic:"Glue",review:"glue",points:1,text:'Which option is the one we normally use? <span class="small">(¿Cuál es la forma que usamos normalmente?)</span>',options:["glue","a glue","an glue"],correct:"glue"},
 {id:"m13-q7",topic:"Furniture",review:"table chair desk",points:1,text:'Which three words are classroom furniture? <span class="small">(¿Cuáles tres palabras son muebles del aula?)</span>',options:["table · chair · desk","pen · paper · book","glue · ruler · scissors"],correct:"table · chair · desk"},
 {id:"m13-q8",topic:"Recognition",review:"colored pencil",points:1,type:"truefalse",visual:"🟦✏️",text:'This can be a colored pencil. <span class="small">(Esto puede ser un lápiz de color.)</span>',correct:"True"}]},
  {id:"verb-it-g6-v1",number:14,title:"MISIÓN 14 – Verb To Be · It",visual:"it-be",defaultLocked:true,sections:[],questions:[]},
  {id:"review-11-14-g6-v1",number:15,title:"MISIÓN 15 – Review Missions 11–14",contentKey:"review-11-14-g6",revision:2,icon:"✅",visual:"review-11-14",defaultLocked:true,intro:"Repaso de Days of the Week, Months of the Year, Classroom Objects y Verb To Be · It.",sections:[{title:"🧠 Review",html:'<div class="review-topics-grid"><span>📅 <strong>Days</strong></span><span>🗓️ <strong>Months</strong></span><span>🎒 <strong>Classroom Objects</strong></span><span>✏️ <strong>It is / It\'s</strong></span></div><p>Usá lo que aprendiste en Missions 11–14. Esta Mission tiene más práctica para 6.º.</p>'}],questions:[{id:"r15g61",topic:"Days",review:"Days of the Week",points:1,text:'Is Wednesday a day or a month? <span class="small">(¿Wednesday es un día o un mes?)</span>',options:["A day","A month"],correct:"A day"},{id:"r15g62",topic:"Months",review:"Months of the Year",points:1,text:'Which one is a month? <span class="small">(¿Cuál es un mes?)</span>',options:["September","Saturday","pencil"],correct:"September"},{id:"r15g63",topic:"Classroom Objects",review:"Classroom Objects",points:1,text:'Which object is used to erase? <span class="small">(¿Qué objeto se usa para borrar?)</span>',options:["eraser","ruler","book"],correct:"eraser"},{id:"r15g64",topic:"Verb To Be It",review:"It is / It\'s",points:1,text:'Choose the correct sentence. <span class="small">(Elegí la oración correcta.)</span>',options:["It is a pen.","It am a pen.","It are a pen."],correct:"It is a pen."},{id:"r15g65",topic:"OR question",review:"Classroom Objects + It",points:1,text:'Is it a pencil or a ruler? ✏️ <span class="small">(¿Es un lápiz o una regla?)</span>',options:["It is a pencil.","It is a ruler."],correct:"It is a pencil."},{id:"r15g66",topic:"Transfer",review:"Missions 11–14",points:1,text:'Choose the sentence that describes a classroom object. <span class="small">(Elegí la oración que describe un objeto del aula.)</span>',options:["It\'s a blue book.","Tuesday is a month.","January is a ruler."],correct:"It\'s a blue book."}],closing:"🎉 ¡Review completado! Seguí practicando lo que necesites de Missions 11–14."},
  {id:"size-colors-g6-v1",number:16,title:"MISIÓN 16 – Adjectives: Size + Colors",visual:"size-colors",defaultLocked:true,sections:[],questions:[]},
  {id:"this-that-g6-v1",number:17,title:"MISIÓN 17 – This and That",visual:"this-that",defaultLocked:true,sections:[],questions:[]},
  cloneMissionBase_(PARTS_FACE_BASE,{id:"parts-face-g6-v1",number:18,title:"MISIÓN 18 – Parts of the Head and Face",visual:"face",defaultLocked:false}),
  cloneMissionBase_(PARTS_BODY_BASE,{id:"parts-body-g6-v1",number:19,title:"MISIÓN 19 – Parts of the Body",visual:"body",defaultLocked:false}),
  {id:"review-16-19-g6-v1",number:20,title:"MISIÓN 20 – Review Missions 16–19",visual:"review-16-19",defaultLocked:true,sections:[],questions:[]},
  {id:"verb-to-be-g6-v1",number:21,title:"MISIÓN 21 – Verb To Be",visual:"to-be",defaultLocked:true,sections:[],questions:[]}
];
function studentMissionCatalog_(){
  const grade6=String(state.student?.grade||"").trim()==="6";
  return [...missions,...(grade6?GRADE6_EXTENDED_MISSIONS:GRADE45_EXTENDED_MISSIONS)];
}


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
function renderGuidedPracticeInline_(){
  const practice=document.getElementById("practicePanel");
  if(practice && practice.dataset.guidedOpen==="true"){
    practice.innerHTML=guidedPracticeView();
    practice.hidden=false;
    bindEvents();
    return true;
  }
  return false;
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
  saveState();
  const practice=document.getElementById("practicePanel");
  if(practice){
    practice.dataset.guidedOpen="true";
    practice.innerHTML=guidedPracticeView();
    practice.hidden=false;
    bindEvents();
    practice.scrollIntoView({behavior:"smooth",block:"nearest"});
  }else{
    state.route="practice-guided";
    render();
  }
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
    return `<section class="card guided-practice-card guided-stage-one">
      <div class="guided-topbar">
        <button class="practice-next-button guided-back-practice" data-action="guided-exit" aria-label="${missionsText_("Back to Practice","Volver a Practice")}">←</button>
        <div class="practice-progress">1 / 3 &nbsp; · &nbsp; ${guidedPractice.index+1} / ${total}</div>
      </div>
      <div class="guided-home-banner">
        <span class="guided-home-badge">${guidedPractice.type==="colors"?'🎨':'🔢'}</span>
        <div><strong>${guidedPractice.type==="colors"?'Colors':'Numbers 1–10'}</strong><small>${missionsText_("Look · Listen · Practice","Mirá · Escuchá · Practicá")}</small></div>
      </div>
      <div class="guided-single-visual">${guidedVisual_(item,false)}</div>
      <div class="guided-stage1-controls">
        <button class="secondary-button guided-prev-button" data-action="guided-prev-stage1" aria-label="${missionsText_("Previous","Anterior")}" ${guidedPractice.index===0?'disabled':''}>◀</button>
        <button class="practice-listen-button guided-speaker" data-action="guided-listen" data-word="${escapeHtml(spoken)}" aria-label="${missionsText_("Listen","Escuchar")}">🔊</button>
        <button class="practice-next-button" data-action="guided-next-stage1" aria-label="${missionsText_("Next","Siguiente")}">▶</button>
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

  // Paso 3: conserva la práctica creada originalmente en v1.6.0.
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
  const selectedAvatar=savedAvatar_(state.student);
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
      <p>🔊 El audio se usa en Listening y en prácticas específicas. Las Missions no tienen audio por ahora.</p>
      <p>📖 Antes de responder, leé la explicación de cada misión: está hecha para ayudarte.</p>
      <p>🏠 En Home no importa si tenés que salir un momento o ayudar en casa. Volvé cuando puedas y seguí.</p>
    </div>

    <div class="learning-goal-note">
      🎯 <strong>Lo importante no es terminar rápido.</strong> Lo importante es entender, practicar y aprender.
    </div>

    <div class="button-row home-intro-final-actions">
      <button class="primary-button" data-action="finish-home-intro">✓ Leí la introducción — Ir a misiones</button>
      <button class="secondary-button avatar-reveal-button" data-action="toggle-avatar-chooser">${selectedAvatar?`Avatar ${selectedAvatar}`:"Elegir mi avatar"}</button>
    </div>
    <div class="home-avatar-chooser" id="homeAvatarChooser" hidden>
      <div class="home-avatar-chooser-copy">
        <strong>Elegí una imagen para representarte</strong>
        <span>Podés elegir cualquiera. No cambia tus resultados ni tu progreso.</span>
      </div>
      <div class="home-avatar-options" role="group" aria-label="Elegir avatar">
        ${HOME_AVATARS.map(a=>`<button type="button" class="home-avatar-choice ${selectedAvatar===a?"selected":""}" data-action="choose-avatar" data-avatar="${a}" aria-label="Elegir ${a}">${a}</button>`).join("")}
      </div>
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
  const grades = [...new Set(rosterStudents().map(s => String(s.grade || "").trim()).filter(g=>g==="6"))]
    .sort((a,b) => a.localeCompare(b, "es", { numeric:true }));
  const gradeOptions = grades.map(g => `<option value="${escapeHtml(g)}" ${String(state.student.grade)===g?"selected":""}>${escapeHtml(g)}</option>`).join("");
  const schoolValue = state.student.institution || savedHomeSchool();

  return `<section class="card identity-entry-card">
    <div class="eyebrow">Home</div>
    <h2>¿Quién va a practicar?</h2>
    <p>Podés escribir <strong>tu primer nombre</strong> y, si tenés uno registrado, también tu <strong>apodo</strong>.</p>
    <div class="identity-home-note">👤 Home es individual. Elegí siempre tus propios datos.<br><strong>Por ahora, el acceso de alumnos está habilitado únicamente para 6.º grado.</strong></div>

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

      <div class="field full identity-main-actions">
        <div class="button-row">
          <button type="button" class="secondary-button" data-action="go-home">Volver</button>
          <button type="submit" class="primary-button">Continuar</button>
        </div>
      </div>

      <details class="field full tester-access-box compact-tester">
        <summary>🧪 Tester autorizado</summary>
        <div class="tester-compact-body">
          <p><strong>Tester:</strong> persona autorizada para probar el funcionamiento del programa y dar feedback. Este modo no es para alumnos.</p>
          <div class="tester-pin-row">
            <input id="testerPin" type="password" inputmode="text" autocomplete="off" placeholder="PIN de Tester" aria-label="PIN de Tester">
            <button type="button" class="secondary-button" data-action="tester-unlock">Autorizar</button>
          </div>
          <div id="testerPinStatus" class="tester-pin-status">🔒 Acceso bloqueado.</div>
          <div class="tester-authorized-controls">
            <label>Grado <select id="testerGradeSelect" disabled><option value="4">4.º</option><option value="5">5.º</option><option value="6" selected>6.º</option></select></label>
            <button type="button" class="secondary-button tester-login-button" data-action="tester-login" data-tester="0" disabled>Tester 1</button>
            <button type="button" class="secondary-button tester-login-button" data-action="tester-login" data-tester="1" disabled>Tester 2</button>
            <button type="button" class="secondary-button tester-login-button" data-action="tester-login" data-tester="2" disabled>Tester 3</button>
          </div>
        </div>
      </details>
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
function getMissionDrafts() {
  try { return JSON.parse(localStorage.getItem(MISSION_DRAFTS_KEY)) || {}; }
  catch { return {}; }
}
function missionDraft_(missionId) {
  const sid=state.student?.id; if(!sid||!missionId)return null;
  return getMissionDrafts()?.[sid]?.[missionId] || null;
}
function saveMissionDraft_(mission) {
  const sid=state.student?.id; if(!sid||!mission)return;
  const all=getMissionDrafts(); all[sid]=all[sid]||{};
  const answers={}; (mission.questions||[]).forEach(q=>{if(state.answers?.[q.id]!==undefined)answers[q.id]=state.answers[q.id];});
  if(!Object.keys(answers).length)return;
  all[sid][mission.id]={answers,optionOrders:state.optionOrders||{},questionVariants:state.questionVariants||{},savedAt:new Date().toISOString()};
  localStorage.setItem(MISSION_DRAFTS_KEY,JSON.stringify(all));
}
function clearMissionDraft_(missionId) {
  const sid=state.student?.id; if(!sid||!missionId)return;
  const all=getMissionDrafts(); if(all[sid]){delete all[sid][missionId];localStorage.setItem(MISSION_DRAFTS_KEY,JSON.stringify(all));}
}
function restoreMissionDraft_(mission) {
  const draft=missionDraft_(mission?.id); if(!draft)return false;
  state.answers={...state.answers,...(draft.answers||{})};
  state.optionOrders={...state.optionOrders,...(draft.optionOrders||{})};
  state.questionVariants={...state.questionVariants,...(draft.questionVariants||{})};
  return true;
}
function firstPendingMissionIndex() {
  const progress = studentProgress();
  const idx = studentMissionCatalog_().findIndex(m => !progress[m.id]);
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


function missionLabelForPracticeTopic_(topic){
  const key=String(topic||"").toLowerCase();
  for(const m of studentMissionCatalog_()){
    const qs=m.questions||[];
    if(qs.some(q=>String(q.topic||"").toLowerCase()===key || String(q.review||"").toLowerCase()===key)){
      return `Mission ${m.number}`;
    }
  }
  return "Mission to review";
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
    <div class="practice-chips">${list.map(x=>`<span><b>${escapeHtml(x[0])}</b><small>Volvé a practicar: ${escapeHtml(missionLabelForPracticeTopic_(x[0]))}</small></span>`).join("")}</div>
  </div>`;
}


// Weekly Quick Vote reminder belongs in ESL Teacher Manager; Home only renders the active weekly poll.
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
  if (isHomeTester_() && !testerBackendTrackingEnabled_()) {
    quickVoteStats.myChoice=choice;
    quickVoteStats.choices={...(quickVoteStats.choices||{}),[choice]:Number(quickVoteStats.choices?.[choice]||0)+1};
    quickVoteStats.total=Number(quickVoteStats.total||0)+1;
    const box=document.getElementById("quickVoteResults"); if(box) box.innerHTML=quickVoteResultsHtml();
    return;
  }
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


const HOME_MISSION_VISUALS = {
  "m1": {base:"images/home-missions/approved-cards/m1-date.jpg", grade6:"images/home-missions/approved-cards/m1-date.jpg"},
  "m2": {base:"images/home-missions/approved-cards/m2-greetings.jpg", grade6:"images/home-missions/approved-cards/m2-greetings.jpg"},
  "m3": {base:"images/home-missions/approved-cards/m3-classroom-dashboard.jpg", grade6:"images/home-missions/approved-cards/m3-classroom-dashboard.jpg"},
  "m4": {base:"images/home-missions/approved-cards/m4-permission-dashboard.jpg", grade6:"images/home-missions/approved-cards/m4-permission-dashboard.jpg"},
  "review-1-4-v1": {base:"images/home-missions/approved-cards/m5-review.jpg", grade6:"images/home-missions/approved-cards/m5-review.jpg"},
  "colors-v1": {base:"images/home-missions/approved-cards/m6-colors-dashboard.jpg", grade6:"images/home-missions/approved-cards/m6-colors-dashboard.jpg"},
  "numbers-1-10-v1": {base:"images/home-missions/approved-cards/m7-numbers-dashboard.jpg", grade6:"images/home-missions/approved-cards/m7-numbers-dashboard.jpg"},
  "weather-temperature-v1": {base:"images/home-missions/approved-cards/m8-weather-dashboard.jpg", grade6:"images/home-missions/approved-cards/m8-weather-dashboard.jpg"},
  "numbers-11-20-v1": {base:"images/home-missions/approved-cards/m9-numbers-11-20-dashboard.jpg", grade6:"images/home-missions/approved-cards/m9-numbers-11-20-dashboard.jpg"},
  "mixed-review-colors-numbers-weather-v1": {base:"images/home-missions/approved-cards/m10-review.jpg", grade6:"images/home-missions/approved-cards/m10-review.jpg"},
  "days-of-week-v1": {base:"images/home-missions/approved-cards/m11-days-dashboard.jpg", grade6:"images/home-missions/approved-cards/m11-days-dashboard.jpg"},
  "months-of-year-v1": {base:"images/home-missions/approved-cards/m12-months-dashboard.jpg", grade6:"images/home-missions/approved-cards/m12-months-dashboard.jpg"},
  "parts-face-g45-v1": {base:"images/home-missions/approved-cards/m13-face-dashboard.jpg"},
  "parts-body-g45-v1": {base:"images/home-missions/approved-cards/m14-body-dashboard.jpg"},
  "review-11-14-g45-v1": {base:"images/home-missions/approved-cards/m15-review-11-14.jpg"},
  "classroom-objects-g6-v1": {base:"images/home-missions/approved-cards/m3-classroom-dashboard.jpg", grade6:"images/home-missions/approved-cards/m3-classroom-dashboard.jpg"},
  "verb-it-g6-v1": {base:"images/home-missions/approved-cards/m14-it.jpg", grade6:"images/home-missions/approved-cards/m14-it.jpg"},
  "review-11-14-g6-v1": {base:"images/home-missions/approved-cards/m15-review-11-14.jpg", grade6:"images/home-missions/approved-cards/m15-review-11-14.jpg"},
  "size-colors-g6-v1": {base:"images/home-missions/approved-cards/m16-size-dashboard.jpg", grade6:"images/home-missions/approved-cards/m16-size-dashboard.jpg"},
  "this-that-g6-v1": {base:"images/home-missions/approved-cards/m17-this-that.jpg", grade6:"images/home-missions/approved-cards/m17-this-that.jpg"},
  "parts-face-g6-v1": {base:"images/home-missions/approved-cards/m13-face-dashboard.jpg", grade6:"images/home-missions/approved-cards/m13-face-dashboard.jpg"},
  "parts-body-g6-v1": {base:"images/home-missions/approved-cards/m14-body-dashboard.jpg", grade6:"images/home-missions/approved-cards/m14-body-dashboard.jpg"},
  "review-16-19-g6-v1": {base:"images/home-missions/approved-cards/m20-review-16-19.jpg", grade6:"images/home-missions/approved-cards/m20-review-16-19.jpg"},
  "verb-to-be-g6-v1": {base:"images/home-missions/approved-cards/m21-to-be.jpg", grade6:"images/home-missions/approved-cards/m21-to-be.jpg"}
};

const GRADE6_EXTRA_QUESTIONS = {
  "m1":[
    {id:"h1g6q1",topic:"Date order",review:"orden de la fecha",points:1,text:"Is August a month or a weekday? <span class=\"small\">(¿August es un mes o un día de la semana?)</span>",options:["A month","A weekday"],correct:"A month"},
    {id:"h1g6q2",topic:"Date sentence",review:"estructura de la fecha",points:1,text:"Choose the best beginning for a date. <span class=\"small\">(Elegí el mejor comienzo para una fecha.)</span>",options:["Today is...","Good night...","Can I...?"],correct:"Today is..."}
  ],
  "m2":[
    {id:"h2g6q1",topic:"Night farewell",review:"Good night",points:1,text:"Is “Good night” for arriving or saying goodbye? <span class=\"small\">(¿Es para llegar o despedirse?)</span>",options:["Arriving","Saying goodbye"],correct:"Saying goodbye"},
    {id:"h2g6q2",topic:"Evening greeting",review:"Good evening",points:1,text:"You arrive in the evening. Which expression fits? <span class=\"small\">(Llegás por la tarde-noche. ¿Cuál corresponde?)</span>",options:["Good evening!","Good night!","See you!"],correct:"Good evening!"}
  ],
  "m3":[
    {id:"h3g6q1",topic:"Stand up",review:"Stand up",points:1,text:"Does “Stand up” mean sit down or get up? <span class=\"small\">(¿Significa sentarse o ponerse de pie?)</span>",options:["Sit down","Get up"],correct:"Get up"},
    {id:"h3g6q2",topic:"Following instructions",review:"instrucciones de clase",points:1,text:"The teacher points to the board. Choose the instruction.",options:["Look.","Copy.","Stop."],correct:"Look."}
  ],
  "m4":[
    {id:"h4g6q1",topic:"Polite requests",review:"please",points:1,text:"Is “please” polite or impolite? <span class=\"small\">(¿Please es amable o descortés?)</span>",options:["Polite","Impolite"],correct:"Polite"},
    {id:"h4g6q2",topic:"Polite full request",review:"pedido completo",points:1,text:"Choose the request you could use with the teacher.",options:["Excuse me. Can I go to the toilet, please?","Toilet!","Go toilet."],correct:"Excuse me. Can I go to the toilet, please?"}
  ],
  "review-1-4-v1":[
    {id:"h5g6q1",topic:"Greetings review",review:"saludos",points:1,text:"Is “Good evening” a greeting or a classroom instruction? <span class=\"small\">(¿Es un saludo o una instrucción?)</span>",options:["A greeting","A classroom instruction"],correct:"A greeting"},
    {id:"h5g6q2",topic:"Permission review",review:"pedir permiso",points:1,text:"Which one asks for permission?",options:["Can I... ?","Stand up.","Goodbye!"],correct:"Can I... ?"}
  ],
  "colors-v1":[
    {id:"h6g6q1",topic:"Colors",review:"colores",points:1,text:"Is purple a color or a number? <span class=\"small\">(¿Purple es un color o un número?)</span>",options:["A color","A number"],correct:"A color"},
    {id:"h6g6q2",topic:"Color comprehension",review:"reconocer colores",points:1,text:"Choose the sentence that matches a green object. <span class=\"small\">(Elegí la oración que corresponde a un objeto verde.)</span>",options:["It is green.","It is seven.","It is rainy."],correct:"It is green."}
  ],
  "numbers-1-10-v1":[
    {id:"h7g6q1",topic:"Numbers 1–10",review:"números 1–10",points:1,text:"Is eight a number or a color? <span class=\"small\">(¿Eight es un número o un color?)</span>",options:["A number","A color"],correct:"A number"},
    {id:"h7g6q2",topic:"Number comprehension",review:"números 1–10",points:1,text:"Choose the number word for 6.",options:["six","seven","ten"],correct:"six"}
  ],
  "weather-temperature-v1":[
    {id:"h8g6q1",topic:"Weather",review:"weather",points:1,text:"Is sunny weather or a number? <span class=\"small\">(¿Sunny es clima o un número?)</span>",options:["Weather","A number"],correct:"Weather"},
    {id:"h8g6q2",topic:"Weather comprehension",review:"weather",points:1,text:"You see rain outside. Choose the best word. <span class=\"small\">(Ves lluvia afuera. Elegí la mejor palabra.)</span>",options:["rainy","sunny","hot"],correct:"rainy"}
  ],
  "numbers-11-20-v1":[
    {id:"h9g6q1",topic:"Numbers 11–20",review:"números 11–20",points:1,text:"Is fourteen 14 or 40? <span class=\"small\">(¿Fourteen es 14 o 40?)</span>",options:["14","40"],correct:"14"},
    {id:"h9g6q2",topic:"Number comprehension",review:"números 11–20",points:1,text:"Choose the word for 18.",options:["eighteen","eight","eighty"],correct:"eighteen"}
  ],
  "mixed-review-colors-numbers-weather-v1":[
    {id:"h10g6q1",topic:"Mixed review",review:"repaso mixto",points:1,text:"Is blue a color or weather? <span class=\"small\">(¿Blue es un color o clima?)</span>",options:["A color","Weather"],correct:"A color"},
    {id:"h10g6q2",topic:"Integrated comprehension",review:"usar lo aprendido",points:1,text:"Choose the option that contains a number and a weather word. <span class=\"small\">(Elegí la opción que contiene un número y una palabra del clima.)</span>",options:["twelve + rainy","green + purple","Monday + January"],correct:"twelve + rainy"}
  ],
  "days-of-week-v1":[
    {id:"h11g6q1",topic:"Days of the week",review:"days of the week",points:1,text:"Is Tuesday a day or a month? <span class=\"small\">(¿Tuesday es un día o un mes?)</span>",options:["A day","A month"],correct:"A day"},
    {id:"h11g6q2",topic:"Days pattern",review:"DAY",points:1,text:"Does every day end in DAY or MONTH? <span class=\"small\">(¿Todos los días terminan en DAY o MONTH?)</span>",options:["DAY","MONTH"],correct:"DAY"}
  ],
  "months-of-year-v1":[
    {id:"h12g6q1",topic:"Months of the year",review:"months of the year",points:1,text:"Is October a month or a weekday? <span class=\"small\">(¿October es un mes o un día de la semana?)</span>",options:["A month","A weekday"],correct:"A month"},
    {id:"h12g6q2",topic:"January",review:"January = enero",points:1,text:"Choose the English word for enero. <span class=\"small\">(Elegí la palabra en inglés para enero.)</span>",options:["January","June","July"],correct:"January"}
  ],
  "classroom-objects-g6-v1":[
    {id:"objg6q1",topic:"Classroom objects OR",review:"classroom objects",points:1,visualHtml:'<div class="question-object-visual"><span class="obj-draw obj-ruler-large"></span></div>',text:"Is it a ruler or a pencil? <span class=\"small\">(¿Es una regla o un lápiz?)</span>",options:["It is a ruler.","It is a pencil."],correct:"It is a ruler."},
    {id:"objg6q2",topic:"Classroom objects production",review:"classroom objects",points:1,text:"Choose the best sentence for 📘. <span class=\"small\">(Elegí la mejor oración para 📘.)</span>",options:["It is a book.","It is glue.","It is a ruler."],correct:"It is a book."}
  ],
  "parts-face-g6-v1":[
    {id:"faceg6q1",topic:"Face OR",review:"parts of the face",points:1,text:"Are these eyes or ears? 👀 <span class=\"small\">(¿Son ojos u orejas?)</span>",options:["They are eyes.","They are ears."],correct:"They are eyes."},
    {id:"faceg6q2",topic:"Face transfer",review:"parts of the face",points:1,text:"Choose the word you can connect with seeing. <span class=\"small\">(Elegí la palabra que relacionás con ver.)</span>",options:["eyes","nose","hair"],correct:"eyes"}
  ],
  "parts-body-g6-v1":[
    {id:"bodyg6q1",topic:"Body OR",review:"parts of the body",points:1,text:"Is this a hand or a foot? ✋ <span class=\"small\">(¿Es una mano o un pie?)</span>",options:["It is a hand.","It is a foot."],correct:"It is a hand."},
    {id:"bodyg6q2",topic:"Body transfer",review:"parts of the body",points:1,text:"Choose the part that bends in the middle of your leg. <span class=\"small\">(Elegí la parte que se dobla en el medio de la pierna.)</span>",options:["knee","elbow","neck"],correct:"knee"}
  ]
};

function addMissionExerciseVisual_(mission){
  if(!mission || !Array.isArray(mission.questions) || !mission.questions.length || !mission.homeImage) return mission;
  if(!mission.questions.some(q=>q.image)){
    const qs=mission.questions.map((q,i)=> i===0 ? {...q,image:mission.homeImage,imageAlt:`Apoyo visual de ${mission.title.replace(/^MISIÓN\s*\d+\s*[–-]\s*/i,"")}`} : q);
    return {...mission,questions:qs};
  }
  return mission;
}


const HOME_MORE_PRACTICE = {
 "m1":[
  {id:"homeplus-m1-tf",topic:"Date order",review:"orden de la fecha",points:1,type:"truefalse",visual:"📅 SEPTEMBER 9",text:'In English, the month comes before the number in this date. <span class="small">(En inglés, el mes aparece antes del número en esta fecha.)</span>',correct:"True"},
  {id:"homeplus-m1-2",topic:"Date sentence",review:"escribir la fecha",points:1,text:'Choose the complete sentence. <span class="small">(Elegí la oración completa.)</span>',options:["Today is Monday.","Today Monday.","Is Monday today."],correct:"Today is Monday."}],
 "m2":[
  {id:"homeplus-m2-tf",topic:"Greetings",review:"saludos",points:1,type:"truefalse",visual:"👋 HI!",text:'“Hi” is an informal greeting. <span class="small">(“Hi” es un saludo informal.)</span>',correct:"True"},
  {id:"homeplus-m2-2",topic:"Greetings",review:"saludos",points:1,text:'You are leaving. What can you say? <span class="small">(Te estás yendo. ¿Qué podés decir?)</span>',options:["See you later.","Good morning.","Hello."],correct:"See you later."}],
 "m3":[
  {id:"homeplus-m3-tf",topic:"Classroom English",review:"instrucciones de clase",points:1,type:"truefalse",visual:"👂",text:'“Listen” means escuchar. <span class="small">(“Listen” significa escuchar.)</span>',correct:"True"},
  {id:"homeplus-m3-2",topic:"Classroom English",review:"instrucciones de clase",points:1,text:'The teacher says “Sit down.” What should you do? <span class="small">(El teacher dice “Sit down”. ¿Qué tenés que hacer?)</span>',options:["Sentarte.","Pararte.","Hablar."],correct:"Sentarte."}],
 "m4":[
  {id:"homeplus-m4-tf",topic:"Polite requests",review:"pedidos amables",points:1,type:"truefalse",visual:"📚",text:'“Can I go to the library, please?” is a polite request. <span class="small">(Es un pedido amable.)</span>',correct:"True"},
  {id:"homeplus-m4-2",topic:"School places",review:"lugares de la escuela",points:1,text:'Where can you find many books? <span class="small">(¿Dónde podés encontrar muchos libros?)</span>',options:["library","kitchen","office"],correct:"library"}],
 "review-1-4-v1":[
  {id:"homeplus-m5-tf",topic:"Review",review:"Missions 1–4",points:1,type:"truefalse",visual:"✅ 1 · 2 · 3 · 4",text:'This Review practices Missions 1–4. <span class="small">(Este repaso practica Missions 1–4.)</span>',correct:"True"},
  {id:"homeplus-m5-2",topic:"Review",review:"Missions 1–4",points:1,text:'Choose a classroom instruction. <span class="small">(Elegí una instrucción del aula.)</span>',options:["Listen.","September.","Purple."],correct:"Listen."}],
 "colors-v1":[
  {id:"homeplus-m6-tf",topic:"Yellow",review:"yellow",points:1,type:"truefalse",visual:"🟡",text:'It’s yellow. <span class="small">(Es amarillo.)</span>',correct:"True"},
  {id:"homeplus-m6-2",topic:"Colors",review:"colores",points:1,text:'Choose the color of grass. <span class="small">(Elegí el color del pasto.)</span>',options:["green","purple","orange"],correct:"green"}],
 "numbers-1-10-v1":[
  {id:"homeplus-m7-tf",topic:"Eight spelling",review:"cómo escribir eight",points:1,type:"truefalse",visual:"8️⃣",text:'8 is spelled “eight”. <span class="small">(El 8 se escribe “eight”.)</span>',correct:"True"},
  {id:"homeplus-m7-2",topic:"Numbers 1–10",review:"números 1–10",points:1,text:'What comes after six? <span class="small">(¿Qué viene después de six?)</span>',options:["seven","five","ten"],correct:"seven"}],
 "weather-temperature-v1":[
  {id:"homeplus-m8-tf",topic:"Weather",review:"weather",points:1,type:"truefalse",visual:"🌧️",text:'It’s rainy. <span class="small">(Está lluvioso.)</span>',correct:"True"},
  {id:"homeplus-m8-2",topic:"Weather",review:"weather",points:1,text:'Choose the best word for ☀️. <span class="small">(Elegí la mejor palabra.)</span>',options:["sunny","rainy","cloudy"],correct:"sunny"}],
 "numbers-11-20-v1":[
  {id:"homeplus-m9-tf",topic:"Numbers 11–20",review:"números 11–20",points:1,type:"truefalse",visual:"1️⃣7️⃣",text:'17 is seventeen. <span class="small">(17 es seventeen.)</span>',correct:"True"},
  {id:"homeplus-m9-2",topic:"Numbers 11–20",review:"números 11–20",points:1,text:'Which number is nineteen? <span class="small">(¿Qué número es nineteen?)</span>',options:["19","9","90"],correct:"19"}],
 "mixed-review-colors-numbers-weather-v1":[
  {id:"homeplus-m10-tf",topic:"Mixed review",review:"repaso mixto",points:1,type:"truefalse",visual:"🔵 12 🌧️",text:'Blue, twelve and rainy belong to topics from Missions 6–9. <span class="small">(Pertenecen a temas de Missions 6–9.)</span>',correct:"True"},
  {id:"homeplus-m10-2",topic:"Mixed review",review:"repaso mixto",points:1,text:'Choose the weather word. <span class="small">(Elegí la palabra del clima.)</span>',options:["cloudy","thirteen","red"],correct:"cloudy"}],
 "days-of-week-v1":[
  {id:"homeplus-m11-tf",topic:"Days capitalization",review:"days of the week",points:1,type:"truefalse",visual:"📅 Monday",text:'In English, days of the week begin with a capital letter. <span class="small">(En inglés, los días empiezan con mayúscula.)</span>',correct:"True"},
  {id:"homeplus-m11-2",topic:"Days of the week",review:"days of the week",points:1,text:'Which one is NOT a day? <span class="small">(¿Cuál NO es un día?)</span>',options:["January","Friday","Sunday"],correct:"January"}],
 "months-of-year-v1":[
  {id:"homeplus-m12-tf",topic:"Months capitalization",review:"months of the year",points:1,type:"truefalse",visual:"🗓️ October",text:'In English, months begin with a capital letter. <span class="small">(En inglés, los meses empiezan con mayúscula.)</span>',correct:"True"},
  {id:"homeplus-m12-2",topic:"Months",review:"months of the year",points:1,text:'Which month comes after September? <span class="small">(¿Qué mes viene después de September?)</span>',options:["October","August","Monday"],correct:"October"}],
 "classroom-objects-g6-v1":[
  {id:"homeplus-m13-tf",topic:"Classroom objects",review:"classroom objects",points:1,type:"truefalse",visualHtml:'<div class="question-object-visual ruler-focus"><span class="obj-draw obj-ruler-large"></span></div>',text:'It is a ruler. <span class="small">(Es una regla.)</span>',correct:"True"},
  {id:"homeplus-m13-2",topic:"Classroom objects",review:"classroom objects",points:1,text:'Which object do you use to stick paper? <span class="small">(¿Qué objeto usás para pegar papel?)</span>',options:["glue","eraser","ruler"],correct:"glue"}],
 "parts-face-g6-v1":[
  {id:"homeplus-m18-tf",topic:"Face",review:"parts of the face",points:1,type:"truefalse",visual:"👄",text:'This is a mouth. <span class="small">(Esto es una boca.)</span>',correct:"True"},
  {id:"homeplus-m18-2",topic:"Face",review:"parts of the face",points:1,text:'Which part do you use to hear? <span class="small">(¿Qué parte usás para escuchar?)</span>',options:["ears","eyes","nose"],correct:"ears"}],
 "parts-body-g6-v1":[
  {id:"homeplus-m19-tf",topic:"Body",review:"parts of the body",points:1,type:"truefalse",visual:"🦶",text:'This is a foot. <span class="small">(Esto es un pie.)</span>',correct:"True"},
  {id:"homeplus-m19-2",topic:"Body",review:"parts of the body",points:1,text:'What is the plural of foot? <span class="small">(¿Cuál es el plural de foot?)</span>',options:["feet","foots","foot"],correct:"feet"}]
};

function missionForStudent_(mission){
  if(!mission) return mission;
  const grade6=String(state.student?.grade||"").trim()==="6";
  const visual=HOME_MISSION_VISUALS[mission.id]||{};
  let copy={...mission, homeImage: grade6?(visual.grade6||visual.base):visual.base, questions:[...(mission.questions||[])]};
  if(grade6){
    const extras=mission.id==="classroom-objects-g6-v1"?[]:(GRADE6_EXTRA_QUESTIONS[mission.id]||[]);
    const core=[...(copy.questions||[])];
    if(extras.length>=2 && core.length>=4){
      copy.questions=[core[2],core[0],extras[0],core[3],core[1],extras[1]].filter(Boolean);
    } else if(core.length>=6){
      copy.questions=[core[2],core[0],core[4],core[3],core[1],core[5],...core.slice(6)].filter(Boolean);
    } else {
      copy.questions=[...core,...extras].filter(Boolean);
    }
  }
  if(grade6){
    const more=mission.id==="classroom-objects-g6-v1"?[]:(HOME_MORE_PRACTICE[mission.id]||[]);
    const existing=new Set((copy.questions||[]).map(q=>q.id));
    copy.questions=[...(copy.questions||[]),...more.filter(q=>!existing.has(q.id))];
  }
  return copy;
}

function sectionLockedForStudent_(sectionKey){
  const key=courseKey(state.student);
  const course=bootstrapData.missionPermissions?.[key];
  if(!course || !course.sections) return false;
  return course.sections[sectionKey]===false;
}

function missionEnabledForStudent(mission) {
  if(!isHomeTester_() && String(state.student?.grade||"").trim()==="6"){
    return [2,4,13].includes(Number(mission?.number));
  }
  const key=courseKey(state.student);
  const course=bootstrapData.missionPermissions?.[key];
  const value=course?.[String(mission.number||state.currentMission+1)];
  if(mission?.defaultLocked) return value===true;
  if(!course) return true;
  return value!==false;
}



function normalizeMissionVideoUrl(rawUrl) {
  const raw=String(rawUrl||"").trim();
  // Local videos packaged with Mission English Home (for example Cloudy.mp4).
  // They must work both when Home is opened locally and when it is published on GitHub Pages.
  if (/^(?!https?:\/\/)(?:\.\/)?[^?#]+\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(raw)) {
    return {type:"video",url:raw.startsWith("./") ? raw : `./${raw}`};
  }
  if(!/^https:\/\//i.test(raw)) return null;
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
  const localCloudy = `
    <div class="short-video-item">
      <strong>Cloudy</strong>
      <span class="small">Weather · Mission 8 · Un momento gracioso de un teacher</span>
      <button class="primary-button" data-action="open-local-video" data-video-src="Cloudy.mp4" data-video-title="Cloudy">▶ Ver video</button>
    </div>`;

  const teacherVideos = videos.map((v, index) => `
    <div class="short-video-item">
      <strong>${escapeHtml(v.title || "Short video")}</strong>
      ${v.translation ? `<span class="small">(${escapeHtml(v.translation)})</span>` : ""}
      ${v.note ? `<span class="small">${escapeHtml(v.note)}</span>` : ""}
      <button class="primary-button" data-action="open-teacher-video" data-video-index="${index}">▶ Ver video</button>
    </div>
  `).join("");
  return localCloudy + teacherVideos;
}

function openTeacherVideo(index) {
  const videos=homeVideosForStudent(),video=videos[Number(index)]; if(!video||!video.embedUrl)return;
  const panel=document.getElementById("shortVideoPlayer"),title=document.getElementById("shortVideoTitle"),host=document.getElementById("shortVideoFrameHost"); if(!panel||!host)return;
  if(title)title.textContent=video.title||"Short video";
  if(!renderMissionVideo_(host,video.embedUrl))host.innerHTML=`<div class="short-video-empty"><strong>Este video no es compatible con Mission English.</strong><br><span class="small">El teacher debe elegir un video que se reproduzca dentro de la aplicación.</span></div>`;
  panel.hidden=false;panel.scrollIntoView({behavior:"smooth",block:"center"});
}



const CLASSROOM_OBJECTS_GRADE6_HOME = {
  number:13,
  title:"Classroom Objects",
  vocabulary:[
    ["pen","lapicera / bolígrafo"],["pencil","lápiz"],["pencil case","cartuchera"],["paper","papel"],
    ["glue","pegamento"],["eraser","goma de borrar"],["marker","marcador"],["liquid paper","corrector líquido"],
    ["backpack","mochila"],["crayon","crayón"],["ruler","regla"],["book","libro"],["colored pencils","lápices de colores"]
  ],
  note:"In British English, eraser can also be called rubber. En inglés británico, a la goma de borrar también se le puede decir rubber.",
  questions:[
    {text:"Which object do you use to write with ink? (¿Qué objeto usás para escribir con tinta?)",options:["pen","ruler","glue"],correct:"pen"},
    {text:"Which object keeps your pencils together? (¿Qué objeto guarda juntos tus lápices?)",options:["pencil case","paper","book"],correct:"pencil case"},
    {text:"Is a ruler for measuring or erasing? (¿Una regla sirve para medir o borrar?)",options:["measuring","erasing"],correct:"measuring",type:"OR"},
    {text:"Which object would you use to correct a written mistake? (¿Qué objeto usarías para corregir un error escrito?)",options:["liquid paper","crayon","backpack"],correct:"liquid paper"}
  ]
};

function missionSceneHtml_(mission, grade6=false, locked=false) {
  const id=String(mission?.id||"");
  const number=Number(mission?.number||0);
  const mapped=HOME_MISSION_VISUALS[id];
  if(mapped){const src=grade6?(mapped.grade6||mapped.base):mapped.base; if(src) return `<img src="${src}" alt="${escapeHtml(mission?.title||'Mission')}">${locked?`<div class="scene-lock">🔒</div>`:""}`;}
  const sceneClass={
    "m1":"date","m3":"classroom","m4":"permission","review-1-4-v1":"review-1-4",
    "colors-v1":"colors","numbers-1-10-v1":"numbers10","weather-temperature-v1":"weather",
    "numbers-11-20-v1":"numbers20","mixed-review-colors-numbers-weather-v1":"review-6-9",
    "days-of-week-v1":"days","months-of-year-v1":"months"
  }[id] || mission?.visual || "review";
  let visual="";
  if(sceneClass==="classroom") visual=`<div class="scene-classroom-english"><span class="shh">🤫</span><span class="sit">🧍<b>↓</b></span><span class="look">👁️<b>→ ▭</b></span><span class="listen">👂</span></div>`;
  else if(sceneClass==="permission") visual=`<div class="scene-permission-can"><strong>Can I...?</strong><div><span title="restroom">🚻</span><span title="library">📚</span><span title="office">🏢</span><span title="kitchen">🍽️</span></div></div>`;
  else if(sceneClass.startsWith("review")){
    const labels=sceneClass==="review-1-4"?["DATE","GREETINGS","CLASS","CAN I…?"]:sceneClass==="review-6-9"?["COLORS","NUMBERS","WEATHER","11–20"]:sceneClass==="review-11-14"?["DAYS","MONTHS","FACE","BODY"]:["SIZE","THIS/THAT","FACE","BODY"];
    visual=`<div class="scene-review-checklist"><div class="review-paper">${labels.map((x,i)=>`<span><b>✓</b>${x}</span>`).join("")}</div><i>🔎</i></div>`;
  }
  else if(sceneClass==="weather") visual=`<div class="scene-weather-pro"><span>☀️</span><span>☁️</span><span>🌧️</span><span>❄️</span><b>🌡️</b></div>`;
  else if(sceneClass==="days") visual=`<div class="scene-calendar-pro"><div class="calendar-rings">● ●</div><strong>WEEK</strong><div class="calendar-days-mini">M T W T F S S</div><small>every day → <b>DAY</b></small></div>`;
  else if(sceneClass==="months") visual=`<div class="scene-calendar-pro months"><div class="calendar-rings">● ●</div><strong>YEAR</strong><div class="month-grid-mini"><i>JAN</i><i>APR</i><i>JUL</i><i>OCT</i></div><small>12 months</small></div>`;
  else if(sceneClass==="face") visual=`<img src="parts-head-face-card.jpg" alt="Mission English character showing parts of the head and face">`;
  else if(sceneClass==="body") visual=`<img src="parts-body-card.jpg" alt="Mission English character showing parts of the body">`;
  else if(sceneClass==="objects") visual=`<div class="scene-objects-pro"><span>✏️</span><span>🖊️</span><span>📏</span><span>📘</span><span>🎒</span><span>🖍️</span></div>`;
  else {
    const old={date:`<div class="scene-calendar"><b>TODAY</b><strong>29</strong><span>MONDAY · JUNE</span></div>`,colors:`<div class="scene-color-chips"><i></i><i></i><i></i><i></i><i></i><i></i></div>`,numbers10:`<div class="scene-number-line">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<span>${n}</span>`).join("")}</div>`,numbers20:`<div class="scene-number-cards">${[11,12,13,14,15,16,17,18,19,20].map(n=>`<span>${n}</span>`).join("")}</div>`,"it-be":`<div class="scene-it-be"><span>✏️</span><b>It is …</b></div>`,"size-colors":`<div class="scene-size-colors"><span class="big-pencil">✏️</span><span class="small-pencil">✏️</span><i></i><i></i><i></i></div>`,"this-that":`<div class="scene-this-that"><span class="near">📘<b>THIS</b></span><span class="far">✏️<b>THAT</b></span></div>`,"to-be":`<div class="scene-to-be"><span>I</span><span>YOU</span><span>HE</span><span>SHE</span><span>IT</span></div>`};
    visual=old[sceneClass]||`<div class="scene-review-checklist"><div class="review-paper"><span><b>✓</b>REVIEW</span></div></div>`;
  }
  return `<div class="mission-scene ${grade6?"grade6-scene":""} scene-${escapeHtml(sceneClass)}">${visual}${locked?`<div class="scene-lock">🔒</div>`:""}</div>`;
}

function mapView() {
  const progress = studentProgress();
  const school = state.student.institution || savedHomeSchool() || "Mission English";
  const grade = gradeLabel(state.student.grade);
  const studentName = firstNameOrNickname(state.student) || "Student";
  const initial = (studentName.trim()[0] || "S").toUpperCase();
  const badgeClasses=["badge-green","badge-blue","badge-purple","badge-orange","badge-teal","badge-pink","badge-gold","badge-cyan","badge-indigo","badge-red"];

  const missionCatalog = studentMissionCatalog_();
  const existingMissionCards = missionCatalog.map((m, i) => {
    const mm=missionForStudent_(m);
    const p=progress[m.id], enabled=missionEnabledForStudent(m), draft=missionDraft_(m.id);
    const isOptional=Number(m.number)===4 && enabled && !p && !draft;
    const status=enabled
      ? (p ? missionsText_("↻ Practice again","↻ Practicar otra vez")
          : (draft ? missionsText_("▶ Continue","▶ Continuar")
          : (isOptional ? missionsText_("◇ Optional","◇ Opcional") : missionsText_("▷ Start","▷ Comenzar"))))
      : missionsText_("🔒 Locked","🔒 Bloqueada");
    const statusClass=enabled ? (p?"status-repeat":(draft?"status-continue":"status-start")) : "status-locked";
    const title=m.title.replace(/^MISIÓN\s*\d+\s*[–-]\s*/i,"");
    return `<article class="dashboard-mission-card ${enabled?"available":"future-card"}">
      <div class="mission-card-heading">
        <div class="mission-number-badge ${badgeClasses[i%badgeClasses.length]}">${escapeHtml(String(m.number || i+1))}</div>
        <h3>${escapeHtml(title)}</h3>
      </div>
      <div class="mission-card-image">
        ${missionSceneHtml_(m, String(state.student?.grade||"").trim()==="6", !enabled)}
      </div>
      <div class="mission-status-strip ${statusClass}">${status}</div>
      ${enabled?`<button class="mission-card-hit" data-action="open-mission" data-index="${i}" aria-label="Abrir ${escapeHtml(title)}"></button>`:""}
    </article>`;
  }).join("");

  const missionCards = existingMissionCards;

  return `<section class="home-dashboard">
    ${homeworkReminderNeedsPopup_()?`
    <div class="homework-reminder-overlay" role="dialog" aria-modal="true" aria-labelledby="homeworkReminderTitle">
      <div class="homework-reminder-card">
        <div class="homework-reminder-icon">📋</div>
        <h2 id="homeworkReminderTitle">¡Tenés una tarea asignada!</h2>
        <p>Antes de empezar, revisá qué tenés que hacer y la fecha límite.</p>
        <div class="homework-reminder-deadline">📅 <strong>Martes 1.º de septiembre · 12:00 PM (mediodía)</strong></div>
        <p class="homework-reminder-location">Cuando cierres este mensaje, podés volver a ver tu tarea cuando quieras desde el botón <strong>📋 Tarea</strong> en la parte superior.</p>
        <button type="button" class="homework-reminder-close" data-action="close-homework-reminder">Entendido</button>
      </div>
    </div>`:""}
    <div class="home-dashboard-top">
      <a class="dashboard-brand" href="#home" data-action="go-home" aria-label="Mission English Home">
        <img src="mission-english-home-logo.png" alt="Mission English Home">
      </a>
      <div class="student-profile-summary">
        <div class="student-avatar-placeholder" title="Avatar del alumno">${savedAvatar_(state.student)?`<span class="student-avatar-emoji">${savedAvatar_(state.student)}</span>`:`<span class="student-initial">${escapeHtml((studentName.trim().charAt(0)||"?").toUpperCase())}</span>`}</div>
        <div><strong>¡Hola, ${escapeHtml(studentName)}!</strong><span>${String(grade).trim().startsWith("6")?'<span class="grade-cap">🎓</span> ':""}${escapeHtml(grade)}</span></div>
      </div>
      <div class="homework-mini-wrap">
        <button type="button" class="homework-mini-trigger ${homeworkReminderApplies_()?"tarea-assigned":""}" data-action="toggle-homework-mini" aria-expanded="false">📋 Tarea</button>
        <div id="homeworkMiniPopover" class="homework-popover" hidden>
          <strong>Tu tarea · 6.º grado</strong>
          <div class="homework-mini-list">
            <div><strong>Obligatorio:</strong></div>
            <div>✓ Mission 2 · Greetings</div>
            <div>✓ Mission 13 · Classroom Objects</div>
            <div>✓ Hacer la encuesta · Quick Vote</div>
            <div>✓ Escuchar el audio · Listening</div>
            <div>✓ Ver el video · Short Video</div>
            <div class="homework-deadline"><strong>📅 Deadline / Fecha límite:</strong><br>Martes 1.º de septiembre · 12:00 PM (mediodía)</div>
          </div>
        </div>
      </div>
      <details class="account-menu">
        <summary class="header-action account-summary">↪ <span>Cambiar estudiante<br>/ Cerrar sesión</span></summary>
        <div class="account-menu-popover">
          <button data-action="change-student">Cambiar estudiante</button>
          <button data-action="sign-out">Cerrar sesión</button>
        </div>
      </details>
    </div>

    <nav class="home-dashboard-nav" aria-label="Navegación de Mission English Home">
      <button data-action="dashboard-home"><span class="nav-home-logo-crop"><img src="images/ui/home-tab-house.png" alt=""></span><span>Home</span></button>
      <button class="active" data-action="dashboard-missions"><span class="nav-icon">🎯</span> <span>Missions</span></button>
      <button data-action="dashboard-explore"><img class="nav-icon-img" src="images/ui/rocket.svg" alt=""><span>${missionsText_("Explore & Practice","Explorar y Practicar")}</span></button>
      <div class="mission-language-switch" aria-label="Mission page language">
        <button type="button" class="${missionsPageLanguage_()==="en"?"selected":""}" data-action="mission-language" data-lang="en">EN</button>
        <span>|</span>
        <button type="button" class="${missionsPageLanguage_()==="es"?"selected":""}" data-action="mission-language" data-lang="es">ES</button>
      </div>
    </nav>

    <section class="missions-panel" id="missionsPanel">
      <div class="missions-title-row"><div><h2>🎯 Missions</h2><p>${missionsText_("Choose a Mission to start learning.","Elegí una misión para empezar a aprender.")}</p></div></div>
      <div class="dashboard-mission-grid">${missionCards}</div>
    </section>

    <section class="home-discovery" id="explorePanel">
      <h3><img class="section-rocket-icon" src="images/ui/rocket.svg" alt=""> ${missionsText_("Explore & Practice","Explorar y Practicar")}</h3>
      <div class="dashboard-extra-grid">
        <button class="explore-launcher" data-action="toggle-explore-panel" data-panel="listeningPanel"><img src="images/ui/headphones.svg" alt=""><span><strong>Listening</strong><small>${missionsText_("Listen and understand","Escuchar y comprender")}</small></span></button>
        <button class="explore-launcher" data-action="toggle-explore-panel" data-panel="quickVotePanel"><img src="images/ui/megaphone.svg" alt=""><span><strong>Quick Vote</strong><small>${missionsText_("Your opinion counts","Tu opinión cuenta")}</small></span></button>
        <button class="explore-launcher" data-action="toggle-explore-panel" data-panel="practicePanel"><img src="images/ui/target.svg" alt=""><span><strong>Practice</strong><small>${missionsText_("Practice at your pace","Practicá a tu ritmo")}</small></span></button>
        <button class="explore-launcher" data-action="toggle-explore-panel" data-panel="shortVideosPanel"><img src="images/ui/video.svg" alt=""><span><strong>Short Videos</strong><small>${missionsText_("Watch, enjoy and learn","Mirá, disfrutá y aprendé")}</small></span></button>
        <button class="explore-launcher" data-action="toggle-explore-panel" data-panel="kahootPanel"><img src="images/ui/kahoot.svg" alt=""><span><strong>Kahoots</strong><small>${missionsText_("Play and review","Jugá y repasá")}</small></span></button>
      </div>

      <div class="explore-detail" id="listeningPanel" hidden>
        <div class="explore-detail-head"><strong>🎧 Listening</strong><button class="secondary-button" data-action="close-explore-panels">${missionsText_("Close","Cerrar")}</button></div>
        <p><strong>Can I go to the toilet, please?</strong><br><span class="small">¿Puedo ir al baño, por favor?</span></p>
        <div class="audio-controls">
          ${sectionLockedForStudent_("listening")?`<button class="secondary-button" disabled>🔒 Bloqueado</button>`:`<button class="secondary-button" data-action="speak-useful">▶ Escuchar</button>`}
          <button class="secondary-button audio-rate ${homeAudioRate===1?"selected":""}" data-action="audio-rate" data-rate="1">1×</button>
          <button class="secondary-button audio-rate ${Math.abs(homeAudioRate-0.75)<0.01?"selected":""}" data-action="audio-rate" data-rate="0.75">🐢 0.75×</button>
        </div>
        <p class="listening-speed-tip">💡 Para escuchar el audio más lento, hacé click en <strong>0.75</strong> y luego presioná <strong>Play</strong> nuevamente.</p>
      </div>

      <div class="explore-detail" id="quickVotePanel" hidden>
        <div class="explore-detail-head"><strong>📣 Quick Vote · Encuesta semanal</strong><button class="secondary-button" data-action="close-explore-panels">${missionsText_("Close","Cerrar")}</button></div>
        <p><strong>What’s your favorite color?</strong><br><span class="small">¿Cuál es tu color favorito?</span></p>
        <div class="quick-vote-rule"><strong>Cada persona puede votar una sola vez.</strong></div>
        <div class="poll-buttons">${["blue","red","green","yellow","purple","orange"].map(c=>`<button class="secondary-button poll-choice" data-action="poll-vote" data-choice="${c}" ${quickVoteStats.myChoice?"disabled":""}>${c.charAt(0).toUpperCase()+c.slice(1)}</button>`).join("")}</div>
        <div id="quickVoteResults">${quickVoteResultsHtml()}</div>
      </div>

      <div class="explore-detail" id="practicePanel" hidden>
        <div class="explore-detail-head"><strong>🎯 Practice</strong><button class="secondary-button" data-action="close-explore-panels">${missionsText_("Close","Cerrar")}</button></div>
        <div class="practice-for-you">${homePracticeForYouHtml()}</div>
        <div class="extra-practice-box">
          <div class="extra-practice-heading"><span aria-hidden="true">🎨 1·2·3</span><div><strong>Prácticas extras</strong><small>Colores y números para practicar mirando y escuchando. Cualquier alumno puede usarlas.</small></div></div>
          <div class="differentiated-choice-grid extra-practice-grid">
            <article class="differentiated-choice-card visual-choice"><div class="practice-big-icon">🎨</div><h3>Colors</h3><button class="primary-button" data-action="guided-start" data-type="colors" aria-label="Practicar colores">▶</button></article>
            <article class="differentiated-choice-card visual-choice"><div class="practice-big-icon visual-numbers-icon">1 2 3</div><h3>Numbers 1–10</h3><button class="primary-button" data-action="guided-start" data-type="numbers" aria-label="Practicar números del 1 al 10">▶</button></article>
          </div>
        </div>
      </div>

      <div class="explore-detail" id="shortVideosPanel" hidden>
        <div class="explore-detail-head"><strong>🎬 Short Videos</strong><button class="secondary-button" data-action="close-explore-panels">${missionsText_("Close","Cerrar")}</button></div>
        <div id="shortVideoList">${shortVideosHtml()}</div>
        <div id="shortVideoPlayer" class="short-video-player" hidden><div class="short-video-head"><strong id="shortVideoTitle">🎬 Short Video</strong><button class="secondary-button" data-action="close-short-video">Cerrar</button></div><div id="shortVideoFrameHost"></div></div>
      </div>

      <div class="explore-detail" id="kahootPanel" hidden>
        <div class="explore-detail-head"><strong>Kahoots</strong><button class="secondary-button" data-action="close-explore-panels">${missionsText_("Close","Cerrar")}</button></div>
        <div class="kahoot-list">
          <a class="kahoot-card" href="https://kahoot.it/challenge/04563251?challenge-id=888d47f0-5a2c-45d1-90e2-eeaafa0fd751_1787587917893" target="_blank" rel="noopener"><span class="kahoot-k">K!</span><span><strong>Colors</strong><small>Mission 6 · Colores</small></span></a>
          <a class="kahoot-card" href="https://kahoot.it/challenge/02412575?challenge-id=888d47f0-5a2c-45d1-90e2-eeaafa0fd751_1787588019194" target="_blank" rel="noopener"><span class="kahoot-k">K!</span><span><strong>Spelling Colors</strong><small>Mission 6 · Deletreando colores</small></span></a>
          <a class="kahoot-card" href="https://kahoot.it/challenge/06972109?challenge-id=888d47f0-5a2c-45d1-90e2-eeaafa0fd751_1787588188996" target="_blank" rel="noopener"><span class="kahoot-k">K!</span><span><strong>What's the weather like?</strong><small>Mission 8 · ¿Cómo está el clima?</small></span></a>
          <a class="kahoot-card" href="https://kahoot.it/challenge/02854007?challenge-id=888d47f0-5a2c-45d1-90e2-eeaafa0fd751_1787602483812" target="_blank" rel="noopener"><span class="kahoot-k">K!</span><span><strong>Months of the Year</strong><small>Mission 12 · Meses del año</small></span></a>
        </div><p class="kahoot-deadline">⏰ Estos juegos vencen el sábado 5 de septiembre al mediodía.</p>
      </div>
    </section>

    <div class="dashboard-footer-note"><span class="footer-left">🌎 Mission: Learn English everyday.</span><span class="footer-center">Powered by <strong>WizPro</strong></span><span class="footer-right">Versión ${escapeHtml(APP_VERSION.replace("Home ",""))}</span></div>
  </section>`;
}

function missionIntroView() {
  const m = missionForStudent_(studentMissionCatalog_()[state.currentMission]);
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
  const mission = missionForStudent_(studentMissionCatalog_()[state.currentMission]);
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
  const m = missionForStudent_(studentMissionCatalog_()[state.currentMission]);
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
  const imageHtml = ""; // v1.6.0: exercise images temporarily disabled; Mission/Observe visuals remain.

  if (q.type === "truefalse") {
    const tfOptions=["True","False"];
    return `<fieldset class="question true-false-question"><legend>${questionText} <span class="small">(${q.points} punto)</span></legend>
      ${q.visualHtml || `<div class="tf-visual">${escapeHtml(q.visual||"")}</div>`}
      <div class="tf-options">
        ${tfOptions.map(opt=>`<label class="tf-option ${opt==="True"?"tf-true":"tf-false"}" data-action="choose-tf"><input type="radio" name="${q.id}" value="${opt}" ${value===opt?"checked":""} required><span class="tf-symbol">${opt==="True"?"✓":"×"}</span><b>${opt}</b></label>`).join("")}
      </div>
    </fieldset>`;
  }

  if (q.type === "text") {
    return `<fieldset class="question"><legend>${questionText} <span class="small">(${q.points} punto)</span></legend>
      ${imageHtml}
      <input name="${q.id}" value="${escapeHtml(value)}" required autocomplete="off" autocapitalize="none" spellcheck="false" /></fieldset>`;
  }

  const options = optionsForQuestion(q);
  return `<fieldset class="question"><legend>${questionText} <span class="small">(${q.points} ${q.points===1?"punto":"puntos"})</span></legend>
    ${imageHtml}
    <div class="option-grid">
    ${options.map(opt => `<label class="option">
      <input type="radio" name="${q.id}" value="${escapeHtml(opt)}" ${value===opt?"checked":""} required />
      <span>${opt}</span>
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
  const mission = missionForStudent_(studentMissionCatalog_()[state.currentMission]);
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

    <p>${missionForStudent_(studentMissionCatalog_()[state.currentMission]).closing}</p>

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
  const mission = missionForStudent_(studentMissionCatalog_()[state.currentMission]);
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
  if (!state.student?.id || !testerBackendTrackingEnabled_()) return;
  const m=missionForStudent_(studentMissionCatalog_()[state.currentMission])||{};
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
  document.querySelectorAll("[data-action]").forEach(el => {
    if(el.dataset.actionBound==="1") return;
    el.dataset.actionBound="1";
    el.addEventListener("click", async event => {
    const action = event.currentTarget.dataset.action;
    if (action && action.startsWith("dp-") && dpHandleAction(action, event.currentTarget)) return;
    if (action === "start-home") { state.forceHomeIntro=false; state.route = "identify"; saveState(); render(); }
    if (action === "first-time-home") { state.forceHomeIntro=true; state.route = "about-home"; saveState(); render(); }
    if (action === "about-home-continue") { state.forceHomeIntro=true; state.route = "identify"; saveState(); render(); }
    if (action === "go-home") { state.route = "home"; saveState(); render(); }
    if (action === "reload-roster") { await loadBootstrap(true); }
    if (action === "dashboard-home") { state.route="home"; saveState(); render(); return; }
    if (action === "close-homework-reminder") {
      closeHomeworkReminder_();
      document.querySelector(".homework-reminder-overlay")?.remove();
      document.querySelector(".homework-mini-trigger")?.focus();
      return;
    }
    if (action === "toggle-homework-mini") {
      const panel=document.getElementById("homeworkMiniPopover");
      if(panel){
        panel.hidden=!panel.hidden;
        event.currentTarget.setAttribute("aria-expanded",String(!panel.hidden));
        panel.classList.remove("mobile-safe-popover");
        panel.style.removeProperty("top");
        if(!panel.hidden && window.matchMedia("(max-width:760px)").matches){
          panel.classList.add("mobile-safe-popover");
          const triggerRect=event.currentTarget.getBoundingClientRect();
          const desiredTop=Math.max(10,Math.min(triggerRect.bottom+8,window.innerHeight-panel.offsetHeight-12));
          panel.style.top=`${desiredTop}px`;
        }
      }
      return;
    }
    if (action === "dashboard-missions") {
      document.querySelectorAll(".home-dashboard-nav > button").forEach(b=>b.classList.toggle("active",b.dataset.action==="dashboard-missions"));
      document.getElementById("missionsPanel")?.scrollIntoView({behavior:"smooth",block:"start"});
      return;
    }
    if (action === "dashboard-explore") {
      document.querySelectorAll(".home-dashboard-nav > button").forEach(b=>b.classList.toggle("active",b.dataset.action==="dashboard-explore"));
      const panel=document.getElementById("explorePanel");
      if(panel){
        if(!window.matchMedia("(max-width:760px)").matches) panel.scrollIntoView({behavior:"smooth",block:"end"});
        panel.classList.remove("explore-focus");
        void panel.offsetWidth;
        panel.classList.add("explore-focus");
        setTimeout(()=>panel.classList.remove("explore-focus"),900);
        setTimeout(()=>panel.querySelector(".explore-launcher")?.focus({preventScroll:true}),250);
      }
      return;
    }
    if (action === "mission-language") {
      setMissionsPageLanguage_(event.currentTarget.dataset.lang||"en");
      render();
      return;
    }
    if (action === "toggle-explore-panel") {
      const id=event.currentTarget.dataset.panel;
      document.querySelectorAll(".explore-detail").forEach(el=>{ if(el.id!==id) el.hidden=true; });
      const panel=document.getElementById(id);
      if(panel){
        panel.hidden=!panel.hidden;
        if(!panel.hidden && !window.matchMedia("(max-width:760px)").matches){
          panel.scrollIntoView({behavior:"smooth",block:"nearest"});
        }
      }
      return;
    }
    if (action === "poll-vote") { submitQuickVote(event.currentTarget.dataset.choice || ""); return; }
    if (action === "open-local-video") {
      const panel=document.getElementById("shortVideoPlayer"), title=document.getElementById("shortVideoTitle"), host=document.getElementById("shortVideoFrameHost");
      if(panel&&host){ if(title) title.textContent=event.currentTarget.dataset.videoTitle||"Short Video"; renderMissionVideo_(host,event.currentTarget.dataset.videoSrc||""); panel.hidden=false; panel.scrollIntoView({behavior:"smooth",block:"center"}); sendActivityEvent("short_video_opened",{detail:`Short Video abierto: ${event.currentTarget.dataset.videoTitle||"Short Video"}`}); }
      return;
    }
    if (action === "close-explore-panels") { document.querySelectorAll(".explore-detail").forEach(el=>el.hidden=true); return; }
    if (action === "choose-tf") {
      const input=event.currentTarget.querySelector('input[type="radio"]');
      if(input){ input.checked=true; input.dispatchEvent(new Event("change",{bubbles:true})); }
      return;
    }
    if (action === "tester-unlock") {
      const pinInput=document.getElementById("testerPin");
      const testerIndex=await testerPinIndex_(pinInput?.value||"");
      const ok=testerIndex>=0;
      homeTesterAuthorized=ok;
      homeTesterAuthorizedIndex=testerIndex;
      const status=document.getElementById("testerPinStatus");
      document.querySelectorAll(".tester-login-button").forEach(b=>{b.disabled=!ok || Number(b.dataset.tester)!==testerIndex;});
      const gradeSelect=document.getElementById("testerGradeSelect"); if(gradeSelect) gradeSelect.disabled=!ok;
      if(status){status.textContent=ok?`✓ Tester ${testerIndex+1} autorizado. Elegí el grado y continuá.`:"✕ PIN incorrecto. El modo Tester continúa bloqueado.";status.classList.toggle("authorized",ok);}
      if(!ok && pinInput){pinInput.value="";pinInput.focus();}
      return;
    }
    if (action === "tester-login") {
      if(!homeTesterAuthorized) return;
      const requestedTester=Number(event.currentTarget.dataset.tester||0);
      if(requestedTester!==homeTesterAuthorizedIndex) return;

      const tester=HOME_TESTERS[requestedTester]||HOME_TESTERS[0];
      const testerGrade=String(document.getElementById("testerGradeSelect")?.value||"6");
      state.student={...tester,grade:testerGrade,firstName:tester.displayName,lastName:"",level:"Tester",mode:"individual",partnerId:"",partner:"",isTester:true};
      // Testers must see the homework reminder on every new tester login so the
      // assigned-task experience can always be verified. Real students still see
      // it only once per assignment.
      try{ localStorage.removeItem(homeworkReminderKey_()); }catch{}
      // Quick Vote state must be isolated per tester. Otherwise a vote loaded for a previous
      // tester can leave myChoice set and prevent Tester 2/3 from sending their own vote.
      quickVoteStats = { total: 0, choices: {}, myChoice: "" };
      state.identityError=""; state.currentMission=0; state.route="map"; saveState(); render(); await loadBootstrap(true,true);
      await refreshQuickVoteResults();
      return;
    }
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
    if (action === "toggle-avatar-chooser") {
      const chooser=document.getElementById("homeAvatarChooser");
      if(chooser){ chooser.hidden=!chooser.hidden; if(!chooser.hidden) chooser.scrollIntoView({behavior:"smooth",block:"nearest"}); }
      return;
    }
    if (action === "choose-avatar") {
      saveAvatar_(event.currentTarget.dataset.avatar || "", state.student);
      saveState();
      render();
      return;
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
      const mission=missionForStudent_(studentMissionCatalog_()[state.currentMission]);
      const completed=!!studentProgress()[mission.id];
      clearCurrentMissionAnswers(); prepareMissionQuestionSet();
      if(completed){ clearMissionDraft_(mission.id); }
      else { restoreMissionDraft_(mission); }
      state.reviewConfirmed=false; state.missionExitCount=0; state.inactivityLogged=false; state.sessionNotice="";
      state.route="mission-intro"; saveState(); render();
    }
    if (action === "read-again") document.getElementById("missionReviewTop")?.scrollIntoView({behavior:"smooth",block:"start"});
    if (action === "confirm-read") {
      state.reviewConfirmed=true; state.missionStartedAt=new Date().toISOString(); state.route="mission"; saveState(); render(); startMissionAttentionTracking();
    }
    if (action === "speak-useful") {
      playUsefulEnglishAudio();
      sendActivityEvent("listening_played",{detail:`Listening reproducido a ${homeAudioRate}x`});
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
      const videoIndex=event.currentTarget.dataset.videoIndex || "0";
      const video=homeVideosForStudent()[Number(videoIndex)]||{};
      openTeacherVideo(videoIndex);
      sendActivityEvent("short_video_opened",{detail:`Short Video abierto: ${video.title||"Short Video"}`});
      event.currentTarget.blur();
    }
    if (action === "close-short-video") {
      const player = document.getElementById("shortVideoPlayer");
      const host = document.getElementById("shortVideoFrameHost");
      if (host) host.innerHTML = "";
      if (player) player.hidden = true;
    }
    if (action === "back-map") { state.route = "map"; saveState(); render(); refreshQuickVoteResults(); }
    if (action === "open-practice") { const p=document.getElementById("practicePanel"); if(p){document.querySelectorAll(".explore-detail").forEach(x=>x.hidden=true);p.hidden=false;p.scrollIntoView({behavior:"smooth",block:"nearest"});} else {state.route="practice-menu";saveState();render();} }
    if (action === "guided-start") {
      const practiceType=event.currentTarget.dataset.type||"practice";
      sendActivityEvent("practice_opened",{detail:`Practice iniciada: ${practiceType}`,practiceType});
      startGuidedPractice_(practiceType);
    }
    if (action === "guided-listen") {
      const word=String(event.currentTarget.dataset.word||"").trim();
      if(word){
        try{
          window.speechSynthesis?.cancel();
          const utter=new SpeechSynthesisUtterance(word);
          utter.lang="en-US";
          utter.rate=.82;
          const voices=window.speechSynthesis?.getVoices?.()||[];
          utter.voice=voices.find(v=>/^en-US/i.test(v.lang)) || voices.find(v=>/^en/i.test(v.lang)) || null;
          window.speechSynthesis?.speak(utter);
        }catch{ speakPracticeWord_(word); }
      }
      return;
    }
    if (action === "guided-prev-stage1") {
      if(guidedPractice.stage===1 && guidedPractice.index>0){
        guidedPractice.index--;
        saveState();
        if(!renderGuidedPracticeInline_()) render();
      }
      return;
    }
    if (action === "guided-next-stage1") {
      const source=guidedPracticeSource_(guidedPractice.type);
      if(guidedPractice.index+1 < source.length){
        guidedPractice.index++;
        saveState();
        if(!renderGuidedPracticeInline_()) render();
      } else {
        guidedPractice.stage=2;
        guidedMakeStage2Order_();
        guidedPrepareQuestion_();
        saveState();
        if(!renderGuidedPracticeInline_()) render();
      }
      return;
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
          sendActivityEvent("practice_completed",{detail:`Practice guiada completada: ${guidedPractice.type} · reconocimiento`,practiceType:guidedPractice.type,practiceMode:"guided"});
          guidedPractice.stage=3;
          guidedPractice.target=null;
          guidedPractice.options=[];
        }else{
          guidedPractice.target=null;
          guidedPrepareQuestion_();
        }
        guidedPractice.locked=false;
        saveState();
        if(!renderGuidedPracticeInline_()) render();
      },650);
    }
    if (action === "guided-final-start") {
      startDifferentiatedPractice(guidedPractice.type,event.currentTarget.dataset.mode||"audio");
    }
    if (action === "guided-exit") {
      guidedPractice={type:"",stage:0,index:0,order:[],target:null,options:[],locked:false};
      state.route="map"; saveState(); render();
      requestAnimationFrame(()=>{
        const practice=document.getElementById("practicePanel");
        if(practice){
          document.querySelectorAll(".explore-detail").forEach(x=>x.hidden=x.id!=="practicePanel");
          practice.hidden=false;
          practice.scrollIntoView({behavior:"smooth",block:"nearest"});
        }
      });
      return;
    }

    if (action === "practice-start") {
      const practiceType=event.currentTarget.dataset.type||"practice";
      const practiceMode=event.currentTarget.dataset.mode||"audio";
      sendActivityEvent("practice_opened",{detail:`Practice iniciada: ${practiceType} · ${practiceMode}`,practiceType,practiceMode});
      startDifferentiatedPractice(practiceType, practiceMode);
    }
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
      if(differentiatedPractice.index>=differentiatedPractice.items.length){
        sendActivityEvent("practice_completed",{detail:`Practice completada: ${differentiatedPractice.type} · ${differentiatedPractice.mode} · ${differentiatedPractice.correct}/${differentiatedPractice.items.length}`,practiceType:differentiatedPractice.type,practiceMode:differentiatedPractice.mode,correct:differentiatedPractice.correct,total:differentiatedPractice.items.length});
        state.route="practice-result";saveState();render();
      }
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
    });
  });

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

    if (grade !== "6") {
      state.identityError = "Por ahora Mission English Home está habilitado solamente para 6.º grado.";
      saveState(); render(); return;
    }

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
      clearMissionDraft_(result.mission.id);
      enqueueResult(result);
      state.route = "mission-result";
      saveState(); render();
      syncQueue(false);
    });
  }
}

function clearCurrentMissionAnswers() {
  const mission = missionForStudent_(studentMissionCatalog_()[state.currentMission]);
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
  saveMissionDraft_(missionForStudent_(studentMissionCatalog_()[state.currentMission]));
}
function enqueueResult(result) {
  if (!testerBackendTrackingEnabled_()) return;
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
