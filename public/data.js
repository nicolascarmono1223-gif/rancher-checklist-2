// Datos de la checklist. Los ids se mantienen estables para guardar el progreso.

export const SLIMES = [
  { id: "pink", name: "Slime Rosa", emoji: "🌸", tone: "255 143 177", food: "Cualquier comida", favorite: "Sin favorito", plort: "Plort rosa", risk: "Bajo", special: "", zone: "Campos Arcoíris" },
  { id: "cotton", name: "Slime de Algodón", emoji: "☁️", tone: "214 230 255", food: "Verduras", favorite: "Lechuga de agua", plort: "Plort de algodón", risk: "Bajo", special: "Salta mucho", zone: "Campos Arcoíris" },
  { id: "tabby", name: "Slime Atigrado", emoji: "🐯", tone: "255 179 92", food: "Carne", favorite: "Gallina de piedra", plort: "Plort atigrado", risk: "Bajo", special: "Roba objetos", zone: "Campos Arcoíris" },
  { id: "phosphor", name: "Slime Luminoso", emoji: "✨", tone: "197 155 255", food: "Frutas", favorite: "Fruta cu", plort: "Plort luminoso", risk: "Medio", special: "Necesita escudo solar", zone: "Campos Arcoíris (de noche)" },
  { id: "angler", name: "Slime Pescador", emoji: "🎣", tone: "127 227 255", food: "Carne", favorite: "Gallina marina", plort: "Plort pescador", risk: "Medio", special: "Atrae objetos", zone: "Playa Luz Estelar" },
  { id: "batty", name: "Slime Murciélago", emoji: "🦇", tone: "179 140 255", food: "Frutas", favorite: "Granada", plort: "Plort de murciélago", risk: "Medio", special: "Necesita muros altos", zone: "Cuevas del Valle de Brasas" },
  { id: "crystal", name: "Slime de Cristal", emoji: "💎", tone: "142 242 255", food: "Verduras", favorite: "Cebolla rara", plort: "Plort de cristal", risk: "Alto", special: "Genera cristales dañinos", zone: "Valle de Brasas" },
  { id: "rock", name: "Slime Roca", emoji: "🪨", tone: "182 194 217", food: "Verduras", favorite: "Remolacha corazón", plort: "Plort de roca", risk: "Medio", special: "Se enrolla y embiste", zone: "Valle de Brasas" },
  { id: "honey", name: "Slime de Miel", emoji: "🍯", tone: "255 207 92", food: "Frutas", favorite: "Mango menta", plort: "Plort de miel", risk: "Bajo", special: "", zone: "Playa Luz Estelar" },
  { id: "hunter", name: "Slime Cazador", emoji: "🏹", tone: "255 154 107", food: "Carne", favorite: "Gallo", plort: "Plort cazador", risk: "Alto", special: "Puede volverse salvaje", zone: "Playa Luz Estelar" },
  { id: "flutter", name: "Slime Mariposa", emoji: "🦋", tone: "169 255 207", food: "Néctar", favorite: "Néctar de rocío lunar", plort: "Plort de mariposa", risk: "Medio", special: "Vuela", zone: "Playa Luz Estelar" },
  { id: "boom", name: "Slime Explosivo", emoji: "💥", tone: "255 122 122", food: "Carne", favorite: "Gallina zarza", plort: "Plort explosivo", risk: "Alto", special: "Explota", zone: "Valle de Brasas" },
  { id: "puddle", name: "Slime Charco", emoji: "💧", tone: "124 200 255", food: "Agua", favorite: "Agua", plort: "Plort de charco", risk: "Bajo", special: "Necesita agua", zone: "Estanques de Playa Luz Estelar" },
  { id: "ringtail", name: "Slime de Cola Anillada", emoji: "🦝", tone: "217 179 140", food: "Cualquier comida", favorite: "Sin favorito", plort: "Plort de cola anillada", risk: "Medio", special: "Se vuelve gato de noche", zone: "Playa Luz Estelar (de noche)" }
];

export const RESOURCES = [
  { id: "magma-comb", name: "Peine de magma", emoji: "🔥", tone: "255 138 92", zone: "Valle de Brasas", target: 10 },
  { id: "tin-petal", name: "Pétalo de estaño", emoji: "🥀", tone: "196 168 255", zone: "Valle de Brasas", target: 10 },
  { id: "black-indigonium", name: "Indigonio negro", emoji: "⚫", tone: "148 160 190", zone: "Valle de Brasas", target: 10 },
  { id: "aqua-glass", name: "Vidrio aguamarina", emoji: "🫧", tone: "111 231 216", zone: "Playa Luz Estelar", target: 10 },
  { id: "dream-bubble", name: "Burbuja de ensueño", emoji: "💭", tone: "178 168 255", zone: "Playa Luz Estelar", target: 10 },
  { id: "royal-jelly", name: "Jalea real", emoji: "🍯", tone: "255 207 92", zone: "Playa Luz Estelar", target: 10 },
  { id: "silky-sand", name: "Arena sedosa", emoji: "⏳", tone: "240 214 160", zone: "Playa Luz Estelar", target: 10 },
  { id: "drift-crystal", name: "Cristal de deriva", emoji: "🔮", tone: "150 196 255", zone: "Valle de Brasas", target: 10 },
  { id: "lightning-mote", name: "Mota de rayo", emoji: "⚡", tone: "255 230 120", zone: "Valle de Brasas", target: 10 },
  { id: "perfect-snowflake", name: "Copo de nieve perfecto", emoji: "❄️", tone: "196 232 255", zone: "Acantilados Nevada", target: 10 },
  { id: "slime-fossil", name: "Fósil de slime", emoji: "🦴", tone: "226 214 188", zone: "Acantilados Nevada", target: 10 }
];

export const ZONES = ["Todas", "Valle de Brasas", "Playa Luz Estelar", "Acantilados Nevada"];

export const FOODS = [
  {
    id: "frutas",
    name: "Frutas",
    emoji: "🍎",
    tone: "255 122 132",
    where: "Huertos de frutas",
    summary: "Dulces y jugosas. Se cultivan en huertos y crecen en árboles de la isla.",
    favorites: "Fruta cu, mango menta, granada",
    slimes: ["phosphor", "batty", "honey"]
  },
  {
    id: "verduras",
    name: "Verduras",
    emoji: "🥕",
    tone: "255 176 74",
    where: "Huertos de verduras",
    summary: "Crecen rápido en los huertos y mantienen contentos a los slimes más tranquilos.",
    favorites: "Lechuga de agua, cebolla rara, remolacha corazón",
    slimes: ["cotton", "crystal", "rock"]
  },
  {
    id: "carne",
    name: "Carne",
    emoji: "🍗",
    tone: "235 140 120",
    where: "Corrales de gallinas",
    summary: "Viene de las gallinas del corral. Los slimes carnívoros no perdonan un bocado.",
    favorites: "Gallina de piedra, gallina marina, gallo, gallina zarza",
    slimes: ["tabby", "angler", "hunter", "boom"]
  },
  {
    id: "nectar",
    name: "Néctar",
    emoji: "🌸",
    tone: "210 160 255",
    where: "Flores de néctar",
    summary: "Se recolecta de las flores especiales de la isla. Delicado y difícil de conseguir.",
    favorites: "Néctar de rocío lunar",
    slimes: ["flutter"]
  },
  {
    id: "agua",
    name: "Agua",
    emoji: "💧",
    tone: "110 200 255",
    where: "Estanques y charcas",
    summary: "Los slimes de agua no comen: absorben agua fresca de los estanques.",
    favorites: "Agua fresca (sin favorito)",
    slimes: ["puddle"]
  },
  {
    id: "todo",
    name: "Cualquier comida",
    emoji: "🍽️",
    tone: "168 255 94",
    where: "Cualquier comedero",
    summary: "Slimes versátiles que aceptan frutas, verduras o carne sin problema.",
    favorites: "Sin favorito: todo les sienta bien",
    slimes: ["pink", "ringtail"]
  }
];

export const PORTS = [
  { id: "rainbow", name: "Puerto de Campos Arcoíris", emoji: "🌈", tone: "255 170 210", requirement: "Depositar slimes", reward: "Abre la ruta inicial", note: "Revisa qué slimes tienes disponibles antes de entrar." },
  { id: "ember", name: "Puerto del Valle de Brasas", emoji: "🌋", tone: "255 138 92", requirement: "Depositar slimes", reward: "Nuevos recursos y slimes", note: "Lleva comida y recursos de sobra." },
  { id: "starlight", name: "Puerto de Playa Luz Estelar", emoji: "🌌", tone: "140 170 255", requirement: "Depositar slimes", reward: "Zonas de noche y marea", note: "Ideal para Luminoso, Pescador y Miel." },
  { id: "powderfall", name: "Puerto de Acantilados Nevada", emoji: "🏔️", tone: "196 232 255", requirement: "Depositar slimes", reward: "Recursos exclusivos", note: "Busca Fósil de slime y Copo de nieve perfecto." }
];

export const RECIPES = [
  { a: "tabby", b: "cotton", food: "Verduras y carne", favorite: "Lechuga de agua o gallina de piedra", risk: "Bajo", need: "Muros altos" },
  { a: "phosphor", b: "honey", food: "Frutas", favorite: "Fruta cu o mango menta", risk: "Medio", need: "Escudo solar" },
  { a: "crystal", b: "rock", food: "Verduras", favorite: "Cebolla rara o remolacha corazón", risk: "Alto", need: "Muros altos" },
  { a: "batty", b: "ringtail", food: "Frutas y cualquier comida", favorite: "Granada", risk: "Medio", need: "Muros altos" },
  { a: "angler", b: "hunter", food: "Carne", favorite: "Gallina marina o gallo", risk: "Alto", need: "Muros altos" },
  { a: "pink", b: "cotton", food: "Verduras y cualquier comida", favorite: "Lechuga de agua", risk: "Bajo", need: "Ninguno especial" }
].map((recipe) => ({ ...recipe, key: `${recipe.a}-${recipe.b}` }));
