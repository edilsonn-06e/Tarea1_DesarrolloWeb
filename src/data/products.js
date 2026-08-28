import laptopImg from '../assets/laptop.jpeg'
import sillaImg from '../assets/silla.jpg'
import audifonoImg from '../assets/Audifonos.jpg'
import mochilaImg from '../assets/mochila.jpg'
import monitorImg from '../assets/monitor.webp'


export const categories = [
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'hogar', label: 'Hogar y Oficina' },
  { value: 'accesorios', label: 'Accesorios' },
]

export const products = [
  {
    id: 'P-001',
    name: 'Laptop Ultra Slim 14"',
    category: 'tecnologia',
    price: 6500,
    stock: 12,
    image: laptopImg,
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
    id: 'P-002',
    name: 'Audífonos Inalámbricos',
    category: 'tecnologia',
    price: 350,
    stock: 40,
    image: audifonoImg,
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
    id: 'P-003',
    name: 'Silla Ergonómica de Oficina',
    category: 'hogar',
    price: 1200,
    stock: 8,
    image: sillaImg,
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
    id: 'P-004',
    name: 'Mochila Antirrobo',
    category: 'accesorios',
    price: 275,
    stock: 25,
    image: mochilaImg,
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
    id: 'P-005',
    name: 'Monitor Curvo 27"',
    category: 'tecnologia',
    price: 2100,
    stock: 15,
    image: monitorImg,
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

export const findProductById = (id) => products.find((p) => p.id === id)

export const formatCurrency = (value) =>
  `Q ${value.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
