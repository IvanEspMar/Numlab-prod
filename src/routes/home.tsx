import { useNavigate } from 'react-router'
import './home.scss'

const INTEGRANTES = [
  { nombre: 'Huesca Martínez José Arturo', rol: 'Programación e investigación' },
  { nombre: 'Espinosa Martínez Iván', rol: 'Diseño y programación' },
  { nombre: 'Martínez González Enrique René', rol: 'Programación e investigación' },
] as const

function Presentacion() {
  const navigate = useNavigate()
  return (
    <section className="recuadro presentacion">
      <div className="presentacion-header">
        <span className="etiqueta">PROYECTO MÉTODOS NUMÉRICOS</span>
        <button type="button" onClick={() => navigate('/problems')} className="start-button">MENÚ PRINCIPAL</button>
      </div>

      <div className="presentacion-contenido">
        <div className="presentacion-titulo">
          <span className="titulo-indice">01 / PRESENTACIÓN</span>

          <h1>
            HERRAMIENTA DE MÉTODOS
            <br />
            <span className="numericos">NUMÉRICOS</span><span className="punto">.</span>
          </h1>

          <div className="titulo-pie">
            <span className="titulo-linea"></span>
            <span>FES ACATLÁN · UNAM</span>
          </div>
        </div>

        <div className="presentacion-visual">
          <div className="visual-grafica">
            <GraficaAnimada />
            <span className="coordenada coordenada-x">X →</span>
            <span className="coordenada coordenada-y">Y ↑</span>
          </div>
        </div>
      </div>

      <div className="presentacion-inferior">
        <div className="presentacion-descripcion">
          <span className="etiqueta">¿QUÉ PUEDES HACER CON NUMLAB?</span>
          <p>
            NumLab es una aplicación para resolver ecuaciones y sistemas mediante distintos métodos numéricos. Permite obtener resultados, consultar los procedimientos paso a paso y comprender cómo funciona cada método.
          </p>
          <p>Desarrollado con <strong>React</strong> y <strong>TypeScript</strong>.</p>
        </div>

        <aside className="integrantes">
          <span className="etiqueta">INTEGRANTES</span>

          {INTEGRANTES.map(({ nombre, rol }, i) => (
            <div className="integrante" key={nombre}>
              <span className="integrante-numero">{String(i + 1).padStart(2, '0')}</span>
              <div className="integrante-info">
                <span className="integrante-nombre">{nombre}</span>
                <span className="integrante-rol">{rol}</span>
              </div>
            </div>
          ))}
        </aside>
      </div>

      <div className="presentacion-footer">
        <span>NUMLAB / 2026</span>
        <span>FACULTAD DE ESTUDIOS SUPERIORES ACATLÁN</span>
      </div>
    </section>
  )
}


export default function Home() {
  return <Presentacion />
}

function GraficaAnimada() {
  return (
    <svg
      className="grafica-animada"
      aria-hidden="true"
      viewBox="0 0 1566 763"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="curva curva-1"
        d="M-60 481.5C-21.5 502.167 88.3 535.199 145.5 529.999C230.5 522.272 291 442.5 305 428.5C325.789 407.711 368 317.499 427.5 317.499C487 317.499 539 438.5 563.5 478.499C597.478 533.973 657.2 618.999 730 598.999C802.8 578.999 842.333 485.333 867.5 428.5C867.5 428.5 887.256 382.592 924 289C950.5 221.5 957 208 981 164C1005 119.999 1054.64 60.0001 1115 60C1188.5 59.9998 1240 135.499 1276 173.999C1312 212.5 1342.71 249.283 1409 281.999C1474.52 314.333 1589 333 1589 333"
        stroke="url(#gradiente-1)"
        strokeWidth="23"
      />

      <path
        className="curva curva-2"
        d="M0 577C12 563 82.5 311.214 219.5 321C356.5 330.786 388.5 700.295 472 700.295C555.5 700.295 589.5 516.998 712.5 479.295C835.5 441.591 934 630.264 1061 620.795C1188 611.326 1245.5 190.439 1360.5 176.795C1475.5 163.151 1588 389.5 1588 389.5"
        stroke="url(#gradiente-2)"
        strokeWidth="18"
      />

      <g className="punto">
        <circle cx="928.5" cy="277.5" r="45.5" fill="#606DF9" fillOpacity="0.25" />
        <circle cx="928.5" cy="277.5" r="31.5" fill="#FC60A2" fillOpacity="0.6" />
        <circle cx="927.742" cy="277.772" r="15.8167" fill="#FC60A2" />
      </g>

      <defs>
        <linearGradient id="gradiente-1" x1="-48.5775" y1="335.614" x2="1566.67" y2="326.663" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F78972" />
          <stop offset="1" stopColor="#F961A2" />
        </linearGradient>

        <linearGradient id="gradiente-2" x1="11" y1="442.562" x2="1566.5" y2="433.917" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B53DC" />
          <stop offset="1" stopColor="#1A76E0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
