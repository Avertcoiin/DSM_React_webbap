// src/pages/OrderConfirm.jsx

import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const OrderConfirm = () => {
  const { cart, getTotal } = useCart();

  return (
    <div className="order-confirmation">
      <h2>Confirmación del pedido</h2>
      <div className="order-details">
        {cart.length === 0 ? (
          <p>No hay productos en tu carrito.</p>
        ) : (
          cart.map((product) => (
            <div key={product.id}>
              <h3>{product.nombre}</h3>
              <p>Cantidad: {product.cantidad}</p>
              <p>Precio: {product.precio}€</p>
            </div>
          ))
        )}
      </div>
      <h3>Total: {getTotal()}€</h3>
      <Link to="/thank-you">
        <button>CONTINUAR</button>
      </Link>
    </div>
  );
};

export default OrderConfirm;
