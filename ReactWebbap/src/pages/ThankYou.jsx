// src/pages/ThankYou.jsx

import { useNavigate } from 'react-router-dom';

function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="thank-you text-center mt-5">
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido realizado con éxito.</p>
      <button className="btn btn-success btn-lg mt-3" onClick={() => navigate("/")}>
        REALIZAR UN NUEVO PEDIDO
      </button>
    </div>
  );
}

export default ThankYou;

