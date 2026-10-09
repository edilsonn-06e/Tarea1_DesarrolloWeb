# Edi's Store — Tarea 4: React, Express y MongoDB Atlas

**Curso:** Desarrollo Web  
**Estudiante:** Edilson Enrique García Villeda  
**Carnet:** 9490-23-2637

## Descripción del proyecto

Edi's Store es una aplicación web de tienda en línea desarrollada con React y React-Bootstrap, que integra un backend en Node.js con Express y una base de datos MongoDB Atlas.

Este proyecto representa la evolución de las Tareas 1, 2 y 3, incorporando persistencia de datos, servicios REST, autenticación mediante JWT y operaciones CRUD para la administración de productos.

## Sitio publicado

**Frontend — Netlify:**  
https://edis-store-tarea4.netlify.app/

**Backend — Render:**  
https://tarea1-desarrolloweb.onrender.com/

**Verificación del servidor:**  
https://tarea1-desarrolloweb.onrender.com/api/health

**Consulta de productos:**  
https://tarea1-desarrolloweb.onrender.com/api/recursos

El frontend se encuentra publicado en Netlify, el backend se ejecuta en Render y los datos se almacenan en MongoDB Atlas.

**Nota:** El servicio gratuito de Render puede suspenderse por inactividad. La primera petición después de un período sin uso puede tardar en responder.

## Tecnologías utilizadas

### Frontend

- React
- React-Bootstrap
- Bootstrap 5
- React Router DOM
- Context API y useReducer
- Vite
- JavaScript
- Fetch API

### Backend

- Node.js
- Express
- Mongoose
- MongoDB Atlas
- bcryptjs
- JSON Web Token (JWT)
- CORS
- dotenv
- nodemon

### Herramientas y despliegue

- Visual Studio Code
- Git y GitHub
- Postman
- Netlify
- Render
- MongoDB Atlas

## Arquitectura del sistema

La aplicación utiliza una arquitectura cliente-servidor.

**Frontend:** React gestiona la interfaz, navegación, formularios, carrito y estado de autenticación.

**Backend:** Express proporciona una API REST que procesa las solicitudes de usuarios y productos.

**Base de datos:** MongoDB Atlas almacena permanentemente los documentos de usuarios y productos.

**Flujo de comunicación:**

React (Netlify) → API REST (Render) → MongoDB Atlas

Las solicitudes HTTP del frontend están centralizadas en `src/api/client.js`.

## Estructura del proyecto

```text
Tarea1_DesarrolloWeb/
├── public/
│   ├── img/
│   └── _redirects
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── src/
│   ├── api/
│   │   └── client.js
│   ├── components/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── data/
│   │   └── products.js
│   ├── pages/
│   │   ├── AdminProductos.jsx
│   │   ├── Home.jsx
│   │   ├── Productos.jsx
│   │   ├── ProductoDetalle.jsx
│   │   ├── Carrito.jsx
│   │   ├── Registro.jsx
│   │   ├── Login.jsx
│   │   ├── Perfil.jsx
│   │   └── Contacto.jsx
│   └── App.jsx
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/edilsonn-06e/Tarea1_DesarrolloWeb.git
cd Tarea1_DesarrolloWeb
git switch Tarea4
```

### 2. Instalar dependencias del frontend

Desde la raíz del proyecto:

```bash
npm install
```

### 3. Instalar dependencias del backend

```bash
cd server
npm install
```

### 4. Configurar MongoDB Atlas

Crear un archivo `.env` dentro de `server/`, utilizando `server/.env.example` como referencia.

```env
PORT=4000
MONGODB_URI=CADENA_DE_CONEXION_DE_MONGODB_ATLAS
CLIENT_URL=http://localhost:5173
JWT_SECRET=CLAVE_ALEATORIA_SEGURA
ADMIN_EMAIL=admin@edisstore.com
ADMIN_PASSWORD=CONTRASENA_SEGURA_DEL_ADMINISTRADOR
```

Reemplazar los valores de ejemplo con la configuración correspondiente.

La clave JWT debe mantenerse privada. La contraseña administrativa debe ser única y contener al menos 12 caracteres.

**Los archivos `.env` están excluidos del control de versiones para evitar publicar credenciales.**

### 5. Configurar el frontend

Crear el archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:4000/api
```

### 6. Cargar productos de prueba

Dentro de `server/`:

```bash
npm run seed
```

El script carga cinco productos iniciales y crea una cuenta administrativa si todavía no existe.

**Advertencia:** este procedimiento elimina y reemplaza los productos existentes. Debe utilizarse únicamente cuando se desee reinicializar el catálogo de prueba.

### 7. Ejecutar el backend

Desde `server/`:

```bash
npm run dev
```

El servidor estará disponible en:

http://localhost:4000

Para verificarlo:

http://localhost:4000/api/health

Respuesta esperada:

```json
{
  "ok": true
}
```

### 8. Ejecutar el frontend

Abrir otra terminal desde la raíz del proyecto:

```bash
npm run dev
```

Abrir:

http://localhost:5173

Para utilizar todas las funcionalidades localmente, ambos servidores deben permanecer encendidos.

## Base de datos

La base de datos utilizada es `edis_store`, alojada en MongoDB Atlas.

### Colección de usuarios

El modelo `User` almacena:

- Nombre
- Correo electrónico
- Contraseña protegida mediante bcrypt
- Rol (`cliente` o `admin`)
- Teléfono
- País
- Fechas de creación y modificación

El sistema excluye la contraseña de las respuestas JSON.

### Colección de productos

El modelo `Product` almacena:

- Código
- Nombre
- Categoría
- Precio
- Existencias
- Imagen
- Descripción
- Colores
- Especificaciones
- Reseñas
- Fechas de creación y modificación

## API REST

La API se encuentra disponible bajo el prefijo `/api`.

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/health` | Verificar funcionamiento | Público |
| POST | `/api/auth/register` | Registrar usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |
| GET | `/api/users/:id` | Consultar perfil | Propietario o administrador |
| GET | `/api/recursos` | Listar productos | Público |
| GET | `/api/recursos/:id` | Consultar producto | Público |
| POST | `/api/recursos` | Crear producto | Administrador |
| PUT | `/api/recursos/:id` | Actualizar producto | Administrador |
| DELETE | `/api/recursos/:id` | Eliminar producto | Administrador |

Los endpoints fueron comprobados mediante Postman durante el desarrollo.

## Autenticación y autorización

La aplicación implementa autenticación mediante JSON Web Tokens (JWT).

### Registro

Un usuario puede crear una cuenta proporcionando sus datos personales y una contraseña.

Los nuevos usuarios reciben el rol `cliente` de manera predeterminada.

### Inicio de sesión

El backend verifica las credenciales almacenadas en MongoDB y devuelve los datos del usuario junto con un token JWT.

El token tiene una vigencia de dos horas.

### Estado global

React utiliza Context API y `useReducer` para administrar:

- `LOGIN_START`
- `LOGIN_SUCCESS`
- `LOGIN_ERROR`
- `LOGOUT`

El token se conserva en memoria y se envía mediante el encabezado `Authorization: Bearer TOKEN` cuando se realizan peticiones HTTP autenticadas.

Al cerrar sesión, se elimina el token de memoria. La sesión no persiste al recargar la aplicación.

### Seguridad

Se implementaron middleware para comprobar la autenticación y el rol administrativo.

Las rutas de modificación de productos requieren el rol `admin`.

La consulta de perfiles requiere autenticación y se encuentra restringida al propietario o a un administrador.

Las contraseñas se almacenan como hashes y no se exponen en las respuestas de usuario.

Este proyecto tiene fines académicos y no incluye funcionalidades propias de una tienda comercial completa, como procesamiento real de pagos o recuperación de contraseñas.

## Páginas de la aplicación

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio y productos destacados |
| `/productos` | Catálogo de productos |
| `/productos/:id` | Detalle de un producto |
| `/carrito` | Carrito de compras |
| `/registro` | Registro de usuarios |
| `/login` | Inicio de sesión |
| `/perfil` | Perfil del usuario |
| `/admin/productos` | Administración del catálogo |
| `/contacto` | Contacto |

Se utilizan componentes reutilizables de navegación y diseño, junto con React Router DOM.

## Administración de productos

El panel administrativo permite realizar operaciones CRUD sobre el catálogo.

Sus principales funciones incluyen:

- Visualización de productos existentes.
- Creación de productos mediante formulario.
- Edición de información y existencias.
- Eliminación de productos con confirmación.
- Actualización de la información desde la API REST.
- Manejo de estados de carga y errores.

Las operaciones administrativas requieren autenticación y autorización desde el backend.

## Pruebas realizadas

Durante el desarrollo se comprobó:

- Conexión a MongoDB Atlas.
- Funcionamiento del endpoint de salud.
- Registro de usuarios.
- Validación de credenciales.
- Generación de tokens JWT.
- Restricción de operaciones administrativas sin token.
- Consulta pública de productos.
- Consulta de perfiles con autenticación.
- Creación, actualización y eliminación de productos.
- Navegación entre páginas.
- Integración del frontend con la API.
- Compilación mediante Vite.

También se ejecutaron los comandos:

```bash
npm run lint
npm run build
```

El último resultado documentado durante el desarrollo fue una compilación correcta y un análisis de código sin errores, aunque con advertencias no bloqueantes.

## Despliegue en producción

### Frontend — Netlify

Sitio:

https://edis-store-tarea4.netlify.app/

Configuración:

```text
Branch: Tarea4
Build command: npm run build
Publish directory: dist
```

Variable de entorno:

```env
VITE_API_URL=https://tarea1-desarrolloweb.onrender.com/api
```

Se utiliza `public/_redirects` para permitir el acceso directo a las rutas de React Router.

### Backend — Render

Servicio:

https://tarea1-desarrolloweb.onrender.com/

Configuración:

```text
Branch: Tarea4
Root directory: server
Build command: npm ci
Start command: npm start
```

Variables de entorno principales:

```env
MONGODB_URI=CADENA_PRIVADA_DE_MONGODB
JWT_SECRET=CLAVE_PRIVADA_JWT
CLIENT_URL=https://edis-store-tarea4.netlify.app
NODE_ENV=production
```

Estas variables se configuran desde Render y no se incluyen con sus valores reales en GitHub.

El backend utiliza el puerto proporcionado mediante `process.env.PORT`.

### Base de datos — MongoDB Atlas

La base de datos permanece alojada en MongoDB Atlas y es consumida por el servidor Express mediante Mongoose.

## Evolución del proyecto

### Tarea 1 — HTML

Construcción inicial de páginas HTML sin CSS ni JavaScript.

Los archivos originales se conservan en `legacy-tarea1/` y en la rama `Tarea1`.

### Tarea 2 — React

Migración del proyecto a React, implementación de componentes reutilizables, navegación, catálogo, detalle de productos y carrito de compras.

### Tarea 3 — Estado global

Implementación de Context API y `useReducer` para gestionar autenticación, login, logout y perfil mediante una simulación del estado de sesión.

### Tarea 4 — Full Stack

Implementación de Node.js, Express, MongoDB Atlas y Mongoose.

Sustitución de los productos estáticos por consultas a la base de datos, incorporación de autenticación real mediante JWT y protección de rutas administrativas.

Despliegue independiente del frontend en Netlify y del backend en Render.

## Conclusión

La Tarea 4 permitió evolucionar Edi's Store hacia una aplicación web full stack, integrando React, Express y MongoDB Atlas.

El sistema cuenta con persistencia de información, autenticación, autorización y administración de productos mediante una API REST.

Además, la publicación independiente del frontend y backend demuestra una arquitectura cliente-servidor que permite acceder a la aplicación desde Internet sin ejecutar los servicios localmente.