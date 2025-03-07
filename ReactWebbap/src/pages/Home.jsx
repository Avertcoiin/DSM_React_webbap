import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Importa la configuración de Firebase
import { ref, get } from 'firebase/database'; // Importa las funciones necesarias de Firebase
import { useCart } from '../context/CartContext'; // Importa el contexto del carrito
import ProductCarousel from '../components/ProductCarrousel'; // Componente de carrusel

function Home() {
  const [productos, setProductos] = useState([]);
  const { cartItems } = useCart(); // Accedemos a los elementos del carrito

  useEffect(() => {
    const productosRef = ref(db, 'productos'); // Referencia a la "ruta" donde están los productos

    get(productosRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const productosArray = [];
          snapshot.forEach((childSnapshot) => {
            const producto = {
              id: childSnapshot.key,
              ...childSnapshot.val(),
            };

            // Buscamos si el producto está en el carrito
            const cartItem = cartItems.find(item => item.id === producto.id);
            if (cartItem) {
              producto.cantidad = cartItem.cantidad; // Asignamos la cantidad desde el carrito
            } else {
              producto.cantidad = 0; // Si no está en el carrito, la cantidad es 0
            }

            productosArray.push(producto); // Agregamos el producto al array
          });

          setProductos(productosArray); // Actualizamos el estado con los productos y sus cantidades
        } else {
          console.log("No hay productos disponibles");
        }
      })
      .catch((error) => {
        console.error('Error al obtener los productos de Firebase:', error);
      });
  }, [cartItems]); // Dependemos de `cartItems` para que se actualice cuando cambia el carrito

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Bienvenidos a nuestra tienda</h2>

      {/* Usamos el carrusel con los productos */}
      <ProductCarousel productos={productos} />
    </div>
  );
}

export default Home;
