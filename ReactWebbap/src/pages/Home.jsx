// src/pages/Home.jsx
// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCarousel from '../components/ProductCarrousel';// Importa el componente

function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const firebaseUrl = 'https://dsm-vertiz-muro-proyecto-react-default-rtdb.europe-west1.firebasedatabase.app/productos.json';
    
    axios.get(firebaseUrl)
      .then((response) => {
        const productosArray = [];
        for (let key in response.data) {
          productosArray.push({
            id: key,
            ...response.data[key],
          });
        }
        setProductos(productosArray);
      })
      .catch((error) => {
        console.error('Error al obtener los productos de Firebase:', error);
      });
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Bienvenidos a nuestra tienda</h2>

      {/* Usamos el carrusel con los productos */}
      <ProductCarousel productos={productos} />
    </div>
  );
}

export default Home;
/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCarousel from '../components/ProductCarrousel'; // Importa el componente

function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const firebaseUrl = 'https://dsm-vertiz-muro-proyecto-react-default-rtdb.europe-west1.firebasedatabase.app/productos.json';
    
    axios.get(firebaseUrl)
      .then((response) => {
        const productosArray = [];
        for (let key in response.data) {
          productosArray.push({
            id: key,
            ...response.data[key],
          });
        }
        setProductos(productosArray);
      })
      .catch((error) => {
        console.error('Error al obtener los productos de Firebase:', error);
      });
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Bienvenidos a nuestra tienda</h2>

      {/* Usamos el carrusel con los productos *//*}
      <ProductCarousel productos={productos} />
    </div>
  );
}

export default Home; */
