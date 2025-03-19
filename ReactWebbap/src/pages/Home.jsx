// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { ref, get } from 'firebase/database'; 
import { useCart } from '../context/CartContext'; 
import ProductCarousel from '../components/ProductCarrousel'; 
import { useSearch } from '../context/SearchContext'; // Usamos el hook del contexto de búsqueda

function Home() {
  const [productos, setProductos] = useState([]);
  const { cartItems } = useCart();
  const { searchTerm } = useSearch(); // Obtenemos el término de búsqueda del contexto

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
            if (cartItem) {
              producto.cantidad = cartItem.cantidad;
            } else {
              producto.cantidad = 0;
            }

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

  // Filtramos los productos usando el searchTerm
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Bienvenidos a nuestra tienda</h2>
      <ProductCarousel productos={productosFiltrados} />
    </div>
  );
}

export default Home;
