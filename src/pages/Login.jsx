import { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Login() {
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={6} lg={5} className="mx-auto">
          <h1 className="mb-4 text-center">Iniciar Sesión</h1>

          {enviado && <Alert variant="success">Sesión iniciada correctamente.</Alert>}

          <Form onSubmit={handleSubmit} className="bg-white border rounded p-4">
            <Form.Group className="mb-3" controlId="usuario_login">
              <Form.Label>Usuario o correo electrónico</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password_login">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" required />
            </Form.Group>
            <Form.Check className="mb-3" type="checkbox" id="recordar" label="Recordarme" />
            <Button type="submit" variant="primary" className="w-100 mb-3">
              Iniciar sesión
            </Button>
            <div className="d-flex justify-content-between small">
              <a href="#!">¿Olvidaste tu contraseña?</a>
              <Link to="/registro">Crear una cuenta</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
