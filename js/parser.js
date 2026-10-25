window.TM = window.TM || {};

TM.BLANK = "□";

TM.normSymbol = (s) => (s === "_" || s === "␣" || s === "B̲" ? TM.BLANK : s);

// Convierte un programa en notación Muchnik en una máquina:
// { rules: Map("estado|símbolo" -> regla), states, initial, finals, errors }
TM.parse = function (text) {
  const rules = new Map();
  const states = [];
  const finals = new Set();
  const errors = [];
  const addState = (s) => { if (!states.includes(s)) states.push(s); };
  const re = /^(\w+)\+?\s*[-–]\s*(\S)\s*,\s*(\S)\s*,\s*([RLrl])\s*[-–]\s*(\w+)(\+?)$/;

  text.split("\n").forEach((raw, i) => {
    const line = raw.replace(/\/\*.*?\*\//g, "").replace(/\/\/.*$/, "").trim();
    if (!line) return;
    const m = line.match(re);
    if (!m) {
      errors.push(`Línea ${i + 1}: formato inválido → "${raw.trim()}"`);
      return;
    }
    const [, from, r, w, dir, to, plus] = m;
    const rule = { from, read: TM.normSymbol(r), write: TM.normSymbol(w), dir: dir.toUpperCase(), to, line: i + 1 };
    const key = `${from}|${rule.read}`;
    if (rules.has(key)) {
      errors.push(`Línea ${i + 1}: ya existe una regla para (${from}, ${rule.read}); la MT debe ser determinística`);
      return;
    }
    rules.set(key, rule);
    addState(from);
    addState(to);
    if (plus) finals.add(to);
  });

  const num = (s) => { const n = s.match(/\d+/); return n ? +n[0] : Infinity; };
  const initial = states.includes("e0") ? "e0" : states[0];
  states.sort((a, b) => num(a) - num(b) || a.localeCompare(b));

  return { rules, states, initial, finals, errors };
};

// Agrupa las reglas en una tabla estado × símbolo.
TM.table = function (machine) {
  const symbols = [];
  for (const r of machine.rules.values()) if (!symbols.includes(r.read)) symbols.push(r.read);
  symbols.sort((a, b) => (a === TM.BLANK) - (b === TM.BLANK) || a.localeCompare(b));
  return { symbols, get: (s, x) => machine.rules.get(`${s}|${x}`) };
};
