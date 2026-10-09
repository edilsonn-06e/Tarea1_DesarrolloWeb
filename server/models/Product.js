
import mongoose from 'mongoose'

// Esquema para las reseñas de los productos
const reviewSchema = new mongoose.Schema(
  {
    author: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  },
  { _id: false }
)

// Esquema principal de productos
const productSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },

    category: {
      type: String,
      enum: ['tecnologia', 'hogar', 'accesorios'],
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo']
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    image: {
      type: String,
      default: ''
    },

    shortDescription: String,
    description: String,
    colors: [String],
    specs: [[String]],
    reviews: [reviewSchema],

    activo: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

// Convertir _id de MongoDB en id para React
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id
    return ret
  }
})

export default mongoose.model('Product', productSchema)
