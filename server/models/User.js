
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo inválido']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    rol: {
      type: String,
      enum: ['admin', 'cliente'],
      default: 'cliente'
    },
    telefono: {
      type: String,
      trim: true
    },
    pais: {
      type: String,
      default: 'Guatemala'
    }
  },
  { timestamps: true }
)

// Encriptar la contraseña antes de guardarla
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Comparar contraseña al iniciar sesión
userSchema.methods.compararPassword = function (passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password)
}

// Ocultar la contraseña al enviar los datos al frontend
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.password
    return ret
  }
})

export default mongoose.model('User', userSchema)
