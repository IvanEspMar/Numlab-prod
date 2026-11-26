import './App.scss'
import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router'

import { Header, Footer } from './components/header'
import Breadcrumbs from './components/breadcrumbs/breadcrumbs'

// Las pantallas de inicio y menús son ligeras y se cargan con la aplicación.
import Home from './routes/home'
import Problemas from './routes/problems/problems'
import NoLineales from './routes/problems/nolineal/nolineal'
import Sistemas from './routes/problems/sistemas/sistemas'
import EigenValues from './routes/problems/eigenvalues/eigenvalues'

const NoLinealIntroduccion = lazy(() => import('./routes/problems/nolineal/nolineal-introducciones'))
const Biseccion = lazy(() => import('./routes/problems/nolineal/biseccion/biseccion'))
const Newton = lazy(() => import('./routes/problems/nolineal/newton/newton'))
const Secante = lazy(() => import('./routes/problems/nolineal/secante/secante'))

const SistemasIntroduccion = lazy(() => import('./routes/problems/sistemas/sistemas-introducciones'))
const GaussJordan = lazy(() => import('./routes/problems/sistemas/gauss-jordan/gauss-jordan'))
const Jacobi = lazy(() => import('./routes/problems/sistemas/jacobi/jacobi'))
const GaussSeidel = lazy(() => import('./routes/problems/sistemas/gauss-seidel/gauss-seidel'))
const Doolittle = lazy(() => import('./routes/problems/sistemas/doolittle/doolittle'))
const Crout = lazy(() => import('./routes/problems/sistemas/crout/crout'))

const EigenIntroduccion = lazy(() => import('./routes/problems/eigenvalues/eigenvalues-introducciones'))
const Potencia = lazy(() => import('./routes/problems/eigenvalues/potencia/potencia'))
const PotenciaInversa = lazy(() => import('./routes/problems/eigenvalues/inversa/inversa'))

function ScrollAlInicio() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function AppContent() {
  const { pathname } = useLocation()

  return (
    <main className="aplicacion">
      <ScrollAlInicio />
      <Header />

      {pathname !== '/' && <Breadcrumbs />}

      <Suspense fallback={<p className="cargando" role="status">Cargando…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problemas />} />

          <Route path="/nolineal" element={<NoLineales />} />
          <Route path="/nolineal/biseccion" element={<NoLinealIntroduccion method="biseccion" />} />
          <Route path="/nolineal/biseccion/calcular" element={<Biseccion />} />
          <Route path="/nolineal/newton" element={<NoLinealIntroduccion method="newton" />} />
          <Route path="/nolineal/newton/calcular" element={<Newton />} />
          <Route path="/nolineal/secante" element={<NoLinealIntroduccion method="secante" />} />
          <Route path="/nolineal/secante/calcular" element={<Secante />} />

          <Route path="/lineal" element={<Sistemas />} />
          <Route path="/lineal/gauss-jordan" element={<SistemasIntroduccion method="gauss-jordan" />} />
          <Route path="/lineal/gauss-jordan/calcular" element={<GaussJordan />} />
          <Route path="/lineal/jacobi" element={<SistemasIntroduccion method="jacobi" />} />
          <Route path="/lineal/jacobi/calcular" element={<Jacobi />} />
          <Route path="/lineal/gauss-seidel" element={<SistemasIntroduccion method="gauss-seidel" />} />
          <Route path="/lineal/gauss-seidel/calcular" element={<GaussSeidel />} />
          <Route path="/lineal/doolittle" element={<SistemasIntroduccion method="doolittle" />} />
          <Route path="/lineal/doolittle/calcular" element={<Doolittle />} />
          <Route path="/lineal/crout" element={<SistemasIntroduccion method="crout" />} />
          <Route path="/lineal/crout/calcular" element={<Crout />} />

          <Route path="/eigenvalues" element={<EigenValues />} />
          <Route path="/eigenvalues/potencia" element={<EigenIntroduccion method="potencia" />} />
          <Route path="/eigenvalues/potencia/calcular" element={<Potencia />} />
          <Route path="/eigenvalues/inversa" element={<EigenIntroduccion method="inversa" />} />
          <Route path="/eigenvalues/inversa/calcular" element={<PotenciaInversa />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Footer />
    </main>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}
