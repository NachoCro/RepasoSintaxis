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
    const sym = this.read();
    const rule = this.m.rules.get(`${this.state}|${sym}`);
    if (!rule) {
      this.log.push(`${this.state} - ${sym},?,? - ?`);
      this.halt("rechaza", `No hay regla para (${this.state}, ${sym}): la MT se detiene sin llegar a un estado final`);
      return false;
    }
    while (this.tape.length <= this.head) this.tape.push(TM.BLANK);
    this.tape[this.head] = rule.write;
    this.head += rule.dir === "R" ? 1 : -1;
    this.state = rule.to;
    this.lastRule = rule;
    this.steps++;
    const fin = this.m.finals.has(rule.to);
    this.log.push(`${rule.from} - ${rule.read},${rule.write},${rule.dir} - ${rule.to}${fin ? "+" : ""}`);

    if (fin) {
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

  run() {
    while (this.step());
  }

  tapeText() {
    let t = this.tape.join("");
    return t.replace(/□+$/, "");
  }
};
