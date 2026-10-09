
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Función general para realizar peticiones HTTP
async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    })
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. ¿Está encendida la API?'
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(
      data.message || `Error ${response.status}`
    )

    error.status = response.status
    throw error
  }

  return data
}

// -----------------------------
// AUTENTICACIÓN
// -----------------------------

// Iniciar sesión
export const loginRequest = (correo, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ correo, password })
  })

// Registrar usuario
export const registerRequest = (datos) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(datos)
  })

// Consultar información de un usuario
export const getUser = (id) =>
  request(`/users/${id}`)

// -----------------------------
// PRODUCTOS
// -----------------------------

// Obtener productos con filtros opcionales
export const getProducts = (filtros = {}) => {
  const params = new URLSearchParams(
    Object.entries(filtros).filter(
      ([, valor]) => valor !== '' && valor != null
    )
  )

  const query = params.toString()

  return request(`/recursos${query ? `?${query}` : ''}`)
}

// Obtener un producto por ID
export const getProduct = (id) =>
  request(`/recursos/${id}`)

// Crear producto
export const createProduct = (producto) =>
  request('/recursos', {
    method: 'POST',
    body: JSON.stringify(producto)
  })

// Actualizar producto
export const updateProduct = (id, cambios) =>
  request(`/recursos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cambios)
  })

// Eliminar producto
export const deleteProduct = (id) =>
  request(`/recursos/${id}`, {
    method: 'DELETE'
  })
