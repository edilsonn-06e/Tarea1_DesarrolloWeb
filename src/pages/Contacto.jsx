import { useState } from 'react'
import { Accordion, Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'

const faqs = [
  { pregunta: '¿Cuánto tarda el envío?', respuesta: 'Entre 3 y 5 días hábiles dentro del territorio nacional.' },
  { pregunta: '¿Puedo cambiar un producto?', respuesta: 'Sí, cuentas con 15 días calendario para solicitar un cambio.' },
  { pregunta: '¿Qué métodos de pago aceptan?', respuesta: 'Tarjeta de crédito, débito y pago contra entrega.' },
]

function Contacto() {
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Contáctanos</h1>

      <Row className="g-4 mb-5">
        <Col md={5}>
          <h2 className="h5">Información de contacto</h2>
          <address className="bg-white border rounded p-3">
            Tienda en Línea (Prototipo)
            <br />
            12 Avenida 5-55, Zona 10, Ciudad de Guatemala
            <br />
            Teléfono: (502) 2222-3333
            <br />
            Correo: contacto@tiendaenlinea.com.gt
          </address>
        </Col>

        <Col md={7}>
          <h2 className="h5">Envíanos un mensaje</h2>
          {enviado && (
            <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
              ¡Mensaje enviado! Te responderemos a la brevedad.
            </Alert>
          )}
          <Form onSubmit={handleSubmit} className="bg-white border rounded p-3">
            <Form.Group className="mb-3" controlId="nombre_contacto">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="correo_contacto">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="asunto">
              <Form.Label>Asunto</Form.Label>
              <Form.Select defaultValue="consulta">
                <option value="consulta">Consulta general</option>
                <option value="soporte">Soporte técnico</option>
                <option value="devolucion">Devoluciones y garantías</option>
                <option value="sugerencia">Sugerencia</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="mensaje">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control as="textarea" rows={4} required />
            </Form.Group>
            <Button type="submit" variant="primary">
              Enviar mensaje
            </Button>
          </Form>
        </Col>
      </Row>

      <h2 className="h5 mb-3">Preguntas frecuentes</h2>
      <Accordion>
        {faqs.map((faq, index) => (
          <Accordion.Item eventKey={String(index)} key={faq.pregunta}>
            <Accordion.Header>{faq.pregunta}</Accordion.Header>
            <Accordion.Body>{faq.respuesta}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  )
}

export default Contacto
