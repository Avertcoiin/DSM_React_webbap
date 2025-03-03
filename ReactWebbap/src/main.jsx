// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importar BrowserRouter
import App from './App';
import './index.css'; // Si tienes un archivo de estilos
import 'bootstrap/dist/css/bootstrap.min.css';  // Importar los estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  
import 'bootstrap-icons/font/bootstrap-icons.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router> {/* Envolvemos la app completa en BrowserRouter */}
      <App />
    </Router>
  </React.StrictMode>
);
