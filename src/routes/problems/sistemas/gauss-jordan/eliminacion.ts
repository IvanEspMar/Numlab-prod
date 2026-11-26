export type Matriz = number[][]

export interface Paso {
  titulo: string
  descripcion: string
  matriz: Matriz
}

export type EstadoSistema = 'unica' | 'infinita' | 'ninguna'

export interface Solucion {
  pasos: Paso[]
  matriz: Matriz
  estado: EstadoSistema
  valores: number[]
  rango: number
}

const EPSILON = 1e-10
const DECIMALES = 6

const copiar = (matriz: Matriz): Matriz => matriz.map((fila) => [...fila])

export function formatearNumero(valor: number): string {
  if (Math.abs(valor) < EPSILON) return '0'
  return Number(valor.toFixed(DECIMALES)).toString()
}

/**
 * Reduce la matriz aumentada `[A | b]` (n × n+1) a su forma escalonada reducida
 * con pivoteo parcial, registrando cada operación elemental.
 */
export function resolverGaussJordan(origen: Matriz): Solucion {
  const matriz = copiar(origen)
  const n = matriz.length
  const pasos: Paso[] = [{
    titulo: 'Matriz inicial',
    descripcion: 'Se comienza con la matriz aumentada del sistema.',
    matriz: copiar(matriz),
  }]

  let filaPivote = 0

  for (let col = 0; col < n && filaPivote < n; col++) {
    let filaMaxima = filaPivote
    for (let fila = filaPivote + 1; fila < n; fila++) {
      if (Math.abs(matriz[fila][col]) > Math.abs(matriz[filaMaxima][col])) filaMaxima = fila
    }

    if (Math.abs(matriz[filaMaxima][col]) < EPSILON) continue

    if (filaMaxima !== filaPivote) {
      ;[matriz[filaPivote], matriz[filaMaxima]] = [matriz[filaMaxima], matriz[filaPivote]]
      pasos.push({
        titulo: `Intercambio F${filaPivote + 1} ↔ F${filaMaxima + 1}`,
        descripcion: 'Se intercambian las filas para colocar el mayor pivote disponible.',
        matriz: copiar(matriz),
      })
    }

    const pivote = matriz[filaPivote][col]
    if (Math.abs(pivote - 1) > EPSILON) {
      for (let j = 0; j <= n; j++) matriz[filaPivote][j] /= pivote
      pasos.push({
        titulo: `Normalización F${filaPivote + 1}`,
        descripcion: `Se divide toda la fila entre ${formatearNumero(pivote)} para convertir el pivote en 1.`,
        matriz: copiar(matriz),
      })
    }

    for (let fila = 0; fila < n; fila++) {
      if (fila === filaPivote) continue

      const factor = matriz[fila][col]
      if (Math.abs(factor) < EPSILON) continue

      for (let j = 0; j <= n; j++) matriz[fila][j] -= factor * matriz[filaPivote][j]
      pasos.push({
        titulo: `F${fila + 1} ← F${fila + 1} − (${formatearNumero(factor)})F${filaPivote + 1}`,
        descripcion: `Se elimina el elemento de la columna ${col + 1} utilizando la fila pivote.`,
        matriz: copiar(matriz),
      })
    }

    filaPivote++
  }

  const incompatible = matriz.some((fila) =>
    fila.slice(0, n).every((valor) => Math.abs(valor) < EPSILON) && Math.abs(fila[n]) >= EPSILON,
  )
  const estado: EstadoSistema = incompatible ? 'ninguna' : filaPivote === n ? 'unica' : 'infinita'

  const valores = Array<number>(n).fill(0)
  if (estado === 'unica') {
    matriz.forEach((fila) => {
      const columna = fila.findIndex((valor, col) => col < n && Math.abs(valor - 1) < EPSILON)
      if (columna !== -1) valores[columna] = fila[n]
    })
  }

  return { pasos, matriz, estado, valores, rango: filaPivote }
}
