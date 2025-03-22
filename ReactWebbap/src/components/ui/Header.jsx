import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import logo from "../../assets/logo.png";
import carrito from "../../assets/carrito.jpg";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useRoute } from "../../context/RouteContext";
import { useConversion } from "../../context/ConversionContext";
import { Dropdown } from "react-bootstrap";
import currency from "currency.js";
import Conversion from "../Conversion";
import Select from "react-select";
import Flag from "react-world-flags";
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getTotalPrice } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const { setDesiredRoute } = useRoute();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [selectedCountry, setSelectedCountry] = useState("EU");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(500);
  const [rating, setRating] = useState(0);
  const prevLocationRef = useRef(location.pathname);
  const { rates, loading, error } = Conversion();
  const { updateConversion } = useConversion();

  const countries = [
    { label: "España", value: "EU", currency: "EUR", flag: "ES" },
    { label: "Estados Unidos", value: "US", currency: "USD", flag: "US" },
    { label: "Reino Unido", value: "GB", currency: "GBP", flag: "GB" },
    { label: "Canadá", value: "CA", currency: "CAD", flag: "CA" },
  ];

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption.value);
    const country = countries.find((c) => c.value === selectedOption.value);
    if (country) {
      const conversionRate = rates[country.currency];
      updateConversion(country.currency, conversionRate);
    }
  };

  const getFormattedPrice = (price) => {
    if (loading) return "Cargando...";
    if (error) return "Error al cargar tasas de cambio";
    const country = countries.find((c) => c.value === selectedCountry);
    if (country) {
      const conversionRate = rates[country.currency];
      if (conversionRate) {
        const convertedPrice = currency(price).multiply(conversionRate);
        return convertedPrice.value;
      }
    }
    return currency(price).value;
  };

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
    prevLocationRef.current = location.pathname;
    setShowFilters(false); // Cerrar filtros al cambiar de ruta
  }, [location.pathname]);

  const totalCantidad = cartItems.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = getTotalPrice();

  const handleOrderClick = () => {
    if (!user) {
      if (location.pathname === "/login") {
        navigate("/");
      } else {
        setDesiredRoute("/order-confirm");
        navigate("/login");
      }
    } else if (location.pathname === "/") {
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

        <div className="d-flex align-items-center mx-3">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control"
            style={{ maxWidth: "250px" }}
            aria-label="Buscar productos"
          />
          <button
            className="btn btn-secondary ms-2 px-3 py-2"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Ocultar Filtros" : "Filtros"}
          </button>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <div className="cart mx-3 position-relative">
          <img src={carrito} alt="Carrito" style={{ height: "40px" }} />
          <span className="badge rounded-circle bg-white text-dark fw-bold position-absolute top-0 start-100 translate-middle border border-dark">
            {totalCantidad}
          </span>
        </div>
        <div className="total mx-3 text-light">
          <span>
            Total: {getCurrencySymbol(countries.find((c) => c.value === selectedCountry)?.currency)}{" "}
            {getFormattedPrice(totalPrecio)}
          </span>
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
            getOptionLabel={(e) => e.label}
            formatOptionLabel={(data) => (
              <div className="d-flex align-items-center">
                <Flag code={data.flag} style={{ width: "20px", marginRight: "10px" }} />
                <span>{data.label}</span>
              </div>
            )}
          />
        </div>
      </div>

      {showFilters && (
        <div className="filters-dropdown bg-light p-3 position-absolute top-100 start-0 w-100 shadow-lg d-flex flex-wrap gap-4 fade-in">
          <div className="price-filter" style={{ minWidth: "250px", flex: "1" }}>
            <label htmlFor="priceRange">Precio máximo:</label>
            <Slider
              id="priceRange"
              min={0}
              max={1000}
              value={priceRange}
              onChange={(event, newValue) => setPriceRange(newValue)}
            />
            <div>
              Precio: {getCurrencySymbol(countries.find((c) => c.value === selectedCountry)?.currency)} {priceRange}
            </div>
          </div>
          <div className="rating-filter" style={{ minWidth: "150px", flex: "1" }}>
            <label>Valoración mínima:</label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`btn btn-sm ${rating === value ? "btn-warning" : "btn-outline-secondary"}`}
                  onClick={() => setRating(value)}
                  aria-label={`Filtrar por ${value} estrellas o más`}
                >
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < value ? "★" : "☆"}</span>
                  ))}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
