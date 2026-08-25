# Edi's Store — Tarea 2: Tienda en Línea con React y Bootstrap

Migración de la Tienda en Línea (Tarea 1, HTML puro) a una aplicación React
componentizada, usando React-Bootstrap para el diseño y react-router-dom para
la navegación entre secciones.

**Nombre:** Edilson Enrique García Villeda
**Carnet:** 9490-23-2637

## Estructura de páginas

- `/` — Inicio: bienvenida, Carousel de productos destacados y grid de Cards.
- `/productos` — Catálogo de Productos: filtros de búsqueda/categoría/orden y tabla de productos.
- `/productos/:id` — Detalle de Producto: especificaciones, reseñas (Accordion, ListGroup, Badge)
  y formulario para agregar al carrito (Modal de confirmación).
- `/carrito` — Carrito de Compras: estado global (React Context), cupón de descuento y checkout.
- `/registro` — Registro de Usuario.
- `/login` — Iniciar Sesión.
- `/contacto` — Contacto: dirección, formulario y preguntas frecuentes (Accordion).

El `Navbar` y el `Footer` son componentes reutilizables presentes en todas las páginas
(`src/components/Layout.jsx`).

## Cómo correr el proyecto

```bash
npm install
npm run dev      # entorno de desarrollo (http://localhost:5173)
npm run build    # build de producción
```

## Tarea 1

Las páginas HTML originales (sin CSS/JS, restricción de la Tarea 1) se conservan en
`legacy-tarea1/` como referencia histórica, y siguen disponibles íntegras en la rama `Tarea1`.
