import React from "react";
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

export default Header;