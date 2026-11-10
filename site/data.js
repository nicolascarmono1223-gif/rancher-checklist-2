/* Datos de la guía. Todo editable: añade o ajusta filas para tu partida. */

const SLIMES = [
  { id: "pink", name: "Pink Slime", emoji: "🩷", zone: "Todas las zonas", diet: "todo", favorite: "—", plort: "Pink Plort", risk: "bajo", valor: "comun", needs: [], note: "Come cualquier cosa: el comodín para tus primeros largos." },
  { id: "cotton", name: "Cotton Slime", emoji: "🤍", zone: "Rainbow Fields", diet: "verdura", favorite: "Water Lettuce", plort: "Cotton Plort", risk: "bajo", valor: "comun", needs: ["muros"], note: "Salta muchísimo: sube los muros del corral." },
  { id: "tabby", name: "Tabby Slime", emoji: "🐱", zone: "Rainbow Fields", diet: "carne", favorite: "Stony Hen", plort: "Tabby Plort", risk: "bajo", valor: "raro", needs: [], note: "Roba plorts del suelo si no lo alimentas a tiempo." },
  { id: "phosphor", name: "Phosphor Slime", emoji: "✨", zone: "Rainbow Fields (de noche)", diet: "fruta", favorite: "Cuberry", plort: "Phosphor Plort", risk: "medio", valor: "raro", needs: ["solar"], note: "No aguanta el sol: necesita techo o Solar Shield." },
  { id: "rock", name: "Rock Slime", emoji: "🪨", zone: "Rainbow Fields / Ember Valley", diet: "verdura", favorite: "Heart Beet", plort: "Rock Plort", risk: "medio", valor: "comun", needs: ["muros"], note: "Se enrolla y embiste cuando se agita." },
  { id: "honey", name: "Honey Slime", emoji: "🍯", zone: "Starlight Strand", diet: "fruta", favorite: "Mint Mango", plort: "Honey Plort", risk: "bajo", valor: "raro", needs: [], note: "Tranquilo y rentable; ideal para combinar con frutas." },
  { id: "crystal", name: "Crystal Slime", emoji: "💎", zone: "Starlight Strand / Ember Valley", diet: "verdura", favorite: "Odd Onion", plort: "Crystal Plort", risk: "alto", valor: "epico", needs: ["muros"], note: "Los cristales que genera dañan al tocarlos." },
  { id: "hunter", name: "Hunter Slime", emoji: "🎯", zone: "Starlight Strand", diet: "carne", favorite: "Roostro", plort: "Hunter Plort", risk: "alto", valor: "epico", needs: ["feral"], note: "Se vuelve feral si pasa hambre: visítalo seguido." },
  { id: "angler", name: "Angler Slime", emoji: "🐟", zone: "Starlight Strand", diet: "carne", favorite: "Sea Hen", plort: "Angler Plort", risk: "medio", valor: "raro", needs: [], note: "Atrae objetos con su luz." },
  { id: "flutter", name: "Flutter Slime", emoji: "🦋", zone: "Starlight Strand", diet: "nectar", favorite: "Moondew Nectar", plort: "Flutter Plort", risk: "medio", valor: "epico", needs: ["red"], note: "Vuela y solo come néctar: el slime más caro de alimentar." },
  { id: "batty", name: "Batty Slime", emoji: "🦇", zone: "Ember Valley (cuevas)", diet: "fruta", favorite: "Pomegranite", plort: "Batty Plort", risk: "medio", valor: "raro", needs: ["red"], note: "Vuela: corral con red superior o techo." },
  { id: "boom", name: "Boom Slime", emoji: "💥", zone: "Ember Valley", diet: "carne", favorite: "Briar Hen", plort: "Boom Plort", risk: "alto", valor: "raro", needs: ["muros"], note: "Explota cuando se agita: nunca lo dejes con hambre." },
  { id: "ringtail", name: "Ringtail Slime", emoji: "🦝", zone: "Starlight Strand", diet: "todo", favorite: "—", plort: "Ringtail Plort", risk: "medio", valor: "raro", needs: [], note: "De noche se convierte en gato y trepa por todo." },
  { id: "puddle", name: "Puddle Slime", emoji: "💧", zone: "Starlight Strand (estanques)", diet: "agua", favorite: "—", plort: "Puddle Plort", risk: "bajo", valor: "comun", needs: ["agua"], noLargo: true, note: "Necesita agua y no puede convertirse en largo." }
];

const RESOURCES = [
  { name: "Jellystone", type: "Minería", zone: "Rainbow Fields", goal: 10 },
  { name: "Strange Diamond", type: "Minería", zone: "Varias zonas", goal: 10 },
  { name: "Radiant Ore", type: "Minería", zone: "Ember Valley", goal: 10 },
  { name: "Indigonium", type: "Minería", zone: "Cuevas", goal: 10 },
  { name: "Primordy Oil", type: "Bomba", zone: "Ember Valley", goal: 10 },
  { name: "Deep Brine", type: "Bomba", zone: "Slime Sea", goal: 10 },
  { name: "Silky Sand", type: "Bomba", zone: "Starlight Strand", goal: 10 },
  { name: "Buzz Wax", type: "Bomba", zone: "Starlight Strand", goal: 10 }
];

const PORTS = [
  { name: "Rainbow Fields", icon: "🌾", requirement: "Terminar la introducción en el Conservatorio", reward: "Zona inicial: recursos y slimes básicos", note: "Consigue Pink, Cotton y Tabby para arrancar tus largos." },
  { name: "Starlight Strand", icon: "🌿", requirement: "Abrir el camino desde el Conservatorio", reward: "Honey, Hunter, Flutter, Puddle y Ringtail", note: "Hay tres dietas distintas: lleva fruta y carne." },
  { name: "Ember Valley", icon: "🔥", requirement: "Abrir el acceso desde el Conservatorio", reward: "Boom, Crystal, Rock y minerales", note: "Prepara corrales con muros altos antes de llevar Boom o Crystal." },
  { name: "Powderfall Bluffs", icon: "❄️", requirement: "Desbloquear el teleportador de la zona", reward: "Slimes y recursos exclusivos de la nieve", note: "Está lejos de la granja: carga comida suficiente." },
  { name: "Grey Labyrinth", icon: "🌀", requirement: "Abrir el portal del laberinto", reward: "Recursos raros de final de partida", note: "Entra con el inventario vacío y sal con todo." },
  { name: "Puertas bloqueadas", icon: "🔒", requirement: "Cumplir el requisito de cada puerta", reward: "Atajos, cofres y zonas escondidas", note: "Marca aquí las que ya abriste." }
];

/* Combinaciones recomendadas: se recalculan con los datos de SLIMES. */
const COMBOS = [
  { a: "pink", b: "cotton", why: "El Pink come lo que sea y el Cotton se conforma con verduras: un huerto de Water Lettuce mantiene el corral y el Cotton dobla plorts con su favorita.", corral: "Muros reforzados: el Cotton salta" },
  { a: "tabby", b: "hunter", why: "Los dos comen carne: un gallinero con Stony Hen y Roostro cubre dieta y favoritos, y los dos plorts se venden muy bien.", corral: "Alimenta seguido: el Hunter se vuelve feral" },
  { a: "tabby", b: "angler", why: "Dieta de carne compartida y dos plorts de buen precio; el Angler atrae plorts con su luz y el Tabby los junta.", corral: "Corral con muros altos" },
  { a: "honey", b: "phosphor", why: "Frutas para los dos: Cuberry y Mint Mango salen del mismo huerto y el Phosphor brilla de noche sin gastar nada extra.", corral: "Techo o Solar Shield" },
  { a: "honey", b: "batty", why: "Comparten dieta de frutas y suman dos plorts raros con muy poco mantenimiento.", corral: "Red antiaérea por el Batty" },
  { a: "rock", b: "crystal", why: "Un solo huerto de verduras para los dos y los plorts más caros de la zona, pero es la pareja más agresiva del juego.", corral: "Muros altos y cuidado con los cristales" },
  { a: "cotton", b: "rock", why: "Verduras compartidas y riesgo contenido: buena pareja para un corral pequeño cuando empiezas.", corral: "Muros altos" },
  { a: "boom", b: "hunter", why: "Mucho valor por plort, pero juntas dos slimes de riesgo alto: solo si vas a visitar el corral muy seguido.", corral: "Muros altos y visitas frecuentes" }
];
