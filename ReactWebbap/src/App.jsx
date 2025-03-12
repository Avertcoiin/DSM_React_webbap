import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Página principal
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';
import OrderConfirm from './pages/OrderConfirm'; // Importa la nueva página de confirmación
import Formulario from './pages/Formulario';
import ThankYou from './pages/ThankYou';
import Login from './pages/Login'; // Importa la nueva página de Login
import { CartProvider } from './context/CartContext'; // Importa el CartProvider
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <CartProvider>
      <div className='d-flex flex-column min-vh-100'>
        <Header />
        <div className = "flex-grow-1 pt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order-confirm" element={<OrderConfirm />} /> {/* Ruta para OrderConfirm */}
            <Route path="/formulario" element={<Formulario />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path='/Login' element={<Login />} />
          </Routes>
        </div>
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
