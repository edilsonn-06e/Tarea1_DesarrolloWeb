import { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return
    }
    setValidated(true)

    // Autenticación simulada: cualquier correo/contraseña válidos inician sesión.
    const nombre = correo
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (letra) => letra.toUpperCase())
    const rol = correo.toLowerCase().includes('admin') ? 'Administrador' : 'Cliente'

    setError('')
    login({ nombre, correo, rol })
    navigate('/perfil')
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={6} lg={5} className="mx-auto">
          <h1 className="mb-4 text-center">Iniciar Sesión</h1>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="bg-white border rounded p-4"
          >
            <Form.Group className="mb-3" controlId="correo_login">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                required
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Ingresa un correo electrónico válido.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password_login">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                La contraseña debe tener al menos 6 caracteres.
              </Form.Control.Feedback>
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
