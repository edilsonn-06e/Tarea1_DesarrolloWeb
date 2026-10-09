
import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Container,
  Form,
  Modal,
  Spinner,
  Table
} from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../api/client.js'
import { categories, formatCurrency } from '../data/products.js'

const vacio = {
  codigo: '',
  name: '',
  category: 'tecnologia',
  price: '',
  stock: '',
  image: ''
}

function AdminProductos() {
  const { user } = useAuth()

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Estados del formulario
  const [show, setShow] = useState(false)
  const [form, setForm] = useState(vacio)
  const [editId, setEditId] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)

  // Consultar productos desde MongoDB
  const cargar = async () => {
    setLoading(true)

    try {
      const data = await getProducts()
      setProductos(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.rol === 'admin') {
      cargar()
    }
  }, [user?.rol])

  // Acceso exclusivo para administradores
  if (!user || user.rol !== 'admin') {
    return <Navigate to="/login" replace />
  }

  // Abrir formulario para crear
  const abrirNuevo = () => {
    setForm({ ...vacio })
    setEditId(null)
    setError('')
    setShow(true)
  }

  // Abrir formulario para editar
  const abrirEditar = (producto) => {
    setForm({ ...vacio, ...producto })
    setEditId(producto.id)
    setError('')
    setShow(true)
  }

  // Actualizar campos del formulario
  const cambiar = (campo) => (event) => {
    setForm((prev) => ({
      ...prev,
      [campo]: event.target.value
    }))
  }

  // Crear o actualizar producto
  const guardar = async (event) => {
    event.preventDefault()
    setGuardando(true)
    setError('')
    setMensaje('')

    const datos = {
      codigo: form.codigo,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image
    }

    try {
      if (editId) {
        await updateProduct(editId, datos)
        setMensaje('Producto actualizado correctamente.')
      } else {
        await createProduct(datos)
        setMensaje('Producto creado correctamente.')
      }

      setShow(false)
      await cargar()

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  // Eliminar producto
  const eliminar = async (producto) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar "${producto.name}"?`
    )

    if (!confirmar) return

    setEliminandoId(producto.id)
    setError('')
    setMensaje('')

    try {
      await deleteProduct(producto.id)

      setMensaje('Producto eliminado correctamente.')

      setProductos((prev) =>
        prev.filter((p) => p.id !== producto.id)
      )

    } catch (err) {
      setError(err.message)

    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <Container className="py-5">

      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Administrar Productos</h1>

        <Button variant="primary" onClick={abrirNuevo}>
          + Nuevo producto
        </Button>
      </div>

      {/* Mensajes */}
      {mensaje && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setMensaje('')}
        >
          {mensaje}
        </Alert>
      )}

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Indicador de carga */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando productos...</p>
        </div>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="bg-white align-middle"
        >
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.codigo}</td>
                <td>{producto.name}</td>

                <td>
                  <Badge bg="info">
                    {categories.find(
                      (c) => c.value === producto.category
                    )?.label}
                  </Badge>
                </td>

                <td>{formatCurrency(producto.price)}</td>

                <td>
                  <Badge
                    bg={producto.stock > 0 ? 'success' : 'secondary'}
                  >
                    {producto.stock}
                  </Badge>
                </td>

                <td>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => abrirEditar(producto)}
                    >
                      Editar
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={eliminandoId === producto.id}
                      onClick={() => eliminar(producto)}
                    >
                      {eliminandoId === producto.id
                        ? 'Eliminando...'
                        : 'Eliminar'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {productos.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-muted"
                >
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Formulario para crear y editar */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Form onSubmit={guardar}>

          <Modal.Header closeButton>
            <Modal.Title>
              {editId ? 'Editar producto' : 'Nuevo producto'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <Form.Group className="mb-3">
              <Form.Label>Código</Form.Label>
              <Form.Control
                required
                value={form.codigo}
                onChange={cambiar('codigo')}
                placeholder="Ej. P-006"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                required
                value={form.name}
                onChange={cambiar('name')}
                placeholder="Nombre del producto"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={form.category}
                onChange={cambiar('category')}
              >
                {categories.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio (Q)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={cambiar('price')}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Existencias</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="1"
                required
                value={form.stock}
                onChange={cambiar('stock')}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen (ruta)</Form.Label>
              <Form.Control
                value={form.image}
                onChange={cambiar('image')}
                placeholder="/img/laptop.jpeg"
              />
              <Form.Text className="text-muted">
                La imagen debe estar en public/img.
              </Form.Text>
            </Form.Group>

            {/* Errores dentro del formulario */}
            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}

          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShow(false)}
              disabled={guardando}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </Modal.Footer>

        </Form>
      </Modal>
    </Container>
  )
}

export default AdminProductos
