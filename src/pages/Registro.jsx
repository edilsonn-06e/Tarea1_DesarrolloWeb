import { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'

const paises = ['Guatemala', 'México', 'El Salvador', 'Honduras', 'Costa Rica']

function Registro() {
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Registro de Usuario</h1>

      {enviado && (
        <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
          ¡Registro completado! Ya puedes iniciar sesión.
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="bg-white border rounded p-4">
        <h2 className="h5">Datos personales</h2>
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Label htmlFor="nombres">Nombres</Form.Label>
            <Form.Control id="nombres" type="text" required />
          </Col>
          <Col md={6}>
            <Form.Label htmlFor="apellidos">Apellidos</Form.Label>
            <Form.Control id="apellidos" type="text" required />
          </Col>
          <Col md={6}>
            <Form.Label htmlFor="nacimiento">Fecha de nacimiento</Form.Label>
            <Form.Control id="nacimiento" type="date" required />
          </Col>
          <Col md={6}>
            <Form.Label htmlFor="genero">Género</Form.Label>
            <Form.Select id="genero" defaultValue="">
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="otro">Otro</option>
              <option value="prefiero_no_decir">Prefiero no decirlo</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label htmlFor="dpi">Número de DPI</Form.Label>
            <Form.Control id="dpi" type="text" pattern="\d{13}" placeholder="13 dígitos" />
          </Col>
        </Row>

        <h2 className="h5">Datos de contacto</h2>
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Label htmlFor="correo">Correo electrónico</Form.Label>
            <Form.Control id="correo" type="email" required />
          </Col>
          <Col md={6}>
            <Form.Label htmlFor="telefono">Teléfono</Form.Label>
            <Form.Control id="telefono" type="tel" required />
          </Col>
          <Col md={8}>
            <Form.Label htmlFor="direccion_registro">Dirección</Form.Label>
            <Form.Control id="direccion_registro" type="text" />
          </Col>
          <Col md={4}>
            <Form.Label htmlFor="pais">País</Form.Label>
            <Form.Select id="pais" defaultValue="Guatemala">
              {paises.map((pais) => (
                <option key={pais} value={pais}>
                  {pais}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <h2 className="h5">Credenciales</h2>
        <Row className="g-3 mb-4">
          <Col md={4}>
            <Form.Label htmlFor="usuario">Usuario</Form.Label>
            <Form.Control id="usuario" type="text" required />
          </Col>
          <Col md={4}>
            <Form.Label htmlFor="password">Contraseña</Form.Label>
            <Form.Control id="password" type="password" required />
          </Col>
          <Col md={4}>
            <Form.Label htmlFor="confirmar_password">Confirmar contraseña</Form.Label>
            <Form.Control id="confirmar_password" type="password" required />
          </Col>
        </Row>

        <h2 className="h5">Preferencias</h2>
        <Form.Check className="mb-2" type="checkbox" id="newsletter" label="Deseo recibir promociones por correo" />
        <Form.Check className="mb-4" type="checkbox" id="terminos" label="Acepto los términos y condiciones" required />

        <Button type="submit" variant="primary">
          Crear cuenta
        </Button>
      </Form>
    </Container>
  )
}

export default Registro
