# Edi's Store — Tarea 3: Autenticación y Estado Global

Evolución de la Tienda en Línea (Tarea 2, React + React-Bootstrap) incorporando una arquitectura de **gestión de estado global** para manejar la sesión del usuario (Login / Logout / Perfil) de forma transversal a toda la aplicación, sin necesidad de prop drilling.

**Nombre:** Edilson Enrique García Villeda
**Carnet:** 9490-23-2637

## Sitio publicado

La aplicación se encuentra publicada en Netlify y puede visualizarse en el siguiente enlace:

**[Edi's Store — Ver sitio web](https://tarea2edilson.netlify.app/)**

## Arquitectura de estado global — Opción A: Context API + useReducer

Se seleccionó **`useContext` combinado con `useReducer`** (en lugar de Redux Toolkit) por las siguientes razones:

* El proyecto ya utilizaba React Context para el carrito de compras (`CartContext`) desde la Tarea 2; adoptar la misma familia de herramientas para la autenticación mantiene la arquitectura consistente y evita mezclar dos paradigmas de estado distintos en la misma aplicación.
* El alcance del estado de sesión (login/logout/perfil) es acotado y no requiere middlewares, DevTools de time-travel ni normalización de datos compleja, por lo que `useReducer` es suficiente para modelar las transiciones de estado de forma predecible.
* Evita agregar dependencias externas (`@reduxjs/toolkit`, `react-redux`) para un caso de uso que React ya resuelve de forma nativa, manteniendo el bundle más liviano.

### Implementación (`src/context/AuthContext.jsx`)

* **`AuthProvider`**: componente que encapsula el `useReducer` y expone el estado y el `dispatch` mediante dos contextos (`AuthStateContext` y `AuthDispatchContext`), montado en la raíz de la aplicación (`App.jsx`) junto al `CartProvider`.
* **Estado inicial**: `{ isAuthenticated: false, user: null, status: 'idle', error: null }`.
* **Reducer con 4 acciones**:
  * `LOGIN_START` — marca el estado como `loading` mientras se simula la autenticación.
  * `LOGIN_SUCCESS` — almacena los datos del usuario (`nombre`, `correo`, `rol`, `fechaAcceso`) y pone `isAuthenticated` en `true`.
  * `LOGIN_ERROR` — registra un mensaje de error y mantiene `isAuthenticated` en `false`.
  * `LOGOUT` — limpia la sesión y restablece el estado inicial.
* **Hooks personalizados**: `useAuthState()` (estado), `useAuthDispatch()` (dispatch crudo) y `useAuth()` (hook de conveniencia que combina el estado con las funciones `login`, `loginError` y `logout`), usados directamente en `NavBar`, `Login` y `Perfil` sin pasar props manualmente entre componentes.

## Flujo de autenticación

* **`/login`** — formulario con React-Bootstrap y validación nativa (`Form.Control` con `required`, tipo `email` y longitud mínima de contraseña). Al enviar credenciales válidas, dispara `login()` con datos estructurados (nombre derivado del correo, correo, rol y fecha de acceso) y redirige a `/perfil`.
* **`Navbar`** — reacciona en tiempo real al estado global: si no hay sesión muestra el enlace "Iniciar Sesión"; si hay sesión, lo reemplaza por un menú desplegable con el nombre del usuario, acceso a "Mi Perfil" y el botón "Cerrar Sesión".
* **`/perfil`** — vista protegida (redirige a `/login` si no hay sesión activa) que consume el estado global directamente con `useAuth()` y muestra los datos de la cuenta (correo, tipo de membresía, fecha de ingreso) e historial de pedidos simulado usando `Card`, `Badge` y `ListGroup` de React-Bootstrap, con opción de cerrar sesión desde la misma pantalla.

## Estructura de páginas

* `/` — **Inicio:** bienvenida, Carousel de productos destacados y grid de Cards.
* `/productos` — **Catálogo de Productos:** filtros de búsqueda, categoría, orden y tabla de productos.
* `/productos/:id` — **Detalle de Producto:** especificaciones, reseñas (Accordion, ListGroup, Badge) y formulario para agregar al carrito (Modal de confirmación).
* `/carrito` — **Carrito de Compras:** estado global (React Context), cupón de descuento y checkout.
* `/registro` — **Registro de Usuario.**
* `/login` — **Iniciar Sesión:** autenticación simulada que dispara la acción `LOGIN` del estado global.
* `/perfil` — **Perfil del usuario autenticado:** datos de sesión y cierre de sesión (ruta protegida).
* `/contacto` — **Contacto:** dirección, formulario y preguntas frecuentes (Accordion).

El `Navbar` y el `Footer` son componentes reutilizables presentes en todas las páginas (`src/components/Layout.jsx`).

## Tecnologías utilizadas

* React (Context API + `useReducer` para estado global de autenticación)
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
