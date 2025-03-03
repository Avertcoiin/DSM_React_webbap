// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importar BrowserRouter
import App from './App';
import './index.css'; // Si tienes un archivo de estilos
import 'bootstrap/dist/css/bootstrap.min.css';  // Importar los estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  
import 'bootstrap-icons/font/bootstrap-icons.css';

/* const addExternalResources = () => {
  // Agregar Google Fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css?family=Roboto|Open+Sans';
  document.head.appendChild(fontLink);

  // Agregar Font Awesome
  const faLink = document.createElement('link');
  faLink.rel = 'stylesheet';
  faLink.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
  document.head.appendChild(faLink);

  // Agregar jQuery (si lo necesitas)
  const jqueryScript = document.createElement('script');
  jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js';
  document.head.appendChild(jqueryScript);
};

addExternalResources(); */

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router> {/* Envolvemos la app completa en BrowserRouter */}
      <App />
    </Router>
  </React.StrictMode>
);


/* createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
) */

  