import { CalculadoraFactorizacion } from '../compartido/calculadora-factorizacion'
import { ejemploCrout } from '../compartido/ejemplos'
import { resolverCrout } from './lu'

export default function Crout() {
  return <CalculadoraFactorizacion metodo="Crout" ejemplo={ejemploCrout} resolver={resolverCrout} />
}
