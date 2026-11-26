import { useCallback, useState } from 'react'
import { EncabezadoCalculadora } from '@/components/encabezado-calculadora/encabezado-calculadora'
import { EditorSistema } from '@/components/editor-matriz/editor-matriz'
import { useMatrizEditable } from '@/hooks/use-matriz-editable'
import { ejemploSistema } from '../compartido/ejemplos'
import { formatearNumero, resolverGaussJordan, type EstadoSistema, type Solucion } from './eliminacion'
import './gauss-jordan.scss'

const TAM_MIN = 2
const TAM_MAX = 8

const ETIQUETAS_ESTADO: Record<EstadoSistema, string> = {
  unica: 'SOLUCIÓN ÚNICA',
  infinita: 'INFINITAS SOLUCIONES',
  ninguna: 'SISTEMA INCOMPATIBLE',
}

function GaussJordan() {
  const [resultado, setResultado] = useState<Solucion | null>(null)
  const [pasoActivo, setPasoActivo] = useState(0)

  const descartarResultado = useCallback(() => {
    setResultado(null)
    setPasoActivo(0)
  }, [])

  const matriz = useMatrizEditable({
    ejemplo: ejemploSistema, minimo: TAM_MIN, maximo: TAM_MAX, alCambiar: descartarResultado,
  })
  const { tamano } = matriz

  function resolver() {
    const { A, b } = matriz.leer()
    setResultado(resolverGaussJordan(A.map((fila, i) => [...fila, b[i]])))
    setPasoActivo(0)
  }

  const paso = resultado?.pasos[pasoActivo]

  return (
    <section className="gauss-jordan">
      <EncabezadoCalculadora titulo="Método de Gauss-Jordan" introduccion="/lineal/gauss-jordan" />

      <section className="gauss-jordan__workspace">
        <div className="gauss-jordan__section-header">
          <div>
            <span className="gauss-jordan__number">01</span>
            <h2>Matriz aumentada</h2>
          </div>

          <div className="gauss-jordan__size">
            <button
              type="button"
              onClick={() => matriz.cambiarTamano(tamano - 1)}
              disabled={tamano <= TAM_MIN}
              aria-label="Disminuir tamaño"
            >
              −
            </button>

            <span>{tamano} × {tamano + 1}</span>

            <button
              type="button"
              onClick={() => matriz.cambiarTamano(tamano + 1)}
              disabled={tamano >= TAM_MAX}
              aria-label="Aumentar tamaño"
            >
              +
            </button>
          </div>
        </div>

        <p className="gauss-jordan__hint">Alterna el signo con ±. Las celdas vacías valen 0.</p>
        {matriz.hayEntradaInvalida && <p role="status">Completa el número en la celda antes de resolver.</p>}

        <EditorSistema matriz={matriz} />

        <div className="gauss-jordan__matrix-footer">
          <span>
            <span className="gauss-jordan__legend"></span>
            Coeficientes
          </span>

          <span>
            <span className="gauss-jordan__legend gauss-jordan__legend--result"></span>
            Términos independientes
          </span>
        </div>

        <div className="gauss-jordan__actions">
          <button type="button" className="gauss-jordan__reset" onClick={matriz.cargarEjemplo}>
            Cargar ejemplo
          </button>

          <button type="button" className="gauss-jordan__reset" onClick={matriz.limpiar}>
            <span aria-hidden="true">↺</span> Limpiar
          </button>

          <button
            type="button"
            className="gauss-jordan__solve"
            onClick={resolver}
            disabled={matriz.hayEntradaInvalida}
          >
            Calcular <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {resultado && (
        <section className="gauss-jordan__results">
          <div className="gauss-jordan__section-header">
            <div>
              <span className="gauss-jordan__number">02</span>
              <h2>Procedimiento</h2>
            </div>

            <span className="gauss-jordan__step-count">{resultado.pasos.length} pasos</span>
          </div>

          <div className="gauss-jordan__step-navigation">
            <button
              type="button"
              onClick={() => setPasoActivo((previo) => Math.max(0, previo - 1))}
              disabled={pasoActivo === 0}
            >
              ← Anterior
            </button>

            <span>Paso {pasoActivo + 1} de {resultado.pasos.length}</span>

            <button
              type="button"
              onClick={() => setPasoActivo((previo) => Math.min(resultado.pasos.length - 1, previo + 1))}
              disabled={pasoActivo === resultado.pasos.length - 1}
            >
              Siguiente →
            </button>
          </div>

          {paso && (
            <article className="gauss-jordan__step">
              <div className="gauss-jordan__step-title">
                <span>PASO {String(pasoActivo + 1).padStart(2, '0')}</span>
                <h3>{paso.titulo}</h3>
              </div>

              <p>{paso.descripcion}</p>

              <div
                className="gauss-jordan__result-matrix"
                style={{ gridTemplateColumns: `28px repeat(${tamano + 1}, minmax(65px, max-content))` }}
                role="region"
                aria-label="Matriz del paso actual"
                tabIndex={0}
              >
                {paso.matriz.map((fila, i) => (
                  <div className="gauss-jordan__result-row" key={i}>
                    <span>F{i + 1}</span>

                    {fila.map((valor, j) => (
                      <span
                        className={j === tamano ? 'gauss-jordan__result-value is-independent' : 'gauss-jordan__result-value'}
                        key={j}
                      >
                        {formatearNumero(valor)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </article>
          )}

          <div className="gauss-jordan__progress">
            {resultado.pasos.map((p, i) => (
              <button
                type="button"
                key={i}
                className={i === pasoActivo ? 'is-active' : ''}
                onClick={() => setPasoActivo(i)}
                aria-current={i === pasoActivo ? 'step' : undefined}
                aria-label={`Ir al paso ${i + 1}: ${p.titulo}`}
              />
            ))}
          </div>

          <div className="gauss-jordan__section-header gauss-jordan__final-header">
            <div>
              <span className="gauss-jordan__number">03</span>
              <h2>Resultado</h2>
            </div>
          </div>

          <div className={`gauss-jordan__answer gauss-jordan__answer--${resultado.estado}`}>
            <span className="gauss-jordan__answer-label">{ETIQUETAS_ESTADO[resultado.estado]}</span>

            {resultado.estado === 'unica' ? (
              <div className="gauss-jordan__variables">
                {resultado.valores.map((valor, i) => (
                  <div className="gauss-jordan__variable" key={i}>
                    <span>x{i + 1}</span>
                    <strong>{formatearNumero(valor)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                {resultado.estado === 'infinita'
                  ? `El sistema tiene ${tamano - resultado.rango} variable(s) libre(s). No existe una solución única.`
                  : 'Se encontró una contradicción en la matriz reducida. No existe solución para este sistema.'}
              </p>
            )}
          </div>
        </section>
      )}
    </section>
  )
}

export default GaussJordan
