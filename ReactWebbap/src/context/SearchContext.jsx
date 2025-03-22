// src/context/SearchContext.js
import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [minRating, setMinRating] = useState(0);

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      minPrice,
      setMinPrice,
      maxPrice,
      setMaxPrice,
      minRating,
      setMinRating
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};
