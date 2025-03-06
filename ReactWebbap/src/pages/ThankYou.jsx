import { useNavigate } from 'react-router-dom';

function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="thank-you text-center d-flex flex-column justify-content-center align-items-center">
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido realizado con éxito.</p>
      
      <div className="d-flex gap-3 mt-3 mb-5">
        <button className="btn btn-success btn-lg" onClick={() => navigate("/")}>
          REALIZAR UN NUEVO PEDIDO
        </button>
        
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/orders")}>
          VER PEDIDOS
        </button>
      </div>
    </div>
  );
}

export default ThankYou;
