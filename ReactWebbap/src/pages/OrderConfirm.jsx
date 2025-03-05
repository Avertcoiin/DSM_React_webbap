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
                        className="img-fluid" // Mantener la imagen fluida
                        alt={item.nombre}
                        style={{ width: '35%', objectFit: 'cover' }} // Aquí cambiamos a 25% de su tamaño original
                      />
                    </div>

                    {/* Contenido del producto */}
                    <div className="card-body d-flex flex-column justify-content-between" style={{ flex: 2 }}>
                      <h5 className="card-title">{item.nombre}</h5>
                      <p className="card-text">€{item.precio}</p>
                      <p className="card-text">Cantidad: {item.cantidad}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna de la derecha (resumen de pedido) */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Resumen de Pedido</h5>
                <ul className="list-group">
                  {cartItems.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between">
                      <span>{item.nombre}</span>
                      <span>€{(item.precio * item.cantidad).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                {/* Total del carrito */}
                <div className="mt-3 text-right">
                  <h4>Total: €{getTotalPrice().toFixed(2)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Final */}
      <div className="text-right mt-4">
        <h3 className="fw-bold">Total del Pedido: €{getTotalPrice().toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default OrderConfirm;
