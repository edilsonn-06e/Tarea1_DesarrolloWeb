
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearSession,
  getTokenExpiration,
  setUnauthorizedHandler,
} from '../api/client.js'
import {
  SESSION_EXPIRED_MESSAGE,
  useAuthDispatch,
  useAuthState,
} from '../context/AuthContext.jsx'

// Vigila la validez de la sesión:
// - Registra el manejador global de respuestas 401 del cliente HTTP.
// - Cierra la sesión automáticamente cuando el token alcanza su expiración.
// En ambos casos limpia el almacenamiento, despacha LOGOUT y redirige a /login.
function SessionWatcher() {
  const { token } = useAuthState()
  const dispatch = useAuthDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const expirar = () => {
      clearSession()
      dispatch({
        type: 'LOGOUT',
        payload: { message: SESSION_EXPIRED_MESSAGE },
      })
      navigate('/login', { replace: true })
    }

    // Interceptor: la API respondió 401 a una petición autenticada
    setUnauthorizedHandler(expirar)

    // Temporizador: cerrar sesión justo cuando vence el token
    let timer
    const exp = token && getTokenExpiration(token)

    if (exp) {
      timer = setTimeout(expirar, Math.max(exp - Date.now(), 0))
    }

    return () => {
      setUnauthorizedHandler(null)
      clearTimeout(timer)
    }
  }, [token, dispatch, navigate])

  return null
}

export default SessionWatcher
