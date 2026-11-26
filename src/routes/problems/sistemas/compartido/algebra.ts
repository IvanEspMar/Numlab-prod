export type Matriz = number[][]

/** Lanza un error si el valor dejó de ser finito (desbordamiento o división entre cero). */
export function finito(valor: number): number {
  if (!Number.isFinite(valor)) {
    throw new Error('El cálculo excede el rango numérico disponible.')
  }
  return valor
}

export function crearMatriz(n: number): Matriz {
  return Array.from({ length: n }, () => Array<number>(n).fill(0))
}

/** Valida que `A` sea cuadrada, `b` tenga su misma dimensión y todo sea finito. */
export function validarSistema(A: Matriz, b: number[]): void {
  const n = A.length
  if (n === 0 || b.length !== n || A.some((fila) => fila.length !== n)) {
    throw new Error('Se requiere una matriz cuadrada y un vector de la misma dimensión.')
  }
  if (!A.every((fila) => fila.every(Number.isFinite)) || !b.every(Number.isFinite)) {
    throw new Error('Todos los coeficientes y términos independientes deben ser finitos.')
  }
}
