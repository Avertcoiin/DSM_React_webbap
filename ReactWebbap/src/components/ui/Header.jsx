// src/components/ui/Header.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import logo from "../../assets/logo.png"; 
import carrito from "../../assets/carrito.jpg"; 
import { useCart } from "../../context/CartContext"; 
import { useSearch } from "../../context/SearchContext"; // Usamos el hook del contexto de búsqueda

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getTotalPrice } = useCart();
  const { searchTerm, setSearchTerm } = useSearch(); // Usamos el término de búsqueda desde el contexto

  const [searchQuery, setSearchQuery] = useState(searchTerm);

  // Manejar el cambio en el input de búsqueda
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); 
    setSearchTerm(event.target.value); // Actualizamos el término de búsqueda en el contexto
  };

  const totalCantidad = cartItems.reduce((acc, item) => acc + item.cantidad, 0); 
  const totalPrecio = getTotalPrice(); 

  const handleOrderClick = () => {
    if (location.pathname !== "/") {
      navigate(-1); 
    } else {
      navigate("/order-confirm"); 
    }
  };

  return (
    <header className="d-flex align-items-center justify-content-between p-3 bg-#333333 fixed-top" style={{ backgroundColor: "#333" }}>
      <div className="d-flex align-items-center">
        <img src={logo} alt="Logo" className="logo" style={{ height: "50px" }} />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control mx-3"
          style={{ maxWidth: "300px" }}
        />
      </div>
      <div className="d-flex align-items-center">
        <div className="cart mx-3 position-relative">
          <img src={carrito} alt="Carrito" style={{ height: "40px" }} />
          <span className="badge rounded-circle bg-white text-dark fw-bold position-absolute top-0 start-100 translate-middle border border-dark">
            {totalCantidad}
          </span>
        </div>

        <div className="total mx-3 text-light">
          <span>Total: {totalPrecio.toFixed(2)}€</span> {/* Muestra el total en precio */}
        </div>
        <div className="session-order mx-3">
          <button className="btn btn-success" onClick={handleOrderClick}>
            {location.pathname !== "/" ? "Atrás" : "Realizar Pedido"}
          </button>
        </div>
        <div className="session-order mx-3">
          <button className="btn btn-primary">Sesión/Pedido</button>
        </div>

      </div>
    </header>
  );
}

export default Header;
