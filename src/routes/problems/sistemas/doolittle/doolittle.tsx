import { CalculadoraFactorizacion } from '../compartido/calculadora-factorizacion'
import { ejemploSistema } from '../compartido/ejemplos'
import { resolverDoolittle } from './lu'

export default function Doolittle() {
  return <CalculadoraFactorizacion metodo="Doolittle" ejemplo={ejemploSistema} resolver={resolverDoolittle} />
}
