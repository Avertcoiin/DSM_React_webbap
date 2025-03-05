// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Crea el contexto del carrito
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Estado del carrito

  // Función para agregar al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(item => item.id === product.id);
      if (existingProduct) {
        // Si el producto ya existe, actualiza la cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, cantidad: product.cantidad }
            : item
        );
      }
      // Si no existe, agrega el producto al carrito
      return [...prevItems, product];
    });
  };

  // Función para eliminar del carrito
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  // Función para calcular el precio total
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  // Asegúrate de que el return esté dentro del CartProvider
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
