// src/context/SearchContext.js
import React, { createContext, useState, useContext } from 'react';

// Creamos el Contexto
const SearchContext = createContext();

// Creamos un Proveedor para envolver nuestra aplicación
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto más fácilmente
export const useSearch = () => {
  return useContext(SearchContext);
};
