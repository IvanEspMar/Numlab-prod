import { useCallback, useMemo, useState } from "react";
import { parseDecimal } from "@/functions/parse-decimal";

/** Sistema `Ax = b` expresado con números. */
export interface SistemaNumerico {
  A: readonly (readonly number[])[];
  b: readonly number[];
}

export interface OpcionesMatrizEditable {
  /** Sistema que se carga al iniciar y con «Cargar ejemplo». */
  ejemplo: SistemaNumerico;
  minimo: number;
  maximo: number;
  /** Se invoca tras cada edición del usuario (por ejemplo, para descartar resultados obsoletos). */
  alCambiar?: () => void;
}

interface Estado {
  tamano: number;
  celdas: string[][];
  signos: number[][];
  vector: string[];
  signosVector: number[];
}

const esVacio = (texto: string) => texto.trim() === "";
const signoDe = (valor: number) => (valor < 0 ? -1 : 1);

function matrizDe<T>(tamano: number, valor: (fila: number, columna: number) => T): T[][] {
  return Array.from({ length: tamano }, (_, i) => Array.from({ length: tamano }, (_, j) => valor(i, j)));
}

function vectorDe<T>(tamano: number, valor: (indice: number) => T): T[] {
  return Array.from({ length: tamano }, (_, i) => valor(i));
}

function estadoVacio(tamano: number): Estado {
  return {
    tamano,
    celdas: matrizDe(tamano, () => ""),
    signos: matrizDe(tamano, () => 1),
    vector: vectorDe(tamano, () => ""),
    signosVector: vectorDe(tamano, () => 1),
  };
}

/** Separa cada número en magnitud (texto) y signo, tal como lo edita `CeldaMatriz`. */
function estadoDesde({ A, b }: SistemaNumerico): Estado {
  return {
    tamano: A.length,
    celdas: A.map((fila) => fila.map((valor) => String(Math.abs(valor)))),
    signos: A.map((fila) => fila.map(signoDe)),
    vector: b.map((valor) => String(Math.abs(valor))),
    signosVector: b.map(signoDe),
  };
}

/** Las celdas vacías cuentan como 0; un texto inválido produce `NaN`. */
function leerNumero(texto: string, signo: number): number {
  return (esVacio(texto) ? 0 : parseDecimal(texto)) * signo;
}

/**
 * Estado y acciones de un editor de sistemas `Ax = b`: celdas, signos, tamaño,
 * ejemplo y lectura numérica. Todas las acciones son estables entre renderizados.
 */
export function useMatrizEditable({ ejemplo, minimo, maximo, alCambiar }: OpcionesMatrizEditable) {
  const [estado, setEstado] = useState(() => estadoDesde(ejemplo));

  const actualizar = useCallback((cambio: (previo: Estado) => Estado) => {
    setEstado(cambio);
    alCambiar?.();
  }, [alCambiar]);

  const cargarEjemplo = useCallback(() => actualizar(() => estadoDesde(ejemplo)), [actualizar, ejemplo]);

  const limpiar = useCallback(() => actualizar(({ tamano }) => estadoVacio(tamano)), [actualizar]);

  const cambiarTamano = useCallback((nuevo: number) => {
    if (!Number.isInteger(nuevo) || nuevo < minimo || nuevo > maximo) return;
    actualizar((previo) => ({
      tamano: nuevo,
      celdas: matrizDe(nuevo, (i, j) => previo.celdas[i]?.[j] ?? ""),
      signos: matrizDe(nuevo, (i, j) => previo.signos[i]?.[j] ?? 1),
      vector: vectorDe(nuevo, (i) => previo.vector[i] ?? ""),
      signosVector: vectorDe(nuevo, (i) => previo.signosVector[i] ?? 1),
    }));
  }, [actualizar, minimo, maximo]);

  const cambiarCelda = useCallback((fila: number, columna: number, valor: string) => {
    actualizar((previo) => ({
      ...previo,
      celdas: previo.celdas.map((f, i) => (i === fila ? f.with(columna, valor) : f)),
    }));
  }, [actualizar]);

  const alternarSigno = useCallback((fila: number, columna: number) => {
    actualizar((previo) => ({
      ...previo,
      signos: previo.signos.map((f, i) => (i === fila ? f.with(columna, -f[columna]) : f)),
    }));
  }, [actualizar]);

  const cambiarVector = useCallback((indice: number, valor: string) => {
    actualizar((previo) => ({ ...previo, vector: previo.vector.with(indice, valor) }));
  }, [actualizar]);

  const alternarSignoVector = useCallback((indice: number) => {
    actualizar((previo) => ({
      ...previo,
      signosVector: previo.signosVector.with(indice, -previo.signosVector[indice]),
    }));
  }, [actualizar]);

  const { tamano, celdas, signos, vector, signosVector } = estado;

  /** Todas las celdas tienen un número válido (ninguna vacía). */
  const completa = useMemo(
    () => celdas.every((fila) => fila.every(esNumeroValido)) && vector.every(esNumeroValido),
    [celdas, vector],
  );

  /** Alguna celda con texto no es un número válido (las vacías no cuentan). */
  const hayEntradaInvalida = useMemo(() => {
    const invalida = (texto: string) => !esVacio(texto) && !Number.isFinite(parseDecimal(texto));
    return celdas.some((fila) => fila.some(invalida)) || vector.some(invalida);
  }, [celdas, vector]);

  const leer = useCallback((): { A: number[][]; b: number[] } => ({
    A: celdas.map((fila, i) => fila.map((texto, j) => leerNumero(texto, signos[i][j]))),
    b: vector.map((texto, i) => leerNumero(texto, signosVector[i])),
  }), [celdas, signos, vector, signosVector]);

  return {
    tamano, celdas, signos, vector, signosVector,
    completa, hayEntradaInvalida,
    cambiarTamano, cambiarCelda, alternarSigno, cambiarVector, alternarSignoVector,
    cargarEjemplo, limpiar, leer,
  };
}

function esNumeroValido(texto: string): boolean {
  return !esVacio(texto) && Number.isFinite(parseDecimal(texto));
}
