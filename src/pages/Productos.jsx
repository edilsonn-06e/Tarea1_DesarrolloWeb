import { useMemo, useState } from 'react'
import { Badge, Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { categories, formatCurrency, products } from '../data/products.js'

const initialFilters = { buscar: '', categoria: '', orden: '' }

function Productos() {
  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)

  const handleChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setAppliedFilters(filters)
  }

  const handleReset = () => {
    setFilters(initialFilters)
    setAppliedFilters(initialFilters)
  }

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(appliedFilters.buscar.trim().toLowerCase())
      const matchesCategory = !appliedFilters.categoria || product.category === appliedFilters.categoria
      return matchesSearch && matchesCategory
    })

    if (appliedFilters.orden === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (appliedFilters.orden === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [appliedFilters])

  return (
    <Container className="py-5">
      <h1 className="mb-4">Catálogo de Productos</h1>

      <Form onSubmit={handleSubmit} className="bg-white border rounded p-3 mb-4">
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <Form.Label htmlFor="buscar">Buscar producto</Form.Label>
            <Form.Control
              id="buscar"
              type="text"
              placeholder="Ej. laptop, silla, audífonos"
              value={filters.buscar}
              onChange={handleChange('buscar')}
            />
          </Col>
          <Col md={3}>
            <Form.Label htmlFor="categoria">Categoría</Form.Label>
            <Form.Select id="categoria" value={filters.categoria} onChange={handleChange('categoria')}>
              <option value="">-- Todas --</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label htmlFor="orden">Ordenar por precio</Form.Label>
            <Form.Select id="orden" value={filters.orden} onChange={handleChange('orden')}>
              <option value="">Sin orden</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
            </Form.Select>
          </Col>
          <Col md={2} className="d-flex gap-2">
            <Button type="submit" variant="primary" className="w-100">
              Buscar
            </Button>
            <Button type="button" variant="outline-secondary" className="w-100" onClick={handleReset}>
              Limpiar
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="table-responsive">
        <Table striped bordered hover className="align-middle bg-white">
          <caption>Productos disponibles en tienda</caption>
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
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>
                  <Badge bg="info">
                    {categories.find((c) => c.value === product.category)?.label}
                  </Badge>
                </td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <Button as={Link} to={`/productos/${product.id}`} size="sm" variant="outline-primary">
                    Ver detalle
                  </Button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No se encontraron productos con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  )
}

export default Productos
