
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Claves usadas para persistir la sesión en localStorage
const TOKEN_KEY = 'edis_token'
const USER_KEY = 'edis_user'

// -----------------------------
// PERSISTENCIA DE LA SESIÓN
// -----------------------------

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// Fecha de expiración (ms) leída del payload del JWT.
// No verifica la firma: eso lo hace el servidor.
export function getTokenExpiration(token) {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    )
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const exp = getTokenExpiration(token)
  return !exp || exp <= Date.now()
}

// -----------------------------
// INTERCEPTOR DE SESIÓN EXPIRADA
// -----------------------------

// Función que se ejecuta cuando la API responde 401
// a una petición autenticada (la registra SessionWatcher)
let onUnauthorized = null

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

// Función general para realizar peticiones HTTP
async function request(path, options = {}) {
  let response

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // Adjuntar automáticamente el token cuando exista
  const token = getStoredToken()

  if (token) {
    headers.Authorization = `Bearer ${token}`
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
    // 401 a una petición que llevaba token:
    // la sesión expiró o el token ya no es válido
    if (response.status === 401 && token) {
      clearSession()
      onUnauthorized?.(data)
    }

    const error = new Error(
      data.message || `Error ${response.status}`
    )

    error.status = response.status
    error.code = data.error
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
