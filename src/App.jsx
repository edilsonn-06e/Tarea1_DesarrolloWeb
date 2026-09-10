import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'
import Carrito from './pages/Carrito.jsx'
import Registro from './pages/Registro.jsx'
import Login from './pages/Login.jsx'
import Perfil from './pages/Perfil.jsx'
import Contacto from './pages/Contacto.jsx'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="productos" element={<Productos />} />
              <Route path="productos/:id" element={<ProductoDetalle />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="registro" element={<Registro />} />
              <Route path="login" element={<Login />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="contacto" element={<Contacto />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
