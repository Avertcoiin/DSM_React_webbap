// src/context/ConversionContext.js

import React, { createContext, useState, useContext } from "react";

// Creamos el contexto para la conversión de moneda
const ConversionContext = createContext();

// Hook para acceder al contexto
export const useConversion = () => useContext(ConversionContext);

// Proveedor del contexto
export const ConversionProvider = ({ children }) => {
  // Estado para almacenar el símbolo de la moneda y el factor de conversión
  const [currencySymbol, setCurrencySymbol] = useState("€");
  const [conversionRate, setConversionRate] = useState(1);

  // Función para actualizar los valores del contexto
  const updateConversion = (currency, rate) => {
    const symbols = {
      EUR: "€",
      USD: "$",
      GBP: "£",
      CAD: "C$",
    };
    setCurrencySymbol(symbols[currency] || "€"); // Actualizamos el símbolo de la moneda
    setConversionRate(rate); // Actualizamos el factor de conversión
  };

  return (
    <ConversionContext.Provider value={{ currencySymbol, conversionRate, updateConversion }}>
      {children}
    </ConversionContext.Provider>
  );
};
