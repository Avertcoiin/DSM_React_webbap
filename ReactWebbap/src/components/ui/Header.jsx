// src/components/ui/Header.jsx
import React from "react";
import logo from "../../assets/logo.png"; // Asegúrate de que la ruta al logo sea correcta
import carrito from "../../assets/carrito.jpg"; // Asegúrate de que la ruta al carrito sea correcta
import { useCart } from "../../context/CartContext"; // Importa el hook del carrito

function Header() {
  const { cartItems, getTotalPrice } = useCart(); // Accede a los productos en el carrito y la función para obtener el total

  // Calculamos el total de productos y el precio total
  const totalCantidad = cartItems.reduce((acc, item) => acc + item.cantidad, 0); // Suma la cantidad total
  const totalPrecio = getTotalPrice(); // Usamos el cálculo del precio total desde el contexto

  return (
    <header className="d-flex align-items-center justify-content-between p-3 bg-dark" style={{ backgroundColor: "#333" }}>
      <img src={logo} alt="Logo" className="logo" style={{ height: "50px" }} />
      <input type="text" placeholder="Buscar..." className="form-control mx-3" style={{ maxWidth: "300px" }} />
      <div className="cart mx-3">
        <img src={carrito} alt="Carrito" style={{ height: "30px" }} />
        <span className="cart-count" style={{ color: "white" }}>
          {totalCantidad} {/* Muestra la cantidad total de productos */}
        </span>
      </div>
      <div className="total mx-3 text-light">
        <span>Total: €{totalPrecio.toFixed(2)}</span> {/* Muestra el total en precio */}
      </div>
      <div className="session-order mx-3">
        <button className="btn btn-success">Sesión/Pedido</button>
      </div>
    </header>
  );
}

export default Header;


/* import React from "react";
import logo from "../../assets/logo.png"; // Asegúrate de que la ruta al logo sea correcta
import carrito from "../../assets/carrito.jpg"; // Asegúrate de que la ruta al carrito sea correcta

function Header() {
  return (
    <header className="d-flex align-items-center justify-content-between p-3 bg-dark" style={{ backgroundColor: "#333" }}>
      <img src={logo} alt="Logo" className="logo" style={{ height: "50px" }} />
      <input type="text" placeholder="Buscar..." className="form-control mx-3" style={{ maxWidth: "300px" }} />
      <div className="cart mx-3">
        <img src={carrito} alt="Carrito" style={{ height: "30px" }} />
      </div>
      <div className="total mx-3 text-light">
        <span>Total: $0.00</span>
      </div>
      <div className="session-order mx-3">
        <button className="btn btn-success">Sesión/Pedido</button>
      </div>
    </header>
  );
}

export default Header; */