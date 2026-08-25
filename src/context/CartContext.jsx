import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product, quantity = 1, color) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.color === color)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          color: color ?? null,
          quantity,
        },
      ]
    })
  }

  const removeItem = (id, color) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.color === color)))
  }

  const updateQuantity = (id, color, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.color === color
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    )
  }

  const clearCart = () => setItems([])

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items],
  )

  const value = { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}
