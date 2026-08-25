import { Col, Container, Row } from 'react-bootstrap'

const modulos = [
  'Estructura general y enrutamiento (Navbar, Footer, Layout, App)',
  'Página de Inicio (Carousel, Cards de productos destacados)',
  'Catálogo de Productos y filtros',
  'Detalle de Producto (specs, reseñas, agregar al carrito)',
  'Carrito de Compras (estado global, cupón, checkout)',
  'Registro de Usuario y Login',
  'Página de Contacto y preguntas frecuentes',
]

function Footer() {
  return (
    <footer className="bg-dark text-light mt-auto py-4">
      <Container>
        <Row className="gy-3">
          <Col md={6}>
            <h5>Edi&apos;s Store &copy; 2026 - UMG</h5>
            <p className="mb-0">
              Tienda en línea desarrollada con React y React-Bootstrap para el curso de
              Desarrollo Web - Tarea 2.
            </p>
          </Col>
          <Col md={6}>
            <h6>Integrante y módulos aportados</h6>
            <p className="mb-1">
              <strong>Edilson Enrique García Villeda</strong> — Carnet: 9490-23-2637
            </p>
            <ul className="small mb-0 ps-3">
              {modulos.map((modulo) => (
                <li key={modulo}>{modulo}</li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
