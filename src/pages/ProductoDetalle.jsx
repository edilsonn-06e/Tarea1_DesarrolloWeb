
import { useEffect, useState } from 'react'
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { getProduct } from '../api/client.js'
import { categories, formatCurrency } from '../data/products.js'

function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  // Estados del producto obtenido desde MongoDB
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Estados del carrito
  const [quantity, setQuantity] = useState(1)
  const [color, setColor] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Obtener el producto desde la API
  useEffect(() => {
    let cancelado = false

    getProduct(id)
      .then((data) => {
        if (!cancelado) {
          setProduct(data)
          setQuantity(1)
          setColor(data.colors?.[0] ?? '')
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
  }, [id])

  // Mostrar indicador mientras carga
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando producto...</p>
      </Container>
    )
  }

  // Mostrar mensaje si ocurrió un error
  if (error || !product) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          {error || 'Producto no encontrado'}
        </Alert>

        <Button as={Link} to="/productos" variant="primary">
          Volver al catálogo
        </Button>
      </Container>
    )
  }

  const categoryLabel = categories.find(
    (c) => c.value === product.category
  )?.label

  const handleAddToCart = (event) => {
    event.preventDefault()

    if (
      product.stock <= 0 ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > product.stock
    ) {
      return
    }

    addItem(product, quantity, color)
    setShowModal(true)
  }

  return (
    <Container className="py-5">
      <Row className="g-4">

        {/* Imagen del producto */}
        <Col md={5}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded shadow-sm"
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary rounded"
              style={{ height: 260 }}
            >
              Sin imagen disponible
            </div>
          )}
        </Col>

        {/* Información del producto */}
        <Col md={7}>
          <div className="d-flex justify-content-between align-items-start">
            <h1>{product.name}</h1>
            <Badge bg="info">{categoryLabel}</Badge>
          </div>

          <p className="text-muted">
            Código: {product.codigo}
          </p>

          <p className="fs-3 fw-bold">
            {formatCurrency(product.price)}
          </p>

          <Badge
            bg={product.stock > 0 ? 'success' : 'danger'}
            className="mb-3"
          >
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : 'Agotado'}
          </Badge>

          <p>{product.description}</p>

          {/* Formulario del carrito */}
          <Form
            onSubmit={handleAddToCart}
            className="border rounded p-3 bg-white"
          >
            <Row className="g-3 align-items-end">
              <Col xs={6} md={4}>
                <Form.Label htmlFor="cantidad">
                  Cantidad
                </Form.Label>

                <Form.Control
                  id="cantidad"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  disabled={product.stock <= 0}
                  onChange={(e) =>
                    setQuantity(Number(e.target.value))
                  }
                  required
                />
              </Col>

              <Col xs={6} md={5}>
                <Form.Label htmlFor="color">
                  Color
                </Form.Label>

                <Form.Select
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  disabled={!product.colors?.length}
                >
                  {(product.colors ?? []).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} md={3}>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={product.stock <= 0}
                >
                  Agregar al carrito
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* Especificaciones y reseñas */}
      <Row className="mt-5">
        <Col lg={8}>
          <Accordion defaultActiveKey="0">

            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Especificaciones técnicas
              </Accordion.Header>

              <Accordion.Body>
                <Table bordered className="mb-0">
                  <tbody>
                    {(product.specs ?? []).map(([label, value]) => (
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
              <Accordion.Header>
                Opiniones de clientes ({product.reviews?.length ?? 0})
              </Accordion.Header>

              <Accordion.Body>
                <ListGroup variant="flush">
                  {(product.reviews ?? []).map((review, index) => (
                    <ListGroup.Item key={index}>
                      <div className="d-flex justify-content-between">
                        <strong>{review.author}</strong>
                        <span>
                          {'⭐'.repeat(review.rating)}
                        </span>
                      </div>

                      <p className="mb-0 text-muted">
                        {review.comment}
                      </p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      {/* Confirmación de producto agregado */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Producto agregado
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Se agregaron {quantity} unidad(es) de{' '}
          <strong>{product.name}</strong>
          {color ? ` (${color})` : ''} al carrito de compras.
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
          >
            Seguir comprando
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate('/carrito')}
          >
            Ir al carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ProductoDetalle
