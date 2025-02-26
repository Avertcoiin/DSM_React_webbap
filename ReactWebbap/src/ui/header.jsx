import React from "react";
import "./header.css";

function Header() {
    return(
        <div className="header">
            <div className="row">
                <div className="col">
                    Logo
                </div>
                <div className="col">
                    Buscador
                </div>
                <div className="col">
                    Carrito
                </div>
                <div className="col">
                    Precio total
                </div>
                <div className="col">
                    sesion y
                    Inicio/pedidos 
                </div>
            </div>
        </div>
    )};

    export default Header;