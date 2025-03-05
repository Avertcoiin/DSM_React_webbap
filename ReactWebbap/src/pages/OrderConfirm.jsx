// src/pages/OrderConfirm.jsx
import React from 'react';
import { useCart } from '../context/CartContext'; // Importamos el contexto del carrito

function OrderConfirm() {
  const { cartItems, getTotalPrice } = useCart(); // Obtenemos los productos del carrito y el precio total

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Confirmación de Pedido</h2>

      {/* Si el carrito está vacío */}
      {cartItems.length === 0 ? (
        <p className="text-center">No tienes productos en tu carrito.</p>
      ) : (
        <>
          <div className="row">
            {cartItems.map((item) => (
              <div key={item.id} className="col-md-4">
                <div className="card mb-3">
                  <img
                    src={item.archivo || "default_image_url"} // Usa la URL de la imagen del producto, si existe
                    className="card-img-top"
                    alt={item.nombre}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.nombre}</h5>
                    <p className="card-text">€{item.precio}</p>
                    <p className="card-text">Cantidad: {item.cantidad}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total del carrito */}
          <div className="text-right">
            <h4>Total: €{getTotalPrice().toFixed(2)}</h4>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderConfirm;
