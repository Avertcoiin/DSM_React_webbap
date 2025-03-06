import React from 'react';
import { useCart } from '../context/CartContext'; // Importamos el contexto del carrito
import { useNavigate } from "react-router-dom";
import { db } from '../firebase_conf/firebase';

function OrderConfirm() {
  const { cartItems, getTotalPrice, clearCart } = useCart(); // Obtenemos los productos del carrito, el precio total y la función para borrar
  const navigate = useNavigate();
  const continuarPedido = () => {
    navigate("/formulario"); // Redirige al usuario a la página de confirmación de pedido
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Confirmación de Pedido</h2>

      {/* Si el carrito está vacío */}
      {cartItems.length === 0 ? (
        <div className="d-flex flex-column align-items-center">
          <p className="text-center">No tienes productos en tu carrito.</p>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
            Atrás
          </button>
        </div>

      ) : (
        <div className="row">
          {/* Columna de la izquierda (productos) */}
          <div className="col-md-8">
            <div className="row">
              {cartItems.map((item) => (
                <div key={item.id} className="col-12 mb-4">
                  <div className="card d-flex flex-row p-3">
                    {/* Imagen del producto */}
                    <div className="card-img-container" style={{ flex: 1 }}>
                      <img
                        src={item.archivo} // Usamos la propiedad archivo directamente para obtener la imagen
                        className="img-fluid"
                        alt={item.nombre}
                        style={{ width: '35%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Contenido del producto */}
                    <div className="card-body d-flex flex-column justify-content-between" style={{ flex: 2 }}>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        {/* Nombre del producto a la izquierda */}
                        <h5 className="mb-0">{item.nombre}</h5>
                        {/* Precio del producto a la derecha */}
                        <p className="fw-bold fs-5 mb-0">{item.precio}€</p>
                      </div>
                      <p className="mb-0">Cantidad: {item.cantidad}</p>

                      {/* Unidades disponibles (uds) */}
                      <div className="d-flex justify-content-between mt-2">
                        <span>
                          {item.uds <= 10 
                            ? <span className="text-danger">Solo quedan {item.uds} unidades</span> 
                            : <span className="text-success">En stock</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna de la derecha (resumen de pedido + botones) */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Resumen de Pedido</h5>
                <ul className="list-group">
                  {cartItems.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between">
                      <span>{item.nombre}</span>
                      <span>{(item.precio * item.cantidad).toFixed(2)}€</span>
                    </li>
                  ))}
                </ul>

                {/* Total del carrito */}
                <div className="mt-3 text-right">
                  <h4 className="fw-bold">Total: {getTotalPrice().toFixed(2)}€</h4>
                </div>

                {/* Botones de acción */}
                <div className="d-flex flex-column mt-3">
                  <button className="btn btn-success btn-lg mb-2" onClick={continuarPedido}>CONTINUAR</button>
                  <button className="btn btn-danger btn-lg" onClick={clearCart}>BORRAR PEDIDO</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Final */}
      <div className="text-right mt-4">
        <h3 className="fw-bold">Total del Pedido: {getTotalPrice().toFixed(2)}€</h3>
      </div>
    </div>
  );
}

export default OrderConfirm;
