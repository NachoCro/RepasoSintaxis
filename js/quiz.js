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
  {
    q: "Con la MT de L₆ y la cadena «aabbcc», ¿en qué estado está y qué lee después de 4 pasos?",
    options: ["e1, leyendo b", "e2, leyendo c", "e3, leyendo Y", "e0, leyendo a"],
    answer: 1,
    why: "e0-a,X,R-e1 · e1-a,a,R-e1 · e1-b,Y,R-e2 · e2-b,b,R-e2 → queda en e2 frente a la primera c.",
  },
  {
    q: "Con la MT de L₆ y la cadena «aabc», ¿qué ocurre?",
    options: ["Acepta", "Rechaza en e4 al leer una Z: falta una b", "Rechaza en e7 al leer una c", "Entra en ciclo infinito"],
    answer: 1,
    why: "En la 2° vuelta e1 saltea la Y (→e4), pero e4 encuentra Z en vez de una b libre y no hay regla para (e4, Z).",
  },
  {
    q: "En la tabla de transiciones de una MT, una celda vacía (–) significa que…",
    options: ["La MT se queda en el mismo estado", "La MT se mueve a la derecha sin escribir", "Si está en ese estado y lee ese símbolo, se detiene y rechaza", "Se acepta la cadena"],
    answer: 2,
    why: "No hay regla para ese par (estado, símbolo): la MT se detiene sin llegar a un estado final.",
  },
  {
    q: "Si a la MT de L₆ se le agrega la regla «e0 - □,□,L - e8+», ¿qué lenguaje reconoce?",
    options: ["{aⁿbⁿcⁿ / n ≥ 1}", "{aⁿbⁿcⁿ / n ≥ 0}", "{aⁿbⁿcⁿ⁺¹ / n ≥ 0}", "a*b*c*"],
    answer: 1,
    why: "La nueva regla acepta la cinta vacía (n = 0); el resto del comportamiento no cambia.",
  },
  {
    q: "¿Cuántos símbolos de cada tipo marca la MT de L₆ en cada vuelta de su ciclo principal?",
    options: ["Dos aes, una b y una c", "Una a, una b y una c", "Todas las aes primero, después todas las bes", "Una a y dos ces"],
    answer: 1,
    why: "e0 marca una a (X), e1/e4 una b (Y) y e2/e5 una c (Z); después e3 retrocede hasta la X.",
  },
  {
    q: "En la MT de L₆, ¿qué estado se encarga de retroceder hasta la última X?",
    options: ["e0", "e2", "e3", "e6"],
    answer: 2,
    why: "e3 tiene reglas Z,Z,L · b,b,L · Y,Y,L · a,a,L y con X,X,R vuelve a e0.",
  },
  {
    q: "Un programa tiene «e1 - a,a,R - e1» y «e1 - a,X,R - e2». ¿Qué problema tiene?",
    options: ["Ninguno", "No es determinístico: hay dos reglas para (e1, a)", "Falta el estado final", "No se puede escribir X"],
    answer: 1,
    why: "La MT es determinística: para cada par (estado, carácter leído) hay como mucho una regla.",
  },
  {
    q: "¿Puede una MT reconocer un lenguaje regular como a*b⁺?",
    options: ["No, solo reconoce lenguajes no regulares", "Sí: por ejemplo, sin escribir nada y moviéndose siempre a la derecha, como un AFD", "Solo si tiene una pila", "Solo si la cadena es finita"],
    answer: 1,
    why: "Todo lo que reconoce un AFD o un AFP también lo reconoce una MT (ver la MT misteriosa 2).",
  },
  {
    q: "En la MT del complemento binario, ¿qué pasa con la cinta?",
    options: ["Queda igual y solo se acepta o rechaza", "Cada 0 pasa a 1 y cada 1 pasa a 0; termina al leer el blanco", "Se borra toda la cadena", "Se duplica la cadena"],
    answer: 1,
    why: "Es una MT que computa: e0 - 0,1,R y e0 - 1,0,R, y con el blanco va al estado final.",
  },
  {
    q: "Una diferencia entre una MT y un AFP es que la MT…",
    options: ["Tiene una pila", "Solo lee la entrada hacia la derecha", "Puede escribir en la cinta y moverse a izquierda y derecha", "No tiene estados finales"],
    answer: 2,
    why: "El AFP lee la entrada de izquierda a derecha y usa una pila; la MT lee y escribe la misma cinta y se mueve en ambos sentidos.",
  },
  {
    q: "¿Una MT siempre termina su ejecución?",
    options: ["Sí, siempre acepta o rechaza", "No: puede quedar en un ciclo infinito", "Sí, porque la cinta es finita", "Solo termina si la cadena es vacía"],
    answer: 1,
    why: "A diferencia de un AF, una MT puede no detenerse nunca (por ejemplo, «e0 - a,a,R - e1» y «e1 - a,a,L - e0»).",
  },
  {
    q: "Para reconocer {aⁿbⁿcⁿ} la técnica clásica con MT es…",
    options: ["Contar con una pila", "Marcar (tachar) un símbolo de cada grupo en cada vuelta", "Recorrer una sola vez de izquierda a derecha", "Borrar toda la cadena"],
    answer: 1,
    why: "Se marca a→X, b→Y, c→Z en cada vuelta y al final se verifica que no quede nada sin marcar.",
  },
  {
    q: "¿Qué contiene el alfabeto A′?",
    options: ["Los estados de la MT", "Los símbolos que la cabeza puede escribir en la cinta (las marcas como X, Y, Z)", "Solo el blanco", "Las direcciones R y L"],
    answer: 1,
    why: "A es el alfabeto del lenguaje; A′ son los símbolos que se pueden escribir.",
  },
  {
    q: "En la MT de L₆, ¿para qué sirven e6 y e7?",
    options: ["Para marcar aes", "Para verificar que solo queden Ys y luego Zs antes del blanco (que no sobren bes ni ces)", "Para retroceder", "Para borrar las marcas"],
    answer: 1,
    why: "e6 recorre las Y, e7 las Z, y solo con el blanco transita a e8+. Cualquier b o c libre provoca el rechazo.",
  },
  {
    q: "Una MT tiene solo «e0 - a,a,R - e0» y «e0 - □,□,L - e1+». ¿Qué lenguaje reconoce?",
    options: ["a⁺", "a* (incluye la palabra vacía)", "{aⁿbⁿ}", "Ninguno"],
    answer: 1,
    why: "Con la cinta vacía e0 lee □ y acepta; con aes las recorre y acepta al llegar al blanco.",
  },
  {
    q: "En la notación de Muchnik, ¿cómo se indica que un estado es final?",
    options: ["Con un asterisco: e8*", "Con un signo más: e8+", "Con un círculo: (e8)", "Con una F: F8"],
    answer: 1,
    why: "Por ejemplo «e7 - □,□,L - e8+».",
  },
  {
    q: "¿Cuál de estas cadenas acepta la MT de L₇ = {aⁿbⁿcⁿ⁺¹ / n ≥ 1}?",
    options: ["aabbcc", "aabbccc", "abc", "aabbcccc"],
    answer: 1,
    why: "n = 2: dos aes, dos bes y tres ces.",
  },
  {
    q: "En una MT de 2 cintas, ¿dónde está la cadena a analizar al comenzar?",
    options: ["Repartida entre las dos cintas", "En la cinta 1; la cinta 2 empieza toda en blanco", "En la cinta 2; la cinta 1 es auxiliar", "Copiada en las dos cintas"],
    answer: 1,
    why: "La cinta 1 tiene la entrada (como en la MT de 1 cinta) y la cinta 2 es una cinta auxiliar que empieza con blancos.",
  },
  {
    q: "¿Qué hace una MT de 2 cintas en UN solo paso?",
    options: ["Lee solo una de las cintas, elegida según el estado", "Lee las dos celdas, escribe en las dos y mueve cada cabeza por separado (R, L o S)", "Mueve las dos cabezas siempre en la misma dirección", "Lee las dos cintas pero solo escribe en la primera"],
    answer: 1,
    why: "La regla depende del estado y del par de caracteres leídos; cada cinta tiene su propio carácter escrito y su propio movimiento.",
  },
  {
    q: "Comparada con la MT de 1 cinta, la MT de 2 cintas…",
    options: ["Reconoce más lenguajes", "Reconoce los mismos lenguajes, pero suele necesitar menos estados, reglas y pasos", "Reconoce menos lenguajes", "Solo puede computar, no reconocer"],
    answer: 1,
    why: "Son equivalentes: una MT de 1 cinta puede simular a una de 2 cintas. La de 2 cintas solo es más cómoda (ej. L₆: 7 reglas en lugar de 21).",
  },
  {
    q: "En la fila «e2 | b b R | X X L | e2», ¿qué ocurre?",
    options: ["En e2 lee b y X; la cinta 1 retrocede y la cinta 2 avanza", "En e2, con b en la cinta 1 y X en la cinta 2: deja los dos símbolos, la cabeza 1 avanza (R), la 2 retrocede (L) y sigue en e2", "Lee dos bes en la cinta 1 y dos X en la cinta 2", "Borra la b y la X y pasa a e2"],
    answer: 1,
    why: "Columnas de cada cinta: lee, escribe, mueve. Cinta 1: lee b, escribe b, R. Cinta 2: lee X, escribe X, L.",
  },
  {
    q: "En las MT de 2 cintas de este repaso, ¿para qué se escribe un # en la primera celda de la cinta 2?",
    options: ["Para indicar el estado final", "Para saber dónde empieza la cinta 2 al retroceder, sin moverse a la izquierda de su primera celda", "Porque la cinta 2 no tiene blancos", "Para separar las dos cintas"],
    answer: 1,
    why: "Igual que con 1 cinta, ninguna cabeza puede moverse a la izquierda de la primera celda: el # funciona como centinela del comienzo.",
  },
];


// Ejercicios "¿qué lenguaje reconoce?"
TM.discover = [
  {
    key: "misterio1",
    predict: ["ab", "aabb", "aab", "abab", ""],
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
    predict: ["b", "aab", "a", "ba", "abbb"],
    hint: "No escribe nada nuevo y siempre va a la derecha: se comporta como un AFD.",
    solution: `<p><b>L = {aᵐ bⁿ / m ≥ 0, n ≥ 1}</b>, es decir, la ER <code>a*b⁺</code>.</p>
<p>e0 lee aes (ciclo), con la primera <code>b</code> pasa a e1, e1 lee bes y acepta en el blanco. Nunca modifica la cinta: es un AFD "disfrazado". Una MT también reconoce lenguajes regulares.</p>`,
  },
  {
    key: "misterio3",
    predict: ["abb", "ab", "aabbbb", "aabbb", "abbb"],
    hint: "Compará con la MT 1: en e1 y e2, ¿cuántas bes se marcan por cada a?",
    solution: `<p><b>L = {aⁿ b²ⁿ / n ≥ 1}</b></p>
<p>Por cada <code>a</code> marcada (e0) marca <b>dos</b> bes: la primera en e1 (avanzando) y la segunda en e2 (que retrocede). Luego e3 vuelve hasta la X. e4 verifica que solo hay Y y el blanco. Cadena más corta: <code>abb</code>.</p>`,
  },
  {
    key: "misterio4",
    predict: ["ab", "abab", "", "aba", "abb"],
    hint: "Otra vez no escribe nada nuevo. ¿Qué secuencia de letras tiene que leer para volver a e1?",
    solution: `<p><b>L = (ab)⁺</b>, es decir {(ab)ⁿ / n ≥ 1}.</p>
<p>e0 exige una <code>a</code>, e1 una <code>b</code>; desde e2 puede empezar otro par (a → e1) o terminar con el blanco. Es un AFD "disfrazado".</p>`,
  },
  {
    key: "misterio5",
    predict: ["b", "abb", "ab", "aabbb", "bb"],
    hint: "Es parecida a la MT 1, pero mirá qué pasa en e3 y en e0 con una b sin marcar.",
    solution: `<p><b>L = {aⁿ bⁿ⁺¹ / n ≥ 0}</b></p>
<p>El ciclo e0→e1→e2→e0 marca 1 a y 1 b por vuelta. Al terminar (e0 lee Y, o lee b si no había aes) exige <b>exactamente una</b> <code>b</code> sin marcar y luego el blanco. Como e0 acepta directamente <code>b</code>, n puede ser 0. Cadena más corta: <code>b</code>.</p>`,
  },
  {
    key: "misterio6",
    mode: "output",
    predict: ["101", "1", "110"],
    hint: "Esta MT no rechaza ningún binario. Fijate qué escribe cuando encuentra el blanco.",
    solution: `<p><b>Computa 2·n en binario</b>: recorre el número sin cambiarlo y escribe un <code>0</code> en lugar del primer blanco (101 = 5 → 1010 = 10).</p>
<p>Igual que la MT del complemento, es una MT que <b>computa</b>: lo importante es cómo queda la cinta.</p>`,
  },
  {
    key: "misterio7",
    predict: ["aba", "aabaa", "abba", "abbaa", "ab"],
    hint: "La cinta 2 funciona como contador. ¿Qué cuenta e1? ¿Qué hace e2 con las bes (fijate la S)? ¿Y qué descuentan e2 y e3?",
    solution: `<p><b>L = {aⁿ bᵐ aⁿ / n ≥ 1, m ≥ 1}</b></p>
<ul>
<li><b>e0</b>: marca el comienzo de la cinta 2 con #.</li>
<li><b>e1</b>: escribe una X en la cinta 2 por cada <code>a</code> del comienzo.</li>
<li><b>e2</b>: saltea las bes sin tocar la cinta 2 (S). Con la primera <code>a</code> de la 2° parte consume una X.</li>
<li><b>e3</b>: cada <code>a</code> restante consume una X. Acepta cuando la cinta 1 llega al □ justo cuando la cinta 2 llega al #.</li>
</ul>
<p>Hay tantas aes al final como al principio, y al menos una b. Cadena más corta: <code>aba</code>.</p>`,
  },
];

// Ejercicios "construí la MT": se verifican corriendo el programa del alumno.
// Cada caso: { w, ok } (reconocer) o { w, out } (computar: la cinta final debe ser out).
TM.build = [
  {
    key: "anbn0",
    title: "L = {aⁿ bⁿ / n ≥ 0}",
    text: "Igual que la MT misteriosa 1, pero también debe aceptar la palabra vacía.",
    hint: "Partí de la MT misteriosa 1 y agregá una sola regla para el caso en que e0 lee el blanco.",
    cases: [{ w: "", ok: true }, { w: "ab", ok: true }, { w: "aaabbb", ok: true }, { w: "aab", ok: false }, { w: "abb", ok: false }, { w: "ba", ok: false }, { w: "abab", ok: false }],
  },
  {
    key: "anbmcnm",
    title: "L = {aⁿ bᵐ cⁿ⁺ᵐ / n ≥ 1, m ≥ 1}",
    text: "Hay tantas ces como aes y bes juntas. Ej.: abcc, aabccc ✔; abc, bcc ✘.",
    hint: "Por cada a o b que marques, marcá una c. Usá marcas distintas para a (X) y b (Y): así, al volver, sabés si después de la marca puede venir una a o solo bes.",
    cases: [{ w: "abcc", ok: true }, { w: "aabccc", ok: true }, { w: "abbccc", ok: true }, { w: "abc", ok: false }, { w: "abccc", ok: false }, { w: "bcc", ok: false }, { w: "acc", ok: false }, { w: "abacc", ok: false }],
  },
  {
    key: "palindromo",
    title: "Palíndromos sobre {a, b}",
    text: "Cadenas que se leen igual en ambos sentidos (incluye la vacía). Ej.: abba, aba, a ✔; ab, abab ✘.",
    hint: "Marcá el primer símbolo libre y \"llevalo\" en el estado (uno para a, otro para b). Andá hasta el final (blanco o X), retrocedé uno y comparalo con el último libre.",
    cases: [{ w: "", ok: true }, { w: "a", ok: true }, { w: "aba", ok: true }, { w: "abba", ok: true }, { w: "babbab", ok: true }, { w: "ab", ok: false }, { w: "abab", ok: false }, { w: "aab", ok: false }],
  },
  {
    key: "wcw",
    title: "L = {w c w / w ∈ {a, b}*}",
    text: "La misma palabra a los dos lados de una c. Ej.: c, aca, abcab ✔; abcba, abca ✘.",
    hint: "Marcá una letra de la 1° mitad, cruzá la c, salteá las marcas de la 2° mitad y verificá que la primera letra libre sea la misma.",
    cases: [{ w: "c", ok: true }, { w: "aca", ok: true }, { w: "abcab", ok: true }, { w: "abbcabb", ok: true }, { w: "abcba", ok: false }, { w: "abca", ok: false }, { w: "acab", ok: false }, { w: "ab", ok: false }],
  },
  {
    key: "igualab",
    title: "Igual cantidad de aes que de bes (en cualquier orden)",
    text: "Ej.: ab, ba, abba, baab y la vacía ✔; aab, b ✘.",
    hint: "Emparejá el primer símbolo libre con uno del tipo contrario. Para volver al comienzo sin salirte de la cinta, marcá la primera celda con un símbolo especial.",
    cases: [{ w: "", ok: true }, { w: "ab", ok: true }, { w: "ba", ok: true }, { w: "abba", ok: true }, { w: "bbaa", ok: true }, { w: "aab", ok: false }, { w: "b", ok: false }, { w: "abbab", ok: false }],
  },
  {
    key: "incbin",
    title: "Computar: sumar 1 a un número binario",
    text: "La cinta final debe tener el número + 1. Ej.: 1011 → 1100, 111 → 1000.",
    hint: "Andá hasta el final y volvé cambiando 1 por 0 hasta encontrar un 0. Cuidado con 111: no podés moverte a la izquierda de la 1° celda.",
    cases: [{ w: "1011", out: "1100" }, { w: "0", out: "1" }, { w: "1", out: "10" }, { w: "111", out: "1000" }, { w: "1000", out: "1001" }, { w: "0111", out: "1000" }],
  },
  {
    key: "sumaunaria",
    title: "Computar: suma en unario",
    text: "n y m en unario separados por +. Ej.: 111+11 → 11111, 1+1 → 11.",
    hint: "No hace falta mover símbolos: cambiá el + por un 1 y borrá el último 1.",
    cases: [{ w: "111+11", out: "11111" }, { w: "1+1", out: "11" }, { w: "11+", out: "11" }, { w: "+1", out: "1" }],
  },
  {
    key: "anb2n2",
    tapes: 2,
    title: "L = {aⁿ b²ⁿ / n ≥ 1} (2 cintas)",
    text: "Por cada a, dos bes. Ej.: abb, aabbbb ✔; ab, abbb ✘.",
    hint: "Escribí una X en la cinta 2 por cada a. Después consumí una X cada dos bes: usá dos estados que se alternen, y en uno de ellos dejá quieta la cinta 2 (S).",
    cases: [{ w: "abb", ok: true }, { w: "aabbbb", ok: true }, { w: "aaabbbbbb", ok: true }, { w: "ab", ok: false }, { w: "abbb", ok: false }, { w: "aabbb", ok: false }, { w: "bb", ok: false }, { w: "abba", ok: false }],
  },
  {
    key: "anbmcnm2",
    tapes: 2,
    title: "L = {aⁿ bᵐ cⁿ⁺ᵐ / n ≥ 1, m ≥ 1} (2 cintas)",
    text: "El mismo lenguaje que en «Construir», ahora con 2 cintas. Ej.: abcc, aabccc ✔; abc, bcc ✘.",
    hint: "Con 2 cintas es mucho más fácil: una X por cada a y por cada b; después, una X menos por cada c.",
    cases: [{ w: "abcc", ok: true }, { w: "aabccc", ok: true }, { w: "abbccc", ok: true }, { w: "abc", ok: false }, { w: "abccc", ok: false }, { w: "bcc", ok: false }, { w: "acc", ok: false }, { w: "abacc", ok: false }],
  },
  {
    key: "wcwr2",
    tapes: 2,
    title: "L = {w c wᴿ / w ∈ {a, b}*} (2 cintas)",
    text: "wᴿ es w al revés. Ej.: c, aca, abcba ✔; abcab, abcb ✘.",
    hint: "Copiá w en la cinta 2. Al leer la c, la cinta 1 sigue hacia la derecha y la cinta 2 retrocede: así recorrés w al revés.",
    cases: [{ w: "c", ok: true }, { w: "aca", ok: true }, { w: "abcba", ok: true }, { w: "abbcbba", ok: true }, { w: "abcab", ok: false }, { w: "abcb", ok: false }, { w: "acba", ok: false }, { w: "ab", ok: false }],
  },
];
