import { Badge, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/productos', label: 'Catálogo de Productos' },
  { to: '/registro', label: 'Registro de Usuario' },
  { to: '/contacto', label: 'Contacto' },
]

function NavBar() {
  const { totalItems } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Edi&apos;s Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center">
            {links.map((link) => (
              <Nav.Link key={link.to} as={NavLink} to={link.to} end={link.end}>
                {link.label}
              </Nav.Link>
            ))}
            <Nav.Link as={NavLink} to="/carrito" className="d-flex align-items-center gap-1">
              🛒 Carrito <Badge bg="secondary">{totalItems}</Badge>
            </Nav.Link>
            {isAuthenticated ? (
              <NavDropdown title={`👤 ${user.nombre}`} id="perfil-dropdown" align="end">
                <NavDropdown.Item as={NavLink} to="/perfil">
                  Mi Perfil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={NavLink} to="/login">
                Iniciar Sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
