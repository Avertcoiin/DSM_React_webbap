import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Página principal
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';
import OrderConfirm from './pages/OrderConfirm'; // Importa la nueva página de confirmación
import { CartProvider } from './context/CartContext'; // Importa el CartProvider

function App() {
  return (
    <CartProvider>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order-confirm" element={<OrderConfirm />} /> {/* Ruta para OrderConfirm */}
        </Routes>
        <Footer />
      </div>
    </CartProvider>
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
