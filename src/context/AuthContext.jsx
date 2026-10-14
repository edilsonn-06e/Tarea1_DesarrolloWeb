
import { createContext, useContext, useReducer } from 'react'
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  isTokenExpired,
  loginRequest,
  saveSession,
} from '../api/client.js'

export const SESSION_EXPIRED_MESSAGE =
  'Su sesión ya no es válida o ha caducado. Por favor, inicie sesión nuevamente.'

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  sessionMessage: null,
}

// Restaurar la sesión guardada en localStorage (si sigue vigente)
function loadInitialState() {
  const token = getStoredToken()
  const user = getStoredUser()

  if (token && user && !isTokenExpired(token)) {
    return { ...initialState, isAuthenticated: true, user, token }
  }

  clearSession()
  return initialState
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        status: 'loading',
        error: null,
        sessionMessage: null,
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        status: 'succeeded',
        error: null,
      }

    case 'LOGIN_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        status: 'failed',
        error: action.payload,
      }

    // payload opcional: mensaje a mostrar (p. ej. sesión expirada)
    case 'LOGOUT':
      return {
        ...initialState,
        sessionMessage: action.payload?.message ?? null,
      }

    case 'CLEAR_SESSION_MESSAGE':
      return { ...state, sessionMessage: null }

    default:
      return state
  }
}

const AuthStateContext = createContext(null)
const AuthDispatchContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, undefined, loadInitialState)

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export function useAuthState() {
  const context = useContext(AuthStateContext)

  if (!context) {
    throw new Error(
      'useAuthState debe usarse dentro de un AuthProvider'
    )
  }

  return context
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext)

  if (!context) {
    throw new Error(
      'useAuthDispatch debe usarse dentro de un AuthProvider'
    )
  }

  return context
}

export function useAuth() {
  const state = useAuthState()
  const dispatch = useAuthDispatch()

  // Inicio de sesión real utilizando MongoDB y JWT
  const login = async (correo, password) => {
    dispatch({ type: 'LOGIN_START' })

    // Limpiar cualquier sesión anterior
    clearSession()

    try {
      const data = await loginRequest(correo, password)

      if (!data.token) {
        throw new Error('El servidor no devolvió un token de autenticación')
      }

      // Persistir el token JWT y el usuario en localStorage
      saveSession(data.token, data.user)

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user, token: data.token },
      })

      return data.user

    } catch (error) {
      clearSession()

      const message =
        error.status === 401
          ? 'Correo o contraseña incorrectos.'
          : error.message

      dispatch({
        type: 'LOGIN_ERROR',
        payload: message,
      })

      throw error
    }
  }

  const loginError = (message) => {
    dispatch({
      type: 'LOGIN_ERROR',
      payload: message,
    })
  }

  const logout = () => {
    // Eliminar el JWT al cerrar sesión
    clearSession()

    dispatch({ type: 'LOGOUT' })
  }

  const clearSessionMessage = () => {
    dispatch({ type: 'CLEAR_SESSION_MESSAGE' })
  }

  return {
    ...state,
    login,
    loginError,
    logout,
    clearSessionMessage,
  }
}
