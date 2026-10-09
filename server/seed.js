
import 'dotenv/config'
import mongoose from 'mongoose'
import Product from './models/Product.js'
import User from './models/User.js'

const productos = [
  {
    codigo: 'P-001',
    name: 'Laptop Ultra Slim 14"',
    category: 'tecnologia',
    price: 6500,
    stock: 12,
    image: '/img/laptop.jpeg',
    shortDescription: 'Procesador de última generación, ideal para trabajo y estudio.',
    description:
      'Laptop delgada y ligera, ideal para trabajo, estudio y entretenimiento. Cuenta con ' +
      'procesador de última generación, 16 GB de memoria RAM y almacenamiento de estado ' +
      'sólido de 512 GB.',
    colors: ['Gris espacial', 'Plata', 'Negro'],
    specs: [
      ['Procesador', 'Núcleo de 8 hilos, 3.2 GHz'],
      ['Memoria RAM', '16 GB'],
      ['Almacenamiento', '512 GB SSD'],
      ['Pantalla', '14 pulgadas, Full HD'],
      ['Peso', '1.3 kg'],
    ],
    reviews: [
      { author: 'María López', rating: 5, comment: 'Excelente rendimiento y muy ligera para transportar.' },
      { author: 'Carlos Ramírez', rating: 4, comment: 'Buena batería, aunque esperaba más puertos USB.' },
    ],
  },
  {
    codigo: 'P-002',
    name: 'Audífonos Inalámbricos',
    category: 'tecnologia',
    price: 350,
    stock: 40,
    image: '/img/Audifonos.jpg',
    shortDescription: 'Sonido envolvente con cancelación de ruido.',
    description:
      'Audífonos inalámbricos con cancelación activa de ruido, hasta 20 horas de batería y ' +
      'conexión Bluetooth 5.0 estable para música y llamadas.',
    colors: ['Negro', 'Blanco'],
    specs: [
      ['Conectividad', 'Bluetooth 5.0'],
      ['Batería', 'Hasta 20 horas'],
      ['Cancelación de ruido', 'Activa (ANC)'],
      ['Peso', '250 g'],
    ],
    reviews: [
      { author: 'Ana Pérez', rating: 5, comment: 'El sonido es increíble y son muy cómodos.' },
    ],
  },
  {
    codigo: 'P-003',
    name: 'Silla Ergonómica de Oficina',
    category: 'hogar',
    price: 1200,
    stock: 8,
    image: '/img/silla.jpg',
    shortDescription: 'Soporte lumbar ajustable, ideal para largas jornadas.',
    description:
      'Silla ergonómica con soporte lumbar ajustable, reposabrazos regulables y respaldo de ' +
      'malla transpirable, pensada para largas jornadas de trabajo.',
    colors: ['Negro'],
    specs: [
      ['Material', 'Malla transpirable'],
      ['Ajuste de altura', 'Sí'],
      ['Reposabrazos', 'Regulables'],
      ['Peso máximo soportado', '120 kg'],
    ],
    reviews: [
      { author: 'Luis Gómez', rating: 4, comment: 'Muy cómoda, el ensamblaje tomó unos 20 minutos.' },
    ],
  },
  {
    codigo: 'P-004',
    name: 'Mochila Antirrobo',
    category: 'accesorios',
    price: 275,
    stock: 25,
    image: '/img/mochila.jpg',
    shortDescription: 'Diseño antirrobo con puerto USB de carga.',
    description:
      'Mochila resistente al agua con compartimento acolchado para laptop de hasta 15.6", ' +
      'cierres ocultos antirrobo y puerto USB externo de carga.',
    colors: ['Gris', 'Negro'],
    specs: [
      ['Capacidad para laptop', 'Hasta 15.6"'],
      ['Material', 'Poliéster resistente al agua'],
      ['Puerto de carga', 'USB externo'],
    ],
    reviews: [
      { author: 'Diego Morales', rating: 5, comment: 'Muy práctica para el día a día y el bus.' },
    ],
  },
  {
    codigo: 'P-005',
    name: 'Monitor Curvo 27"',
    category: 'tecnologia',
    price: 2100,
    stock: 15,
    image: '/img/monitor.webp',
    shortDescription: 'Panel curvo Full HD con alta tasa de refresco.',
    description:
      'Monitor curvo de 27 pulgadas con panel Full HD, 100 Hz de tasa de refresco y tiempo ' +
      'de respuesta de 1 ms, ideal para productividad y entretenimiento.',
    colors: ['Negro'],
    specs: [
      ['Tamaño', '27 pulgadas'],
      ['Resolución', 'Full HD (1920x1080)'],
      ['Tasa de refresco', '100 Hz'],
      ['Curvatura', '1500R'],
    ],
    reviews: [
      { author: 'Fernanda Ruiz', rating: 4, comment: 'Los colores se ven muy bien, buena relación precio-calidad.' },
    ],
  },
]

try {
  await mongoose.connect(process.env.MONGODB_URI)

  console.log('Conectado a MongoDB Atlas')

  // Reemplazar los productos existentes
  await Product.deleteMany({})
  await Product.insertMany(productos)

  console.log('5 productos insertados correctamente')


  // Crear el administrador únicamente si no existe
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword || adminPassword.length < 12) {
    throw new Error(
      'Configura ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres)'
    )
  }

  const adminExistente = await User.findOne({
    correo: adminEmail.toLowerCase()
  })

  if (!adminExistente) {
    await User.create({
      nombre: 'Administrador Edis Store',
      correo: adminEmail,
      password: adminPassword,
      rol: 'admin',
    })

    console.log('Administrador creado correctamente')
  } else {
    console.log('El administrador ya existe. No se modificó su contraseña.')
  }


  console.log('Administrador creado correctamente')
  console.log('Datos de prueba insertados')

} catch (error) {
  console.error('Error al insertar datos:', error.message)
  process.exitCode = 1

} finally {
  await mongoose.disconnect()
}
