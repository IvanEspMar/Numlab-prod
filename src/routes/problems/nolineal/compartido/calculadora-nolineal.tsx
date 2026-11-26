import { MathJax } from "better-react-mathjax";
import { useId, useMemo, type ReactNode } from "react";
import { EncabezadoCalculadora } from "@/components/encabezado-calculadora/encabezado-calculadora";
import { formatearAproximacion, formatearDecimal } from "./formato-decimal";
import { GraficaMatematica } from "./grafica-matematica";
import { createSolutionGraph, type GraphData } from "./grafica-modelo";
import type { EstadoRaiz, ResultadoRaiz } from "../calculo/metodos-raices";
import "./calculadora-nolineal.scss";
import "@/styles/resultados-calculadora.scss";

interface CalculadoraNoLinealProps {
    titulo: string;
    rutaIntroduccion: string;
    ecuacion: string;
    ecuacionLatex: string | null;
    mensajeValidacion: string;
    onCambiarEcuacion: (valor: string) => void;
    onValidar: () => void;
    parametros: ReactNode;
    children: ReactNode;
    graficaEntrada: GraphData | null;
    resultado: ResultadoRaiz<unknown> | null;
    ayudaGrafica?: string;
}

export function CalculadoraNoLineal({
    titulo,
    rutaIntroduccion,
    ecuacion,
    ecuacionLatex,
    mensajeValidacion,
    onCambiarEcuacion,
    onValidar,
    parametros,
    children,
    graficaEntrada,
    resultado,
    ayudaGrafica = "Ingresa valores iniciales donde la función esté definida.",
}: CalculadoraNoLinealProps) {
    const equationId = useId();
    const solutionGraph = useMemo(() => {
        if (!graficaEntrada || !resultado?.ultima || !esResultadoAceptado(resultado.estado)) return null;
        return createSolutionGraph(graficaEntrada, resultado.ultima);
    }, [graficaEntrada, resultado]);

    return (
        <section className="calculadora-nolineal">
            <EncabezadoCalculadora titulo={titulo} introduccion={rutaIntroduccion} />

            <div className="calculadora-nolineal__workspace">
                <div className="calculadora-nolineal__panel">
                    <form className="calculadora-nolineal__equation-input" onSubmit={(event) => {
                        event.preventDefault();
                        onValidar();
                    }}>
                        <label htmlFor={equationId}>Función de x</label>
                        <div>
                            <input
                                id={equationId}
                                type="text"
                                value={ecuacion}
                                onChange={(event) => onCambiarEcuacion(event.target.value)}
                                placeholder="x^2 - 2"
                            />
                            <button type="submit">Validar función</button>
                        </div>
                        {ecuacionLatex === null && mensajeValidacion && (
                            <span className="calculadora-nolineal__error" role="status">{mensajeValidacion}</span>
                        )}
                    </form>
                    {ecuacionLatex !== null && (
                        <div className="calculadora-nolineal__parameters">{parametros}</div>
                    )}
                </div>

                <section className="calculadora-nolineal__panel" aria-label="Vista previa de la función">
                    <h2>Vista previa</h2>
                    {ecuacionLatex === null ? (
                        <p className="calculadora-nolineal__hint">Valida la función para ver su fórmula y habilitar el cálculo.</p>
                    ) : (
                        <div className="calculadora-nolineal__equation-preview">
                            <MathJax dynamic>{String.raw`\[f(x)=${ecuacionLatex}\]`}</MathJax>
                        </div>
                    )}
                    {ecuacionLatex !== null && (
                        <div className="calculadora-nolineal__input-graph">
                            <h2>Gráfica de entrada</h2>
                            {graficaEntrada ? <GraficaMatematica data={graficaEntrada} /> : (
                                <p className="calculadora-nolineal__hint">{ayudaGrafica}</p>
                            )}
                        </div>
                    )}
                </section>
            </div>
            {ecuacionLatex !== null && resultado && <ResultadoNoLineal resultado={resultado} />}
            {solutionGraph && (
                <section className="calculadora-nolineal__panel calculadora-nolineal__solution-graph">
                    <h2>Gráfica del resultado</h2>
                    <GraficaMatematica data={solutionGraph} />
                </section>
            )}
            {ecuacionLatex !== null && children}
        </section>
    );
}

interface EntradaDecimalProps {
    id: string;
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
}

export function EntradaDecimal({ id, value, onValueChange, placeholder }: EntradaDecimalProps) {
    function changeSign() {
        const numberText = value.trim();
        onValueChange(/^[-−]/.test(numberText) ? numberText.slice(1) : `-${numberText.replace(/^\+/, "")}`);
    }

    return (
        <div className="calculadora-nolineal__decimal-input">
            <input
                id={id}
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={placeholder}
            />
            <button type="button" aria-label="Cambiar signo" aria-controls={id} onClick={changeSign}>±</button>
        </div>
    );
}

export function TablaIteraciones({ columnas, filas }: {
    columnas: readonly string[];
    filas: readonly (readonly number[])[];
}) {
    if (filas.length === 0) return null;

    return (
        <section className="tabla-iteraciones">
            <h2>Iteraciones</h2>
            <div className="tabla-iteraciones__scroll" tabIndex={0} role="region" aria-label="Tabla de iteraciones">
                <table>
                    <thead>
                        <tr>
                            {columnas.map((columna) => (
                                <th key={columna} scope="col">
                                    <MathJax inline>{String.raw`\(${columna}\)`}</MathJax>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map((fila, i) => (
                            <tr key={i}>
                                {fila.map((valor, j) => <td key={j}>{formatearAproximacion(valor)}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

const titulos: Record<EstadoRaiz, string> = {
    exacta: "Raíz exacta en la evaluación",
    aproximada: "Raíz aproximada",
    condicionada: "Aproximación condicionada a la continuidad",
    invalida: "Entradas inválidas",
    condiciones: "Condiciones del método incumplidas",
    interrumpida: "Interrupción numérica",
    limite: "Máximo de iteraciones alcanzado",
};

function esResultadoAceptado(estado: EstadoRaiz): boolean {
    return estado === "exacta" || estado === "aproximada" || estado === "condicionada";
}

function ResultadoNoLineal({ resultado }: { resultado: ResultadoRaiz<unknown> }) {
    const { estado, ultima, mensaje } = resultado;
    const exacta = estado === "exacta";
    const formatear = exacta ? formatearDecimal : formatearAproximacion;
    const relacion = exacta ? "=" : String.raw`\approx `;

    return (
        <section className="resumen-calculadora" role="status">
            <div>
                <h3>{titulos[estado]}</h3>
                {mensaje && <p>{mensaje}</p>}
                {ultima && (
                    <>
                        {!esResultadoAceptado(estado) && <p>Última aproximación evaluada</p>}
                        <MathJax className="resumen-calculadora__valor" dynamic>{String.raw`\[x${relacion}${formatear(ultima.x)}\]`}</MathJax>
                    </>
                )}
            </div>
            {ultima && (
                <div>
                    <h3>Comprobación</h3>
                    <MathJax className="resumen-calculadora__valor" dynamic>{String.raw`\[|f(x)|${relacion}${formatear(Math.abs(ultima.fx))}\]`}</MathJax>
                    {ultima.semiancho !== undefined && <p>Semiancho del intervalo {formatearAproximacion(ultima.semiancho)}</p>}
                    {ultima.cambio !== undefined && <p>Cambio entre aproximaciones {formatearAproximacion(ultima.cambio)}</p>}
                </div>
            )}
        </section>
    );
}
