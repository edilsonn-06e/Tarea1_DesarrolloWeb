import { Container, Nav, Navbar, Badge } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/productos', label: 'Catálogo de Productos' },
  { to: '/registro', label: 'Registro de Usuario' },
  { to: '/login', label: 'Iniciar Sesión' },
  { to: '/contacto', label: 'Contacto' },
]

function NavBar() {
  const { totalItems } = useCart()

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Edi&apos;s Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            {links.map((link) => (
              <Nav.Link key={link.to} as={NavLink} to={link.to} end={link.end}>
                {link.label}
              </Nav.Link>
            ))}
            <Nav.Link as={NavLink} to="/carrito" className="d-flex align-items-center gap-1">
              🛒 Carrito <Badge bg="secondary">{totalItems}</Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
