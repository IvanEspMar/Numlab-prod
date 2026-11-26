import { useCallback, useState } from 'react'
import { EditorSistema } from '@/components/editor-matriz/editor-matriz'
import { useMatrizEditable, type SistemaNumerico } from '@/hooks/use-matriz-editable'
import { PanelFactorizacion, ResultadoFactorizacion, type ResultadoLU } from './panel-factorizacion'

const TAM_MIN = 3
const TAM_MAX = 10

interface CalculadoraFactorizacionProps {
  metodo: 'Doolittle' | 'Crout'
  ejemplo: SistemaNumerico
  resolver: (A: number[][], b: number[]) => ResultadoLU
}

/** Calculadora común de los métodos de factorización LU: solo cambia el algoritmo. */
export function CalculadoraFactorizacion({ metodo, ejemplo, resolver }: CalculadoraFactorizacionProps) {
  const [resultado, setResultado] = useState<ResultadoLU | null>(null)
  const [error, setError] = useState('')

  const descartarResultado = useCallback(() => {
    setResultado(null)
    setError('')
  }, [])

  const matriz = useMatrizEditable({
    ejemplo, minimo: TAM_MIN, maximo: TAM_MAX, alCambiar: descartarResultado,
  })

  function calcular() {
    try {
      const { A, b } = matriz.leer()
      setResultado(resolver(A, b))
      setError('')
    } catch (e) {
      setResultado(null)
      setError(e instanceof Error ? e.message : 'Error desconocido')
    }
  }

  return (
    <PanelFactorizacion
      metodo={metodo}
      tamano={matriz.tamano}
      minimo={TAM_MIN}
      maximo={TAM_MAX}
      puedeCalcular={matriz.completa}
      onCambiarTamano={matriz.cambiarTamano}
      onCargarEjemplo={matriz.cargarEjemplo}
      onLimpiar={matriz.limpiar}
      onCalcular={calcular}
      error={error}
      editor={<EditorSistema matriz={matriz} />}
    >
      {resultado && <ResultadoFactorizacion {...resultado} />}
    </PanelFactorizacion>
  )
}
