// src/components/ProductCarrousel.jsx
import React from 'react';

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

export default ProductCarousel;
