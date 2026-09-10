import { createContext, useContext, useReducer } from 'react'

const initialState = {
  isAuthenticated: false,
  user: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, status: 'loading', error: null }
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
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export function useAuthState() {
  const context = useContext(AuthStateContext)
  if (!context) {
    throw new Error('useAuthState debe usarse dentro de un AuthProvider')
  }
  return context
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext)
  if (!context) {
    throw new Error('useAuthDispatch debe usarse dentro de un AuthProvider')
  }
  return context
}

export function useAuth() {
  const state = useAuthState()
  const dispatch = useAuthDispatch()

  const login = ({ nombre, correo, rol = 'Cliente' }) => {
    dispatch({ type: 'LOGIN_START' })
    const user = {
      nombre,
      correo,
      rol,
      fechaAcceso: new Date().toISOString(),
    }
    dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    return user
  }

  const loginError = (message) => {
    dispatch({ type: 'LOGIN_ERROR', payload: message })
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  return { ...state, login, loginError, logout }
}
