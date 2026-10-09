
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner
} from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.jsx'
import { getUser } from '../api/client.js'

// Historial de pedidos simulado
const pedidosSimulados = [
  {
    id: 'PED-1042',
    fecha: '2026-08-14',
    total: 'Q1,250.00',
    estado: 'Entregado'
  },
  {
    id: 'PED-1078',
    fecha: '2026-08-29',
    total: 'Q680.50',
    estado: 'En camino'
  },
  {
    id: 'PED-1103',
    fecha: '2026-09-05',
    total: 'Q320.00',
    estado: 'Procesando'
  }
]

const estadoVariant = {
  Entregado: 'success',
  'En camino': 'info',
  Procesando: 'warning'
}

function Perfil() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  // Estados de los datos de MongoDB
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Consultar los datos del usuario
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return
    }

    let cancelado = false

    getUser(user.id)
      .then((data) => {
        if (!cancelado) {
          setPerfil(data)
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelado) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (!cancelado) {
          setLoading(false)
        }
      })

    return () => {
      cancelado = true
    }
  }, [isAuthenticated, user?.id])

  // Redirigir si no ha iniciado sesión
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Formatear fechas recibidas de MongoDB
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible'

    return new Date(fecha).toLocaleString('es-GT', {
      dateStyle: 'long',
      timeStyle: 'short'
    })
  }

  // Indicador de carga
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">
          Cargando información del perfil...
        </p>
      </Container>
    )
  }

  // Error al obtener el perfil
  if (error || !perfil) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'No se pudo cargar el perfil del usuario.'}
        </Alert>

        <Button
          variant="outline-primary"
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Mi Perfil</h1>

      <Row className="g-4">

        {/* Información del usuario */}
        <Col md={5}>
          <Card>
            <Card.Body>
              <Card.Title>
                {perfil.nombre}
              </Card.Title>

              <Card.Subtitle className="mb-3 text-muted">
                {perfil.correo}
              </Card.Subtitle>

              <Badge
                bg={perfil.rol === 'admin' ? 'danger' : 'success'}
                className="mb-3"
              >
                {perfil.rol === 'admin'
                  ? 'Administrador'
                  : 'Cliente'}
              </Badge>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Correo:</strong> {perfil.correo}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Tipo de membresía:</strong>{' '}
                  {perfil.rol === 'admin'
                    ? 'Administrador'
                    : 'Cliente'}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Teléfono:</strong>{' '}
                  {perfil.telefono || 'No registrado'}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>País:</strong>{' '}
                  {perfil.pais || 'No registrado'}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Miembro desde:</strong>{' '}
                  {formatearFecha(perfil.createdAt)}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Última actualización:</strong>{' '}
                  {formatearFecha(perfil.updatedAt)}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>ID en MongoDB:</strong>
                  <div className="small text-muted text-break">
                    {perfil.id}
                  </div>
                </ListGroup.Item>
              </ListGroup>

              <Button
                variant="outline-danger"
                className="mt-3 w-100"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Historial de pedidos simulado */}
        <Col md={7}>
          <Card>
            <Card.Header>
              Historial de pedidos (simulado)
            </Card.Header>

            <ListGroup variant="flush">
              {pedidosSimulados.map((pedido) => (
                <ListGroup.Item
                  key={pedido.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{pedido.id}</strong>
                    <div className="text-muted small">
                      {pedido.fecha}
                    </div>
                  </div>

                  <div className="text-end">
                    <div>{pedido.total}</div>

                    <Badge bg={estadoVariant[pedido.estado]}>
                      {pedido.estado}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

      </Row>
    </Container>
  )
}

export default Perfil
