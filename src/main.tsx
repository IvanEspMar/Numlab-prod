import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MathJaxContext } from 'better-react-mathjax'
import App from './App'

const contenedor = document.getElementById('root')
if (!contenedor) throw new Error('No se encontró el elemento #root.')

createRoot(contenedor).render(
  <StrictMode>
    <MathJaxContext>
      <App />
    </MathJaxContext>
  </StrictMode>,
)
