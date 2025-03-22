// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { ref, get } from 'firebase/database'; 
import { useCart } from '../context/CartContext'; 
import 'animate.css';
import ProductCarousel from '../components/ProductCarrousel'; 
import { useSearch } from '../context/SearchContext';

function Home() {
  const [productos, setProductos] = useState([]);
  const { cartItems } = useCart();
  const {
    searchTerm,
    minPrice,
    maxPrice,
    minRating
  } = useSearch(); // Obtenemos todos los filtros del contexto

  useEffect(() => {
    const productosRef = ref(db, 'productos'); 

    get(productosRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const productosArray = [];
          snapshot.forEach((childSnapshot) => {
            const producto = {
              id: childSnapshot.key,
              ...childSnapshot.val(),
            };

            const cartItem = cartItems.find(item => item.id === producto.id);
            producto.cantidad = cartItem ? cartItem.cantidad : 0;

            productosArray.push(producto);
          });

          setProductos(productosArray);
        } else {
          console.log("No hay productos disponibles");
        }
      })
      .catch((error) => {
        console.error('Error al obtener los productos de Firebase:', error);
      });
  }, [cartItems]);

  // Filtros combinados
  const productosFiltrados = productos.filter((producto) => {
    const nombreMatch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const precioMatch = producto.precio >= minPrice && producto.precio <= maxPrice;
    const ratingMatch = producto.rating >= minRating;
    return nombreMatch && precioMatch && ratingMatch;
  });

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 animate__animated animate__rubberBand">Bienvenidos a nuestra tienda</h2>
      <ProductCarousel productos={productosFiltrados} />
    </div>
  );
}

export default Home;
