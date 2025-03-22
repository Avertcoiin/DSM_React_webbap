// src/components/ui/Footer.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 text-start">
                        <h5>Asistencia</h5>
                        <ul className="list-unstyled">
                            <li>FAQ</li>
                            <li>Soporte Técnico</li>
                            <li>Guías</li>
                        </ul>
                    </div>
                    <div className="col-md-4 text-start">
                        <h5>Empresa</h5>
                        <ul className="list-unstyled">
                            <li>Sobre Nosotros</li>
                            <li>Trabaja con Nosotros</li>
                            <li>Blog</li>
                        </ul>
                    </div>
                    <div className="col-md-4 text-start">
                        <h5>Contacto/Redes</h5>
                        <ul className="list-unstyled">
                            <li>Email</li>
                            <li>Facebook</li>
                            <li>Twitter</li>
                        </ul>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 text-center py-3">
                        <p>&copy; 2025 - all reserved rights</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
