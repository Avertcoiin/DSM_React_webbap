import Home from './pages/Home'; // Página principal
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';
import OrderConfirm from './pages/OrderConfirm'; // Importa la nueva página de confirmación
import Formulario from './pages/Formulario';
import ThankYou from './pages/ThankYou';
import { CartProvider } from './context/CartContext'; // Importa el CartProvider
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <CartProvider>
      <div className='d-flex flex-column min-vh-100'>
        <Header />
        <div className = "flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order-confirm" element={<OrderConfirm />} /> {/* Ruta para OrderConfirm */}
            <Route path="/formulario" element={<Formulario />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
