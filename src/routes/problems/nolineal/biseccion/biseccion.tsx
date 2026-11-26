import { parseDecimal } from "@/functions/parse-decimal";
import { MathJax } from "better-react-mathjax";
import { useMemo } from "react";
import { CalculadoraNoLineal, EntradaDecimal, TablaIteraciones } from "../compartido/calculadora-nolineal";
import { ejemplosRaices } from "../calculo/ejemplos-raices";
import { formatearDecimal } from "../compartido/formato-decimal";
import { evaluarReal } from "../calculo/funcion-real";
import { createInputGraph } from "../compartido/grafica-modelo";
import { resolverBiseccion, type FilaBiseccion } from "../calculo/metodos-raices";
import { useCalculoRaiz } from "../compartido/use-calculo-raiz";

const ejemplo = ejemplosRaices.biseccion;
const COLUMNAS = ["k", "a", "c", "b", "f(a)", "f(c)", "f(b)", "(b-a)/2"];

export default function Biseccion() {
    const {
        ecuacion, campos, funcion, error, resultado, setResultado, cambiarEcuacion, cambiarCampo, validarFuncion,
    } = useCalculoRaiz<FilaBiseccion, "a" | "b">(ejemplo.funcion, { a: ejemplo.a, b: ejemplo.b });

    const a = parseDecimal(campos.a);
    const b = parseDecimal(campos.b);
    const inputGraph = useMemo(
        () => funcion ? createInputGraph(funcion.evaluar, { method: "biseccion", a, b }) : null,
        [funcion, a, b],
    );
    const fa = useMemo(() => funcion ? evaluarReal(funcion.evaluar, a) : null, [funcion, a]);
    const fb = useMemo(() => funcion ? evaluarReal(funcion.evaluar, b) : null, [funcion, b]);

    function calcular() {
        if (funcion) {
            setResultado(resolverBiseccion(funcion.evaluar, a, b, ejemplo.tolerancia, ejemplo.maximo));
        }
    }

    return (
        <CalculadoraNoLineal
            titulo="MÉTODO DE BISECCIÓN"
            rutaIntroduccion="/nolineal/biseccion"
            ecuacion={ecuacion}
            ecuacionLatex={funcion?.latex ?? null}
            mensajeValidacion={error}
            onCambiarEcuacion={cambiarEcuacion}
            onValidar={validarFuncion}
            graficaEntrada={inputGraph}
            resultado={resultado}
            ayudaGrafica="Ingresa un intervalo válido con a menor que b."
            parametros={(
                <>
                    <div className="calculadora-nolineal__interval-inputs">
                        <h3>Intervalo inicial</h3>
                        <label htmlFor="interval-a">a:</label>
                        <EntradaDecimal id="interval-a" value={campos.a} onValueChange={(valor) => cambiarCampo("a", valor)} />
                        <label htmlFor="interval-b">b:</label>
                        <EntradaDecimal id="interval-b" value={campos.b} onValueChange={(valor) => cambiarCampo("b", valor)} />
                    </div>

                    <div className="calculadora-nolineal__interval-values">
                        <span><MathJax inline>{String.raw`\(f(a)\)`}</MathJax> = {fa === null ? "No definido" : formatearDecimal(fa)}</span>
                        <span><MathJax inline>{String.raw`\(f(b)\)`}</MathJax> = {fb === null ? "No definido" : formatearDecimal(fb)}</span>
                    </div>

                    <div className="calculadora-nolineal__calculation-controls">
                        <button type="button" onClick={calcular}>Calcular</button>
                    </div>
                </>
            )}
        >
            {resultado && <TablaIteraciones
                columnas={COLUMNAS}
                filas={resultado.filas.map(({ a, b, c, fa, fb, fc, semiancho }, i) =>
                    [i + 1, a, c, b, fa, fc, fb, semiancho],
                )}
            />}
        </CalculadoraNoLineal>
    );
}
