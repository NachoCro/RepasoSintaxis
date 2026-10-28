window.TM = window.TM || {};

TM.BLANK = "□";

TM.normSymbol = (s) => (s === "_" || s === "␣" || s === "B̲" ? TM.BLANK : s);

// Convierte un programa en notación Muchnik en una máquina:
// { rules: Map("estado|símbolo" -> regla), states, initial, finals, errors }
TM.parse = function (text) {
  const rules = new Map();
  const rows = [];
  const states = [];
  const finals = new Set();
  const errors = [];
  const addState = (s) => { if (!states.includes(s)) states.push(s); };
  const re = /^(\w+)\+?\s*[-–]\s*(\S)\s*,\s*(\S)\s*,\s*([RLrl])\s*[-–]\s*(\w+)(\+?)$/;

  text.split("\n").forEach((raw, i) => {
    const comment = (raw.match(/\/\*(.*?)\*\//) || ["", ""])[1].trim();
    const line = raw.replace(/\/\*.*?\*\//g, "").replace(/\/\/.*$/, "").trim();
    if (!line) return;
    const m = line.match(re);
    if (!m) {
      errors.push(`Fila ${i + 1}: formato inválido (revisá que estén el estado, lo que lee, escribe, el movimiento R o L y el próximo estado)`);
      return;
    }
    const [, from, r, w, dir, to, plus] = m;
    const rule = { from, read: TM.normSymbol(r), write: TM.normSymbol(w), dir: dir.toUpperCase(), to, line: i + 1, comment };
    const key = `${from}|${rule.read}`;
    if (rules.has(key)) {
      errors.push(`Fila ${i + 1}: ya existe una regla para (${from}, ${rule.read}); la MT debe ser determinística`);
      return;
    }
    rules.set(key, rule);
    rows.push(rule);
    addState(from);
    addState(to);
    if (plus) finals.add(to);
  });

  const num = (s) => { const n = s.match(/\d+/); return n ? +n[0] : Infinity; };
  const initial = states.includes("e0") ? "e0" : states[0];
  states.sort((a, b) => num(a) - num(b) || a.localeCompare(b));

  return { tapes: 1, rules, rows, states, initial, finals, errors };
};

// Separa cada línea en sus 6 campos (para cargar el editor en forma de grilla)
TM.fields1 = function (text) {
  return text.split("\n").map((raw) => {
    const comment = (raw.match(/\/\*(.*?)\*\//) || ["", ""])[1].trim();
    const line = raw.replace(/\/\*.*?\*\//g, "").replace(/\/\/.*$/, "").trim();
    if (!line) return null;
    const [from = "", mid = "", to = ""] = line.split(/\s*[-–]\s+|\s+[-–]\s*/);
    const [r = "", w = "", d = "R"] = mid.split(",").map((x) => x.trim());
    return [from, r, w, d.toUpperCase(), to, comment];
  }).filter(Boolean);
};

// Agrupa las reglas en una tabla estado × símbolo.
TM.table = function (machine) {
  const symbols = [];
  for (const r of machine.rules.values()) if (!symbols.includes(r.read)) symbols.push(r.read);
  symbols.sort((a, b) => (a === TM.BLANK) - (b === TM.BLANK) || a.localeCompare(b));
  return { symbols, get: (s, x) => machine.rules.get(`${s}|${x}`) };
};

// MT de 2 cintas. Cada fila del programa es:
// estado | leído escrito mov (cinta 1) | leído escrito mov (cinta 2) | estado de llegada  /* comentario */
// mov: R, L o S (la cabeza se queda). El estado final se marca con "+".
TM.MOVES = ["R", "L", "S"];

// Separa cada línea en sus 9 campos (para cargar el editor en forma de grilla)
TM.fields2 = function (text) {
  return text.split("\n").filter((l) => l.includes("|")).map((raw) => {
    const comment = (raw.match(/\/\*(.*?)\*\//) || ["", ""])[1].trim();
    const [from = "", c1 = "", c2 = "", to = ""] = raw.replace(/\/\*.*?\*\//g, "").split("|").map((s) => s.trim());
    const t = (c) => { const p = c.split(/[\s,]+/).filter(Boolean); return [p[0] || "", p[1] || "", (p[2] || "R").toUpperCase()]; };
    return [from, ...t(c1), ...t(c2), to, comment];
  });
};

TM.parse2 = function (text) {
  const rules = new Map();
  const rows = [];
  const states = [];
  const finals = new Set();
  const errors = [];
  const addState = (s) => { if (!states.includes(s)) states.push(s); };
  const sym = (s) => s && [...s].length === 1;

  text.split("\n").forEach((raw, i) => {
    const comment = (raw.match(/\/\*(.*?)\*\//) || ["", ""])[1].trim();
    const line = raw.replace(/\/\*.*?\*\//g, "").replace(/\/\/.*$/, "").trim();
    if (!line) return;
    const bad = (msg) => errors.push(`Fila ${i + 1}: ${msg}`);
    const parts = line.split("|").map((s) => s.trim());
    if (parts.length !== 4) return bad("debe tener estado | cinta 1 | cinta 2 | estado de llegada");
    const [from, c1, c2, toRaw] = parts;
    const tape = (c) => {
      const p = c.split(/[\s,]+/).filter(Boolean);
      if (p.length !== 3 || !sym(p[0]) || !sym(p[1]) || !/^[RLS]$/i.test(p[2])) return null;
      return [TM.normSymbol(p[0]), TM.normSymbol(p[1]), p[2].toUpperCase()];
    };
    const t1 = tape(c1), t2 = tape(c2), to = toRaw.match(/^(\w+)(\+?)$/);
    if (!/^\w+$/.test(from)) return bad("falta el estado actual");
    if (!t1) return bad("en la cinta 1 hay que indicar un carácter leído, uno escrito y el movimiento (R, L o S)");
    if (!t2) return bad("en la cinta 2 hay que indicar un carácter leído, uno escrito y el movimiento (R, L o S)");
    if (!to) return bad("falta el estado de llegada");
    const rule = {
      from, to: to[1], line: i + 1, comment,
      read: [t1[0], t2[0]], write: [t1[1], t2[1]], dir: [t1[2], t2[2]],
    };
    rule.label = `${rule.read.join("")}/${rule.write.join("")},${rule.dir.join("")}`;
    const key = `${from}|${rule.read.join("|")}`;
    if (rules.has(key)) return bad(`ya existe una regla para (${from}, ${rule.read.join(", ")}); la MT debe ser determinística`);
    rules.set(key, rule);
    rows.push(rule);
    addState(from);
    addState(rule.to);
    if (to[2]) finals.add(rule.to);
  });

  const num = (s) => { const n = s.match(/\d+/); return n ? +n[0] : Infinity; };
  const initial = states.includes("e0") ? "e0" : states[0];
  states.sort((a, b) => num(a) - num(b) || a.localeCompare(b));

  return { tapes: 2, rules, rows, states, initial, finals, errors };
};

TM.compile = (text, tapes = 1) => (tapes === 2 ? TM.parse2(text) : TM.parse(text));
TM.compileDef = (def) => TM.compile(def.program, def.tapes || 1);
TM.newSim = (m, w) => (m.tapes === 2 ? new TM.Simulator2(m, w) : new TM.Simulator(m, w));
