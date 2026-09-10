import { Navigate, useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.jsx'

const pedidosSimulados = [
  { id: 'PED-1042', fecha: '2026-08-14', total: 'Q1,250.00', estado: 'Entregado' },
  { id: 'PED-1078', fecha: '2026-08-29', total: 'Q680.50', estado: 'En camino' },
  { id: 'PED-1103', fecha: '2026-09-05', total: 'Q320.00', estado: 'Procesando' },
]

const estadoVariant = {
  Entregado: 'success',
  'En camino': 'info',
  Procesando: 'warning',
}

function Perfil() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const fechaIngreso = new Date(user.fechaAcceso).toLocaleString('es-GT', {
    dateStyle: 'long',
    timeStyle: 'short',
  })

  return (
    <Container className="py-5">
      <h1 className="mb-4">Mi Perfil</h1>
      <Row className="g-4">
        <Col md={5}>
          <Card>
            <Card.Body>
              <Card.Title>{user.nombre}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">{user.correo}</Card.Subtitle>
              <Badge bg={user.rol === 'Administrador' ? 'danger' : 'success'} className="mb-3">
                {user.rol}
              </Badge>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Correo:</strong> {user.correo}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Tipo de membresía:</strong> {user.rol}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Fecha de ingreso:</strong> {fechaIngreso}
                </ListGroup.Item>
              </ListGroup>
              <Button variant="outline-danger" className="mt-3 w-100" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card>
            <Card.Header>Historial de pedidos (simulado)</Card.Header>
            <ListGroup variant="flush">
              {pedidosSimulados.map((pedido) => (
                <ListGroup.Item
                  key={pedido.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{pedido.id}</strong>
                    <div className="text-muted small">{pedido.fecha}</div>
                  </div>
                  <div className="text-end">
                    <div>{pedido.total}</div>
                    <Badge bg={estadoVariant[pedido.estado]}>{pedido.estado}</Badge>
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
