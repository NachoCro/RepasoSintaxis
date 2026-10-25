window.TM = window.TM || {};

TM.quiz = [
  {
    q: "Según Muchnik, una Máquina de Turing es un autómata…",
    options: ["No determinístico con pila", "Determinístico capaz de reconocer cualquier lenguaje formal", "Finito que solo reconoce lenguajes regulares", "Determinístico que solo reconoce LICs"],
    answer: 1,
    why: "Cap. 7: «Una MT es un autómata determinístico con la capacidad de reconocer cualquier lenguaje formal».",
  },
  {
    q: "¿Cuál de estos NO es uno de los 6 componentes de una MT?",
    options: ["Una cinta infinita dividida en celdas", "Un alfabeto A′ de símbolos que pueden escribirse", "Una pila de símbolos", "Un programa (conjunto de reglas)"],
    answer: 2,
    why: "La pila es propia del Autómata Finito con Pila (AFP). La MT tiene: A, cinta, cabeza, A′, estados y programa.",
  },
  {
    q: "¿Qué puede hacer la cabeza de cinta en UN solo paso?",
    options: ["Leer varias celdas y moverse dos posiciones", "Leer una celda, escribir (otro carácter o el mismo) y moverse una celda a izquierda o derecha", "Solo leer y avanzar a la derecha", "Escribir sin leer"],
    answer: 1,
    why: "Lee el contenido de una celda, lo reemplaza por otro carácter o deja el mismo, y se reposiciona en la celda contigua (R o L).",
  },
  {
    q: "En la regla «e2 - c,Z,L - e3», ¿qué significa cada parte?",
    options: ["En e2, si lee Z escribe c, va a la izquierda y pasa a e3", "En e2, si lee c escribe Z, se mueve a la izquierda y pasa a e3", "En e3, si lee c escribe Z y vuelve a e2", "En e2 lee c y Z y se queda en e2"],
    answer: 1,
    why: "Formato: estado actual - carácter leído, carácter escrito, dirección - estado de llegada.",
  },
  {
    q: "¿Para qué sirve el blanco (□) después de la cadena?",
    options: ["Para separar estados", "Actúa como centinela que indica el fin de la cadena, como '\\0' en ANSI C", "Indica el estado de rechazo", "No sirve para nada"],
    answer: 1,
    why: "Muchnik compara al blanco con el '\\0' de las cadenas en C.",
  },
  {
    q: "¿Por qué L₆ = {aⁿbⁿcⁿ / n ≥ 1} necesita una MT?",
    options: ["Porque es regular", "Porque no es regular ni LIC: no lo reconoce un AFD ni un AFP", "Porque es infinito", "Porque tiene tres letras"],
    answer: 1,
    why: "L₆ no es Regular (no lo reconoce un AFD) ni LIC (no lo reconoce un AFP), pero sí una MT.",
  },
  {
    q: "La MT, además de reconocer lenguajes, puede…",
    options: ["Solo reconocer, nada más", "Computar: realizar lo que hace una computadora", "Solo reconocer lenguajes regulares", "Minimizar AFDs"],
    answer: 1,
    why: "«La MT no solo reconoce cualquier lenguaje formal de la Jerarquía de Chomsky, sino que también puede computar».",
  },
  {
    q: "En la traza de «abcc» con la MT de L₆, la máquina queda en e7 leyendo una c. ¿Qué ocurre?",
    options: ["Acepta, porque ya marcó todo", "Rechaza: no existe regla para (e7, c)", "Vuelve a e0", "Entra en ciclo infinito"],
    answer: 1,
    why: "Ejercicio 2 resuelto: «e7 - c,?,? - ?». Sin regla aplicable la MT se detiene sin estado final.",
  },
  {
    q: "La cabeza de cinta, ¿puede moverse a la izquierda de la celda del primer carácter?",
    options: ["Sí, siempre", "No, nunca", "Solo en el estado inicial", "Solo si lee un blanco"],
    answer: 1,
    why: "«La cabeza de cinta nunca se puede mover a la izquierda de la celda en la que se encuentra el primer carácter de la cadena a analizar».",
  },
];

// Ejercicios "¿qué lenguaje reconoce?"
TM.discover = [
  {
    key: "misterio1",
    hint: "Fijate qué marca en cada vuelta: ¿cuántas aes y cuántas bes por ciclo?",
    solution: `<p><b>L = {aⁿ bⁿ / n ≥ 1}</b></p>
<ul>
<li><b>e0</b>: marca una <code>a</code> con X (o, si ve Y, pasa a verificar).</li>
<li><b>e1</b>: avanza sobre aes e Y hasta la primera <code>b</code>, la marca con Y y retrocede.</li>
<li><b>e2</b>: retrocede hasta la X y vuelve a e0.</li>
<li><b>e3</b>: verifica que solo quedan Y y luego el blanco → acepta.</li>
</ul>
<p>Cada vuelta marca <b>1 a</b> y <b>1 b</b> → misma cantidad. Cadena más corta: <code>ab</code>.</p>`,
  },
  {
    key: "misterio2",
    hint: "No escribe nada nuevo y siempre va a la derecha: se comporta como un AFD.",
    solution: `<p><b>L = {aᵐ bⁿ / m ≥ 0, n ≥ 1}</b>, es decir, la ER <code>a*b⁺</code>.</p>
<p>e0 lee aes (ciclo), con la primera <code>b</code> pasa a e1, e1 lee bes y acepta en el blanco. Nunca modifica la cinta: es un AFD "disfrazado". Una MT también reconoce lenguajes regulares.</p>`,
  },
  {
    key: "misterio3",
    hint: "Compará con la MT 1: en e1 y e2, ¿cuántas bes se marcan por cada a?",
    solution: `<p><b>L = {aⁿ b²ⁿ / n ≥ 1}</b></p>
<p>Por cada <code>a</code> marcada (e0) marca <b>dos</b> bes: la primera en e1 (avanzando) y la segunda en e2 (que retrocede). Luego e3 vuelve hasta la X. e4 verifica que solo hay Y y el blanco. Cadena más corta: <code>abb</code>.</p>`,
  },
];
