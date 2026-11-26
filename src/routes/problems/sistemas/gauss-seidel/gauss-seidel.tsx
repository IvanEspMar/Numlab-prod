import { CalculadoraIterativa } from '../compartido/calculadora-iterativa'
import { resolverGaussSeidel } from '../compartido/metodos-iterativos'

export default function GaussSeidel() {
  return (
    <CalculadoraIterativa
      metodo="gauss-seidel"
      titulo="Método de Gauss-Seidel"
      descripcion="Solución de sistemas de ecuaciones lineales mediante aproximaciones sucesivas y actualización inmediata de valores."
      resolver={resolverGaussSeidel}
    />
  )
}
