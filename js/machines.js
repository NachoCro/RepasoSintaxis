// Máquinas de ejemplo. Notación de Muchnik:
// estado actual - carácter leído, carácter escrito, dirección - estado de llegada
// El estado final se marca con "+". El blanco se escribe □ (también se acepta _).
window.TM = window.TM || {};

TM.machines = {
  L6: {
    title: "L₆ = {aⁿ bⁿ cⁿ / n ≥ 1}",
    source: "Muchnik, SSL 3, Cap. 7, Ejemplo 1",
    inputs: ["abc", "aabbcc", "aaabbbccc", "abcc", "aabbc"],
    program: `e0 - a,X,R - e1   /* e0 es el estado inicial */
e0 - Y,Y,R - e6   /* ya marcó todas las aes */
e1 - a,a,R - e1   /* lee todas las aes que hay en la cinta */
e1 - b,Y,R - e2   /* marca la primera b */
e1 - Y,Y,R - e4   /* lee una b marcada y cambia de estado */
e2 - b,b,R - e2   /* lee todas las bes que hay en la cinta */
e2 - c,Z,L - e3   /* marca una c */
e2 - Z,Z,R - e5   /* lee una c marcada y cambia de estado */
e3 - Z,Z,L - e3   /* lee las ces marcadas y retrocede */
e3 - b,b,L - e3   /* lee las bes y retrocede */
e3 - Y,Y,L - e3   /* lee las bes marcadas y retrocede */
e3 - a,a,L - e3   /* lee las aes y retrocede (buscando una X) */
e3 - X,X,R - e0   /* encuentra una X y avanza */
e4 - Y,Y,R - e4   /* lee bes marcadas y avanza */
e4 - b,Y,R - e2   /* lee una b y la marca */
e5 - Z,Z,R - e5   /* lee ces marcadas y avanza */
e5 - c,Z,L - e3   /* lee una c y la marca */
e6 - Y,Y,R - e6   /* encuentra todas las bes marcadas */
e6 - Z,Z,R - e7   /* encuentra la 1° c marcada */
e7 - Z,Z,R - e7   /* verifica que todas las ces están marcadas */
e7 - □,□,L - e8+  /* reconoce la cadena y transita al estado final */`,
  },

  complemento: {
    title: "Complemento de un número binario",
    source: "Muchnik, SSL 3, Cap. 7, Ejemplo 2",
    inputs: ["10110", "0000", "1"],
    program: `e0 - 0,1,R - e0   /* e0 es el estado inicial */
e0 - 1,0,R - e0
e0 - □,□,L - e1+  /* transita al estado final */`,
  },

  L7: {
    title: "L₇ = {aⁿ bⁿ cⁿ⁺¹ / n ≥ 1}",
    source: "Ejercicio 3 del Cap. 7 (resolución propia, complemento)",
    inputs: ["abcc", "aabbccc", "abc", "abccc"],
    program: `e0 - a,X,R - e1   /* marca una a */
e0 - Y,Y,R - e6   /* ya marcó todas las aes */
e1 - a,a,R - e1
e1 - b,Y,R - e2   /* marca la primera b */
e1 - Y,Y,R - e4
e2 - b,b,R - e2
e2 - c,Z,L - e3   /* marca una c */
e2 - Z,Z,R - e5
e3 - Z,Z,L - e3
e3 - b,b,L - e3
e3 - Y,Y,L - e3
e3 - a,a,L - e3
e3 - X,X,R - e0   /* vuelve a buscar la próxima a */
e4 - Y,Y,R - e4
e4 - b,Y,R - e2
e5 - Z,Z,R - e5
e5 - c,Z,L - e3
e6 - Y,Y,R - e6
e6 - Z,Z,R - e7
e7 - Z,Z,R - e7   /* saltea las ces marcadas */
e7 - c,c,R - e9   /* exige UNA c extra sin marcar */
e9 - □,□,L - e8+  /* y después el blanco: acepta */`,
  },

  duplicar: {
    title: "Duplicar una cadena de aes y bes",
    source: "Ejercicio 4 del Cap. 7 (resolución propia, complemento)",
    inputs: ["abbaa", "ab", "b"],
    program: `e0 - a,A,R - e1   /* marca la 1° letra con A/B (para saber dónde termina) */
e0 - b,B,R - e2
e3 - a,X,R - e1   /* marca una a y "la lleva" */
e3 - b,Y,R - e2   /* marca una b y "la lleva" */
e3 - □,□,L - e8   /* no quedan letras por copiar: restaurar */
e1 - a,a,R - e1   /* llevando a: avanza hasta el separador */
e1 - b,b,R - e1
e1 - □,□,R - e4
e2 - a,a,R - e2   /* llevando b: avanza hasta el separador */
e2 - b,b,R - e2
e2 - □,□,R - e5
e4 - a,a,R - e4   /* recorre la copia */
e4 - b,b,R - e4
e4 - □,a,L - e6   /* escribe la a al final de la copia */
e5 - a,a,R - e5
e5 - b,b,R - e5
e5 - □,b,L - e6   /* escribe la b al final de la copia */
e6 - a,a,L - e6   /* retrocede por la copia */
e6 - b,b,L - e6
e6 - □,□,L - e7   /* cruza el separador */
e7 - a,a,L - e7   /* retrocede por el original hasta una marca */
e7 - b,b,L - e7
e7 - X,X,R - e3
e7 - Y,Y,R - e3
e7 - A,A,R - e3
e7 - B,B,R - e3
e8 - X,a,L - e8   /* restaura las marcas */
e8 - Y,b,L - e8
e8 - A,a,R - e9+  /* llegó a la 1° letra: termina */
e8 - B,b,R - e9+`,
  },

  // Máquinas para practicar "descubrir el lenguaje"
  misterio1: {
    title: "MT misteriosa 1",
    inputs: ["ab", "aabb", "aab", "abb", "ba"],
    program: `e0 - a,X,R - e1
e0 - Y,Y,R - e3
e1 - a,a,R - e1
e1 - Y,Y,R - e1
e1 - b,Y,L - e2
e2 - Y,Y,L - e2
e2 - a,a,L - e2
e2 - X,X,R - e0
e3 - Y,Y,R - e3
e3 - □,□,L - e4+`,
  },

  misterio2: {
    title: "MT misteriosa 2",
    inputs: ["b", "aabbb", "a", "aba"],
    program: `e0 - a,a,R - e0
e0 - b,b,R - e1
e1 - b,b,R - e1
e1 - □,□,L - e2+`,
  },

  misterio3: {
    title: "MT misteriosa 3",
    inputs: ["abb", "aabbbb", "ab", "abbb"],
    program: `e0 - a,X,R - e1
e0 - Y,Y,R - e4
e1 - a,a,R - e1
e1 - Y,Y,R - e1
e1 - b,Y,R - e2
e2 - b,Y,L - e3
e3 - Y,Y,L - e3
e3 - a,a,L - e3
e3 - X,X,R - e0
e4 - Y,Y,R - e4
e4 - □,□,L - e5+`,
  },

  misterio4: {
    title: "MT misteriosa 4",
    inputs: ["ab", "abab", "aba", "ba"],
    program: `e0 - a,a,R - e1
e1 - b,b,R - e2
e2 - a,a,R - e1
e2 - □,□,L - e3+`,
  },

  misterio5: {
    title: "MT misteriosa 5",
    inputs: ["b", "abb", "aabbb", "ab", "abbb"],
    program: `e0 - a,X,R - e1
e0 - Y,Y,R - e3
e0 - b,b,R - e4
e1 - a,a,R - e1
e1 - Y,Y,R - e1
e1 - b,Y,L - e2
e2 - Y,Y,L - e2
e2 - a,a,L - e2
e2 - X,X,R - e0
e3 - Y,Y,R - e3
e3 - b,b,R - e4
e4 - □,□,L - e5+`,
  },

  misterio6: {
    title: "MT misteriosa 6 (computa)",
    inputs: ["101", "1", "110"],
    program: `e0 - 0,0,R - e0
e0 - 1,1,R - e0
e0 - □,0,L - e1+`,
  },

  // Soluciones de "Practicá: construí la MT"
  anbn0: {
    title: "Solución: aⁿ bⁿ / n ≥ 0",
    solution: true,
    inputs: ["", "ab", "aabb", "aab", "ba"],
    program: `e0 - □,□,L - e4+  /* palabra vacía: n = 0 */
e0 - a,X,R - e1   /* marca una a */
e0 - Y,Y,R - e3   /* ya no quedan aes: verificar */
e1 - a,a,R - e1
e1 - Y,Y,R - e1
e1 - b,Y,L - e2   /* marca la b correspondiente */
e2 - Y,Y,L - e2
e2 - a,a,L - e2
e2 - X,X,R - e0   /* vuelve a la última X */
e3 - Y,Y,R - e3
e3 - □,□,L - e4+  /* solo había Ys: acepta */`,
  },

  anbmcnm: {
    title: "Solución: aⁿ bᵐ cⁿ⁺ᵐ / n ≥ 1, m ≥ 1",
    solution: true,
    inputs: ["abcc", "aabccc", "abbccc", "abc", "bcc"],
    program: `e0 - a,X,R - e1   /* la primera letra debe ser a */
e1 - a,a,R - e1   /* llevando la marca de una a */
e1 - b,b,R - e2
e1 - Z,Z,R - e6
e1 - c,Z,L - e3
e2 - b,b,R - e2   /* saltea bes */
e2 - Z,Z,R - e6
e2 - c,Z,L - e3   /* marca una c */
e6 - Z,Z,R - e6   /* saltea ces ya marcadas */
e6 - c,Z,L - e3
e3 - Z,Z,L - e3   /* retrocede hasta la última marca */
e3 - b,b,L - e3
e3 - a,a,L - e3
e3 - X,X,R - e5   /* la última marca fue de una a */
e3 - Y,Y,R - e4   /* la última marca fue de una b */
e5 - a,X,R - e1   /* después de una X puede venir a o b */
e5 - b,Y,R - e2
e4 - b,Y,R - e2   /* después de una Y solo b... */
e4 - Z,Z,R - e7   /* ...o ya se marcó todo: verificar */
e7 - Z,Z,R - e7
e7 - □,□,L - e8+`,
  },

  palindromo: {
    title: "Solución: palíndromos sobre {a,b}",
    solution: true,
    inputs: ["abba", "aba", "a", "", "ab", "abab"],
    program: `e0 - a,X,R - e1   /* marca el primer símbolo libre y "lo lleva" */
e0 - b,X,R - e2
e0 - X,X,L - e9+  /* longitud par: todo emparejado */
e0 - □,□,L - e9+  /* palabra vacía */
e1 - a,a,R - e1   /* llevando a: va hasta el final */
e1 - b,b,R - e1
e1 - X,X,L - e3
e1 - □,□,L - e3
e2 - a,a,R - e2   /* llevando b: va hasta el final */
e2 - b,b,R - e2
e2 - X,X,L - e4
e2 - □,□,L - e4
e3 - a,X,L - e5   /* el último libre debe ser a */
e3 - X,X,L - e9+  /* era el símbolo del medio (longitud impar) */
e4 - b,X,L - e5   /* el último libre debe ser b */
e4 - X,X,L - e9+
e5 - a,a,L - e5   /* vuelve hasta la X de la izquierda */
e5 - b,b,L - e5
e5 - X,X,R - e0`,
  },

  wcw: {
    title: "Solución: w c w / w ∈ {a,b}*",
    solution: true,
    inputs: ["c", "aca", "abcab", "abcba", "abca"],
    program: `e0 - a,X,R - e1   /* marca una letra de la 1° mitad y la lleva */
e0 - b,X,R - e2
e0 - c,c,R - e5   /* 1° mitad terminada: verificar la 2° */
e1 - a,a,R - e1
e1 - b,b,R - e1
e1 - c,c,R - e3
e2 - a,a,R - e2
e2 - b,b,R - e2
e2 - c,c,R - e4
e3 - X,X,R - e3   /* saltea las ya comparadas */
e3 - a,X,L - e6   /* coincide: marca */
e4 - X,X,R - e4
e4 - b,X,L - e6
e6 - X,X,L - e6   /* vuelve hasta la c */
e6 - c,c,L - e7
e7 - a,a,L - e7   /* y hasta la última X de la 1° mitad */
e7 - b,b,L - e7
e7 - X,X,R - e0
e5 - X,X,R - e5   /* la 2° mitad debe estar toda marcada */
e5 - □,□,L - e8+`,
  },

  igualab: {
    title: "Solución: igual cantidad de aes que de bes",
    solution: true,
    inputs: ["", "ab", "ba", "abba", "baab", "aab"],
    program: `e0 - □,□,L - e9+  /* palabra vacía */
e0 - a,P,R - e1   /* P marca el comienzo de la cinta */
e0 - b,P,R - e2
e1 - a,a,R - e1   /* tengo una a: busco una b */
e1 - X,X,R - e1
e1 - b,X,L - e3
e2 - b,b,R - e2   /* tengo una b: busco una a */
e2 - X,X,R - e2
e2 - a,X,L - e3
e3 - a,a,L - e3   /* vuelve al comienzo (la P) */
e3 - b,b,L - e3
e3 - X,X,L - e3
e3 - P,P,R - e4
e4 - X,X,R - e4   /* busca el primer símbolo libre */
e4 - a,X,R - e1
e4 - b,X,R - e2
e4 - □,□,L - e9+  /* no quedan libres: acepta */`,
  },

  incbin: {
    title: "Solución: sumar 1 a un número binario",
    solution: true,
    inputs: ["1011", "111", "0", "1"],
    program: `e0 - 0,C,R - e1   /* marca la 1° celda (C = 0, U = 1) */
e0 - 1,U,R - e1
e1 - 0,0,R - e1   /* va hasta el final */
e1 - 1,1,R - e1
e1 - □,□,L - e2
e2 - 1,0,L - e2   /* 1 + 1 = 0 y me llevo 1 */
e2 - 0,1,L - e4   /* 0 + 1 = 1: terminó la suma */
e2 - C,1,R - e9+
e2 - U,1,R - e3   /* todo era 1: queda 1 seguido de ceros */
e3 - 0,0,R - e3
e3 - □,0,L - e9+  /* agrega un 0 al final */
e4 - 0,0,L - e4   /* vuelve a restaurar la 1° celda */
e4 - 1,1,L - e4
e4 - C,0,R - e9+
e4 - U,1,R - e9+`,
  },

  sumaunaria: {
    title: "Solución: suma en unario (111+11 → 11111)",
    solution: true,
    inputs: ["111+11", "1+1", "11+", "+"],
    program: `e0 - 1,1,R - e0   /* recorre el 1° sumando */
e0 - +,1,R - e1   /* reemplaza el + por un 1 */
e1 - 1,1,R - e1
e1 - □,□,L - e2
e2 - 1,□,L - e3+  /* borra el último 1: queda n + m */`,
  },
};
