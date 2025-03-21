// src/components/ProductCarrousel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import Conversion from './Conversion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

function ProductCarousel({ productos }) {
  const { addToCart, cartItems } = useCart(); // Accedemos al método getTotalPrice del contexto
  const [activeIndex] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(getItemsPerRow());
  const [cantidadProductos, setCantidadProductos] = useState({});
  const [showModal, setShowModal] = useState(false); // Estado para controlar la modal
  const [productoAlcanzado, setProductoAlcanzado] = useState(null); // Estado para el producto con límite alcanzado
  const { rates, loading, error } = Conversion(); 

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

  const closeModal = () => {
    setShowModal(false);
    setProductoAlcanzado(null); // Resetear el producto alcanzado
  };


  // handleIncrement para aumentar la cantidad del producto sin exceder el límite de stock
  const handleIncrement = useCallback((id) => {
    const cartProduct = cartItems.find(item => item.id === id);
    const currentQuantity = cartProduct ? cartProduct.cantidad : 0;
    const product = productos.find(p => p.id === id);

    // Si la cantidad ya es igual o mayor al stock, mostrar modal y no hacer nada más
    if (currentQuantity >= product.uds) {
      setProductoAlcanzado(product); // Guardar el producto para mostrar en la modal
      setShowModal(true); // Mostrar la modal
      return;
    }

    // Incrementamos la cantidad
    setCantidadProductos((prev) => {
      const newCantidad = currentQuantity + 1;

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
                        <div className="thumb-wrapper w-100 d-flex flex-column h-100">
                          <div className="img-box">
                            <img
                              src={producto.archivo} //"src/assets/jarron1.webp" 
                              className="img-responsive w-80"
                            />
                          </div>
                          <div className="thumb-content text-center d-flex flex-column flex-grow-1">
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
                            <div className="d-flex justify-content-center align-items-center contador-container bg-light p-2 rounded mt-auto">
                              <button
                                className="btn btn-danger mx-2"
                                onClick={() => handleDecrement(producto.id)}
                                onMouseUp={(e) => e.currentTarget.blur()}
                                onBlur={(e) => e.currentTarget.blur()}
                                disabled={producto.cantidad <= 0}
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
      {/* Modal de Bootstrap */}
      {showModal && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">¡Atención!</h5>
              </div>
              <div className="modal-body">
                Has alcanzado el límite de unidades disponibles del producto <strong>{productoAlcanzado?.nombre}</strong>.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeModal}>Aceptar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCarousel;
