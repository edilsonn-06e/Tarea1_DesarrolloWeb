import { Carousel, Col, Container, ListGroup, Row } from 'react-bootstrap'
import ProductCard from '../components/ProductCard.jsx'
import { products } from '../data/products.js'

const beneficios = [
  'Envíos a todo el país.',
  'Garantía en todos los productos.',
  'Atención al cliente personalizada.',
  'Pagos seguros.',
]

const destacados = products.slice(0, 3)

function Home() {
  return (
    <>
      <Carousel className="hero-carousel">
        {destacados.map((product) => (
          <Carousel.Item key={product.id}>
            {product.image ? (
              <img className="d-block w-100" src={product.image} alt={product.name} />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-dark text-light" style={{ height: 380 }}>
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

      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1>Tienda en Línea (Prototipo)</h1>
            <p className="lead">
              Bienvenido(a) a Edi&apos;s Store. Somos una tienda en línea dedicada a ofrecer
              productos de tecnología, hogar y accesorios al mejor precio.
            </p>
          </Col>
        </Row>

        <h2 className="mb-4">Productos Destacados</h2>
        <Row className="g-4 mb-5">
          {destacados.map((product) => (
            <Col key={product.id} md={4}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        <Row>
          <Col lg={8} className="mx-auto">
            <h2 className="mb-3">¿Por qué comprar con nosotros?</h2>
            <ListGroup numbered>
              {beneficios.map((beneficio) => (
                <ListGroup.Item key={beneficio}>{beneficio}</ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
