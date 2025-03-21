// src/components/Conversion.jsx
import { useState, useEffect } from "react";
import axios from "axios";

// API URL de Exchange API
const API_URL = "https://api.exchangerate-api.com/v4/latest/EUR"; // Tasa base EUR

function Conversion() {
  const [rates, setRates] = useState({});  // Inicializamos rates como objeto vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Realizamos una solicitud a la API para obtener las tasas de cambio
        const response = await axios.get(API_URL);
        
        // Almacenamos las tasas de cambio en el estado
        setRates(response.data.rates);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchRates();
  }, []);  // Solo se ejecuta una vez cuando el componente se monta

  return { rates, loading, error };
}

export default Conversion;
