
import { useEffect, useState } from 'react'
import {
  Alert,
  Carousel,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner
} from 'react-bootstrap'
import ProductCard from '../components/ProductCard.jsx'
import { getProducts } from '../api/client.js'

const beneficios = [
  'Envíos a todo el país.',
  'Garantía en todos los productos.',
  'Atención al cliente personalizada.',
  'Pagos seguros.',
]

function Home() {
  const [destacados, setDestacados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Obtener productos desde MongoDB Atlas
  useEffect(() => {
    let cancelado = false

    setLoading(true)
    setError('')

    getProducts()
      .then((productos) => {
        if (!cancelado) {
          setDestacados(productos.slice(0, 3))
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
  }, [])

  return (
    <>
      {/* Carrusel de productos destacados */}
      {!loading && !error && destacados.length > 0 && (
        <Carousel className="hero-carousel">
          {destacados.map((product) => (
            <Carousel.Item key={product.id}>
              {product.image ? (
                <img
                  className="d-block w-100"
                  src={product.image}
                  alt={product.name}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-dark text-light"
                  style={{ height: 380 }}
                >
                  {product.name}
                </div>
              )}

              <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
                <h3>{product.name}</h3>
                <p>{product.shortDescription}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      <Container className="py-5">

        {/* Indicador de carga */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando productos destacados...</p>
          </div>
        )}

        {/* Errores de conexión */}
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {/* Presentación de la tienda */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1>Tienda en Línea</h1>
            <p className="lead">
              Bienvenido(a) a Edi&apos;s Store.
              Somos una tienda en línea dedicada a ofrecer
              productos de tecnología, hogar y accesorios
              al mejor precio.
            </p>
          </Col>
        </Row>

        {/* Productos destacados */}
        <h2 className="mb-4">Productos Destacados</h2>

        {!loading && !error && (
          <Row className="g-4 mb-5">
            {destacados.map((product) => (
              <Col key={product.id} md={4}>
                <ProductCard product={product} />
              </Col>
            ))}

            {destacados.length === 0 && (
              <Col>
                <Alert variant="info">
                  No hay productos destacados disponibles.
                </Alert>
              </Col>
            )}
          </Row>
        )}

        {/* Beneficios de la tienda */}
        <Row>
          <Col lg={8} className="mx-auto">
            <h2 className="mb-3">
              ¿Por qué comprar con nosotros?
            </h2>

            <ListGroup numbered>
              {beneficios.map((beneficio) => (
                <ListGroup.Item key={beneficio}>
                  {beneficio}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>

      </Container>
    </>
  )
}

export default Home
