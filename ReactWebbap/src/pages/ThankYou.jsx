// src/pages/ThankYou.jsx

import { useNavigate } from 'react-router-dom';

function ThankYou() {

  const navigate = useNavigate();

  return (
    <div className="thank-you">
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido realizado con éxito.</p>
      <button className="btn btn-success btn-lg mb-2" onClick={navigate("/")}>REALIZAR UN NUEVO PEDIDO</button>
    </div>
  )
}

export default ThankYou
