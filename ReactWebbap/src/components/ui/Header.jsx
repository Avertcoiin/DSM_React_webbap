// src/components/ui/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import logo from "../../assets/logo.png"; // Asegúrate de que la ruta al logo sea correcta
import carrito from "../../assets/carrito.jpg"; // Asegúrate de que la ruta al carrito sea correcta
import { useCart } from "../../context/CartContext"; // Importa el hook del carrito

function Header() {
  const navigate = useNavigate(); // Usamos el hook useNavigate para redirigir
  const { cartItems, getTotalPrice } = useCart(); // Accede a los productos en el carrito y la función para obtener el total

  // Calculamos el total de productos y el precio total
  const totalCantidad = cartItems.reduce((acc, item) => acc + item.cantidad, 0); // Suma la cantidad total
  const totalPrecio = getTotalPrice(); // Usamos el cálculo del precio total desde el contexto

  // Función para manejar el clic en "Sesión/Pedido"
  const handleOrderClick = () => {
    navigate("/order-confirm"); // Redirige al usuario a la página de confirmación de pedido
  };

  return (
    <header className="d-flex align-items-center justify-content-between p-3 bg-#333333" style={{ backgroundColor: "#333" }}>
      <div className="d-flex align-items-center">
        <img src={logo} alt="Logo" className="logo" style={{ height: "50px" }} />
        <input type="text" placeholder="Buscar..." className="form-control mx-3" style={{ maxWidth: "300px" }} />
      </div>
      <div className="d-flex align-items-center">
        <div className="cart mx-3">
          <img src={carrito} alt="Carrito" style={{ height: "50px" }} />
        </div>
        <div className="total mx-3 text-light">
          <span>Total: $0.00</span>
        </div>
        <div className="order-button mx-3">
          <button className="btn btn-success">Realizar Pedido</button>
        </div>
        <div className="session-order mx-3">
          <button className="btn btn-primary">Sesión/Pedido</button>
        </div>

      </div>
    </header>
  );
}

export default Header;
