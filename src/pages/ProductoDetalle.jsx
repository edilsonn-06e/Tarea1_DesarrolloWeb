import { useState } from 'react'
import {
  Accordion,
  Badge,
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
  Table,
} from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { categories, findProductById, formatCurrency } from '../data/products.js'

function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const product = findProductById(id)

  const [quantity, setQuantity] = useState(1)
  const [color, setColor] = useState(product?.colors?.[0] ?? '')
  const [showModal, setShowModal] = useState(false)

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscas no existe o fue removido del catálogo.</p>
        <Button as={Link} to="/productos" variant="primary">
          Volver al catálogo
        </Button>
      </Container>
    )
  }

  const categoryLabel = categories.find((c) => c.value === product.category)?.label

  const handleAddToCart = (event) => {
    event.preventDefault()
    addItem(product, quantity, color)
    setShowModal(true)
  }

  return (
    <Container className="py-5">
      <Row className="g-4">
        <Col md={5}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="img-fluid rounded shadow-sm" />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary rounded"
              style={{ height: 260 }}
            >
              Sin imagen disponible
            </div>
          )}
        </Col>

        <Col md={7}>
          <div className="d-flex justify-content-between align-items-start">
            <h1>{product.name}</h1>
            <Badge bg="info">{categoryLabel}</Badge>
          </div>
          <p className="text-muted">Código: {product.id}</p>
          <p className="fs-3 fw-bold">{formatCurrency(product.price)}</p>
          <Badge bg={product.stock > 0 ? 'success' : 'danger'} className="mb-3">
            {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado'}
          </Badge>
          <p>{product.description}</p>

          <Form onSubmit={handleAddToCart} className="border rounded p-3 bg-white">
            <Row className="g-3 align-items-end">
              <Col xs={6} md={4}>
                <Form.Label htmlFor="cantidad">Cantidad</Form.Label>
                <Form.Control
                  id="cantidad"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                />
              </Col>
              <Col xs={6} md={5}>
                <Form.Label htmlFor="color">Color</Form.Label>
                <Form.Select id="color" value={color} onChange={(e) => setColor(e.target.value)}>
                  {product.colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={12} md={3}>
                <Button type="submit" variant="primary" className="w-100">
                  Agregar al carrito
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={8}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Especificaciones técnicas</Accordion.Header>
              <Accordion.Body>
                <Table bordered className="mb-0">
                  <tbody>
                    {product.specs.map(([label, value]) => (
                      <tr key={label}>
                        <th className="w-50">{label}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Opiniones de clientes ({product.reviews.length})</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review.author}>
                      <div className="d-flex justify-content-between">
                        <strong>{review.author}</strong>
                        <span>{'⭐'.repeat(review.rating)}</span>
                      </div>
                      <p className="mb-0 text-muted">{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Producto agregado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Se agregaron {quantity} unidad(es) de <strong>{product.name}</strong> ({color}) al
          carrito de compras.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Seguir comprando
          </Button>
          <Button variant="primary" onClick={() => navigate('/carrito')}>
            Ir al carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ProductoDetalle
