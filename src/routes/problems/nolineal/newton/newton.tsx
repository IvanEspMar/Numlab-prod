import { parseDecimal } from "@/functions/parse-decimal";
import { useMemo } from "react";
import { CalculadoraNoLineal, EntradaDecimal, TablaIteraciones } from "../compartido/calculadora-nolineal";
import { ejemplosRaices } from "../calculo/ejemplos-raices";
import { createInputGraph } from "../compartido/grafica-modelo";
import { resolverNewton, type FilaNewton } from "../calculo/metodos-raices";
import { useCalculoRaiz } from "../compartido/use-calculo-raiz";

const ejemplo = ejemplosRaices.newton;
const COLUMNAS = ["k", "x_k", "f(x_k)", "f'(x_k)", "x_{k+1}"];

export default function Newton() {
    const {
        ecuacion, campos, funcion, error, resultado, setResultado, cambiarEcuacion, cambiarCampo, validarFuncion,
    } = useCalculoRaiz<FilaNewton, "x">(ejemplo.funcion, { x: ejemplo.x }, true);

    const x = parseDecimal(campos.x);
    const inputGraph = useMemo(() => funcion?.pendiente ? createInputGraph(funcion.evaluar, {
        method: "newton", x, derivative: funcion.pendiente,
    }) : null, [funcion, x]);

    function calcular() {
        if (funcion?.pendiente) {
            setResultado(resolverNewton(funcion.evaluar, funcion.pendiente, x, ejemplo.tolerancia, ejemplo.maximo));
        }
    }

    return (
        <CalculadoraNoLineal
            titulo="MÉTODO DE NEWTON-RAPHSON"
            rutaIntroduccion="/nolineal/newton"
            ecuacion={ecuacion}
            ecuacionLatex={funcion?.latex ?? null}
            mensajeValidacion={error}
            onCambiarEcuacion={cambiarEcuacion}
            onValidar={validarFuncion}
            graficaEntrada={inputGraph}
            resultado={resultado}
            parametros={(
                <>
                    <div className="calculadora-nolineal__interval-inputs">
                        <h3>Valor inicial</h3>
                        <label htmlFor="newton-initial-value">x₀:</label>
                        <EntradaDecimal id="newton-initial-value" value={campos.x} onValueChange={(valor) => cambiarCampo("x", valor)} />
                    </div>

                    <div className="calculadora-nolineal__calculation-controls">
                        <button type="button" onClick={calcular}>Calcular</button>
                    </div>
                </>
            )}
        >
            {resultado && <TablaIteraciones
                columnas={COLUMNAS}
                filas={resultado.filas.map(({ x, fx, pendiente, siguiente }, i) =>
                    [i, x, fx, pendiente, siguiente],
                )}
            />}
        </CalculadoraNoLineal>
    );
}
