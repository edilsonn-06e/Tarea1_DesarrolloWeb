# Edi's Store — Tarea 2: Tienda en Línea con React y Bootstrap

Migración de la Tienda en Línea (Tarea 1, HTML puro) a una aplicación React componentizada, utilizando React-Bootstrap para el diseño y `react-router-dom` para la navegación entre las diferentes secciones del sitio.

**Nombre:** Edilson Enrique García Villeda
**Carnet:** 9490-23-2637

## Sitio publicado

La aplicación se encuentra publicada en Netlify y puede visualizarse en el siguiente enlace:

**[Edi's Store — Ver sitio web](https://tarea2edilson.netlify.app/)**

## Estructura de páginas

* `/` — **Inicio:** bienvenida, Carousel de productos destacados y grid de Cards.
* `/productos` — **Catálogo de Productos:** filtros de búsqueda, categoría, orden y tabla de productos.
* `/productos/:id` — **Detalle de Producto:** especificaciones, reseñas (Accordion, ListGroup, Badge) y formulario para agregar al carrito (Modal de confirmación).
* `/carrito` — **Carrito de Compras:** estado global (React Context), cupón de descuento y checkout.
* `/registro` — **Registro de Usuario.**
* `/login` — **Iniciar Sesión.**
* `/contacto` — **Contacto:** dirección, formulario y preguntas frecuentes (Accordion).

El `Navbar` y el `Footer` son componentes reutilizables presentes en todas las páginas (`src/components/Layout.jsx`).

## Tecnologías utilizadas

* React
* React-Bootstrap
* Bootstrap
* React Router DOM
* Vite
* Netlify

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

El proyecto se ejecutará en el entorno de desarrollo:

`http://localhost:5173`

Para generar el build de producción:

```bash
npm run build
```

## Tarea 1

Las páginas HTML originales, desarrolladas sin CSS ni JavaScript debido a las restricciones de la Tarea 1, se conservan en `legacy-tarea1/` como referencia histórica.

La versión original también continúa disponible íntegramente en la rama `Tarea1`.
