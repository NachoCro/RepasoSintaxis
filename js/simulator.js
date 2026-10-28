window.TM = window.TM || {};

TM.Simulator = class {
  constructor(machine, input, maxSteps = 5000) {
    this.m = machine;
    this.tape = [...input].map(TM.normSymbol);
    this.head = 0;
    this.state = machine.initial;
    this.steps = 0;
    this.maxSteps = maxSteps;
    this.log = [];
    this.lastRule = null;
    this.result = null; // null | "acepta" | "rechaza"
    this.reason = "";
    this.history = []; // instantáneas para "Paso ◀"
    if (machine.finals.has(this.state)) this.halt("acepta", "El estado inicial es final");
  }

  read() {
    return this.tape[this.head] ?? TM.BLANK;
  }

  halt(result, reason) {
    this.result = result;
    this.reason = reason;
  }

  step() {
    if (this.result) return false;
    this.history.push({ tape: [...this.tape], head: this.head, state: this.state, steps: this.steps, lastRule: this.lastRule, logLen: this.log.length });
    const sym = this.read();
    const rule = this.m.rules.get(`${this.state}|${sym}`);
    if (!rule) {
      this.log.push({ from: this.state, read: sym, missing: true });
      this.halt("rechaza", `No hay regla para (${this.state}, ${sym}): la MT se detiene sin llegar a un estado final`);
      return false;
    }
    while (this.tape.length <= this.head) this.tape.push(TM.BLANK);
    this.tape[this.head] = rule.write;
    this.head += rule.dir === "R" ? 1 : -1;
    this.state = rule.to;
    this.lastRule = rule;
    this.steps++;
    this.log.push(rule);

    if (this.m.finals.has(rule.to)) {
      this.head = Math.max(this.head, 0);
      this.halt("acepta", `Llegó al estado final ${rule.to}`);
    } else if (this.head < 0) {
      this.head = 0;
      this.halt("rechaza", "La cabeza intentó moverse a la izquierda del primer carácter");
    } else if (this.steps >= this.maxSteps) {
      this.halt("rechaza", `Se superaron ${this.maxSteps} pasos (¿ciclo infinito?)`);
    }
    return !this.result;
  }

  back() {
    const h = this.history.pop();
    if (!h) return false;
    Object.assign(this, { tape: h.tape, head: h.head, state: h.state, steps: h.steps, lastRule: h.lastRule, result: null, reason: "" });
    this.log.length = h.logLen;
    return true;
  }

  // Regla que se aplicaría en el próximo paso (undefined si no hay)
  nextRule() {
    return this.m.rules.get(`${this.state}|${this.read()}`);
  }

  run() {
    while (this.step());
  }

  tapeText() {
    let t = this.tape.join("");
    return t.replace(/□+$/, "");
  }
};

// MT de 2 cintas: la entrada va en la cinta 1 y la cinta 2 empieza en blanco.
// Cada paso lee las dos celdas, escribe en las dos y mueve cada cabeza (R, L o S).
TM.Simulator2 = class {
  constructor(machine, input, maxSteps = 5000) {
    this.m = machine;
    this.tapes = [[...input].map(TM.normSymbol), []];
    this.heads = [0, 0];
    this.state = machine.initial;
    this.steps = 0;
    this.maxSteps = maxSteps;
    this.log = []; // reglas aplicadas; la última puede ser { from, read, missing: true }
    this.lastRule = null;
    this.result = null;
    this.reason = "";
    this.history = [];
    if (machine.finals.has(this.state)) this.halt("acepta", "El estado inicial es final");
  }

  read() {
    return this.tapes.map((t, k) => t[this.heads[k]] ?? TM.BLANK);
  }

  halt(result, reason) {
    this.result = result;
    this.reason = reason;
  }

  step() {
    if (this.result) return false;
    this.history.push({ tapes: this.tapes.map((t) => [...t]), heads: [...this.heads], state: this.state, steps: this.steps, lastRule: this.lastRule, logLen: this.log.length });
    const syms = this.read();
    const rule = this.nextRule();
    if (!rule) {
      this.log.push({ from: this.state, read: syms, missing: true });
      this.halt("rechaza", `No hay regla para (${this.state}, ${syms.join(", ")}): la MT se detiene sin llegar a un estado final`);
      return false;
    }
    this.tapes.forEach((t, k) => {
      while (t.length <= this.heads[k]) t.push(TM.BLANK);
      t[this.heads[k]] = rule.write[k];
      this.heads[k] += rule.dir[k] === "R" ? 1 : rule.dir[k] === "L" ? -1 : 0;
    });
    this.state = rule.to;
    this.lastRule = rule;
    this.steps++;
    this.log.push(rule);

    const off = this.heads.findIndex((h) => h < 0);
    if (this.m.finals.has(rule.to)) {
      this.heads = this.heads.map((h) => Math.max(h, 0));
      this.halt("acepta", `Llegó al estado final ${rule.to}`);
    } else if (off >= 0) {
      this.heads[off] = 0;
      this.halt("rechaza", `La cabeza de la cinta ${off + 1} intentó moverse a la izquierda de la primera celda`);
    } else if (this.steps >= this.maxSteps) {
      this.halt("rechaza", `Se superaron ${this.maxSteps} pasos (¿ciclo infinito?)`);
    }
    return !this.result;
  }

  back() {
    const h = this.history.pop();
    if (!h) return false;
    Object.assign(this, { tapes: h.tapes, heads: h.heads, state: h.state, steps: h.steps, lastRule: h.lastRule, result: null, reason: "" });
    this.log.length = h.logLen;
    return true;
  }

  nextRule() {
    return this.m.rules.get(`${this.state}|${this.read().join("|")}`);
  }

  run() {
    while (this.step());
  }

  tapeText(k = 0) {
    return this.tapes[k].join("").replace(/□+$/, "");
  }
};
