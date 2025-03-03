// src/pages/ThankYou.jsx

import { Link } from 'react-router-dom'

function ThankYou() {
  return (
    <div className="thank-you">
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido realizado con éxito.</p>
      <Link to="/">
        <button>REALIZAR UN NUEVO PEDIDO</button>
      </Link>
    </div>
  )
}

export default ThankYou
