import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import logo from "../../assets/logo.png";
import carrito from "../../assets/carrito.jpg";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useRoute } from "../../context/RouteContext"; // Importar useRoute
import { Dropdown } from "react-bootstrap";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getTotalPrice } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const { setDesiredRoute } = useRoute();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const prevLocationRef = useRef(location.pathname); // Usamos useRef para almacenar la ruta anterior


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    prevLocationRef.current = location.pathname; // Actualizamos la ruta anterior en cada renderizado
  }, [location.pathname]);

  const totalCantidad = cartItems.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = getTotalPrice();

  const handleOrderClick = () => {
    if (!user) {
      if (location.pathname === "/login") {
        navigate("/");
      }else{
        setDesiredRoute("/order-confirm");
        navigate("/login");
      }
    } else if (location.pathname === "/" ) {
      navigate("/order-confirm");
    } else if (location.pathname === "/thank-you" || prevLocationRef.current === location.pathname) {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="d-flex align-items-center justify-content-between p-3 bg-dark fixed-top">
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
          <span>Total: {totalPrecio.toFixed(2)}€</span>
        </div>
        <div className="session-order mx-3">
          <button className="btn btn-success" onClick={handleOrderClick}>
            {location.pathname !== "/" ? "Atrás" : "Realizar Pedido"}
          </button>
        </div>
        <div className="session-order mx-3 d-flex flex-row align-items-center">
          {user ? (
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                <i className="bi bi-person-circle"></i> Cuenta
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/pedidos")}>Pedidos</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("/borrar-usuario")}>Borrar usuario</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              <i className="bi bi-person-circle"></i> Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
