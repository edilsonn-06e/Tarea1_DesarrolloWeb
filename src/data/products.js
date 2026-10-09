
export const categories = [
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'hogar', label: 'Hogar y Oficina' },
  { value: 'accesorios', label: 'Accesorios' },
]

export const formatCurrency = (value) =>
  `Q ${value.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
