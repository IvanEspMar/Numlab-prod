import { useCallback, useState } from 'react'
import { EncabezadoCalculadora } from '@/components/encabezado-calculadora/encabezado-calculadora'
import { EditorSistema } from '@/components/editor-matriz/editor-matriz'
import { useMatrizEditable } from '@/hooks/use-matriz-editable'
import { ejemploSistema } from './ejemplos'
import type { ResolverIterativo, ResultadoIterativo } from './metodos-iterativos'
import './iterativos.scss'
import '@/styles/resultados-calculadora.scss'

const TAM_MIN = 2
const TAM_MAX = 8
const TOLERANCIA_INICIAL = '0.0001'
const ITERACIONES_INICIALES = '100'
const OPCIONES_TAMANO = Array.from({ length: TAM_MAX - TAM_MIN + 1 }, (_, i) => i + TAM_MIN)

function formatear(valor: number): string {
  return Number(valor.toFixed(6)).toString()
}

interface CalculadoraIterativaProps {
  /** Identificador de ruta y de los campos: `jacobi` o `gauss-seidel`. */
  metodo: string
  titulo: string
  descripcion: string
  resolver: ResolverIterativo
}

/** Calculadora común de los métodos iterativos lineales: solo cambia el algoritmo. */
export function CalculadoraIterativa({ metodo, titulo, descripcion, resolver }: CalculadoraIterativaProps) {
  const [tolerancia, setTolerancia] = useState(TOLERANCIA_INICIAL)
  const [maxIteraciones, setMaxIteraciones] = useState(ITERACIONES_INICIALES)
  const [resultado, setResultado] = useState<ResultadoIterativo | null>(null)
  const [error, setError] = useState('')

  const descartarResultado = useCallback(() => {
    setResultado(null)
    setError('')
  }, [])

  const matriz = useMatrizEditable({
    ejemplo: ejemploSistema, minimo: TAM_MIN, maximo: TAM_MAX, alCambiar: descartarResultado,
  })

  function cargarEjemplo() {
    matriz.cargarEjemplo()
    setTolerancia(TOLERANCIA_INICIAL)
    setMaxIteraciones(ITERACIONES_INICIALES)
  }

  function calcular() {
    setError('')
    setResultado(null)

    const tol = Number(tolerancia)
    const maximo = Number(maxIteraciones)

    if (!Number.isFinite(tol) || tol <= 0) {
      setError('La tolerancia debe ser un número mayor que cero.')
      return
    }
    if (!Number.isInteger(maximo) || maximo < 1) {
      setError('El máximo de iteraciones debe ser un entero positivo.')
      return
    }

    const { A, b } = matriz.leer()
    if (!A.flat().every(Number.isFinite) || !b.every(Number.isFinite)) {
      setError('Verifica que todos los valores sean números válidos.')
      return
    }
    if (A.some((fila, i) => fila[i] === 0)) {
      setError('La diagonal principal no puede contener ceros.')
      return
    }

    const respuesta = resolver(A, b, tol, maximo)
    if (!respuesta) {
      setError('No fue posible completar el cálculo. Revisa los valores.')
      return
    }
    setResultado(respuesta)
  }

  const idTamano = `${metodo}-size`

  return (
    <section className="iterativo">
      <EncabezadoCalculadora titulo={titulo} introduccion={`/lineal/${metodo}`} descripcion={descripcion} />

      <section className="iterativo__section">
        <div className="iterativo__section-header">
          <div>
            <span className="iterativo__number">01</span>
            <h2>Sistema de ecuaciones</h2>
          </div>

          <div className="iterativo__size">
            <label htmlFor={idTamano}>Dimensión</label>
            <select
              id={idTamano}
              value={matriz.tamano}
              onChange={(event) => matriz.cambiarTamano(Number(event.target.value))}
            >
              {OPCIONES_TAMANO.map((valor) => (
                <option key={valor} value={valor}>{valor} × {valor}</option>
              ))}
            </select>
          </div>
        </div>

        <EditorSistema matriz={matriz} />

        <div className="iterativo__matrix-note">
          Alterna el signo con ±. Las celdas vacías valen 0.
        </div>
      </section>

      <section className="iterativo__section">
        <div className="iterativo__section-header">
          <div>
            <span className="iterativo__number">02</span>
            <h2>Parámetros de cálculo</h2>
          </div>
        </div>

        <div className="iterativo__parameters">
          <label>
            Tolerancia
            <input
              type="number"
              min="0"
              step="any"
              value={tolerancia}
              onChange={(event) => { setTolerancia(event.target.value); descartarResultado() }}
            />
          </label>

          <label>
            Máximo de iteraciones
            <input
              type="number"
              min="1"
              step="1"
              value={maxIteraciones}
              onChange={(event) => { setMaxIteraciones(event.target.value); descartarResultado() }}
            />
          </label>
        </div>
      </section>

      <div className="iterativo__actions">
        <button type="button" className="iterativo__example" onClick={cargarEjemplo}>
          Cargar ejemplo
        </button>
        <button type="button" className="iterativo__clear" onClick={matriz.limpiar}>
          Limpiar
        </button>
        <button type="button" className="iterativo__calculate" onClick={calcular}>
          Calcular <span aria-hidden="true">→</span>
        </button>
      </div>

      {error && <p className="iterativo__error" role="alert">{error}</p>}

      {resultado && <ResultadoIterativoVista resultado={resultado} />}
    </section>
  )
}

function ResultadoIterativoVista({ resultado }: { resultado: ResultadoIterativo }) {
  const { values, iterations, converged } = resultado
  const ultima = iterations[iterations.length - 1]

  return (
    <>
      <section className="resumen-calculadora" role="status">
        <div>
          <h3>{converged ? 'Solución aproximada' : 'Última aproximación'}</h3>
          <div className="resumen-calculadora__valor iterativo__solution">
            {values.map((valor, i) => (
              <span key={i}>x<sub>{i + 1}</sub> ≈ {formatear(valor)}</span>
            ))}
          </div>
        </div>
        <div>
          <h3>Convergencia</h3>
          <div className="resumen-calculadora__valor">Error final {formatear(ultima.error)}</div>
          <p>{converged ? 'Convergencia alcanzada' : 'Máximo de iteraciones alcanzado'}</p>
          <p>{iterations.length} iteraciones realizadas</p>
        </div>
      </section>

      <section className="tabla-iteraciones">
        <h2>Iteraciones</h2>
        <div className="tabla-iteraciones__scroll" tabIndex={0} role="region" aria-label="Tabla de iteraciones">
          <table>
            <thead>
              <tr>
                <th scope="col">Iteración</th>
                {values.map((_, i) => <th key={i} scope="col">x<sub>{i + 1}</sub></th>)}
                <th scope="col">Error</th>
              </tr>
            </thead>

            <tbody>
              {iterations.map((iteracion) => (
                <tr key={iteracion.index}>
                  <td>{iteracion.index}</td>
                  {iteracion.values.map((valor, i) => <td key={i}>{formatear(valor)}</td>)}
                  <td>{formatear(iteracion.error)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
