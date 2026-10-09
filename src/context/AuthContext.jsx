
import { createContext, useContext, useReducer } from 'react'
import { loginRequest } from '../api/client.js'

const initialState = {
  isAuthenticated: false,
  user: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        status: 'succeeded',
        error: null,
      }

    case 'LOGIN_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        status: 'failed',
        error: action.payload,
      }

    case 'LOGOUT':
      return { ...initialState }

    default:
      return state
  }
}

const AuthStateContext = createContext(null)
const AuthDispatchContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

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

  // Inicio de sesión real utilizando MongoDB
  const login = async (correo, password) => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const data = await loginRequest(correo, password)

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data.user,
      })

      return data.user

    } catch (error) {
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
    dispatch({ type: 'LOGOUT' })
  }

  return { ...state, login, loginError, logout }
}
