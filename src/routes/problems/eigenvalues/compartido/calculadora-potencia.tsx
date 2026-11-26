import { useCallback, useState } from "react";
import { MathJax } from "better-react-mathjax";
import { EncabezadoCalculadora } from "@/components/encabezado-calculadora/encabezado-calculadora";
import { EditorSistema } from "@/components/editor-matriz/editor-matriz";
import { useMatrizEditable, type SistemaNumerico } from "@/hooks/use-matriz-editable";
import { solveEigen, type EigenResult } from "./metodos-potencia";
import { ResultadosPotencia } from "./resultados-potencia";
import "./calculadora-potencia.scss";

const MIN_SIZE = 2;
const MAX_SIZE = 8;
const MAX_ITERACIONES = 1000;
const TOLERANCIA_INICIAL = "0.000001";
const ITERACIONES_INICIALES = "100";
const OPCIONES_TAMANO = Array.from({ length: MAX_SIZE - MIN_SIZE + 1 }, (_, i) => i + MIN_SIZE);

const MATRIZ_EJEMPLO = [
  [2, -2, 1],
  [2, -8, 2],
  [1, 2, 2],
];
const EJEMPLO_POTENCIA: SistemaNumerico = { A: MATRIZ_EJEMPLO, b: [1, 1, 1] };
const EJEMPLO_INVERSA: SistemaNumerico = { A: MATRIZ_EJEMPLO, b: [3, 1, -1] };

export function CalculadoraPotencia({ inversa = false }: { inversa?: boolean }) {
  const [tolerance, setTolerance] = useState(TOLERANCIA_INICIAL);
  const [maxIterations, setMaxIterations] = useState(ITERACIONES_INICIALES);
  const [result, setResult] = useState<EigenResult | null>(null);
  const [error, setError] = useState("");

  const descartarResultado = useCallback(() => {
    setResult(null);
    setError("");
  }, []);

  const matriz = useMatrizEditable({
    ejemplo: inversa ? EJEMPLO_INVERSA : EJEMPLO_POTENCIA,
    minimo: MIN_SIZE,
    maximo: MAX_SIZE,
    alCambiar: descartarResultado,
  });

  function loadExample() {
    matriz.cargarEjemplo();
    setTolerance(TOLERANCIA_INICIAL);
    setMaxIterations(ITERACIONES_INICIALES);
  }

  function calculate() {
    setError("");
    setResult(null);

    const parsedTolerance = Number(tolerance);
    const parsedIterations = Number(maxIterations);

    if (!Number.isFinite(parsedTolerance) || parsedTolerance <= 0) {
      setError("La tolerancia debe ser un número mayor que cero.");
      return;
    }

    if (!Number.isInteger(parsedIterations) || parsedIterations < 1 || parsedIterations > MAX_ITERACIONES) {
      setError(`El máximo de iteraciones debe estar entre 1 y ${MAX_ITERACIONES}.`);
      return;
    }

    const { A, b } = matriz.leer();
    if (!A.flat().every(Number.isFinite) || !b.every(Number.isFinite)) {
      setError("Verifica que todos los valores sean números válidos.");
      return;
    }

    setResult(solveEigen(A, b, parsedTolerance, parsedIterations, inversa));
  }

  return (
    <section className="potencia">
      <EncabezadoCalculadora
        titulo={inversa ? "Método de la potencia inversa" : "Método de la potencia"}
        introduccion={inversa ? "/eigenvalues/inversa" : "/eigenvalues/potencia"}
        descripcion={inversa ? (
          <MathJax inline>{String.raw`Aproxima el valor propio de menor magnitud de una matriz invertible y su vector propio. Si \(Av=\lambda v\), entonces \(A^{-1}v=(1/\lambda)v\). Cada iteración resuelve un sistema lineal sin formar la inversa.`}</MathJax>
        ) : (
          <MathJax inline>{String.raw`Aproxima el valor propio dominante en magnitud de una matriz cuadrada y su vector propio, ligados por \(Av=\lambda v\). El método multiplica y normaliza el vector en cada iteración. Un valor propio negativo puede dominar si su magnitud es la mayor.`}</MathJax>
        )}
      />

      <section className="potencia__section">
        <div className="potencia__section-header">
          <div>
            <span className="potencia__number">01</span>
            <h2>Matriz de entrada</h2>
          </div>

          <div className="potencia__size">
            <label htmlFor="potencia-size">Dimensión</label>

            <select
              id="potencia-size"
              value={matriz.tamano}
              onChange={(event) => matriz.cambiarTamano(Number(event.target.value))}
            >
              {OPCIONES_TAMANO.map((value) => (
                <option key={value} value={value}>
                  {value} × {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <EditorSistema
          matriz={matriz}
          etiquetaVector="Vector inicial x₀"
          etiquetaComponente="Componente inicial"
        />

        <div className="potencia__matrix-note">
          Alterna el signo con ±. Las celdas vacías valen 0.
        </div>
      </section>

      <section className="potencia__section">
        <div className="potencia__section-header">
          <div>
            <span className="potencia__number">02</span>
            <h2>Parámetros de cálculo</h2>
          </div>
        </div>

        <div className="potencia__parameters">
          <label>
            Tolerancia
            <input
              type="number"
              min="0"
              step="any"
              value={tolerance}
              onChange={(event) => { setTolerance(event.target.value); descartarResultado(); }}
            />
          </label>

          <label>
            Máximo de iteraciones
            <input
              type="number"
              min="1"
              max={MAX_ITERACIONES}
              step="1"
              value={maxIterations}
              onChange={(event) => { setMaxIterations(event.target.value); descartarResultado(); }}
            />
          </label>
        </div>
      </section>

      <div className="potencia__actions">
        <button type="button" onClick={loadExample}>
          Cargar ejemplo
        </button>
        <button type="button" onClick={matriz.limpiar}>
          Limpiar
        </button>
        <button
          type="button"
          className="potencia__calculate"
          onClick={calculate}
        >
          Calcular <span aria-hidden="true">→</span>
        </button>
      </div>

      {error && (
        <p className="potencia__error" role="alert">
          <strong>Entradas inválidas.</strong> {error}
        </p>
      )}

      {result && <ResultadosPotencia result={result} inversa={inversa} />}
    </section>
  );
}
