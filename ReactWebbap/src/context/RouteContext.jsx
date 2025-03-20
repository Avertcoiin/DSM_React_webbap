import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [desiredRoute, setDesiredRoute] = useState(null);

  return (
    <RouteContext.Provider value={{ desiredRoute, setDesiredRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

RouteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useRoute = () => useContext(RouteContext);