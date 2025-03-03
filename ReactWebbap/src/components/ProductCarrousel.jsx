// src/components/ProductCarrousel.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap CSS
import 'font-awesome/css/font-awesome.min.css'; // Importar Font Awesome CSS

function ProductCarousel({ productos }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Función para dividir los productos en grupos de 4
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const productChunks = chunkArray(productos, 4); // Divide los productos en grupos de 4

  // Maneja el cambio de slide al hacer clic en las flechas
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? productChunks.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === productChunks.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div id="myCarousel" className="carousel slide" data-ride="carousel" data-interval="0">
            {/* Indicadores del carrusel */}
            <ol className="carousel-indicators">
              {productChunks.map((_, index) => (
                <li
                  key={index}
                  data-target="#myCarousel"
                  data-slide-to={index}
                  className={index === activeIndex ? 'active' : ''}
                ></li>
              ))}
            </ol>

            {/* Slides del carrusel */}
            <div className="carousel-inner">
              {productChunks.map((chunk, index) => (
                <div key={index} className={`item ${index === activeIndex ? 'active' : ''}`}>
                  <div className="row">
                    {chunk.map((producto) => (
                      <div key={producto.id} className="col-sm-3">
                        <div className="thumb-wrapper">
                          <span className="wish-icon">
                            <i className="fa fa-heart-o"></i>
                          </span>
                          <div className="img-box">
                            <img src={producto.image} className="img-responsive" alt={producto.name} />
                          </div>
                          <div className="thumb-content">
                            <h4>{producto.name}</h4>
                            <div className="star-rating">
                              <ul className="list-inline">
                                {[...Array(5)].map((_, i) => (
                                  <li key={i} className="list-inline-item">
                                    <i
                                      className={`fa ${
                                        i < producto.rating ? 'fa-star' : 'fa-star-o'
                                      }`}
                                    ></i>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="item-price">
                              <strike>${producto.originalPrice}</strike> <b>${producto.discountedPrice}</b>
                            </p>
                            <a href="#" className="btn btn-primary">
                              Add to Cart
                            </a>
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
/* import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap CSS
import 'font-awesome/css/font-awesome.min.css'; // Importar Font Awesome CSS

function ProductCarousel({ productos }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const productChunks = chunkArray(productos, 4);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div id="myCarousel" className="carousel slide" data-ride="carousel" data-interval="0">
                        <ol className="carousel-indicators">
                            {productChunks.map((_, index) => (
                                <li
                                    key={index}
                                    data-target="#myCarousel"
                                    data-slide-to={index}
                                    className={index === activeIndex ? 'active' : ''}
                                ></li>
                            ))}
                        </ol>
                        <div className="carousel-inner">
                            {productChunks.map((chunk, index) => (
                                <div key={index} className={`item ${index === activeIndex ? 'active' : ''}`}>
                                    <div className="row">
                                        {chunk.map((producto) => (
                                            <div key={producto.id} className="col-sm-3">
                                                <div className="thumb-wrapper">
                                                    <span className="wish-icon">
                                                        <i className="fa fa-heart-o"></i>
                                                    </span>
                                                    <div className="img-box">
                                                        <img src={producto.image} className="img-responsive" alt={producto.name} />
                                                    </div>
                                                    <div className="thumb-content">
                                                        <h4>{producto.name}</h4>
                                                        <div className="star-rating">
                                                            <ul className="list-inline">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <li key={i} className="list-inline-item">
                                                                        <i
                                                                            className={`fa ${i < producto.rating ? 'fa-star' : 'fa-star-o'
                                                                                }`}
                                                                        ></i>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <p className="item-price">
                                                            <strike>${producto.originalPrice}</strike> <b>${producto.discountedPrice}</b>
                                                        </p>
                                                        <a href="#" className="btn btn-primary">
                                                            Add to Cart
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCarousel; */




/* import React from 'react';

function ProductCarousel({ productos }) {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {productos.map((producto, index) => (
          <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={producto.id}>
            <div className="row">
              <div className="col-sm-3">
                <div className="thumb-wrapper">
                  <span className="wish-icon">
                    <i className="fa fa-heart-o"></i>
                  </span>
                  <div className="img-box">
                    <img
                      src={producto.archivo}
                      className="img-responsive"
                      alt={producto.nombre}
                    />
                  </div>
                  <div className="thumb-content">
                    <h4>{producto.nombre}</h4>
                    <div className="star-rating">
                      <ul className="list-inline">
                        {Array.from({ length: 5 }, (_, index) => (
                          <li className="list-inline-item" key={index}>
                            <i className={index < 4 ? "fa fa-star" : "fa fa-star-o"}></i>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="item-price">
                      <strike>${producto.precioAnterior}</strike> <b>${producto.precio}</b>
                    </p>
                    <a href="#" className="btn btn-primary">Añadir al carrito</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default ProductCarousel; */
