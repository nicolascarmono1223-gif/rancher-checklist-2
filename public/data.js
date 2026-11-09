// Datos de la checklist. Los ids se mantienen estables para guardar el progreso.

export const SLIMES = [
  { id: "pink", name: "Slime Rosa", emoji: "🌸", tone: "255 143 177", food: "Cualquier comida", favorite: "Sin favorito", plort: "Plort rosa", risk: "Bajo", special: "El más fácil de cuidar", zone: "Campos Arcoíris" },
  { id: "cotton", name: "Slime de Algodón", emoji: "☁️", tone: "214 230 255", food: "Verduras", favorite: "Lechuga de agua", plort: "Plort de algodón", risk: "Bajo", special: "Salta y se lanza", zone: "Campos Arcoíris" },
  { id: "tabby", name: "Slime Atigrado", emoji: "🐯", tone: "255 179 92", food: "Carne", favorite: "Gallina de piedra", plort: "Plort atigrado", risk: "Bajo", special: "Roba objetos", zone: "Campos Arcoíris" },
  { id: "phosphor", name: "Slime Luminoso", emoji: "✨", tone: "197 155 255", food: "Frutas", favorite: "Baya cu", plort: "Plort luminoso", risk: "Medio", special: "Necesita escudo solar", zone: "Campos Arcoíris (de noche)" },
  { id: "angler", name: "Slime Pescador", emoji: "🎣", tone: "127 227 255", food: "Carne", favorite: "Gallina de mar", plort: "Plort pescador", risk: "Medio", special: "Destello que aturde", zone: "Orilla Luz Estelar" },
  { id: "batty", name: "Slime Murciélago", emoji: "🦇", tone: "179 140 255", food: "Frutas", favorite: "Granada", plort: "Plort de murciélago", risk: "Medio", special: "Se agita con el sol", zone: "Valle de Brasas" },
  { id: "crystal", name: "Slime de Cristal", emoji: "💎", tone: "142 242 255", food: "Verduras", favorite: "Cebolla rara", plort: "Plort de cristal", risk: "Alto", special: "Genera cristales dañinos", zone: "Valle de Brasas" },
  { id: "rock", name: "Slime Roca", emoji: "🪨", tone: "182 194 217", food: "Verduras", favorite: "Remolacha corazón", plort: "Plort de roca", risk: "Medio", special: "Se enrolla y embiste", zone: "Valle de Brasas" },
  { id: "honey", name: "Slime de Miel", emoji: "🍯", tone: "255 207 92", food: "Frutas", favorite: "Mango menta", plort: "Plort de miel", risk: "Bajo", special: "Sus plorts atraen slimes", zone: "Orilla Luz Estelar" },
  { id: "hunter", name: "Slime Cazador", emoji: "🏹", tone: "255 154 107", food: "Carne", favorite: "Gallo", plort: "Plort cazador", risk: "Alto", special: "Sus largos nacen salvajes", zone: "Orilla Luz Estelar" },
  { id: "flutter", name: "Slime Mariposa", emoji: "🦋", tone: "169 255 207", food: "Néctar", favorite: "Néctar de rocío lunar", plort: "Plort de mariposa", risk: "Medio", special: "Solo come néctar", zone: "Orilla Luz Estelar" },
  { id: "boom", name: "Slime Explosivo", emoji: "💥", tone: "255 122 122", food: "Carne", favorite: "Gallina zarza", plort: "Plort explosivo", risk: "Alto", special: "Explota", zone: "Valle de Brasas" },
  { id: "puddle", name: "Slime Charco", emoji: "💧", tone: "124 200 255", food: "Agua", favorite: "Agua", plort: "Plort de charco", risk: "Bajo", special: "Necesita agua", zone: "Estanques de la isla" },
  { id: "ringtail", name: "Slime de Cola Anillada", emoji: "🦝", tone: "217 179 140", food: "Cualquier comida", favorite: "Sin favorito", plort: "Plort de cola anillada", risk: "Medio", special: "Se vuelve piedra de día", zone: "Orilla Luz Estelar (de noche)" },
  { id: "saber", name: "Slime Sable", emoji: "🗡️", tone: "255 214 140", food: "Carne", favorite: "Gallina trueno", plort: "Plort de sable", risk: "Medio", special: "Salta y ruge", zone: "Acantilados Polvorosos" },
  { id: "yolky", name: "Slime Yema", emoji: "🍳", tone: "255 236 170", food: "No come", favorite: "Sin favorito", plort: "Plort de yema", risk: "Bajo", special: "Hace poner huevos gigantes", zone: "Nidos de gallinas" },
  { id: "tangle", name: "Slime Maraña", emoji: "🌺", tone: "176 255 168", food: "Carne", favorite: "Gallina pintada", plort: "Plort de maraña", risk: "Medio", special: "Atrapa comida con lianas", zone: "Tormentas de polen" },
  { id: "dervish", name: "Slime Derviche", emoji: "🌪️", tone: "170 210 255", food: "Frutas", favorite: "Pera espinosa", plort: "Plort derviche", risk: "Alto", special: "Crea tornados", zone: "Tormentas de viento" },
  { id: "fire", name: "Slime de Fuego", emoji: "🔥", tone: "255 138 96", food: "Ceniza", favorite: "Ceniza", plort: "Plort de fuego", risk: "Alto", special: "Solo vive en ceniza", zone: "Valle de Brasas" },
  { id: "sloomber", name: "Slime Sloomber", emoji: "💤", tone: "232 176 255", food: "Carne", favorite: "Gallina caramelizada", plort: "Plort sloomber", risk: "Medio", special: "Duerme a otros slimes", zone: "Laberinto Gris · Tierra de los Sueños" },
  { id: "hyper", name: "Slime Hiper", emoji: "⚡", tone: "140 255 230", food: "Verduras", favorite: "Papa turbo", plort: "Plort hiper", risk: "Medio", special: "Corre y rebota sin parar", zone: "Laberinto Gris · Terrario" },
  { id: "twin", name: "Slime Gemelo", emoji: "🌀", tone: "168 198 255", food: "Frutas", favorite: "Polaricereza", plort: "Plort gemelo", risk: "Medio", special: "Abre portales", zone: "Laberinto Gris · Cielo Imposible" },
  { id: "shadow", name: "Slime Sombra", emoji: "🌑", tone: "150 150 190", food: "No come", favorite: "Sin favorito", plort: "Plort de sombra", risk: "Bajo", special: "Huye y desaparece", zone: "Laberinto Gris" },
  { id: "gold", name: "Slime Dorado", emoji: "🪙", tone: "255 224 130", food: "No come", favorite: "Sin favorito", plort: "Plort dorado", risk: "Bajo", special: "Golpéalo con cualquier objeto", zone: "Toda la isla (raro)" },
  { id: "lucky", name: "Slime Suertudo", emoji: "🍀", tone: "255 210 160", food: "Carne", favorite: "Sin favorito", plort: "Da newbucks, no plorts", risk: "Bajo", special: "Se asusta y huye", zone: "Toda la isla (raro)" }
];

export const RESOURCES = [
  { id: "magma-comb", name: "Peine de magma", emoji: "🔥", tone: "255 138 92", zone: "Valle de Brasas", target: 10 },
  { id: "tin-petal", name: "Pétalo de estaño", emoji: "🥀", tone: "196 168 255", zone: "Valle de Brasas", target: 10 },
  { id: "black-indigonium", name: "Indigonio negro", emoji: "⚫", tone: "148 160 190", zone: "Valle de Brasas", target: 10 },
  { id: "aqua-glass", name: "Vidrio aguamarina", emoji: "🫧", tone: "111 231 216", zone: "Orilla Luz Estelar", target: 10 },
  { id: "dream-bubble", name: "Burbuja de ensueño", emoji: "💭", tone: "178 168 255", zone: "Orilla Luz Estelar", target: 10 },
  { id: "royal-jelly", name: "Jalea real", emoji: "🍯", tone: "255 207 92", zone: "Orilla Luz Estelar", target: 10 },
  { id: "silky-sand", name: "Arena sedosa", emoji: "⏳", tone: "240 214 160", zone: "Orilla Luz Estelar", target: 10 },
  { id: "drift-crystal", name: "Cristal de deriva", emoji: "🔮", tone: "150 196 255", zone: "Valle de Brasas", target: 10 },
  { id: "lightning-mote", name: "Mota de rayo", emoji: "⚡", tone: "255 230 120", zone: "Valle de Brasas", target: 10 },
  { id: "perfect-snowflake", name: "Copo de nieve perfecto", emoji: "❄️", tone: "196 232 255", zone: "Acantilados Polvorosos", target: 10 },
  { id: "slime-fossil", name: "Fósil de slime", emoji: "🦴", tone: "226 214 188", zone: "Acantilados Polvorosos", target: 10 }
];

export const ZONES = ["Todas", "Valle de Brasas", "Orilla Luz Estelar", "Acantilados Polvorosos"];

export const FOOD_GROUPS = [
  { id: "frutas", name: "Frutas", emoji: "🍎", tone: "255 122 132", summary: "Dulces y jugosas. Salen de los huertos de frutas." },
  { id: "verduras", name: "Verduras", emoji: "🥕", tone: "255 176 74", summary: "Crecen rápido en el huerto y llenan mucho a los slimes." },
  { id: "carne", name: "Carne", emoji: "🍗", tone: "235 140 120", summary: "Viene de las gallinas del corral. Los carnívoros no perdonan." },
  { id: "nectar", name: "Néctar", emoji: "🌸", tone: "210 160 255", summary: "Delicado y difícil de conseguir. Solo lo comen las mariposas." },
  { id: "especiales", name: "Dietas especiales", emoji: "💧", tone: "140 200 255", summary: "Slimes que no comen frutas, verduras ni carne." }
];

export const FOODS = [
  { id: "baya-cu", name: "Baya cu", group: "frutas", emoji: "🍒", tone: "255 122 132", where: "Huerto de frutas", note: "La fruta más común y la primera que conviene plantar.", slimes: ["phosphor"] },
  { id: "mango-menta", name: "Mango menta", group: "frutas", emoji: "🥭", tone: "255 200 120", where: "Huerto de frutas", note: "Fresco y refrescante. Crece en árboles del huerto.", slimes: ["honey"] },
  { id: "granada", name: "Granada", group: "frutas", emoji: "🍎", tone: "255 120 140", where: "Huerto de frutas", note: "Fruta de árbol. A los murciélagos les encanta.", slimes: ["batty"] },
  { id: "fruta-pogo", name: "Fruta pogo", group: "frutas", emoji: "🍈", tone: "200 255 140", where: "Huerto de frutas", note: "Ningún slime la tiene como favorita: úsala para el comedero diario.", slimes: [] },
  { id: "pera-espinosa", name: "Pera espinosa", group: "frutas", emoji: "🍐", tone: "220 240 150", where: "Huerto de frutas (rara)", note: "Fruta poco común. Es la debilidad del Slime Derviche.", slimes: ["dervish"] },
  { id: "polaricereza", name: "Polaricereza", group: "frutas", emoji: "🍒", tone: "255 150 170", where: "Huerto de frutas (rara)", note: "Fruta rara de la isla. Solo el Slime Gemelo la adora.", slimes: ["twin"] },

  { id: "lechuga-agua", name: "Lechuga de agua", group: "verduras", emoji: "🥬", tone: "190 255 170", where: "Huerto de verduras", note: "Crece rápido y es la favorita del Slime de Algodón.", slimes: ["cotton"] },
  { id: "remolacha-corazon", name: "Remolacha corazón", group: "verduras", emoji: "🥕", tone: "255 140 160", where: "Huerto de verduras", note: "Dulce y contundente. Favorita del Slime Roca.", slimes: ["rock"] },
  { id: "cebolla-rara", name: "Cebolla rara", group: "verduras", emoji: "🧅", tone: "210 190 255", where: "Huerto de verduras", note: "Suave para los slimes y muy rentable de cultivar.", slimes: ["crystal"] },
  { id: "zanahoria", name: "Zanahoria", group: "verduras", emoji: "🥕", tone: "255 160 90", where: "Huerto de verduras", note: "La verdura básica: barata, rápida y sin favorito.", slimes: [] },
  { id: "papa-turbo", name: "Papa turbo", group: "verduras", emoji: "🥔", tone: "255 220 120", where: "Huerto de verduras (rara)", note: "Verdura poco común. Favorita del Slime Hiper.", slimes: ["hyper"] },

  { id: "gallina-piedra", name: "Gallina de piedra", group: "carne", emoji: "🐔", tone: "220 200 170", where: "Corral de gallinas", note: "Gallina común del corral. Favorita del Slime Atigrado.", slimes: ["tabby"] },
  { id: "gallina-mar", name: "Gallina de mar", group: "carne", emoji: "🐔", tone: "150 220 255", where: "Corral de gallinas", note: "Gallina costera. El Slime Pescador la sigue a todas partes.", slimes: ["angler"] },
  { id: "gallina-zarza", name: "Gallina zarza", group: "carne", emoji: "🐔", tone: "190 220 150", where: "Corral de gallinas", note: "Gallina de matorral. Antojo favorito del Slime Explosivo.", slimes: ["boom"] },
  { id: "gallo", name: "Gallo", group: "carne", emoji: "🐓", tone: "255 180 120", where: "Corral de gallinas", note: "Más grande que una gallina. Favorito del Slime Cazador.", slimes: ["hunter"] },
  { id: "gallina-pintada", name: "Gallina pintada", group: "carne", emoji: "🐔", tone: "255 190 220", where: "Corral de gallinas", note: "Gallina de colores vivos. Favorita del Slime Maraña.", slimes: ["tangle"] },
  { id: "gallina-trueno", name: "Gallina trueno", group: "carne", emoji: "🐔", tone: "255 230 130", where: "Corral de gallinas", note: "Gallina eléctrica. El Slime Sable la devora sin dudarlo.", slimes: ["saber"] },
  { id: "gallina-caramelizada", name: "Gallina caramelizada", group: "carne", emoji: "🐔", tone: "230 170 110", where: "Corral de gallinas (rara)", note: "Gallina dulce y rara. Favorita del Slime Sloomber.", slimes: ["sloomber"] },
  { id: "gallina", name: "Gallina común", group: "carne", emoji: "🐔", tone: "240 230 200", where: "Corral de gallinas", note: "La gallina de siempre. Nadie la tiene como favorita.", slimes: [] },

  { id: "nectar-lunar", name: "Néctar de rocío lunar", group: "nectar", emoji: "🌸", tone: "210 160 255", where: "Flores de néctar · de noche", note: "Se recoge de las flores que brillan de noche. Solo lo come el Slime Mariposa.", slimes: ["flutter"] },

  { id: "agua", name: "Agua fresca", group: "especiales", emoji: "💧", tone: "110 200 255", where: "Estanques y charcas", note: "El Slime Charco no come: absorbe agua y necesita vivir cerca de ella.", slimes: ["puddle"] },
  { id: "ceniza", name: "Ceniza", group: "especiales", emoji: "🔥", tone: "255 138 96", where: "Incinerador del rancho", note: "Quema cualquier comida en el incinerador y el Slime de Fuego la comerá.", slimes: ["fire"] },
  { id: "cualquier-comida", name: "Cualquier comida", group: "especiales", emoji: "🍽️", tone: "168 255 94", where: "Frutas, verduras y carne", note: "Los omnívoros aceptan de todo, pero sin néctar y sin comida favorita.", slimes: ["pink", "ringtail"] },
  { id: "no-come", name: "No comen nada", group: "especiales", emoji: "✨", tone: "200 200 220", where: "Solo aparecen y se van", note: "Lánzales un objeto para sacarles plorts o newbucks. No se pueden criar en corral.", slimes: ["yolky", "shadow", "gold", "lucky"] }
];

export const PORTS = [
  { id: "rainbow", name: "Puerto de Campos Arcoíris", emoji: "🌈", tone: "255 170 210", requirement: "Depositar slimes", reward: "Abre la ruta inicial", note: "Revisa qué slimes tienes disponibles antes de entrar." },
  { id: "ember", name: "Puerto del Valle de Brasas", emoji: "🌋", tone: "255 138 92", requirement: "Depositar slimes", reward: "Nuevos recursos y slimes", note: "Lleva comida y recursos de sobra." },
  { id: "starlight", name: "Puerto de Orilla Luz Estelar", emoji: "🌌", tone: "140 170 255", requirement: "Depositar slimes", reward: "Zonas de noche y marea", note: "Ideal para Luminoso, Pescador y Miel." },
  { id: "powderfall", name: "Puerto de Acantilados Polvorosos", emoji: "🏔️", tone: "196 232 255", requirement: "Depositar slimes", reward: "Recursos exclusivos", note: "Busca Fósil de slime y Copo de nieve perfecto." }
];

export const RECIPES = [
  { a: "tabby", b: "cotton", food: "Verduras y carne", favorite: "Lechuga de agua o gallina de piedra", risk: "Bajo", need: "Muros altos" },
  { a: "phosphor", b: "honey", food: "Frutas", favorite: "Baya cu o mango menta", risk: "Medio", need: "Escudo solar" },
  { a: "crystal", b: "rock", food: "Verduras", favorite: "Cebolla rara o remolacha corazón", risk: "Alto", need: "Muros altos" },
  { a: "batty", b: "ringtail", food: "Frutas y cualquier comida", favorite: "Granada", risk: "Medio", need: "Muros altos" },
  { a: "angler", b: "hunter", food: "Carne", favorite: "Gallina de mar o gallo", risk: "Alto", need: "Muros altos" },
  { a: "saber", b: "boom", food: "Carne", favorite: "Gallina trueno o gallina zarza", risk: "Alto", need: "Muros altos" },
  { a: "tangle", b: "dervish", food: "Carne y frutas", favorite: "Gallina pintada o pera espinosa", risk: "Alto", need: "Dos comederos" },
  { a: "pink", b: "cotton", food: "Verduras y cualquier comida", favorite: "Lechuga de agua", risk: "Bajo", need: "Ninguno especial" }
].map((recipe) => ({ ...recipe, key: `${recipe.a}-${recipe.b}` }));
