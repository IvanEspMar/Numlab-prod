# NumLab

Proyecto de Métodos Numéricos I · FES Acatlán, UNAM.

Aplicación desarrollada con React, TypeScript, Vite y Sass para consultar la teoría y utilizar calculadoras de métodos numéricos.

## Desarrollo

Requiere Node.js 22 o superior.

```bash
npm ci
npm run dev
```

Para comprobar el proyecto antes de publicarlo:

```bash
npm run build
npm run preview
```

## Comprobaciones

```bash
npm run typecheck   # TypeScript en modo estricto
npm run lint        # oxlint
npm test            # pruebas de los algoritmos (requiere Node.js 22.18 o superior)
```

## Imágenes

Las ilustraciones están en `src/assets/`. Los retratos de sistemas lineales usan WebP (≈60 % menos peso que los PNG/JPG originales) y las gráficas de ecuaciones no lineales, SVG.

## Navegación

- `/problems`: selección de temas.
- `/nolineal`, `/lineal`, `/eigenvalues`: listas de métodos.
- `/<tema>/<metodo>`: introducción, explicación, historia e ilustración.
- `/<tema>/<metodo>/calcular`: calculadora existente.

El sitio utiliza `HashRouter` para admitir enlaces directos en GitHub Pages sin configurar redirecciones del servidor. Ejemplo: `https://ivanespmar.github.io/NumLab/#/nolineal/newton`.

## Publicación en GitHub Pages

1. Confirma que se compila con `npm run build`.
2. Haz commit; `dist/` y `node_modules/` permanecen ignorados.
3. Sube los cambios a `main`.
4. En el repositorio de GitHub, abre **Settings → Pages → Build and deployment → Source → GitHub Actions**.
5. El workflow `.github/workflows/deploy.yml` instalará dependencias, compilará y desplegará `dist` automáticamente.

La ruta base del sitio es `/Numlab-prod/` por defecto. Para otro nombre de repositorio no hace falta editar el código: `VITE_BASE=/NumLab/ npm run build`.

## Organización

- `src/routes/problems/` contiene los catálogos y las pantallas de cada método, agrupados en `nolineal/`, `sistemas/` y `eigenvalues/`. Las introducciones y calculadoras se cargan bajo demanda (`React.lazy`), de modo que `mathjs` y las gráficas solo se descargan al abrir esas pantallas.
- La carpeta `compartido/` de cada familia reúne sus componentes, auxiliares y estilos reutilizables:
  - `sistemas/compartido/`: `calculadora-iterativa` (Jacobi y Gauss-Seidel), `calculadora-factorizacion` (Doolittle y Crout), algoritmos iterativos, álgebra común y ejemplos.
  - `nolineal/calculo/`: algoritmos de raíces, evaluación de funciones, ejemplos y pruebas.
- Cada algoritmo es una función pura separada de su pantalla (`lu.ts`, `eliminacion.ts`, `metodos-iterativos.ts`, `metodos-potencia.ts`, `metodos-raices.ts`), por lo que se prueba sin React.
- `src/hooks/use-matriz-editable.ts` concentra el estado del editor de sistemas `Ax = b` (celdas, signos, tamaño, ejemplo y lectura numérica) que comparten las cinco calculadoras de sistemas y las dos de valores propios.
- `src/components/` contiene las piezas que usan varias familias, como la cabecera de calculadora, el editor de matrices y la plantilla de las introducciones.
- `src/styles/` reúne los tokens de diseño y los mixins Sass para botones y paneles.
