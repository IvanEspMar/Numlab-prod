
import { Link } from 'react-router'
import './tarjeta.scss'

export type TarjetaData = {
  numero: string
  categoria: string
  titulo: string
  imagen?: string
  textoAlternativo?: string
  formula?: string
  descripcion: string
  pie: string
  ruta: string
}

function Tarjeta({ tarjeta }: { tarjeta: TarjetaData }) {
  return (
    <Link className="tarjeta" to={tarjeta.ruta} aria-label={`Conocer ${tarjeta.titulo}`}>
      <header className="tarjeta__encabezado">
        <span className="tarjeta__numero">{tarjeta.numero}</span>
        <span className="tarjeta__categoria">{tarjeta.categoria}</span>
      </header>

      <h3 className="tarjeta__titulo">{tarjeta.titulo}</h3>

      <div className="tarjeta__visual">
        {tarjeta.imagen && (
          <img
            src={tarjeta.imagen}
            alt={tarjeta.textoAlternativo ?? ''}
            decoding="async"
          />
        )}

        {tarjeta.formula && (
          <span className="tarjeta__formula">
            {tarjeta.formula}
          </span>
        )}
      </div>

      <p className="tarjeta__descripcion">
        {tarjeta.descripcion}
      </p>

      <footer className="tarjeta__pie">
        <span className="tarjeta__pie-texto">{tarjeta.pie}</span>
      </footer>
    </Link>
  )
}

export default Tarjeta
