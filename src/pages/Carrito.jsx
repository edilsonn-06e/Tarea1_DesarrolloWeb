import { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatCurrency } from '../data/products.js'

function Carrito() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [cupon, setCupon] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState(null)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false)

  const handleCupon = (event) => {
    event.preventDefault()
    setCuponAplicado(cupon.trim() ? cupon.trim().toUpperCase() : null)
  }

  const handleCheckout = (event) => {
    event.preventDefault()
    setPedidoConfirmado(true)
    clearCart()
  }

  if (items.length === 0 && !pedidoConfirmado) {
    return (
      <Container className="py-5 text-center">
        <h1>Carrito de Compras</h1>
        <p className="text-muted">Tu carrito está vacío.</p>
        <Button as={Link} to="/productos" variant="primary">
          Ver catálogo de productos
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Carrito de Compras</h1>

      {pedidoConfirmado && (
        <Alert variant="success" onClose={() => setPedidoConfirmado(false)} dismissible>
          ¡Pedido confirmado! Te contactaremos para coordinar el envío.
        </Alert>
      )}

      {items.length > 0 && (
        <>
          <div className="table-responsive mb-4">
            <Table bordered hover className="align-middle bg-white">
              <caption>Detalle del carrito de compras</caption>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={`${item.id}-${item.color}`}>
                    <td>
                      {item.name}
                      {item.color && <div className="text-muted small">Color: {item.color}</div>}
                    </td>
                    <td>{formatCurrency(item.price)}</td>
                    <td style={{ maxWidth: 100 }}>
                      <Form.Control
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, item.color, Number(e.target.value) || 1)
                        }
                      />
                    </td>
                    <td>{formatCurrency(item.price * item.quantity)}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeItem(item.id, item.color)}
                      >
                        Quitar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">
                    Total
                  </td>
                  <td colSpan={2} className="fw-bold">
                    {formatCurrency(totalPrice)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>

          <Row className="g-4">
            <Col md={5}>
              <h2 className="h5">Código de descuento</h2>
              <Form onSubmit={handleCupon} className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Ej. DESCUENTO10"
                  value={cupon}
                  onChange={(e) => setCupon(e.target.value)}
                />
                <Button type="submit" variant="outline-secondary">
                  Aplicar
                </Button>
              </Form>
              {cuponAplicado && (
                <Alert variant="info" className="mt-3 mb-0">
                  Cupón <strong>{cuponAplicado}</strong> aplicado.
                </Alert>
              )}
            </Col>

            <Col md={7}>
              <h2 className="h5">Finalizar compra</h2>
              <Form onSubmit={handleCheckout} className="bg-white border rounded p-3">
                <Form.Group className="mb-3" controlId="nombre_envio">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="direccion">
                  <Form.Label>Dirección de entrega</Form.Label>
                  <Form.Control as="textarea" rows={2} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Método de pago</Form.Label>
                  <Form.Check type="radio" name="metodo_pago" id="tarjeta" label="Tarjeta de crédito/débito" defaultChecked />
                  <Form.Check type="radio" name="metodo_pago" id="contra_entrega" label="Pago contra entrega" />
                </Form.Group>
                <Button type="submit" variant="primary">
                  Confirmar pedido
                </Button>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default Carrito
