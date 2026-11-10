"use strict";

/* ---------- Constantes de presentación ---------- */

const STORAGE_KEY = "rancher-checklist-2:v2";

const DIET_LABEL = { carne: "Carne", fruta: "Fruta", verdura: "Verdura", nectar: "Néctar", todo: "Cualquier comida", agua: "Agua" };
const RISK_LABEL = { bajo: "bajo", medio: "medio", alto: "alto" };
const VALOR_LABEL = { comun: "Común", raro: "Raro", epico: "Épico" };
const VALOR_POINTS = { comun: 1, raro: 2, epico: 3 };
const NEED_LABEL = { solar: "Solar Shield o techo", muros: "Muros altos", red: "Red antiaérea", agua: "Estanque", feral: "Alimentar seguido" };
const NEED_TIP = {
  solar: "El Phosphor se degrada con el sol: techo o Solar Shield obligatorio.",
  muros: "Sube los muros: si salta o embiste, se escapa.",
  red: "Pon red o techo: si vuela, se va del corral.",
  agua: "Prepara estanque: sin agua no sobrevive.",
  feral: "El Hunter se vuelve feral si pasa hambre: alimentación constante."
};

const els = {
  stats: document.getElementById("stats"),
  overallRing: document.getElementById("overallRing"),
  overallPct: document.getElementById("overallPct"),
  slimeSearch: document.getElementById("slimeSearch"),
  slimeFilter: document.getElementById("slimeFilter"),
  slimeHint: document.getElementById("slimeHint"),
  slimeList: document.getElementById("slimeList"),
  resourceSearch: document.getElementById("resourceSearch"),
  resourceHint: document.getElementById("resourceHint"),
  resourceList: document.getElementById("resourceList"),
  portList: document.getElementById("portList"),
  comboList: document.getElementById("comboList"),
  largoA: document.getElementById("largoA"),
  largoB: document.getElementById("largoB"),
  analyzeBtn: document.getElementById("analyzeBtn"),
  largoResult: document.getElementById("largoResult"),
  partnerPick: document.getElementById("partnerPick"),
  partnerList: document.getElementById("partnerList"),
  resetBtn: document.getElementById("resetBtn")
};

/* ---------- Estado guardado ---------- */

const emptyState = () => ({ slimes: {}, resources: {}, ports: {}, combos: {} });

function loadState() {
  const base = emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    return {
      slimes: { ...base.slimes, ...(saved.slimes || {}) },
      resources: { ...base.resources, ...(saved.resources || {}) },
      ports: { ...base.ports, ...(saved.ports || {}) },
      combos: { ...base.combos, ...(saved.combos || {}) }
    };
  } catch (err) {
    return base;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    /* almacenamiento lleno o bloqueado: seguimos sin guardar */
  }
}

let state = loadState();
let activeView = "slimes";
let slimeFilterValue = "all";

/* ---------- Utilidades ---------- */

const slimeById = (id) => SLIMES.find((s) => s.id === id);
const comboKey = (c) => `${c.a}-${c.b}`;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function verdictClass(verdict) {
  if (verdict === "Excelente" || verdict === "Buena") return "badge-ok";
  if (verdict === "Aceptable") return "badge-warn";
  return "badge-risk";
}

function emptyMessage(text) {
  return `<p class="empty">${escapeHtml(text)}</p>`;
}

/* ---------- Análisis de combinaciones ---------- */

function analyzePair(a, b) {
  if (!a || !b) return { invalid: "Elige dos slimes diferentes." };
  if (a.id === b.id) return { invalid: "Un slime no se combina consigo mismo: elige dos distintos." };

  const blocked = [a, b].find((s) => s.noLargo);
  if (blocked) return { invalid: `${blocked.name} no puede convertirse en largo: necesita su propio estanque.` };

  let score = 0;
  const tips = [];
  let dietNote;

  if (a.diet === b.diet) {
    score += 46;
    dietNote = `Los dos comen ${DIET_LABEL[a.diet].toLowerCase()}: un solo cultivo o gallinero alimenta el corral entero.`;
    tips.push(`Aprovecha las favoritas (${a.favorite} y ${b.favorite}) para sacar plorts dobles.`);
  } else if (a.diet === "todo" || b.diet === "todo") {
    score += 30;
    dietNote = "El slime de dieta libre acepta lo que comas tú, así que basta con alimentar al otro.";
    tips.push("El slime de dieta libre no tiene favorita: ese lado nunca dará plorts dobles.");
  } else {
    score += 10;
    dietNote = `Necesitan dos comidas distintas (${DIET_LABEL[a.diet].toLowerCase()} y ${DIET_LABEL[b.diet].toLowerCase()}): dos cultivos y el doble de viajes.`;
    tips.push("Con dos dietas, alimenta siempre ambos lados o aparecerán Tarr.");
  }

  score += (VALOR_POINTS[a.valor] + VALOR_POINTS[b.valor]) * 7;

  const altos = [a, b].filter((s) => s.risk === "alto").length;
  const medios = [a, b].filter((s) => s.risk === "medio").length;
  score -= altos * 16 + medios * 4;

  if (altos) tips.push("Hay un slime de riesgo alto: refuerza el corral y aliméntalo antes de salir de la granja.");
  else if (medios) tips.push("Riesgo medio: revisa el corral al volver de cada viaje.");

  const needs = [...new Set([...a.needs, ...b.needs])];
  score -= needs.length * 7;
  needs.forEach((n) => tips.push(NEED_TIP[n]));

  const clamped = Math.max(5, Math.min(100, Math.round(score)));
  const verdict = clamped >= 72 ? "Excelente" : clamped >= 52 ? "Buena" : clamped >= 34 ? "Aceptable" : "Riesgosa";

  return { score: clamped, verdict, dietNote, needs, tips };
}

function partnerSuggestions(slime) {
  return SLIMES
    .filter((s) => s.id !== slime.id)
    .map((s) => ({ slime: s, analysis: analyzePair(slime, s) }))
    .filter((entry) => !entry.analysis.invalid)
    .sort((x, y) => y.analysis.score - x.analysis.score)
    .slice(0, 3);
}

/* ---------- Progreso ---------- */

function totals() {
  const slimes = SLIMES.filter((s) => state.slimes[s.id]).length;
  const resources = RESOURCES.filter((r) => (state.resources[r.name] || 0) >= r.goal).length;
  const ports = PORTS.filter((p) => state.ports[p.name]).length;
  const combos = COMBOS.filter((c) => state.combos[comboKey(c)]).length;
  const done = slimes + resources + ports + combos;
  const total = SLIMES.length + RESOURCES.length + PORTS.length + COMBOS.length;
  return { slimes, resources, ports, combos, done, total, pct: total ? Math.round((done * 100) / total) : 0 };
}

function renderStats() {
  const t = totals();
  els.stats.innerHTML = [
    { label: "Slimes capturados", value: `${t.slimes}/${SLIMES.length}`, icon: "🌀" },
    { label: "Recursos completos", value: `${t.resources}/${RESOURCES.length}`, icon: "⛏️" },
    { label: "Portales abiertos", value: `${t.ports}/${PORTS.length}`, icon: "🚪" },
    { label: "Largos creados", value: `${t.combos}/${COMBOS.length}`, icon: "🧪" }
  ].map((s) => `
    <li class="stat">
      <span class="stat-icon" aria-hidden="true">${s.icon}</span>
      <span class="stat-value">${s.value}</span>
      <span class="stat-label">${s.label}</span>
    </li>`).join("");

  els.overallPct.textContent = `${t.pct}%`;
  els.overallRing.style.setProperty("--p", String(t.pct));
  els.overallRing.setAttribute("aria-label", `Progreso total ${t.pct}%`);
}

/* ---------- Vistas ---------- */

function renderSlimes() {
  const term = (els.slimeSearch.value || "").toLowerCase().trim();
  const list = SLIMES
    .filter((s) => !term || s.name.toLowerCase().includes(term) || s.zone.toLowerCase().includes(term))
    .filter((s) => slimeFilterValue === "all" || (slimeFilterValue === "captured" ? !!state.slimes[s.id] : !state.slimes[s.id]));

  els.slimeList.innerHTML = list.length ? list.map(slimeCard).join("") : emptyMessage("Ningún slime coincide con la búsqueda.");
  const captured = SLIMES.filter((s) => state.slimes[s.id]).length;
  els.slimeHint.textContent = `${captured} de ${SLIMES.length} slimes capturados`;
}

function slimeCard(s) {
  const captured = !!state.slimes[s.id];
  return `
  <article class="card slime-card${captured ? " is-done" : ""}">
    <div class="card-top">
      <span class="avatar diet-${s.diet}" aria-hidden="true">${s.emoji}</span>
      <div class="card-title">
        <h3>${escapeHtml(s.name)}</h3>
        <p class="meta">${escapeHtml(s.zone)}</p>
      </div>
      <span class="badge ${captured ? "badge-ok" : "badge-idle"}">${captured ? "Capturado" : "Pendiente"}</span>
    </div>
    <dl class="facts">
      <div><dt>Dieta</dt><dd>${DIET_LABEL[s.diet]}</dd></div>
      <div><dt>Favorita</dt><dd>${escapeHtml(s.favorite)}</dd></div>
      <div><dt>Plort</dt><dd>${escapeHtml(s.plort)}</dd></div>
      <div><dt>Valor</dt><dd>${VALOR_LABEL[s.valor]}</dd></div>
    </dl>
    <p class="note">${escapeHtml(s.note)}</p>
    <div class="chips">
      <span class="chip risk-${s.risk}">Riesgo ${RISK_LABEL[s.risk]}</span>
      ${s.needs.map((n) => `<span class="chip">${NEED_LABEL[n]}</span>`).join("")}
    </div>
    <label class="toggle">
      <input type="checkbox" data-slime="${s.id}" ${captured ? "checked" : ""} />
      <span>Marcar como capturado</span>
    </label>
  </article>`;
}

function renderResources() {
  const term = (els.resourceSearch.value || "").toLowerCase().trim();
  const list = RESOURCES.filter((r) => !term || r.name.toLowerCase().includes(term) || r.type.toLowerCase().includes(term));
  els.resourceList.innerHTML = list.length ? list.map(resourceCard).join("") : emptyMessage("Ningún recurso coincide con la búsqueda.");
  const done = RESOURCES.filter((r) => (state.resources[r.name] || 0) >= r.goal).length;
  els.resourceHint.textContent = `${done} de ${RESOURCES.length} recursos completos`;
}

function resourceCard(r) {
  const have = state.resources[r.name] || 0;
  const done = have >= r.goal;
  const pct = Math.min(100, Math.round((have * 100) / r.goal));
  return `
  <article class="card resource-card${done ? " is-done" : ""}">
    <div class="card-top">
      <span class="avatar diet-mine" aria-hidden="true">${r.type === "Bomba" ? "💧" : "⛏️"}</span>
      <div class="card-title">
        <h3>${escapeHtml(r.name)}</h3>
        <p class="meta">${escapeHtml(r.type)} · ${escapeHtml(r.zone)}</p>
      </div>
      <span class="badge ${done ? "badge-ok" : "badge-idle"}">${have}/${r.goal}</span>
    </div>
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${r.goal}" aria-valuenow="${have}" aria-label="Progreso de ${escapeHtml(r.name)}">
      <span style="width:${pct}%"></span>
    </div>
    <div class="stepper">
      <button class="btn small" type="button" data-res="${escapeHtml(r.name)}" data-step="-1" aria-label="Quitar uno de ${escapeHtml(r.name)}">−</button>
      <input type="number" min="0" max="999" inputmode="numeric" value="${have}" data-res-input="${escapeHtml(r.name)}" aria-label="Cantidad de ${escapeHtml(r.name)}" />
      <button class="btn small" type="button" data-res="${escapeHtml(r.name)}" data-step="1" aria-label="Añadir uno de ${escapeHtml(r.name)}">+</button>
    </div>
  </article>`;
}

function renderPorts() {
  els.portList.innerHTML = PORTS.map((p) => {
    const open = !!state.ports[p.name];
    return `
    <article class="card port-card${open ? " is-done" : ""}">
      <div class="card-top">
        <span class="avatar diet-port" aria-hidden="true">${p.icon}</span>
        <div class="card-title">
          <h3>${escapeHtml(p.name)}</h3>
          <p class="meta">${escapeHtml(p.requirement)}</p>
        </div>
        <span class="badge ${open ? "badge-ok" : "badge-idle"}">${open ? "Abierto" : "Pendiente"}</span>
      </div>
      <dl class="facts"><div><dt>Desbloquea</dt><dd>${escapeHtml(p.reward)}</dd></div></dl>
      <p class="note">${escapeHtml(p.note)}</p>
      <label class="toggle">
        <input type="checkbox" data-port="${escapeHtml(p.name)}" ${open ? "checked" : ""} />
        <span>Ya lo desbloqueé</span>
      </label>
    </article>`;
  }).join("");
}

function renderComboList() {
  els.comboList.innerHTML = COMBOS.map(comboCard).join("");
}

function comboCard(c) {
  const a = slimeById(c.a);
  const b = slimeById(c.b);
  if (!a || !b) return "";
  const key = comboKey(c);
  const done = !!state.combos[key];
  const analysis = analyzePair(a, b);
  return `
  <article class="card combo-card${done ? " is-done" : ""}">
    <div class="combo-head">
      <span class="pair">
        <span class="avatar sm diet-${a.diet}" aria-hidden="true">${a.emoji}</span>
        <span class="plus" aria-hidden="true">+</span>
        <span class="avatar sm diet-${b.diet}" aria-hidden="true">${b.emoji}</span>
      </span>
      <span class="badge ${verdictClass(analysis.verdict)}">${analysis.verdict}</span>
    </div>
    <h3>${escapeHtml(a.name)} + ${escapeHtml(b.name)}</h3>
    <p class="note">${escapeHtml(c.why)}</p>
    <div class="chips">
      <span class="chip">${DIET_LABEL[a.diet]} + ${DIET_LABEL[b.diet]}</span>
      ${analysis.needs.map((n) => `<span class="chip">${NEED_LABEL[n]}</span>`).join("")}
    </div>
    <p class="meta">Corral: ${escapeHtml(c.corral)}</p>
    <label class="toggle">
      <input type="checkbox" data-combo="${key}" ${done ? "checked" : ""} />
      <span>Largo creado</span>
    </label>
  </article>`;
}

function renderAnalysis() {
  const a = slimeById(els.largoA.value);
  const b = slimeById(els.largoB.value);
  const analysis = analyzePair(a, b);

  els.largoResult.hidden = false;
  if (analysis.invalid) {
    els.largoResult.className = "result is-invalid";
    els.largoResult.innerHTML = `<p class="note">${escapeHtml(analysis.invalid)}</p>`;
    return;
  }

  els.largoResult.className = "result";
  els.largoResult.innerHTML = `
    <div class="result-head">
      <h3>${escapeHtml(a.name)} + ${escapeHtml(b.name)}</h3>
      <span class="badge ${verdictClass(analysis.verdict)}">${analysis.verdict} · ${analysis.score}/100</span>
    </div>
    <p class="note">${escapeHtml(analysis.dietNote)}</p>
    <dl class="facts">
      <div><dt>Plorts</dt><dd>${escapeHtml(a.plort)} + ${escapeHtml(b.plort)}</dd></div>
      <div><dt>Favoritas</dt><dd>${escapeHtml(a.favorite)} / ${escapeHtml(b.favorite)}</dd></div>
    </dl>
    <div class="chips">
      ${analysis.needs.length
        ? analysis.needs.map((n) => `<span class="chip">${NEED_LABEL[n]}</span>`).join("")
        : '<span class="chip">Sin requisitos extra de corral</span>'}
    </div>
    <ul class="tips">${analysis.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`;
}

function renderPartners() {
  const slime = slimeById(els.partnerPick.value);
  if (!slime) return;
  const suggestions = partnerSuggestions(slime);
  els.partnerList.innerHTML = suggestions.map(({ slime: partner, analysis }) => `
    <article class="card combo-card">
      <div class="combo-head">
        <span class="pair">
          <span class="avatar sm diet-${slime.diet}" aria-hidden="true">${slime.emoji}</span>
          <span class="plus" aria-hidden="true">+</span>
          <span class="avatar sm diet-${partner.diet}" aria-hidden="true">${partner.emoji}</span>
        </span>
        <span class="badge ${verdictClass(analysis.verdict)}">${analysis.score}/100</span>
      </div>
      <h3>${escapeHtml(partner.name)}</h3>
      <p class="note">${escapeHtml(analysis.dietNote)}</p>
      <div class="chips"><span class="chip">${DIET_LABEL[partner.diet]}</span></div>
    </article>`).join("");
}

/* ---------- Navegación y eventos ---------- */

function setView(view) {
  activeView = view;
  document.querySelectorAll(".tab").forEach((tab) => {
    const on = tab.dataset.view === view;
    tab.classList.toggle("is-active", on);
    tab.setAttribute("aria-selected", String(on));
  });
  ["slimes", "resources", "ports", "combos"].forEach((name) => {
    document.getElementById(`view-${name}`).classList.toggle("is-hidden", name !== view);
  });
  renderActiveView();
}

function renderActiveView() {
  if (activeView === "slimes") renderSlimes();
  else if (activeView === "resources") renderResources();
  else if (activeView === "ports") renderPorts();
  else {
    renderComboList();
    renderPartners();
  }
}

function commit() {
  saveState();
  renderStats();
}

function fillSelects() {
  const options = SLIMES.map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");
  els.largoA.innerHTML = options;
  els.largoB.innerHTML = options;
  els.partnerPick.innerHTML = options;
  els.largoA.value = "tabby";
  els.largoB.value = "honey";
  els.partnerPick.value = "tabby";
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
  });

  els.slimeFilter.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    slimeFilterValue = button.dataset.filter;
    els.slimeFilter.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === button));
    renderSlimes();
  });

  els.slimeSearch.addEventListener("input", renderSlimes);
  els.resourceSearch.addEventListener("input", renderResources);

  els.slimeList.addEventListener("change", (event) => {
    const box = event.target.closest("input[data-slime]");
    if (!box) return;
    state.slimes[box.dataset.slime] = box.checked;
    commit();
    renderSlimes();
  });

  els.resourceList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-res]");
    if (!button) return;
    const name = button.dataset.res;
    const current = state.resources[name] || 0;
    state.resources[name] = Math.max(0, Math.min(999, current + Number(button.dataset.step)));
    commit();
    renderResources();
  });

  els.resourceList.addEventListener("change", (event) => {
    const input = event.target.closest("input[data-res-input]");
    if (!input) return;
    const name = input.dataset.resInput;
    const parsed = Number.parseInt(input.value, 10);
    state.resources[name] = Math.max(0, Math.min(999, Number.isNaN(parsed) ? 0 : parsed));
    commit();
    renderResources();
  });

  els.portList.addEventListener("change", (event) => {
    const box = event.target.closest("input[data-port]");
    if (!box) return;
    state.ports[box.dataset.port] = box.checked;
    commit();
    renderPorts();
  });

  els.comboList.addEventListener("change", (event) => {
    const box = event.target.closest("input[data-combo]");
    if (!box) return;
    state.combos[box.dataset.combo] = box.checked;
    commit();
    renderComboList();
  });

  els.analyzeBtn.addEventListener("click", renderAnalysis);
  els.largoA.addEventListener("change", renderAnalysis);
  els.largoB.addEventListener("change", renderAnalysis);
  els.partnerPick.addEventListener("change", renderPartners);

  els.resetBtn.addEventListener("click", () => {
    if (!confirm("¿Borrar todo el progreso guardado en este dispositivo?")) return;
    state = emptyState();
    saveState();
    renderStats();
    renderActiveView();
    els.largoResult.hidden = true;
  });
}

/* ---------- Arranque ---------- */

fillSelects();
bindEvents();
renderStats();
setView("slimes");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
