(function () {
  const $ = (s, root = document) => root.querySelector(s);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const show = (w) => (w === "" ? "λ" : w);

  // localStorage puede no estar disponible (ventana privada, previsualizaciones)
  const store = {
    get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin persistencia */ } },
  };

  const shuffle = (a) => {
    a = [...a];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  // Resalta los comentarios /* */ dentro del código
  const highlight = (code) => esc(code).replace(/\/\*.*?\*\//g, (m) => `<span class="cm">${m}</span>`);

  const runMachine = (m, w) => { const s = new TM.Simulator(m, w); s.run(); return s; };

  // ---------- Navegación: una sección por pantalla ----------
  const sections = [...document.querySelectorAll("main > section")];
  const navLinks = [...document.querySelectorAll("nav a")];
  const titleOf = (sec) => $("h1", sec).textContent.replace(/^\d+\.\s*/, "");
  sections.forEach((sec, i) => {
    const prev = sections[i - 1], next = sections[i + 1];
    const pager = document.createElement("div");
    pager.className = "pager";
    pager.innerHTML = (prev ? `<a class="prev" href="#${prev.id}">← ${titleOf(prev)}</a>` : "<span></span>") +
      `<span class="muted">${i + 1} / ${sections.length}</span>` +
      (next ? `<a class="next" href="#${next.id}">${titleOf(next)} →</a>` : "<span></span>");
    sec.appendChild(pager);
  });

  // Muestra la sección que contiene el id (puede ser un elemento interno, ej. #build-list)
  function goTo(id, { scroll = true } = {}) {
    const target = (id && document.getElementById(id)) || sections[0];
    const sec = target.closest("main > section") || sections[0];
    sections.forEach((s) => s.classList.toggle("active", s === sec));
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${sec.id}`));
    if (!scroll) return;
    if (target === sec) window.scrollTo(0, 0);
    else target.scrollIntoView();
  }
  document.body.classList.add("paged");
  window.addEventListener("hashchange", () => goTo(location.hash.slice(1)));
  goTo(location.hash.slice(1), { scroll: false });
  const openSection = (id) => (location.hash === `#${id}` ? goTo(id) : (location.hash = id));

  function tableHTML(machine) {
    const t = TM.table(machine);
    let h = `<table class="tbl tt"><tr><th>TT</th>${t.symbols.map((s) => `<th>${esc(s)}</th>`).join("")}</tr>`;
    for (const s of machine.states) {
      const mark = (s === machine.initial ? "−" : "") + (machine.finals.has(s) ? "+" : "");
      h += `<tr><td><b>${s}${mark}</b></td>`;
      for (const x of t.symbols) {
        const r = t.get(s, x);
        h += `<td>${r ? `${esc(r.write)},${r.dir},${r.to}` : `<span class="empty">–</span>`}</td>`;
      }
      h += "</tr>";
    }
    return h + "</table>";
  }

  // ---------- Ruta de estudio ----------
  const route = [
    { title: "Conceptos", time: "45 min", items: [
      ["c1", "Leer qué es una MT y sus 6 componentes", "#conceptos"],
      ["c2", "Notación de una regla y el blanco como centinela", "#conceptos"],
      ["c3", "Jerarquía de Chomsky y cuándo acepta / rechaza", "#conceptos"],
      ["c4", "Responder las preguntas conceptuales del quiz (1 a 9)", "#autoevaluacion"],
    ] },
    { title: "Construir", time: "2 h", items: [
      ["b1", "Leer el método paso a paso", "#construir"],
      ["b2", "Seguir L₆ con «aabbcc» en el simulador usando «Adiviná el paso»", "#simulador"],
      ["b3", "Repasar las trazas de abc y abcc", "#construir"],
      ["b4", "Intentar L₇ y duplicar antes de ver la solución", "#construir"],
      ["b5", "Leer los errores típicos", "#construir"],
      ["b6", "Construir aⁿbⁿ (n ≥ 0) y verificarla", "#build-list"],
      ["b7", "Construir aⁿbᵐcⁿ⁺ᵐ y verificarla", "#build-list"],
      ["b8", "Construir palíndromos o wcw y verificarla", "#build-list"],
      ["b9", "Construir «sumar 1 a un binario» y verificarla", "#build-list"],
    ] },
    { title: "Descubrir", time: "1 h 30", items: [
      ["d1", "Leer el método y el ejemplo resuelto con L₆", "#descubrir"],
      ["d2", "MT misteriosas 1 a 3 (predecir antes de ver la solución)", "#discover-list"],
      ["d3", "MT misteriosas 4 a 6", "#discover-list"],
    ] },
    { title: "Simulacro", time: "1 h", items: [
      ["s1", "Hacer el simulacro completo con el reloj", "#autoevaluacion"],
      ["s2", "Repasar cada pregunta y caso que salió mal", "#autoevaluacion"],
    ] },
    { title: "Repaso final", time: "30 min", items: [
      ["r1", "Leer la hoja resumen (o imprimirla)", "#resumen"],
      ["r2", "Construir sin pistas «igual cantidad de a y b» o la suma unaria", "#build-list"],
    ] },
  ];
  const done = new Set(store.get("ruta", []));
  const rutaList = $("#ruta-list");
  rutaList.innerHTML = route.map((b, i) => `<div class="ruta-block"><h3>${i + 1}. ${b.title} <span class="muted">· ${b.time}</span></h3>${b.items
    .map(([id, text, href]) => `<label class="check"><input type="checkbox" data-r="${id}"${done.has(id) ? " checked" : ""}> <span>${text}</span> <a href="${href}">ir →</a></label>`)
    .join("")}</div>`).join("");
  const totalItems = route.reduce((n, b) => n + b.items.length, 0);
  const updateRoute = () => {
    const pct = Math.round((100 * done.size) / totalItems);
    $("#ruta-bar").style.width = pct + "%";
    $("#ruta-pct").textContent = `${done.size} de ${totalItems} tareas (${pct} %)`;
  };
  rutaList.onchange = (e) => {
    const id = e.target.dataset.r;
    if (!id) return;
    e.target.checked ? done.add(id) : done.delete(id);
    store.set("ruta", [...done]);
    updateRoute();
  };
  $("#ruta-reset").onclick = () => {
    done.clear();
    store.set("ruta", []);
    rutaList.querySelectorAll("input").forEach((c) => (c.checked = false));
    updateRoute();
  };
  updateRoute();

  // ---------- Ejemplos (programa + diagrama + tabla) ----------
  function renderExample(container, key, { showTitle = false } = {}) {
    const def = TM.machines[key];
    const m = TM.parse(def.program);
    container.innerHTML = `
      ${showTitle ? `<h3>${def.title}</h3>` : ""}
      <div class="ex-grid">
        <div>
          <pre class="code">${highlight(def.program)}</pre>
          <div class="table-wrap">${tableHTML(m)}</div>
        </div>
        <div><svg class="diagram"></svg></div>
      </div>
      <div class="btns">${def.inputs
        .map((w) => `<button class="small" data-sim="${key}" data-input="${esc(w)}">Simular «${esc(show(w))}»</button>`)
        .join("")}</div>`;
    TM.renderDiagram($("svg", container), m);
  }

  document.querySelectorAll(".example").forEach((el) => renderExample(el, el.dataset.machine));
  document.querySelectorAll("[data-table]").forEach((el) => (el.innerHTML = tableHTML(TM.parse(TM.machines[el.dataset.table].program))));

  // ---------- Descubrir el lenguaje ----------
  function discoverCard(d) {
    const card = document.createElement("div");
    card.className = "card";
    const output = d.mode === "output";
    card.innerHTML = `<span class="tag extra">Práctica</span>
      <h2>${TM.machines[d.key].title}</h2>
      <div class="example"></div>
      <div class="predict">
        <p><b>Antes de ver la solución:</b> ${output ? "¿cómo queda la cinta con cada entrada?" : "¿acepta o rechaza cada cadena?"}</p>
        ${d.predict.map((w, i) => `<label class="pred"><code>${esc(show(w))}</code> ${output
          ? `<input type="text" data-p="${i}" placeholder="cinta final" autocomplete="off">`
          : `<select data-p="${i}"><option value="">¿?</option><option value="acepta">acepta</option><option value="rechaza">rechaza</option></select>`} <span class="mark"></span></label>`).join("")}
        <label class="block">Tu respuesta: ${output ? "¿qué computa?" : "L ="} <input type="text" class="answer" autocomplete="off"></label>
        <button class="small check-pred">Comprobar predicciones</button> <span class="pred-score"></span>
      </div>
      <details><summary>Pista</summary><p>${d.hint}</p></details>
      <details><summary>Ver solución</summary>${d.solution}</details>`;
    renderExample($(".example", card), d.key);
    const m = TM.parse(TM.machines[d.key].program);
    $(".check-pred", card).onclick = () => {
      let ok = 0;
      d.predict.forEach((w, i) => {
        const s = runMachine(m, w);
        const real = output ? s.tapeText() : s.result;
        const field = $(`[data-p="${i}"]`, card);
        const good = field.value.trim() === real;
        if (good) ok++;
        $(".mark", field.parentNode).innerHTML = good ? `<span class="ok">✔</span>` : `<span class="bad">✘ ${esc(real)}</span>`;
      });
      $(".pred-score", card).textContent = `${ok} / ${d.predict.length}. Ahora compará tu respuesta con la solución.`;
    };
    return card;
  }
  const dl = $("#discover-list");
  TM.discover.forEach((d) => dl.appendChild(discoverCard(d)));

  // ---------- Construir: ejercicios con verificación ----------
  const caseText = (c) => ("out" in c ? `${show(c.w)} → ${c.out}` : `${show(c.w)} ${c.ok ? "✔" : "✘"}`);
  const bl = $("#build-list");
  TM.build.forEach((b) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span class="tag extra">Práctica</span>
      <h2>${b.title}</h2>
      <p>${b.text}</p>
      <p class="muted">Casos de prueba: ${b.cases.map((c) => `<code>${esc(caseText(c))}</code>`).join(" ")}</p>
      <div class="btns"><button class="small" data-build="${b.key}">Resolver en el simulador ✎</button></div>
      <details><summary>Pista</summary><p>${b.hint}</p></details>
      <details><summary>Ver solución</summary><div class="example"></div></details>`;
    renderExample($(".example", card), b.key);
    bl.appendChild(card);
  });

  // ---------- Simulador ----------
  const sel = $("#sim-example"), prog = $("#sim-program"), inp = $("#sim-input");
  const tapeEl = $("#sim-tape"), statusEl = $("#sim-status"), infoEl = $("#sim-info");
  const logEl = $("#sim-log"), errEl = $("#sim-errors"), diag = $("#sim-diagram"), quick = $("#sim-quick");
  const exSel = $("#sim-exercise"), verifyOut = $("#sim-verify-out"), speed = $("#sim-speed");
  let machine = null, sim = null, timer = null;

  const groups = { libro: "Ejemplos y ejercicios", misterio: "MT misteriosas", sol: "Soluciones de práctica" };
  const og = {};
  for (const [g, label] of Object.entries(groups)) { og[g] = document.createElement("optgroup"); og[g].label = label; sel.appendChild(og[g]); }
  for (const [k, d] of Object.entries(TM.machines)) og[d.solution ? "sol" : k.startsWith("misterio") ? "misterio" : "libro"].appendChild(new Option(d.title, k));
  sel.add(new Option("(programa propio)", ""));
  for (const b of TM.build) exSel.add(new Option(b.title, b.key));

  const quickButtons = (list) => "Probar: " + list.map((w) => `<button class="small" data-q="${esc(w)}">${esc(show(w))}</button>`).join("");

  function setExample(key, input) {
    if (key) {
      sel.value = key;
      prog.value = TM.machines[key].program;
      inp.value = input ?? TM.machines[key].inputs[0];
      quick.innerHTML = quickButtons(TM.machines[key].inputs);
    }
    load();
  }

  function setExercise(key) {
    const b = TM.build.find((x) => x.key === key);
    exSel.value = key;
    verifyOut.innerHTML = "";
    if (!b) return;
    sel.value = "";
    prog.value = `/* ${b.title} */\n`;
    inp.value = b.cases[0].w;
    quick.innerHTML = quickButtons(b.cases.map((c) => c.w));
    load();
    prog.focus();
  }

  function load() {
    stopAnim();
    guessStats = { ok: 0, total: 0 };
    machine = TM.parse(prog.value);
    errEl.innerHTML = machine.errors.map((e) => `<div>⚠ ${esc(e)}</div>`).join("");
    if (!machine.states.length) {
      sim = null;
      statusEl.textContent = "El programa no tiene reglas válidas.";
      statusEl.className = "status";
      tapeEl.innerHTML = ""; diag.innerHTML = ""; logEl.textContent = ""; infoEl.innerHTML = "";
      updateGuess();
      return;
    }
    sim = new TM.Simulator(machine, inp.value.trim());
    draw();
  }

  function draw() {
    const to = Math.max(sim.tape.length, sim.head + 1) + 3;
    let h = "";
    for (let i = 0; i < to; i++) {
      const c = sim.tape[i] ?? TM.BLANK;
      h += `<span class="${i === sim.head ? "head" : ""} ${c === TM.BLANK ? "blank" : ""}">${esc(c)}</span>`;
    }
    tapeEl.innerHTML = h;
    infoEl.innerHTML = `Estado: <b>${sim.state}${machine.finals.has(sim.state) ? "+" : ""}</b> · Leyendo: <b>${esc(sim.read())}</b> · Pasos: <b>${sim.steps}</b>`;
    logEl.textContent = sim.log.join("\n");
    logEl.scrollTop = logEl.scrollHeight;
    if (sim.result === "acepta") {
      statusEl.className = "status ok";
      statusEl.textContent = `✔ ACEPTA — ${sim.reason}. Cinta final: ${sim.tapeText() || "(vacía)"}`;
    } else if (sim.result === "rechaza") {
      statusEl.className = "status bad";
      statusEl.textContent = `✘ RECHAZA — ${sim.reason}.`;
    } else {
      statusEl.className = "status";
      statusEl.textContent = "En ejecución…";
    }
    TM.renderDiagram(diag, machine, { current: sim.state, rule: sim.lastRule });
    updateGuess();
  }

  function stopAnim() {
    clearTimeout(timer);
    timer = null;
    $("#sim-play").textContent = "Animar ⏯";
  }

  function tick() {
    const more = sim.step();
    draw();
    timer = more ? setTimeout(tick, +speed.value) : (stopAnim(), null);
  }

  $("#sim-load").onclick = load;
  $("#sim-step").onclick = () => { if (!sim) load(); if (sim) { sim.step(); draw(); } };
  $("#sim-back").onclick = () => { stopAnim(); if (sim && sim.back()) draw(); };
  $("#sim-run").onclick = () => { stopAnim(); if (!sim || sim.result) load(); if (sim) { sim.run(); draw(); } };
  $("#sim-play").onclick = () => {
    if (timer) return stopAnim();
    if (!sim || sim.result) load();
    if (!sim) return;
    $("#sim-play").textContent = "Pausa ⏸";
    timer = setTimeout(tick, +speed.value);
  };
  sel.onchange = () => (sel.value ? setExample(sel.value) : ((quick.innerHTML = ""), load()));
  inp.onkeydown = (e) => { if (e.key === "Enter") load(); };
  prog.oninput = () => { if (sel.value) { sel.value = ""; quick.innerHTML = ""; } };
  quick.onclick = (e) => { const b = e.target.closest("[data-q]"); if (b) { inp.value = b.dataset.q; load(); } };
  exSel.onchange = () => {
    verifyOut.innerHTML = "";
    const b = TM.build.find((x) => x.key === exSel.value);
    if (b) quick.innerHTML = quickButtons(b.cases.map((c) => c.w));
  };

  // Verifica el programa del textarea contra los casos del ejercicio elegido
  $("#sim-verify").onclick = () => {
    const b = TM.build.find((x) => x.key === exSel.value);
    if (!b) { verifyOut.innerHTML = `<p class="bad">Elegí primero un ejercicio.</p>`; return; }
    const m = TM.parse(prog.value);
    if (!m.states.length) { verifyOut.innerHTML = `<p class="bad">El programa no tiene reglas válidas.</p>`; return; }
    let ok = 0;
    const rows = b.cases.map((c) => {
      const s = runMachine(m, c.w);
      const want = "out" in c ? `acepta con ${c.out}` : c.ok ? "acepta" : "rechaza";
      const got = s.result === "acepta" && "out" in c ? `acepta con ${s.tapeText() || "(vacía)"}` : s.result;
      const good = "out" in c ? s.result === "acepta" && s.tapeText() === c.out : (s.result === "acepta") === c.ok;
      if (good) ok++;
      return `<tr class="${good ? "ok" : "bad"}"><td><button class="small" data-q="${esc(c.w)}">${esc(show(c.w))}</button></td><td>${esc(want)}</td><td>${good ? "✔" : "✘"} ${esc(got)}${good ? "" : `<br><span class="muted">${esc(s.reason)}</span>`}</td></tr>`;
    });
    const all = ok === b.cases.length;
    verifyOut.innerHTML = `<p class="status ${all ? "ok" : "bad"}">${all ? "✔ ¡Pasa todos los casos!" : `✘ Pasa ${ok} de ${b.cases.length} casos`}</p>
      <table class="tbl"><tr><th>Entrada</th><th>Esperado</th><th>Tu MT</th></tr>${rows.join("")}</table>`;
  };
  verifyOut.onclick = quick.onclick;

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sim], [data-build]");
    if (!b) return;
    if (b.dataset.build) setExercise(b.dataset.build);
    else setExample(b.dataset.sim, b.dataset.input);
    openSection("simulador");
  });

  // ---------- Modo "Adiviná el paso" ----------
  const NONE = "__none";
  let guessStats = { ok: 0, total: 0 };
  const guessOn = $("#sim-guess-on"), guessBox = $("#sim-guess");

  function updateGuess() {
    guessBox.hidden = !guessOn.checked;
    if (!guessOn.checked) return;
    const live = sim && !sim.result;
    $("#g-from").innerHTML = !sim ? "—" : live ? `${sim.state}, leyendo ${esc(sim.read())}` : "la ejecución terminó";
    $("#g-check").disabled = !live;
    const to = $("#g-to"), prev = to.value;
    to.innerHTML = (machine ? machine.states : []).map((s) => `<option>${s}</option>`).join("") + `<option value="${NONE}">no hay regla (rechaza)</option>`;
    if ([...to.options].some((o) => o.value === prev)) to.value = prev;
    $("#g-score").textContent = guessStats.total ? `Aciertos: ${guessStats.ok} / ${guessStats.total}` : "";
  }

  guessOn.onchange = () => { $("#g-result").textContent = ""; updateGuess(); };
  $("#g-check").onclick = () => {
    if (!sim || sim.result) return;
    const rule = sim.nextRule();
    const w = TM.normSymbol($("#g-write").value.trim() || sim.read());
    const to = $("#g-to").value;
    const good = rule ? w === rule.write && $("#g-dir").value === rule.dir && to === rule.to : to === NONE;
    guessStats.total++;
    if (good) guessStats.ok++;
    const res = $("#g-result");
    res.className = good ? "ok" : "bad";
    res.textContent = good ? "✔ ¡Bien!" : `✘ Era: ${rule ? `${rule.write},${rule.dir} - ${rule.to}` : "no hay regla, rechaza"}`;
    $("#g-write").value = "";
    sim.step();
    draw();
  };

  setExample("L6", "aabbcc");

  // ---------- Autoevaluación ----------
  // Renderiza preguntas con las opciones mezcladas; devuelve la función que corrige.
  function renderQuiz(container, questions) {
    container.innerHTML = "";
    const cards = questions.map((q, i) => {
      const order = shuffle(q.options.map((_, j) => j));
      const div = document.createElement("div");
      div.className = "card question";
      const name = `${container.id}-${i}`;
      div.innerHTML = `<p><b>${i + 1}.</b> ${esc(q.q)}</p>` +
        order.map((j) => `<label class="opt"><input type="radio" name="${name}" value="${j}"> ${esc(q.options[j])}</label>`).join("") +
        `<p class="why" hidden></p>`;
      container.appendChild(div);
      return div;
    });
    return () => {
      let ok = 0;
      questions.forEach((q, i) => {
        const card = cards[i];
        const chosen = $("input:checked", card);
        const good = chosen && +chosen.value === q.answer;
        if (good) ok++;
        card.classList.toggle("right", !!good);
        card.classList.toggle("wrong", !good);
        const why = $(".why", card);
        why.hidden = false;
        why.innerHTML = `${good ? "✔ Correcto." : `✘ Respuesta: <b>${esc(q.options[q.answer])}</b>.`} ${esc(q.why)}`;
      });
      return ok;
    };
  }

  const checkQuiz = renderQuiz($("#quiz"), TM.quiz);
  $("#quiz-check").onclick = () => { $("#quiz-score").textContent = `Puntaje: ${checkQuiz()} / ${TM.quiz.length}`; };

  // ---------- Simulacro ----------
  let mockTimer = null, checkMock = null, mockQs = [];
  const mockTimerEl = $("#mock-timer");
  $("#mock-start").onclick = () => {
    clearInterval(mockTimer);
    mockQs = shuffle(TM.quiz).slice(0, 10);
    checkMock = renderQuiz($("#mock-quiz"), mockQs);
    const b = shuffle(TM.build)[0], d = shuffle(TM.discover)[0];
    $("#mock-tasks").innerHTML = `<div class="card"><h3>A. Construí la MT: ${b.title}</h3><p>${b.text}</p>
        <button class="small" data-build="${b.key}">Resolver en el simulador ✎</button> y después «Verificar mi MT».</div>
      <div class="card"><h3>B. ¿Qué ${d.mode === "output" ? "computa" : "lenguaje reconoce"} la ${TM.machines[d.key].title}?</h3>
        <pre class="code">${esc(TM.machines[d.key].program)}</pre>
        <label class="block">Tu respuesta <input type="text" autocomplete="off"></label>
        <details><summary>Ver solución (al terminar)</summary>${d.solution}</details></div>
      <h3>C. Preguntas</h3>`;
    $("#mock").hidden = false;
    $("#mock-score").textContent = "";
    $("#mock-start").textContent = "Reiniciar simulacro";
    const end = Date.now() + 60 * 60 * 1000;
    const tickMock = () => {
      const left = Math.max(0, end - Date.now());
      const mm = String(Math.floor(left / 60000)).padStart(2, "0"), ss = String(Math.floor(left / 1000) % 60).padStart(2, "0");
      mockTimerEl.textContent = `⏱ ${mm}:${ss}`;
      mockTimerEl.classList.toggle("bad", left < 5 * 60 * 1000);
      if (!left) { clearInterval(mockTimer); mockTimerEl.textContent = "⏱ ¡Tiempo!"; }
    };
    tickMock();
    mockTimer = setInterval(tickMock, 1000);
  };
  $("#mock-check").onclick = () => {
    if (!checkMock) return;
    clearInterval(mockTimer);
    $("#mock-score").textContent = `Preguntas: ${checkMock()} / ${mockQs.length}. Revisá A y B con el verificador y la solución.`;
  };

  // ---------- Hoja resumen ----------
  $("#print-sheet").onclick = () => {
    document.body.classList.add("print-sheet");
    window.print();
  };
  window.addEventListener("afterprint", () => document.body.classList.remove("print-sheet"));
})();
