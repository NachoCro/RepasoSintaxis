window.TM = window.TM || {};

// Dibuja el diagrama de estados de una MT en un <svg>.
// hl = { current: estado actual, rule: última regla aplicada }
TM.renderDiagram = function (svg, machine, hl = {}) {
  const NS = "http://www.w3.org/2000/svg";
  const id = svg.id || (svg.id = "d" + Math.random().toString(36).slice(2, 8));
  const states = machine.states;
  const n = states.length;
  const r = 24;
  const W = 760;
  const H = n <= 2 ? 300 : n <= 5 ? 520 : 640;
  const cx = W / 2, cy = H / 2;
  const R = n <= 1 ? 0 : Math.min(W, H) / 2 - 105;

  const pos = {};
  states.forEach((s, i) => {
    const a = n === 2 ? Math.PI + i * Math.PI : -Math.PI / 2 + (2 * Math.PI * i) / n;
    pos[s] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });

  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e);
    return e;
  };

  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const defs = el("defs", {});
  for (const [name, cls] of [["arrow", "edge-head"], ["arrowhl", "edge-head hl"]]) {
    const mk = el("marker", { id: `${id}-${name}`, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
    el("path", { d: "M0,0 L10,5 L0,10 z", class: cls }, mk);
  }

  // Agrupar reglas por par (origen, destino)
  const groups = new Map();
  for (const rule of machine.rules.values()) {
    const k = `${rule.from}→${rule.to}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(rule);
  }

  const edgesLayer = el("g", {});
  const labelsLayer = el("g", {});

  const label = (x, y, rules, isHl) => {
    const t = el("text", { x, y, class: "edge-label" + (isHl ? " hl" : ""), "text-anchor": "middle" }, labelsLayer);
    const lines = rules.map((q) => `${q.read}/${q.write},${q.dir}`);
    const y0 = -((lines.length - 1) * 13) / 2;
    lines.forEach((ln, i) => {
      const ts = el("tspan", { x, dy: i === 0 ? y0 + 4 : 13 }, t);
      ts.textContent = ln;
    });
  };

  for (const [k, rules] of groups) {
    const { from, to } = rules[0];
    const isHl = hl.rule && rules.includes(hl.rule);
    const cls = "edge" + (isHl ? " hl" : "");
    const marker = `url(#${id}-${isHl ? "arrowhl" : "arrow"})`;
    const p = pos[from];

    if (from === to) {
      let dx = p.x - cx, dy = p.y - cy;
      let d = Math.hypot(dx, dy);
      if (d < 1) { dx = 0; dy = -1; d = 1; }
      const ux = dx / d, uy = dy / d;
      const rot = (a) => ({ x: ux * Math.cos(a) - uy * Math.sin(a), y: ux * Math.sin(a) + uy * Math.cos(a) });
      const s = rot(-0.5), e = rot(0.5), c1 = rot(-0.7), c2 = rot(0.7);
      const L = r * 3.2;
      el("path", {
        d: `M${p.x + s.x * r},${p.y + s.y * r} C${p.x + c1.x * L},${p.y + c1.y * L} ${p.x + c2.x * L},${p.y + c2.y * L} ${p.x + e.x * r},${p.y + e.y * r}`,
        class: cls, "marker-end": marker,
      }, edgesLayer);
      const off = r * 2.75 + rules.length * 6.5;
      label(p.x + ux * off, p.y + uy * off, rules, isHl);
      continue;
    }

    const q = pos[to];
    const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
    const nx = -dy / d, ny = dx / d;
    const bend = groups.has(`${to}→${from}`) ? 38 : 16;
    const c = { x: (p.x + q.x) / 2 + nx * bend, y: (p.y + q.y) / 2 + ny * bend };
    const toward = (a, b, rad) => { const l = Math.hypot(b.x - a.x, b.y - a.y); return { x: a.x + ((b.x - a.x) / l) * rad, y: a.y + ((b.y - a.y) / l) * rad }; };
    const s = toward(p, c, r), e = toward(q, c, r + 1);
    el("path", { d: `M${s.x},${s.y} Q${c.x},${c.y} ${e.x},${e.y}`, class: cls, "marker-end": marker }, edgesLayer);
    const mx = 0.25 * p.x + 0.5 * c.x + 0.25 * q.x;
    const my = 0.25 * p.y + 0.5 * c.y + 0.25 * q.y;
    label(mx + nx * 10, my + ny * 10, rules, isHl);
  }

  // Flecha de estado inicial
  if (machine.initial && pos[machine.initial]) {
    const p = pos[machine.initial];
    el("path", {
      d: `M${p.x - r - 34},${p.y} L${p.x - r - 2},${p.y}`,
      class: "edge start", "marker-end": `url(#${id}-arrow)`,
    }, edgesLayer);
  }

  for (const s of states) {
    const p = pos[s];
    const fin = machine.finals.has(s);
    const cur = hl.current === s;
    const g = el("g", { class: "node" + (cur ? " current" : "") + (fin ? " final" : "") });
    el("circle", { cx: p.x, cy: p.y, r }, g);
    if (fin) el("circle", { cx: p.x, cy: p.y, r: r - 4, class: "inner" }, g);
    const t = el("text", { x: p.x, y: p.y + 5, "text-anchor": "middle" }, g);
    t.textContent = s;
    const sup = s === machine.initial ? "−" : "";
    if (sup || fin) {
      const ts = el("tspan", { dy: -9, class: "sup" }, t);
      ts.textContent = sup + (fin ? "+" : "");
    }
  }
};
