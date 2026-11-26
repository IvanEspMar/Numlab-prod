import MethodIntroduction, { type MethodIntroductionData } from '@/components/method-introduction/method-introduction'
import biseccion from '@/assets/biseccion.svg'
import newton from '@/assets/newton.svg'
import secante from '@/assets/secante.svg'

const methods = {
  biseccion: {
    title: 'Método de Bisección',
    category: 'Raíces de ecuaciones · Método cerrado',
    description: 'Es un procedimiento numérico que aproxima una raíz real dividiendo repetidamente un intervalo en dos mitades.',
    background: String.raw`Si una función es continua en \([a,b]\) y \(f(a)\) y \(f(b)\) tienen signos opuestos, el teorema del valor intermedio garantiza que existe al menos una raíz en el intervalo. Cada paso conserva la mitad donde persiste el cambio de signo.`,
    history: 'La búsqueda de soluciones mediante intervalos se remonta a procedimientos antiguos de aproximación. La bisección moderna formaliza esta idea con el teorema del valor intermedio, desarrollado en el contexto del análisis matemático.',
    procedure: [
      String.raw`Elegir \(a<b\) y comprobar que la función sea continua en el intervalo. Si un extremo evalúa a cero, es una raíz en la precisión de cálculo. En otro caso se requieren signos opuestos.`,
      String.raw`Calcular el punto medio \(c=\frac{a+b}{2}\) y evaluar la función en ese punto.`,
      'Si la evaluación no es cero, conservar la mitad con cambio de signo.',
      String.raw`La calculadora pide un semiancho pequeño y que \(|f(c)|\) se reduzca respecto al menor residuo inicial. El semiancho acota la distancia a alguna raíz solo bajo continuidad. Un intervalo estrecho con residuo grande puede indicar una discontinuidad o que falta precisión.`,
    ],
    formulaLatex: String.raw`c = \frac{a+b}{2}`,
    image: biseccion,
    imageAlt: 'Gráfica que ilustra el método de bisección',
    calculatorPath: '/nolineal/biseccion/calcular',
  },
  newton: {
    title: 'Método de Newton-Raphson',
    category: 'Raíces de ecuaciones · Método abierto',
    description: 'Aproxima una raíz de una función utilizando la pendiente de su recta tangente en cada iteración.',
    background: String.raw`Se parte de una aproximación \(x_0\). La tangente a la curva en ese punto corta al eje horizontal en una nueva estimación. El proceso requiere evaluar la función y su derivada y puede fallar si la derivada es cero o el punto inicial es inadecuado.`,
    history: 'Isaac Newton desarrolló ideas de aproximación de raíces en el siglo XVII. Joseph Raphson publicó en 1690 un procedimiento relacionado; el método actual se asocia a ambos nombres y evolucionó con el cálculo diferencial.',
    procedure: [
      String.raw`Elegir una aproximación inicial \(x_0\).`,
      String.raw`Evaluar \(f(x_n)\) y su derivada \(f'(x_n)\).`,
      'Calcular la siguiente aproximación mediante la fórmula de Newton.',
      'Parar si la evaluación es cero en la precisión de cálculo o si se obtienen a la vez un paso pequeño respecto a la escala de las aproximaciones y un residuo pequeño respecto al inicial. Estos indicadores permiten aceptar una aproximación sin certificar su distancia a una raíz.',
    ],
    formulaLatex: String.raw`x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}`,
    image: newton,
    imageAlt: 'Gráfica SVG de la aproximación mediante rectas tangentes',
    calculatorPath: '/nolineal/newton/calcular',
  },
  secante: {
    title: 'Método de la Secante',
    category: 'Raíces de ecuaciones · Método abierto',
    description: 'Calcula aproximaciones a una raíz mediante rectas secantes que pasan por dos puntos de la gráfica.',
    background: 'A diferencia de Newton-Raphson, no requiere calcular la derivada. Utiliza dos valores iniciales y aproxima la pendiente mediante diferencias finitas. Su convergencia no está garantizada para cualquier elección de puntos.',
    history: 'El uso de interpolación lineal para aproximar raíces tiene antecedentes históricos anteriores al cálculo diferencial. La secante es una versión iterativa de esa idea que emplea dos aproximaciones sucesivas.',
    procedure: [
      String.raw`Elegir dos valores iniciales \(x_0\) y \(x_1\).`,
      'Evaluar la función en ambos puntos.',
      'Encontrar la intersección de la secante con el eje horizontal.',
      'Usar las dos aproximaciones más recientes. Parar si la evaluación es cero en la precisión de cálculo o si coinciden un paso pequeño en la escala de las aproximaciones y un residuo pequeño respecto al menor residuo inicial. El criterio no da una cota de distancia a una raíz.',
    ],
    formulaLatex: String.raw`x_{n+1}=x_n-\frac{f(x_n)(x_n-x_{n-1})}{f(x_n)-f(x_{n-1})}`,
    image: secante,
    imageAlt: 'Gráfica SVG que representa la recta secante',
    calculatorPath: '/nolineal/secante/calcular',
  },
} satisfies Record<string, MethodIntroductionData>

export type NoLinealMethod = keyof typeof methods

export default function NoLinealIntroduccion({ method }: { method: NoLinealMethod }) {
  return <MethodIntroduction method={methods[method]} />
}
