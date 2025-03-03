// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Importa la página Home

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />  {/* Aquí manejas solo las rutas */}
    </Routes>
  );
}

export default App;

/* import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import Home from './pages/Home';
import OrderConfirm from './pages/OrderConfirm';
import Orders from './pages/Orders';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order-confirm" element={<OrderConfirm />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App; */
