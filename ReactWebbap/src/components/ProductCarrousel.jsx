// src/components/ProductCarrousel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

function ProductCarousel({ productos }) {
  const { addToCart, cartItems, getTotalPrice } = useCart(); // Accedemos al método getTotalPrice del contexto
  const [activeIndex] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(getItemsPerRow());
  const [cantidadProductos, setCantidadProductos] = useState({});

  // Función para actualizar la cantidad de productos por fila
  useEffect(() => {
    const handleResize = () => setItemsPerRow(getItemsPerRow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para determinar la cantidad de productos por fila
  function getItemsPerRow() {
    const width = window.innerWidth;
    if (width >= 1200) return 4;
    if (width >= 992) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const productChunks = chunkArray(productos, itemsPerRow);

  // handleIncrement para aumentar la cantidad del producto
  const handleIncrement = useCallback((id) => {
    // Encontramos el producto en el carrito
    const cartProduct = cartItems.find(item => item.id === id);
    const currentQuantity = cartProduct ? cartProduct.cantidad : 0; // Si existe en el carrito, usamos su cantidad
  
    // Incrementamos la cantidad
    setCantidadProductos((prev) => {
      const newCantidad = currentQuantity + 1;
      const product = productos.find(p => p.id === id);
  
      addToCart({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: newCantidad,
        archivo: product.archivo,
        tiempoEnv: product.tiempoEnv,
        uds: product.uds,
      });
  
      return { ...prev, [id]: newCantidad };
    });
  }, [productos, addToCart, cartItems]);
  
  // handleDecrement para disminuir la cantidad del producto
  const handleDecrement = useCallback((id) => {
    // Encontramos el producto en el carrito
    const cartProduct = cartItems.find(item => item.id === id);
    const currentQuantity = cartProduct ? cartProduct.cantidad : 0; // Si existe en el carrito, usamos su cantidad
  
    // Decrementamos la cantidad, pero no permitimos valores negativos
    setCantidadProductos((prev) => {
      const newCantidad = Math.max(currentQuantity - 1, 0); // Si ya está en 0, no decrementar más
      const product = productos.find(p => p.id === id);
  
      addToCart({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: newCantidad,
        archivo: product.archivo,
        tiempoEnv: product.tiempoEnv,
        uds: product.uds,
      });
  
      return { ...prev, [id]: newCantidad };
    });
  }, [productos, addToCart, cartItems]);
  

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div id="myCarousel" className="carousel slide" data-ride="carousel" data-interval="0">

            <div className="carousel-inner">
              {productChunks.map((chunk, index) => (
                <div key={index} className={`item ${index === activeIndex ? 'active' : ''}`}>
                  <div className="row d-flex justify-content-center">
                    {chunk.map((producto) => (
                      <div
                        key={producto.id}
                        className={`col-${12 / itemsPerRow} d-flex align-items-stretch mb-4`}
                      >
                        <div className="thumb-wrapper w-100">
                          <div className="img-box">
                            <img
                              src={producto.archivo} //"src/assets/jarron1.webp" 
                              className="img-responsive w-80"
                            />
                          </div>
                          <div className="thumb-content text-center">
                            <h4>{producto.nombre}</h4>
                            <div className="star-rating">
                              <ul className="list-inline">
                                {[...Array(5)].map((_, i) => (
                                  <li key={i} className="list-inline-item">
                                    <i
                                      className={`fa ${i < producto.rating ? 'fa-star' : 'fa-star-o'}`}
                                    ></i>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="item-price">
                              <b>€{producto.precio}</b>
                            </p>
                            {/* Controles de cantidad */}
                            <div className="d-flex justify-content-center align-items-center contador-container bg-light p-2 rounded">
                              <button
                                className="btn btn-danger mx-2"
                                onClick={() => handleDecrement(producto.id)}
                                onMouseUp={(e) => e.currentTarget.blur()}
                                onBlur={(e) => e.currentTarget.blur()}
                              >
                                −
                              </button>

                              <span className="fw-bold">{producto.cantidad || 0}</span>

                              <button
                                className="btn btn-success mx-2"
                                onClick={() => handleIncrement(producto.id)}
                                onMouseUp={(e) => e.currentTarget.blur()}
                                onBlur={(e) => e.currentTarget.blur()}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCarousel;
