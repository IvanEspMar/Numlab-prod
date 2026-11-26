export type Metodo = 'jacobi' | 'gauss-seidel'

export interface IteracionLineal {
  index: number
  values: number[]
  error: number
}

export interface ResultadoIterativo {
  values: number[]
  iterations: IteracionLineal[]
  converged: boolean
}

function iterar(
  A: number[][], b: number[], tolerancia: number, maximo: number, inmediato: boolean,
): ResultadoIterativo | null {
  const n = A.length
  if (A.some((fila, i) => fila[i] === 0)) return null

  let actual = Array<number>(n).fill(0)
  const iterations: IteracionLineal[] = []

  for (let index = 1; index <= maximo; index++) {
    const siguiente = inmediato ? [...actual] : Array<number>(n).fill(0)
    const origen = inmediato ? siguiente : actual

    for (let i = 0; i < n; i++) {
      let suma = b[i]
      for (let j = 0; j < n; j++) {
        if (j !== i) suma -= A[i][j] * origen[j]
      }
      siguiente[i] = suma / A[i][i]
    }

    if (!siguiente.every(Number.isFinite)) return null

    let error = 0
    for (let i = 0; i < n; i++) error = Math.max(error, Math.abs(siguiente[i] - actual[i]))

    iterations.push({ index, values: [...siguiente], error })
    actual = siguiente

    if (error <= tolerancia) return { values: actual, iterations, converged: true }
  }

  return { values: actual, iterations, converged: false }
}

export const resolverJacobi = (A: number[][], b: number[], tolerancia: number, maximo: number) =>
  iterar(A, b, tolerancia, maximo, false)

export const resolverGaussSeidel = (A: number[][], b: number[], tolerancia: number, maximo: number) =>
  iterar(A, b, tolerancia, maximo, true)

export type ResolverIterativo = typeof resolverJacobi
