import { Badge, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { categories, formatCurrency } from '../data/products.js'

function ProductCard({ product }) {
  const categoryLabel = categories.find((c) => c.value === product.category)?.label ?? product.category

  return (
    <Card className="product-card h-100 shadow-sm">
      {product.image ? (
        <Card.Img variant="top" src={product.image} alt={product.name} />
      ) : (
        <div className="d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary" style={{ height: 200 }}>
          Sin imagen disponible
        </div>
      )}
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{product.name}</Card.Title>
          <Badge bg="info">{categoryLabel}</Badge>
        </div>
        <Card.Text className="text-muted small">{product.shortDescription}</Card.Text>
        <div className="mt-auto">
          <p className="fw-bold fs-5 mb-2">{formatCurrency(product.price)}</p>
          <Button as={Link} to={`/productos/${product.id}`} variant="primary" className="w-100">
            Ver detalle
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProductCard
