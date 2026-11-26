import assert from 'node:assert/strict'
import test from 'node:test'
import { formatearNumero, resolverGaussJordan } from './eliminacion.ts'

function cercano(actual, esperado, limite = 1e-9) {
  assert.ok(Math.abs(actual - esperado) <= limite, `${actual} ≈ ${esperado}`)
}

test('Gauss-Jordan resuelve el sistema de ejemplo con solución única', () => {
  const resultado = resolverGaussJordan([[10, -1, 2, 6], [-1, 11, -1, 22], [2, -1, 10, -10]])
  assert.equal(resultado.estado, 'unica')
  assert.equal(resultado.rango, 3)
  assert.equal(resultado.pasos[0].titulo, 'Matriz inicial')
  const esperado = [1, 2, -1]
  resultado.valores.forEach((valor, i) => cercano(valor, esperado[i]))
})

test('Gauss-Jordan intercambia filas cuando el pivote es nulo', () => {
  const resultado = resolverGaussJordan([[0, 2, 4], [3, 1, 5]])
  assert.equal(resultado.estado, 'unica')
  assert.ok(resultado.pasos.some((paso) => paso.titulo.startsWith('Intercambio')))
  cercano(resultado.valores[0], 1)
  cercano(resultado.valores[1], 2)
})

test('Gauss-Jordan distingue sistemas incompatibles e indeterminados', () => {
  const incompatible = resolverGaussJordan([[1, 1, 2], [2, 2, 5]])
  assert.equal(incompatible.estado, 'ninguna')

  const indeterminado = resolverGaussJordan([[1, 1, 2], [2, 2, 4]])
  assert.equal(indeterminado.estado, 'infinita')
  assert.equal(indeterminado.rango, 1)
})

test('formatearNumero redondea a seis decimales y limpia ceros numéricos', () => {
  assert.equal(formatearNumero(1e-12), '0')
  assert.equal(formatearNumero(-1e-12), '0')
  assert.equal(formatearNumero(1 / 3), '0.333333')
})
