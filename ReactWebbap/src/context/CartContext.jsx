// src/context/CartContext.jsx

import React, { createContext, useContext, useState } from 'react'

// Creamos el contexto para el carrito
const CartContext = createContext()

// Proveedor del contexto
export const useCart = () => useContext(CartContext)

// El proveedor envuelve la aplicación y gestiona el estado global del carrito
const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // Función para agregar al carrito
  const addToCart = (product) => {
    const updatedCart = [...cart]
    const existingProduct = updatedCart.find(item => item.id === product.id)

    if (existingProduct) {
      existingProduct.cantidad += 1  // Aumentar cantidad si el producto ya está en el carrito
    } else {
      updatedCart.push({ ...product, cantidad: 1 }) // Si no está en el carrito, agregarlo con cantidad 1
    }

    setCart(updatedCart)
  }

  // Función para eliminar del carrito
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id)
    setCart(updatedCart)
  }

  // Calcular el total
  const getTotal = () => {
    return cart.reduce((total, product) => total + product.precio * product.cantidad, 0)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider
