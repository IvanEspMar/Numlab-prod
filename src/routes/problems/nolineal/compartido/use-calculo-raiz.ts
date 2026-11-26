import { useCallback, useState } from "react";
import { prepararFuncion } from "../calculo/funcion-real";
import type { ResultadoRaiz } from "../calculo/metodos-raices";

type Preparacion = ReturnType<typeof prepararFuncion>;

/**
 * Estado común de las calculadoras de raíces: texto de la ecuación, función validada,
 * campos numéricos (como texto) y último resultado. Cualquier edición descarta el resultado.
 */
export function useCalculoRaiz<Fila, Campo extends string>(
  ejemplo: string,
  camposIniciales: Record<Campo, string>,
  conDerivada = false,
) {
  const [ecuacion, setEcuacion] = useState(ejemplo);
  const [campos, setCampos] = useState(camposIniciales);
  const [preparacion, setPreparacion] = useState<Preparacion | null>(null);
  const [resultado, setResultado] = useState<ResultadoRaiz<Fila> | null>(null);

  const cambiarEcuacion = useCallback((texto: string) => {
    setEcuacion(texto);
    setPreparacion(null);
    setResultado(null);
  }, []);

  const validarFuncion = useCallback(() => {
    setResultado(null);
    setPreparacion(prepararFuncion(ecuacion, conDerivada));
  }, [ecuacion, conDerivada]);

  const cambiarCampo = useCallback((campo: Campo, valor: string) => {
    setCampos((previos) => ({ ...previos, [campo]: valor }));
    setResultado(null);
  }, []);

  return {
    ecuacion,
    campos,
    funcion: preparacion?.funcion,
    error: preparacion?.error ?? "",
    resultado,
    setResultado,
    cambiarEcuacion,
    cambiarCampo,
    validarFuncion,
  };
}
