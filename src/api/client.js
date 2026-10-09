
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Token del usuario autenticado.
// Se conserva únicamente en memoria.
let authToken = null

export function setAuthToken(token) {
  authToken = token || null
}

// Función general para realizar peticiones HTTP
async function request(path, options = {}) {
  let response

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // Enviar el token cuando esté disponible
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
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

export const loginRequest = (correo, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ correo, password })
  })

export const registerRequest = (datos) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(datos)
  })

// Requiere un token válido
export const getUser = (id) =>
  request(`/users/${id}`)

// -----------------------------
// PRODUCTOS
// -----------------------------

// Consultas públicas
export const getProducts = (filtros = {}) => {
  const params = new URLSearchParams(
    Object.entries(filtros).filter(
      ([, valor]) => valor !== '' && valor != null
    )
  )

  const query = params.toString()

  return request(`/recursos${query ? `?${query}` : ''}`)
}

export const getProduct = (id) =>
  request(`/recursos/${id}`)

// Operaciones que requieren administrador
export const createProduct = (producto) =>
  request('/recursos', {
    method: 'POST',
    body: JSON.stringify(producto)
  })

export const updateProduct = (id, cambios) =>
  request(`/recursos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cambios)
  })

export const deleteProduct = (id) =>
  request(`/recursos/${id}`, {
    method: 'DELETE'
  })
