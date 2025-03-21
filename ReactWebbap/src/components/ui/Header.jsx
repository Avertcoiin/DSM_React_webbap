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
import currency from "currency.js"; // Importamos currency.js
import Conversion from "../Conversion"; // Importamos el hook
import Select from "react-select"; // Importamos react-select
import Flag from "react-world-flags"; // Importamos react-world-flags para las banderas

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getTotalPrice } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const { setDesiredRoute } = useRoute();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [selectedCountry, setSelectedCountry] = useState("EU");
  const prevLocationRef = useRef(location.pathname); // Usamos useRef para almacenar la ruta anterior
  const { rates, loading, error } = Conversion(); // Usamos el hook actualizado

  // Definir los países, monedas y banderas
  const countries = [
    { label: "España", value: "EU", currency: "EUR", flag: "EU" },
    { label: "Estados Unidos", value: "US", currency: "USD", flag: "US" },
    { label: "Reino Unido", value: "GB", currency: "GBP", flag: "GB" },
    { label: "Canadá", value: "CA", currency: "CAD", flag: "CA" },
  ];

  // Función para manejar la selección del país
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption.value);
  };

  // Función para obtener el precio total formateado con la moneda seleccionada
  const getFormattedPrice = (price) => {
    if (loading) return "Cargando..."; // Mostramos un mensaje mientras se cargan las tasas
    if (error) return "Error al cargar tasas de cambio"; // Mostramos un mensaje si hubo un error

    const country = countries.find((c) => c.value === selectedCountry);
    if (country) {
      // Usamos las tasas de conversión reales obtenidas
      const conversionRate = rates[country.currency]; // Obtenemos la tasa de conversión
      if (conversionRate) {
        const convertedPrice = currency(price).multiply(conversionRate); // Multiplicamos el precio
        return convertedPrice.format(); // Retornamos el precio formateado con el símbolo de moneda
      }
    }
    return currency(price).format(); // Si no se encuentra, devuelve el precio en euros
  };

  // Función para obtener el símbolo de la moneda
  const getCurrencySymbol = (currencyCode) => {
    const currencySymbols = {
      EUR: "€",
      USD: "$",
      GBP: "£",
      CAD: "C$",
    };
    return currencySymbols[currencyCode] || "";
  };

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
  const totalPrecio = getTotalPrice(); // Precio total en euros

  const handleOrderClick = () => {
    if (!user) {
      if (location.pathname === "/login") {
        navigate("/"); // Redirigimos a inicio si no hay usuario
      } else {
        setDesiredRoute("/order-confirm");
        navigate("/login");
      }
    } else if (location.pathname === "/") {
      navigate("/order-confirm"); // Confirmamos pedido si estamos en la página principal
    } else if (location.pathname === "/thank-you" || prevLocationRef.current === location.pathname) {
      navigate("/"); // Volvemos al inicio
    } else {
      navigate(-1); // Regresamos a la página anterior
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Logout y redirigir al inicio
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
          <span>Total: {getCurrencySymbol(countries.find((c) => c.value === selectedCountry)?.currency)} {getFormattedPrice(totalPrecio)}</span>
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
        <div className="country-select mx-3">
          <Select
            options={countries.map((country) => ({
              value: country.value,
              label: (
                <div className="d-flex align-items-center">
                  <Flag code={country.flag} style={{ width: "20px", marginRight: "10px" }} />
                  <span>{country.label}</span>
                </div>
              ),
            }))}
            onChange={handleCountryChange}
            value={countries.find((c) => c.value === selectedCountry)}
            getOptionLabel={(e) => e.label} // Usamos el label personalizado para que muestre la bandera
            formatOptionLabel={(data) => (
              <div className="d-flex align-items-center">
                <Flag code={data.flag} style={{ width: "20px", marginRight: "10px" }} />
                <span>{data.label}</span>
              </div>
            )}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
