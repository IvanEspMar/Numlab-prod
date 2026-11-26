import { crearMatriz, finito, validarSistema, type Matriz } from '../compartido/algebra.ts'

export type { Matriz }

export interface PasoDoolittle {
  k: number
  L: Matriz
  U: Matriz
}

/**
 * Factorización de Doolittle sin pivoteo: `A = LU` con diagonal unitaria en `L`.
 * Lanza un error si algún pivote es nulo o numéricamente nulo.
 */
export function factorizarDoolittle(A: Matriz) {
  const n = A.length
  const L = crearMatriz(n)
  const U = crearMatriz(n)
  const pasos: PasoDoolittle[] = []
  // Comparar con la escala de la columna evita depender de las unidades de A.
  const tolerancia = n * Number.EPSILON

  for (let k = 0; k < n; k++) {
    L[k][k] = 1

    // Fila k de U: u_kj = a_kj − Σ l_ks·u_sj
    for (let j = k; j < n; j++) {
      let suma = 0
      for (let s = 0; s < k; s++) suma += L[k][s] * U[s][j]
      U[k][j] = finito(A[k][j] - suma)
    }

    const escala = A.reduce((maximo, fila) => Math.max(maximo, Math.abs(fila[k])), 0)
    if (U[k][k] === 0 || Math.abs(U[k][k]) / escala <= tolerancia) {
      throw new Error(
        `El pivote u${k + 1}${k + 1} es cero o demasiado pequeño. Doolittle sin pivoteo no puede continuar.`,
      )
    }

    // Columna k de L: l_ik = (a_ik − Σ l_is·u_sk) / u_kk
    for (let i = k + 1; i < n; i++) {
      let suma = 0
      for (let s = 0; s < k; s++) suma += L[i][s] * U[s][k]
      L[i][k] = finito((A[i][k] - suma) / U[k][k])
    }

    pasos.push({ k: k + 1, L: L.map((fila) => [...fila]), U: U.map((fila) => [...fila]) })
  }

  return { L, U, pasos }
}

/** Resuelve `Ly = b` (L triangular inferior con diagonal unitaria). */
export function sustitucionAdelante(L: Matriz, b: number[]): number[] {
  const y = Array<number>(L.length).fill(0)
  for (let i = 0; i < L.length; i++) {
    let suma = 0
    for (let j = 0; j < i; j++) suma += L[i][j] * y[j]
    y[i] = finito(b[i] - suma)
  }
  return y
}

/** Resuelve `Ux = y` (U triangular superior). */
export function sustitucionAtras(U: Matriz, y: number[]): number[] {
  const x = Array<number>(U.length).fill(0)
  for (let i = U.length - 1; i >= 0; i--) {
    let suma = 0
    for (let j = i + 1; j < U.length; j++) suma += U[i][j] * x[j]
    x[i] = finito((y[i] - suma) / U[i][i])
  }
  return x
}

export function resolverDoolittle(A: Matriz, b: number[]) {
  validarSistema(A, b)
  const { L, U } = factorizarDoolittle(A)
  const y = sustitucionAdelante(L, b)
  const x = sustitucionAtras(U, y)
  return { L, U, y, x }
}
