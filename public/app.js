import { SLIMES, RESOURCES, ZONES, FOOD_GROUPS, FOODS, PORTS, RECIPES } from "./data.js";

const STORAGE_KEY = "ranchoSlime.v3";
const LEGACY_KEY = "rancherChecklist2";
const RISK_ORDER = { Bajo: 0, Medio: 1, Alto: 2 };
const VIEWS = ["inicio", "slimes", "comida", "recursos", "puertos", "largos"];

// Nombres que usaba la versión anterior; sirven para migrar el progreso guardado.
const OLD_RESOURCES = ["Magma Comb", "Tin Petal", "Black Indigonium", "Aqua Glass", "Dream Bubble", "Royal Jelly", "Silky Sand", "Drift Crystal", "Lightning Mote", "Perfect Snowflake", "Slime Fossil"];
const OLD_PORTS = ["Puerto de Rainbow Fields", "Puerto de Ember Valley", "Puerto de Starlight Strand", "Puerto de Powderfall Bluffs"];

const $ = (selector) => document.querySelector(selector);

const els = {
  overview: $("#overview"),
  slimeList: $("#slimeList"),
  slimeFilters: $("#slimeFilters"),
  slimeSearch: $("#slimeSearch"),
  slimesCount: $("#slimesCount"),
  resourceList: $("#resourceList"),
  resourceFilters: $("#resourceFilters"),
  resourcesCount: $("#resourcesCount"),
  foodList: $("#foodList"),
  foodCount: $("#foodCount"),
  foodFoot: $("#foodFoot"),
  portList: $("#portList"),
  portsCount: $("#portsCount"),
  largoList: $("#largoList"),
  largosCount: $("#largosCount"),
  largosRecommendedCount: $("#largosRecommendedCount"),
  largoResult: $("#largoResult"),
  largoA: $("#largoA"),
  largoB: $("#largoB"),
  appbarPct: $("#appbarPct"),
  appbarRingFill: $("#appbarRingFill"),
  toast: $("#toast"),
  resetDialog: $("#resetDialog"),
};

const ui = {
  tab: "inicio",
  slimeFilter: "todos",
  zone: "Todas",
  largoResultHtml: "",
};

let state = createState();
let deferredInstall = null;
let toastTimer = 0;

/* ------------------------------ Persistencia ------------------------------ */

function createState() {
  return {
    slimes: Object.fromEntries(SLIMES.map((s) => [s.id, false])),
    resources: Object.fromEntries(RESOURCES.map((r) => [r.id, 0])),
    ports: Object.fromEntries(PORTS.map((p) => [p.id, false])),
    largos: Object.fromEntries(RECIPES.map((r) => [r.key, false])),
  };
}

function clampInt(value, min, max) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : min;
}

function migrateLegacy(old, base) {
  if (old && typeof old === "object") {
    for (const slime of SLIMES) {
      if (old.slimes && old.slimes[slime.id]) base.slimes[slime.id] = true;
    }
    RESOURCES.forEach((resource, index) => {
      const value = old.resources ? old.resources[OLD_RESOURCES[index]] : undefined;
      if (typeof value === "number") base.resources[resource.id] = clampInt(value, 0, 999);
    });
    PORTS.forEach((port, index) => {
      if (old.ports && old.ports[OLD_PORTS[index]]) base.ports[port.id] = true;
    });
    for (const recipe of RECIPES) {
      if (old.largos && old.largos[recipe.key]) base.largos[recipe.key] = true;
    }
  }
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch (error) {
    /* almacenamiento no disponible */
  }
  return base;
}

function loadState() {
  const base = createState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      for (const slime of SLIMES) base.slimes[slime.id] = Boolean(saved?.slimes?.[slime.id]);
      for (const resource of RESOURCES) base.resources[resource.id] = clampInt(saved?.resources?.[resource.id], 0, 999);
      for (const port of PORTS) base.ports[port.id] = Boolean(saved?.ports?.[port.id]);
      for (const recipe of RECIPES) base.largos[recipe.key] = Boolean(saved?.largos?.[recipe.key]);
      return base;
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) return migrateLegacy(JSON.parse(legacy), base);
  } catch (error) {
    console.warn("No se pudo leer el progreso guardado.", error);
  }
  return base;
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("No se pudo guardar el progreso.", error);
  }
}

/* --------------------------------- Datos ---------------------------------- */

function stats() {
  const slimes = SLIMES.reduce((sum, s) => sum + (state.slimes[s.id] ? 1 : 0), 0);
  const resources = RESOURCES.reduce((sum, r) => sum + (state.resources[r.id] >= r.target ? 1 : 0), 0);
  const ports = PORTS.reduce((sum, p) => sum + (state.ports[p.id] ? 1 : 0), 0);
  const largos = RECIPES.reduce((sum, r) => sum + (state.largos[r.key] ? 1 : 0), 0);
  const done = slimes + resources + ports + largos;
  const total = SLIMES.length + RESOURCES.length + PORTS.length + RECIPES.length;
  return { slimes, resources, ports, largos, done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/* --------------------------------- Utiles --------------------------------- */

function setRing(circle, pct) {
  if (!circle) return;
  const radius = Number(circle.getAttribute("r"));
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${circumference * (1 - Math.max(0, Math.min(100, pct)) / 100)}`;
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 1700);
}

function vibrate() {
  if (typeof navigator.vibrate === "function") navigator.vibrate(8);
}

function focusControl(act, id, fallbackAct) {
  const selector = `[data-act="${act}"][data-id="${CSS.escape(id)}"]`;
  let target = document.querySelector(selector);
  if ((!target || target.disabled) && fallbackAct) {
    target = document.querySelector(`[data-act="${fallbackAct}"][data-id="${CSS.escape(id)}"]`);
  }
  if (target && !target.disabled) target.focus({ preventScroll: true });
}

const emptyState = (icon, title, text) => `
  <div class="empty">
    <span class="empty-icon" aria-hidden="true">${icon}</span>
    <h3>${title}</h3>
    <p>${text}</p>
  </div>`;

const riskTag = (risk) => `<span class="tag risk--${risk.toLowerCase()}">Riesgo ${risk.toLowerCase()}</span>`;

const dietLabel = (slime) => {
  if (slime.food === "No come") return "No come nada";
  if (slime.food === "Cualquier comida") return "Come cualquier comida";
  return `Come ${slime.food.toLowerCase()}`;
};

const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"></path></svg>`;

const chevron = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg>`;

const ICON = {
  food: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3v7a2 2 0 0 0 4 0V3"></path><path d="M9 10v11"></path><path d="M17 3c-1.8 2-2 4.6-2 6.5 0 1.6 1 2.5 2.5 2.5V21"></path></svg>`,
  plort: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 7 7-7 11-7-11 7-7Z"></path><path d="M5 10h14"></path></svg>`,
  place: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>`,
  star: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"></path></svg>`,
};

const slimeImg = (slime, extra = "") => `<img class="slime-img ${extra}" src="slimes/${slime.id}.svg" alt="" width="64" height="64">`;

const slimeAvatar = (slime, extra = "") => `<span class="avatar avatar--art ${extra}" style="--tone:${slime.tone}" aria-hidden="true">${slimeImg(slime)}</span>`;

/* -------------------------------- Resumen --------------------------------- */

function tile(icon, label, done, total, tab) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `<button class="tile" type="button" data-act="go" data-tab="${tab}">
    <span class="tile-icon" aria-hidden="true">${icon}</span>
    <span class="tile-label">${label}</span>
    <span class="tile-value">${done}<small>/${total}</small></span>
    <span class="bar"><span style="width:${pct}%"></span></span>
  </button>`;
}

function suggestionRow(item) {
  const slime = item.slimeId ? SLIMES.find((entry) => entry.id === item.slimeId) : null;
  const art = slime
    ? slimeAvatar(slime)
    : `<span class="avatar" style="--tone:${item.tone}" aria-hidden="true">${item.emoji}</span>`;
  return `<button class="sug" type="button" data-act="go" data-tab="${item.tab}">
    ${art}
    <span class="sug-body">
      <span class="sug-title">${item.title}</span>
      <span class="sug-meta">${item.meta}</span>
    </span>
    ${chevron}
  </button>`;
}

function renderOverview() {
  const s = stats();
  const greeting = s.pct === 0 ? "Empieza tu aventura" : s.pct === 100 ? "¡Rancho completo!" : s.pct < 40 ? "Vas tomando ritmo" : s.pct < 75 ? "Buen avance" : "Casi lo tienes";

  const suggestions = [];
  const nextSlime = SLIMES.find((item) => !state.slimes[item.id]);
  if (nextSlime) {
    suggestions.push({
      emoji: nextSlime.emoji,
      tone: nextSlime.tone,
      slimeId: nextSlime.id,
      title: `Captura al ${nextSlime.name}`,
      meta: `Riesgo ${nextSlime.risk.toLowerCase()} · ${dietLabel(nextSlime).toLowerCase()}`,
      tab: "slimes",
    });
  }
  const nextPort = PORTS.find((item) => !state.ports[item.id]);
  if (nextPort) {
    suggestions.push({
      emoji: nextPort.emoji,
      tone: nextPort.tone,
      title: `Abre el ${nextPort.name}`,
      meta: `Recompensa: ${nextPort.reward}`,
      tab: "puertos",
    });
  }
  const closest = RESOURCES
    .filter((resource) => state.resources[resource.id] < resource.target)
    .sort((a, b) => (a.target - state.resources[a.id]) - (b.target - state.resources[b.id]))[0];
  if (closest) {
    suggestions.push({
      emoji: closest.emoji,
      tone: closest.tone,
      title: `Te faltan ${closest.target - state.resources[closest.id]} de ${closest.name}`,
      meta: `Zona: ${closest.zone}`,
      tab: "recursos",
    });
  }
  const nextLargo = RECIPES.find((recipe) => !state.largos[recipe.key]);
  if (nextLargo) {
    const a = SLIMES.find((item) => item.id === nextLargo.a);
    const b = SLIMES.find((item) => item.id === nextLargo.b);
    suggestions.push({
      emoji: a.emoji,
      tone: a.tone,
      slimeId: a.id,
      title: `Crea el Largo de ${a.name} + ${b.name}`,
      meta: `Necesita: ${nextLargo.need.toLowerCase()}`,
      tab: "largos",
    });
  }

  els.overview.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Tu progreso</p>
        <h2>${greeting}</h2>
        <p class="hero-sub">${s.done} de ${s.total} objetivos completados</p>
      </div>
      <div class="hero-ring" role="img" aria-label="Progreso general: ${s.pct}%">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="ring-track" cx="60" cy="60" r="52"></circle>
          <circle class="ring-fill" id="heroRingFill" cx="60" cy="60" r="52"></circle>
        </svg>
        <span>${s.pct}%</span>
      </div>
    </section>

    <div class="tiles">
      ${tile("🌀", "Slimes", s.slimes, SLIMES.length, "slimes")}
      ${tile("⛏️", "Recursos", s.resources, RESOURCES.length, "recursos")}
      ${tile("🚪", "Puertos", s.ports, PORTS.length, "puertos")}
      ${tile("🧪", "Largos", s.largos, RECIPES.length, "largos")}
    </div>

    ${suggestions.length
      ? `<section class="panel">
          <div class="panel-head">
            <h2>Continúa por aquí</h2>
            <span class="panel-hint">${suggestions.length} pendientes</span>
          </div>
          ${suggestions.map(suggestionRow).join("")}
        </section>`
      : `<section class="panel panel--win">
          <span class="win-icon" aria-hidden="true">🏆</span>
          <h2>¡No te falta nada!</h2>
          <p>Completaste slimes, recursos, puertos y largos. El rancho está en su mejor momento.</p>
        </section>`}

    ${deferredInstall
      ? `<section class="panel panel--install">
          <div class="panel-copy">
            <h2>Lleva el rancho contigo</h2>
            <p>Instálala y ábrela sin conexión, como cualquier app del teléfono.</p>
          </div>
          <button class="btn btn--primary" type="button" data-act="install">Instalar</button>
        </section>`
      : ""}

    <section class="panel panel--tip">
      <span class="tip-icon" aria-hidden="true">💾</span>
      <p><b>Guardado automático.</b> Tu progreso vive solo en este dispositivo y la app funciona sin conexión.</p>
    </section>

    <div class="reset-row">
      <button class="reset-link" type="button" data-act="reset-open">Reiniciar progreso</button>
    </div>
  `;

  setRing(document.getElementById("heroRingFill"), s.pct);
}

/* --------------------------------- Slimes --------------------------------- */

function slimeCard(slime) {
  const done = state.slimes[slime.id];
  return `<article class="card ${done ? "is-done" : ""}">
    <div class="card-top">
      ${slimeAvatar(slime)}
      <div class="card-title">
        <h3>${slime.name}</h3>
        <p class="meta meta--ico">${ICON.food}${dietLabel(slime)}</p>
      </div>
      <span class="status ${done ? "is-ok" : ""}">${done ? "Capturado" : "Pendiente"}</span>
    </div>
    <dl class="facts facts--3">
      <div><dt>${ICON.star}Favorito</dt><dd>${slime.favorite}</dd></div>
      <div><dt>${ICON.plort}Plort</dt><dd>${slime.plort}</dd></div>
      <div><dt>${ICON.place}Lugar</dt><dd>${slime.zone}</dd></div>
    </dl>
    <div class="tags">
      ${riskTag(slime.risk)}
      ${slime.special ? `<span class="tag">${slime.special}</span>` : ""}
    </div>
    <button class="toggle" type="button" data-act="toggle-slime" data-id="${slime.id}" aria-pressed="${done}">
      <span class="box" aria-hidden="true">${checkIcon}</span>
      ${done ? "Capturado" : "Marcar como capturado"}
    </button>
  </article>`;
}

function renderSlimeFilters() {
  const captured = SLIMES.reduce((sum, slime) => sum + (state.slimes[slime.id] ? 1 : 0), 0);
  const filters = [
    { id: "todos", label: "Todos", count: SLIMES.length },
    { id: "capturados", label: "Capturados", count: captured },
    { id: "pendientes", label: "Pendientes", count: SLIMES.length - captured },
  ];
  els.slimeFilters.innerHTML = filters
    .map((filter) => `<button class="chip ${ui.slimeFilter === filter.id ? "is-active" : ""}" type="button"
      data-act="filter-slimes" data-filter="${filter.id}" aria-pressed="${ui.slimeFilter === filter.id}">
      ${filter.label}<b>${filter.count}</b>
    </button>`)
    .join("");
}

function renderSlimes() {
  const query = els.slimeSearch.value.trim().toLowerCase();
  const filtered = SLIMES.filter((slime) => {
    const haystack = [slime.name, dietLabel(slime), slime.favorite, slime.plort, slime.special, slime.zone].join(" ").toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesFilter = ui.slimeFilter === "todos"
      || (ui.slimeFilter === "capturados" ? state.slimes[slime.id] : !state.slimes[slime.id]);
    return matchesQuery && matchesFilter;
  });

  const captured = SLIMES.reduce((sum, slime) => sum + (state.slimes[slime.id] ? 1 : 0), 0);
  els.slimesCount.textContent = `${captured}/${SLIMES.length}`;
  renderSlimeFilters();
  els.slimeList.innerHTML = filtered.length
    ? filtered.map(slimeCard).join("")
    : emptyState("🔍", "Sin resultados", "Prueba con otro nombre o cambia el filtro.");
}

/* -------------------------------- Recursos -------------------------------- */

function resourceCard(resource) {
  const value = state.resources[resource.id] || 0;
  const done = value >= resource.target;
  const pct = Math.min(100, Math.round((value / resource.target) * 100));

  return `<article class="card resource ${done ? "is-done" : ""}">
    <div class="card-top">
      <span class="avatar" style="--tone:${resource.tone}" aria-hidden="true">${resource.emoji}</span>
      <div class="card-title">
        <h3>${resource.name}</h3>
        <p class="meta meta--ico">${ICON.place}${resource.zone}</p>
      </div>
      <span class="status ${done ? "is-ok" : "is-warn"}">${done ? "Completo" : `${value}/${resource.target}`}</span>
    </div>
    <div class="bar bar--lg" role="progressbar" aria-label="Progreso de ${resource.name}"
      aria-valuemin="0" aria-valuemax="${resource.target}" aria-valuenow="${value}">
      <span style="width:${pct}%"></span>
    </div>
    <div class="stepper">
      <button class="step" type="button" data-act="res-dec" data-id="${resource.id}"
        aria-label="Quitar uno de ${resource.name}" ${value === 0 ? "disabled" : ""}>−</button>
      <span class="stepper-value"><b>${value}</b><small>de ${resource.target}</small></span>
      <button class="step step--add" type="button" data-act="res-inc" data-id="${resource.id}"
        aria-label="Añadir uno a ${resource.name}">+</button>
      ${done
        ? `<span class="done-pill">✓ Listo</span>`
        : `<button class="mini-btn" type="button" data-act="res-done" data-id="${resource.id}">Completar</button>`}
    </div>
  </article>`;
}

function renderResourceFilters() {
  els.resourceFilters.innerHTML = ZONES
    .map((zone) => {
      const count = zone === "Todas" ? RESOURCES.length : RESOURCES.filter((r) => r.zone === zone).length;
      return `<button class="chip ${ui.zone === zone ? "is-active" : ""}" type="button"
        data-act="filter-zone" data-filter="${zone}" aria-pressed="${ui.zone === zone}">
        ${zone}<b>${count}</b>
      </button>`;
    })
    .join("");
}

function renderResources() {
  const complete = RESOURCES.reduce((sum, resource) => sum + (state.resources[resource.id] >= resource.target ? 1 : 0), 0);
  els.resourcesCount.textContent = `${complete}/${RESOURCES.length}`;
  renderResourceFilters();
  const list = ui.zone === "Todas" ? RESOURCES : RESOURCES.filter((resource) => resource.zone === ui.zone);
  els.resourceList.innerHTML = list.map(resourceCard).join("");
}

/* --------------------------------- Comida --------------------------------- */

function foodCard(food) {
  const slimes = food.slimes.map((id) => SLIMES.find((slime) => slime.id === id)).filter(Boolean);
  return `<article class="card food-card">
    <div class="card-top">
      <span class="avatar" style="--tone:${food.tone}" aria-hidden="true">${food.emoji}</span>
      <div class="card-title">
        <h3>${food.name}</h3>
        <p class="meta meta--ico">${ICON.place}${food.where}</p>
      </div>
      <span class="status ${slimes.length ? "is-ok" : ""}">${slimes.length
        ? `${slimes.length} ${slimes.length === 1 ? "favorito" : "favoritos"}`
        : "Sin favorito"}</span>
    </div>
    <p class="food-summary">${food.note}</p>
    ${slimes.length
      ? `<div class="food-slimes">
          <span class="food-slimes-label">${ICON.star}Favorito de</span>
          <div class="slime-chips">
            ${slimes.map((slime) => `<span class="slime-chip">${slimeImg(slime)}${slime.name}</span>`).join("")}
          </div>
        </div>`
      : ""}
  </article>`;
}

function renderFoods() {
  const favorites = FOODS.reduce((sum, food) => sum + food.slimes.length, 0);
  els.foodCount.textContent = `${FOODS.length} alimentos`;
  els.foodList.innerHTML = FOOD_GROUPS.map((group) => {
    const items = FOODS.filter((food) => food.group === group.id);
    if (!items.length) return "";
    return `<section class="food-group">
      <div class="food-group-head">
        <span class="avatar" style="--tone:${group.tone}" aria-hidden="true">${group.emoji}</span>
        <div class="food-group-copy">
          <h3>${group.name}</h3>
          <p>${group.summary}</p>
        </div>
        <span class="pill">${items.length}</span>
      </div>
      ${items.map(foodCard).join("")}
    </section>`;
  }).join("");
  if (els.foodFoot) els.foodFoot.textContent = `${favorites} comidas favoritas repartidas entre los slimes.`;
}

/* -------------------------------- Puertos --------------------------------- */

function portCard(port) {
  const done = state.ports[port.id];
  return `<article class="card ${done ? "is-done" : ""}">
    <div class="card-top">
      <span class="avatar" style="--tone:${port.tone}" aria-hidden="true">${port.emoji}</span>
      <div class="card-title">
        <h3>${port.name}</h3>
        <p class="meta">${port.requirement}</p>
      </div>
      <span class="status ${done ? "is-ok" : ""}">${done ? "Completado" : "Pendiente"}</span>
    </div>
    <dl class="facts">
      <div><dt>Recompensa</dt><dd>${port.reward}</dd></div>
      <div><dt>Consejo</dt><dd>${port.note}</dd></div>
    </dl>
    <button class="toggle" type="button" data-act="toggle-port" data-id="${port.id}" aria-pressed="${done}">
      <span class="box" aria-hidden="true">${checkIcon}</span>
      ${done ? "Completado" : "Marcar como completado"}
    </button>
  </article>`;
}

function renderPorts() {
  const done = PORTS.reduce((sum, port) => sum + (state.ports[port.id] ? 1 : 0), 0);
  els.portsCount.textContent = `${done}/${PORTS.length}`;
  els.portList.innerHTML = PORTS.map(portCard).join("");
}

/* --------------------------------- Largos --------------------------------- */

function largoCard(recipe) {
  const a = SLIMES.find((slime) => slime.id === recipe.a);
  const b = SLIMES.find((slime) => slime.id === recipe.b);
  const done = state.largos[recipe.key];
  return `<article class="card ${done ? "is-done" : ""}">
    <div class="card-top">
      <span class="avatar-stack" aria-hidden="true">
        ${slimeAvatar(a)}
        ${slimeAvatar(b)}
      </span>
      <div class="card-title">
        <h3>${a.name} + ${b.name}</h3>
        <p class="meta">${recipe.food} · ${recipe.need}</p>
      </div>
      <span class="status ${done ? "is-ok" : ""}">${done ? "Creado" : "Planeado"}</span>
    </div>
    <dl class="facts">
      <div><dt>Favorito útil</dt><dd>${recipe.favorite}</dd></div>
      <div><dt>Riesgo</dt><dd>${recipe.risk}</dd></div>
    </dl>
    <button class="toggle" type="button" data-act="toggle-largo" data-id="${recipe.key}" aria-pressed="${done}">
      <span class="box" aria-hidden="true">${checkIcon}</span>
      ${done ? "Largo creado" : "Marcar como creado"}
    </button>
  </article>`;
}

function renderLargos() {
  const done = RECIPES.reduce((sum, recipe) => sum + (state.largos[recipe.key] ? 1 : 0), 0);
  const label = `${done}/${RECIPES.length}`;
  if (els.largosCount) els.largosCount.textContent = label;
  if (els.largosRecommendedCount) els.largosRecommendedCount.textContent = label;
  els.largoList.innerHTML = RECIPES.map(largoCard).join("");
  els.largoResult.innerHTML = ui.largoResultHtml;
}

function fillLargoSelects() {
  const options = SLIMES.map((slime) => `<option value="${slime.id}">${slime.name}</option>`).join("");
  els.largoA.innerHTML = options;
  els.largoB.innerHTML = options;
  els.largoA.value = SLIMES[0].id;
  els.largoB.value = SLIMES[1].id;
}

function analyzeLargo() {
  const a = SLIMES.find((slime) => slime.id === els.largoA.value);
  const b = SLIMES.find((slime) => slime.id === els.largoB.value);
  if (!a || !b) return;

  if (a.id === b.id) {
    ui.largoResultHtml = `<div class="result result--warn">
      <h3>Combinación no válida</h3>
      <p class="result-tip">Elige dos slimes diferentes para crear un Largo.</p>
    </div>`;
  } else {
    const risk = RISK_ORDER[a.risk] >= RISK_ORDER[b.risk] ? a.risk : b.risk;
    const shared = a.food === b.food || a.food === "Cualquier comida" || b.food === "Cualquier comida";
    const cares = [...new Set([a.special, b.special].filter(Boolean))];

    ui.largoResultHtml = `<div class="result result--${risk.toLowerCase()}">
      <div class="result-top">
        ${slimeAvatar(a, "avatar--lg")}
        <span class="plus" aria-hidden="true">+</span>
        ${slimeAvatar(b, "avatar--lg")}
        ${riskTag(risk)}
      </div>
      <h3>${a.name} + ${b.name}</h3>
      <dl class="facts">
        <div><dt>Comida</dt><dd>${a.food} · ${b.food}</dd></div>
        <div><dt>Favoritos</dt><dd>${a.favorite} · ${b.favorite}</dd></div>
        <div><dt>Produce</dt><dd>${a.plort} · ${b.plort}</dd></div>
        ${cares.length ? `<div><dt>Cuidados</dt><dd>${cares.join(" · ")}</dd></div>` : ""}
      </dl>
      <p class="result-note ${shared ? "" : "is-warn"}">${shared
        ? "✅ Comparten tipo de comida: será fácil mantenerlos alimentados."
        : "⚠️ Comen cosas distintas: prepara dos comederos, uno para cada tipo."}</p>
      <p class="result-tip">Con su comida favorita, un Largo puede producir hasta el doble de plorts.</p>
    </div>`;
  }

  els.largoResult.innerHTML = ui.largoResultHtml;
  const result = els.largoResult.querySelector(".result");
  if (result) result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function swapLargos() {
  const first = els.largoA.value;
  els.largoA.value = els.largoB.value;
  els.largoB.value = first;
  if (ui.largoResultHtml) analyzeLargo();
}

/* -------------------------------- Acciones -------------------------------- */

function toggleSlime(id) {
  const before = stats();
  state.slimes[id] = !state.slimes[id];
  save();
  renderAll();
  focusControl("toggle-slime", id);
  vibrate();

  if (!state.slimes[id]) {
    toast("Marcado como pendiente");
    return;
  }
  const after = stats();
  if (after.pct === 100 && before.pct !== 100) toast("🎉 ¡Rancho completo!");
  else if (after.slimes === SLIMES.length) toast("🎉 ¡Todos los slimes capturados!");
  else toast("Capturado ✓");
}

function togglePort(id) {
  const before = stats();
  state.ports[id] = !state.ports[id];
  save();
  renderAll();
  focusControl("toggle-port", id);
  vibrate();

  if (!state.ports[id]) {
    toast("Marcado como pendiente");
    return;
  }
  const after = stats();
  if (after.pct === 100 && before.pct !== 100) toast("🎉 ¡Rancho completo!");
  else if (after.ports === PORTS.length) toast("🎉 ¡Todos los puertos abiertos!");
  else toast("Puerto completado ✓");
}

function toggleLargo(key) {
  const before = stats();
  state.largos[key] = !state.largos[key];
  save();
  renderAll();
  focusControl("toggle-largo", key);
  vibrate();

  if (!state.largos[key]) {
    toast("Marcado como planeado");
    return;
  }
  const after = stats();
  if (after.pct === 100 && before.pct !== 100) toast("🎉 ¡Rancho completo!");
  else toast("Largo creado ✓");
}

function bumpResource(id, delta) {
  const resource = RESOURCES.find((item) => item.id === id);
  if (!resource) return;
  const next = clampInt((state.resources[id] || 0) + delta, 0, 999);
  if (next === state.resources[id]) return;

  state.resources[id] = next;
  save();
  renderAll();
  focusControl(delta > 0 ? "res-inc" : "res-dec", id, "res-inc");
  vibrate();
  if (next === resource.target) toast(`${resource.name}: ¡completo!`);
}

function completeResource(id) {
  const resource = RESOURCES.find((item) => item.id === id);
  if (!resource) return;
  state.resources[id] = resource.target;
  save();
  renderAll();
  focusControl("res-done", id, "res-inc");
  vibrate();
  toast(`${resource.name}: ¡completo!`);
}

function resetAll() {
  state = createState();
  save();
  ui.largoResultHtml = "";
  els.largoResult.innerHTML = "";
  els.resetDialog.close();
  renderAll();
  toast("Progreso reiniciado");
}

function promptInstall() {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  deferredInstall.userChoice.then((choice) => {
    if (choice.outcome === "accepted") toast("Instalando la app…");
    deferredInstall = null;
    renderOverview();
  }).catch(() => {
    deferredInstall = null;
    renderOverview();
  });
}

/* --------------------------------- Render --------------------------------- */

function renderAll() {
  renderGlobal();
  renderOverview();
  renderSlimes();
  renderFoods();
  renderResources();
  renderPorts();
  renderLargos();
}

function renderGlobal() {
  const s = stats();
  els.appbarPct.textContent = `${s.pct}%`;
  setRing(els.appbarRingFill, s.pct);
  document.body.classList.toggle("is-complete", s.pct === 100);
}

function switchTab(tab, { scroll = true } = {}) {
  const next = VIEWS.includes(tab) ? tab : "inicio";
  ui.tab = next;

  VIEWS.forEach((view) => {
    const section = document.getElementById(`view-${view}`);
    if (section) section.hidden = view !== next;
  });

  document.querySelectorAll(".tabbar .tab").forEach((button) => {
    const active = button.dataset.tab === next;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

/* --------------------------------- Eventos -------------------------------- */

function bindEvents() {
  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-act]");
    if (!control) return;
    const { act, id, tab, filter } = control.dataset;

    switch (act) {
      case "go": switchTab(tab); break;
      case "toggle-slime": toggleSlime(id); break;
      case "toggle-port": togglePort(id); break;
      case "toggle-largo": toggleLargo(id); break;
      case "res-inc": bumpResource(id, 1); break;
      case "res-dec": bumpResource(id, -1); break;
      case "res-done": completeResource(id); break;
      case "filter-slimes": ui.slimeFilter = filter; renderSlimes(); break;
      case "filter-zone": ui.zone = filter; renderResources(); break;
      case "analyze": analyzeLargo(); break;
      case "swap": swapLargos(); break;
      case "install": promptInstall(); break;
      case "reset-open": els.resetDialog.showModal(); break;
      case "reset-cancel": els.resetDialog.close(); break;
      case "reset-confirm": resetAll(); break;
      default: break;
    }
  });

  els.slimeSearch.addEventListener("input", renderSlimes);

  els.resetDialog.addEventListener("click", (event) => {
    if (event.target === els.resetDialog) els.resetDialog.close();
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstall = event;
    renderOverview();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstall = null;
    toast("App instalada ✓");
    renderOverview();
  });
}

/* ------------------------------- Arranque --------------------------------- */

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  // La vista previa corre dentro de un iframe: ahí no registramos la caché
  // offline para que cada cambio se vea al instante. Instalada como app
  // (ventana propia) sí funciona sin conexión.
  if (window.self !== window.top) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    }).catch(() => {});
    if (window.caches) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key))).catch(() => {});
    }
    return;
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

function init() {
  state = loadState();
  fillLargoSelects();
  bindEvents();
  renderAll();
  switchTab("inicio", { scroll: false });
  registerServiceWorker();
}

init();
