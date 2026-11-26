import { CalculadoraIterativa } from '../compartido/calculadora-iterativa'
import { resolverJacobi } from '../compartido/metodos-iterativos'

export default function Jacobi() {
  return (
    <CalculadoraIterativa
      metodo="jacobi"
      titulo="Método de Jacobi"
      descripcion="Solución de sistemas de ecuaciones lineales mediante aproximaciones sucesivas."
      resolver={resolverJacobi}
    />
  )
}
