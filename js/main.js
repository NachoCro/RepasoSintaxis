(function () {
  const $ = (s, root = document) => root.querySelector(s);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Resalta los comentarios /* */ dentro del código
  const highlight = (code) => esc(code).replace(/\/\*.*?\*\//g, (m) => `<span class="cm">${m}</span>`);

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
        .map((w) => `<button class="small" data-sim="${key}" data-input="${esc(w)}">Simular «${esc(w)}»</button>`)
        .join("")}</div>`;
    TM.renderDiagram($("svg", container), m);
  }

  document.querySelectorAll(".example").forEach((el) => renderExample(el, el.dataset.machine));
  document.querySelectorAll("[data-table]").forEach((el) => (el.innerHTML = tableHTML(TM.parse(TM.machines[el.dataset.table].program))));

  // ---------- Descubrir el lenguaje ----------
  const dl = $("#discover-list");
  TM.discover.forEach((d, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span class="tag extra">Práctica</span>
      <h2>${TM.machines[d.key].title}</h2>
      <div class="example"></div>
      <details><summary>Pista</summary><p>${d.hint}</p></details>
      <details><summary>Ver solución</summary>${d.solution}</details>`;
    dl.appendChild(card);
    renderExample($(".example", card), d.key);
    void i;
  });

  // ---------- Simulador ----------
  const sel = $("#sim-example"), prog = $("#sim-program"), inp = $("#sim-input");
  const tapeEl = $("#sim-tape"), statusEl = $("#sim-status"), infoEl = $("#sim-info");
  const logEl = $("#sim-log"), errEl = $("#sim-errors"), diag = $("#sim-diagram"), quick = $("#sim-quick");
  let machine = null, sim = null, timer = null;

  for (const [k, d] of Object.entries(TM.machines)) sel.add(new Option(d.title, k));
  sel.add(new Option("(programa propio)", ""));

  function setExample(key, input) {
    if (key) {
      sel.value = key;
      prog.value = TM.machines[key].program;
      inp.value = input ?? TM.machines[key].inputs[0];
      quick.innerHTML = "Probar: " + TM.machines[key].inputs.map((w) => `<button class="small" data-q="${esc(w)}">${esc(w)}</button>`).join("");
    }
    load();
  }

  function load() {
    stopAnim();
    machine = TM.parse(prog.value);
    errEl.innerHTML = machine.errors.map((e) => `<div>⚠ ${esc(e)}</div>`).join("");
    if (!machine.states.length) {
      sim = null;
      statusEl.textContent = "El programa no tiene reglas válidas.";
      statusEl.className = "status";
      tapeEl.innerHTML = ""; diag.innerHTML = ""; logEl.textContent = "";
      return;
    }
    sim = new TM.Simulator(machine, inp.value.trim());
    draw();
  }

  function draw() {
    const from = 0;
    const to = Math.max(sim.tape.length, sim.head + 1) + 3;
    let h = "";
    for (let i = from; i < to; i++) {
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
  }

  function stopAnim() {
    clearInterval(timer);
    timer = null;
    $("#sim-play").textContent = "Animar ⏯";
  }

  $("#sim-load").onclick = load;
  $("#sim-step").onclick = () => { if (!sim) load(); if (sim) { sim.step(); draw(); } };
  $("#sim-run").onclick = () => { stopAnim(); if (!sim || sim.result) load(); if (sim) { sim.run(); draw(); } };
  $("#sim-play").onclick = () => {
    if (timer) return stopAnim();
    if (!sim || sim.result) load();
    if (!sim) return;
    $("#sim-play").textContent = "Pausa ⏸";
    timer = setInterval(() => { if (!sim.step()) stopAnim(); draw(); }, 450);
  };
  sel.onchange = () => (sel.value ? setExample(sel.value) : ((quick.innerHTML = ""), load()));
  inp.onkeydown = (e) => { if (e.key === "Enter") load(); };
  prog.oninput = () => { if (sel.value) sel.value = ""; quick.innerHTML = ""; };
  quick.onclick = (e) => { const b = e.target.closest("[data-q]"); if (b) { inp.value = b.dataset.q; load(); } };

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sim]");
    if (!b) return;
    setExample(b.dataset.sim, b.dataset.input);
    $("#simulador").scrollIntoView({ behavior: "smooth" });
  });

  setExample("L6", "aabbcc");

  // ---------- Autoevaluación ----------
  const qz = $("#quiz");
  TM.quiz.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "card question";
    div.innerHTML = `<p><b>${i + 1}.</b> ${esc(q.q)}</p>` +
      q.options.map((o, j) => `<label class="opt"><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`).join("") +
      `<p class="why" hidden></p>`;
    qz.appendChild(div);
  });
  $("#quiz-check").onclick = () => {
    let ok = 0;
    TM.quiz.forEach((q, i) => {
      const card = qz.children[i];
      const sel = $(`input[name=q${i}]:checked`, card);
      const good = sel && +sel.value === q.answer;
      if (good) ok++;
      card.classList.toggle("right", !!good);
      card.classList.toggle("wrong", !good);
      const why = $(".why", card);
      why.hidden = false;
      why.innerHTML = `${good ? "✔ Correcto." : `✘ Respuesta: <b>${esc(q.options[q.answer])}</b>.`} ${esc(q.why)}`;
    });
    $("#quiz-score").textContent = `Puntaje: ${ok} / ${TM.quiz.length}`;
  };
})();
