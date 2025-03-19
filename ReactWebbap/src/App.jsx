// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Página principal
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';
import OrderConfirm from './pages/OrderConfirm'; // Importa la nueva página de confirmación
import Formulario from './pages/Formulario';
import ThankYou from './pages/ThankYou';
import Login from './pages/Login'; // Importa la nueva página de Login
import Pedidos from './pages/Pedidos.jsx'; // Importa la nueva página de Orders
import Register from './pages/Register'; // Importa la nueva página de Register
import BorrarUsuario from './pages/BorrarUsuario'; // Importa la nueva página de BorrarUsuario
import { CartProvider } from './context/CartContext'; // Importa el CartProvider
import { SearchProvider } from './context/SearchContext'; // Importa el SearchProvider
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <CartProvider>
      <SearchProvider>
        <div className='d-flex flex-column min-vh-100'>
          <Header />
          <div className="flex-grow-1 pt-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/order-confirm" element={<OrderConfirm />} />
              <Route path="/formulario" element={<Formulario />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path='/login' element={<Login />} />
              <Route path='/pedidos' element={<Pedidos />} />
              <Route path='/register' element={<Register />} />
              <Route path='/borrar-usuario' element={<BorrarUsuario />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </SearchProvider>
    </CartProvider>
  );
}

export default App;
