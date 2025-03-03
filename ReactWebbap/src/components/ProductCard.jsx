// src/components/ProductCard.jsx

// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

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
      
      {/* Carrusel de productos */}
      <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
        {/* Indicadores del carrusel */}
        <ol className="carousel-indicators">
          {productos.length > 0 && productos.map((_, index) => (
            <li
              key={index}
              data-bs-target="#productCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
            ></li>
          ))}
        </ol>

        {/* Items del carrusel */}
        <div className="carousel-inner">
          {/* Iteramos sobre los productos para crear cada "item" */}
          {productos.map((producto, index) => (
            <div key={producto.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <div className="row">
                <div className="col-sm-3">
                  <div className="thumb-wrapper">
                    <ProductCard product={producto} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles del carrusel */}
        <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Home;


/* import React from 'react';

function ProductCard({ product }) {
  return (
    <div className="card h-100 shadow-sm">
      <img src={product.archivo} className="card-img-top img-fluid" alt={product.nombre} />
      <div className="card-body">
        <h5 className="card-title">{product.nombre}</h5>
        <p className="card-text">Precio: ${product.precio}</p>
        <p className="card-text">Tiempo de envío: {product.tiempoEnv}</p>
        <p className="card-text">Unidades disponibles: {product.uds}</p>
      </div>
      <div className="card-footer text-center">
        <button className="btn btn-primary">Añadir al carrito</button>
      </div>
    </div>
  );
}

export default ProductCard; */
