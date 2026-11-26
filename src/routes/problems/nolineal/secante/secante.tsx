import { parseDecimal } from "@/functions/parse-decimal";
import { useMemo } from "react";
import { CalculadoraNoLineal, EntradaDecimal, TablaIteraciones } from "../compartido/calculadora-nolineal";
import { ejemplosRaices } from "../calculo/ejemplos-raices";
import { createInputGraph } from "../compartido/grafica-modelo";
import { resolverSecante, type FilaSecante } from "../calculo/metodos-raices";
import { useCalculoRaiz } from "../compartido/use-calculo-raiz";

const ejemplo = ejemplosRaices.secante;
const COLUMNAS = ["k", "x_{k-1}", "x_k", "x_{k+1}", "f(x_k)"];

export default function Secante() {
    const {
        ecuacion, campos, funcion, error, resultado, setResultado, cambiarEcuacion, cambiarCampo, validarFuncion,
    } = useCalculoRaiz<FilaSecante, "x0" | "x1">(ejemplo.funcion, { x0: ejemplo.x0, x1: ejemplo.x1 });

    const x0 = parseDecimal(campos.x0);
    const x1 = parseDecimal(campos.x1);
    const inputGraph = useMemo(
        () => funcion ? createInputGraph(funcion.evaluar, { method: "secante", x0, x1 }) : null,
        [funcion, x0, x1],
    );

    function calcular() {
        if (funcion) {
            setResultado(resolverSecante(funcion.evaluar, x0, x1, ejemplo.tolerancia, ejemplo.maximo));
        }
    }

    return (
        <CalculadoraNoLineal
            titulo="MÉTODO DE LA SECANTE"
            rutaIntroduccion="/nolineal/secante"
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
                        <h3>Valores iniciales</h3>
                        <label htmlFor="initial-value">x₀:</label>
                        <EntradaDecimal id="initial-value" value={campos.x0} onValueChange={(valor) => cambiarCampo("x0", valor)} />
                        <label htmlFor="initial-value-2">x₁:</label>
                        <EntradaDecimal id="initial-value-2" value={campos.x1} onValueChange={(valor) => cambiarCampo("x1", valor)} />
                    </div>
                    <div className="calculadora-nolineal__calculation-controls">
                        <button type="button" onClick={calcular}>Calcular</button>
                    </div>
                </>
            )}
        >
            {resultado && <TablaIteraciones
                columnas={COLUMNAS}
                filas={resultado.filas.map(({ anterior, x, fx, siguiente }, i) =>
                    [i + 1, anterior, x, siguiente, fx],
                )}
            />}
        </CalculadoraNoLineal>
    );
}
