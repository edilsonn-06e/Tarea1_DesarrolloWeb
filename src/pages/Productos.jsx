
import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/client.js'
import { categories, formatCurrency } from '../data/products.js'

const initialFilters = {
  buscar: '',
  categoria: '',
  orden: ''
}

function Productos() {
  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)

  // Estados para los productos de MongoDB
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Consultar los productos desde la API
  useEffect(() => {
    let cancelado = false

    setLoading(true)
    setError('')

    getProducts(appliedFilters)
      .then((data) => {
        if (!cancelado) {
          setProductos(data)
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
  }, [appliedFilters])

  const handleChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setAppliedFilters({ ...filters })
  }

  const handleReset = () => {
    setFilters({ ...initialFilters })
    setAppliedFilters({ ...initialFilters })
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Catálogo de Productos</h1>

      <Form
        onSubmit={handleSubmit}
        className="bg-white border rounded p-3 mb-4"
      >
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <Form.Label htmlFor="buscar">
              Buscar producto
            </Form.Label>
            <Form.Control
              id="buscar"
              type="text"
              placeholder="Ej. laptop, silla, audífonos"
              value={filters.buscar}
              onChange={handleChange('buscar')}
            />
          </Col>

          <Col md={3}>
            <Form.Label htmlFor="categoria">
              Categoría
            </Form.Label>
            <Form.Select
              id="categoria"
              value={filters.categoria}
              onChange={handleChange('categoria')}
            >
              <option value="">-- Todas --</option>
              {categories.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label htmlFor="orden">
              Ordenar por precio
            </Form.Label>
            <Form.Select
              id="orden"
              value={filters.orden}
              onChange={handleChange('orden')}
            >
              <option value="">Sin orden</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
            </Form.Select>
          </Col>

          <Col md={2} className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              Buscar
            </Button>

            <Button
              type="button"
              variant="outline-secondary"
              className="w-100"
              onClick={handleReset}
            >
              Limpiar
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Indicador de carga */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando productos...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {/* Tabla de productos */}
      {!loading && !error && (
        <div className="table-responsive">
          <Table
            striped
            bordered
            hover
            className="align-middle bg-white"
          >
            <caption>
              Productos disponibles en tienda
            </caption>

            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Existencias</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((product) => (
                <tr key={product.id}>
                  <td>{product.codigo}</td>

                  <td>{product.name}</td>

                  <td>
                    <Badge bg="info">
                      {categories.find(
                        (c) => c.value === product.category
                      )?.label}
                    </Badge>
                  </td>

                  <td>
                    {formatCurrency(product.price)}
                  </td>

                  <td>{product.stock}</td>

                  <td>
                    <Button
                      as={Link}
                      to={`/productos/${product.id}`}
                      size="sm"
                      variant="outline-primary"
                    >
                      Ver detalle
                    </Button>
                  </td>
                </tr>
              ))}

              {productos.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-muted"
                  >
                    No se encontraron productos con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  )
}

export default Productos
