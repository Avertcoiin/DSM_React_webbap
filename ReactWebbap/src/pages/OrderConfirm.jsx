// src/pages/OrderConfirm.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext"; // Importamos el contexto del carrito
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Asegúrate de que la ruta sea correcta
import { ref, get } from "firebase/database"; // Importamos get() para obtener datos de Firebase
import { useConversion } from "../context/ConversionContext"; // Asegúrate de importar el hook del contexto

function OrderConfirm() {
  const { cartItems, getTotalPrice, clearCart } = useCart(); // Obtenemos los productos del carrito, el precio total y la función para borrar
  const navigate = useNavigate();
  const [stockAvailability, setStockAvailability] = useState({}); // Estado para almacenar la disponibilidad de stock
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar los mensajes de error
  const { conversionRate, currencySymbol } = useConversion(); // Obtener el rate de conversión y símbolo

  // Función para obtener el tiempo estimado de envío
  const getEstimatedShippingTime = () => {
    const maxShippingTime = Math.max(...cartItems.map(item => item.tiempoEnv));
    return maxShippingTime;
  };

  // Función para calcular la fecha estimada de entrega
  const getEstimatedDeliveryDate = () => {
    const estimatedShippingTime = getEstimatedShippingTime(); // Obtener el tiempo estimado
    const today = new Date(); // Obtener la fecha actual
    today.setDate(today.getDate() + estimatedShippingTime); // Sumamos los días de envío a la fecha actual

    // Obtener el día y el mes
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'long' }); // Obtener el nombre del mes

    return `${day} de ${month}`; // Devolver la fecha en el formato "15 de marzo"
  };

  // Filtrar los productos con cantidad mayor a 0
  const filteredCartItems = cartItems.filter(item => item.cantidad > 0);

  // Función para obtener el precio convertido
  const getConvertedPrice = (price) => {
    return price * conversionRate; // Multiplicamos el precio por la tasa de conversión
  };

  // Función para comprobar la disponibilidad del stock
  const checkStockAvailability = async () => {
    const stockData = {};
    let hasError = false; // Variable para verificar si hay un error

    for (const item of filteredCartItems) {
      const productRef = ref(db, `productos/${item.id}/uds`); // Obtener el stock disponible del producto
      const snapshot = await get(productRef);
      if (snapshot.exists()) {
        const stock = snapshot.val();
        if (item.cantidad > stock) {
          console.error(`Error: La cantidad solicitada de ${item.nombre} excede el stock disponible. Stock disponible: ${stock}, solicitado: ${item.cantidad}`);
          hasError = true; // Si hay un error, lo marcamos
          setErrorMessage(`La cantidad de "${item.nombre}" solicitada excede el stock disponible. Solo quedan ${stock} unidades.`); // Actualizamos el mensaje de error
        } else {
          stockData[item.id] = { available: true }; // Si está disponible, lo marcamos
        }
      } else {
        console.error(`Error: No se encontró el producto con ID ${item.id} en la base de datos.`);
        hasError = true; // Si no se encuentra el producto, lo marcamos como error
        setErrorMessage("Uno o más productos no se encontraron en la base de datos.");
      }
    }

    if (!hasError) {
      setStockAvailability(stockData); // Si no hubo errores, actualizamos la disponibilidad
    }
  };

  useEffect(() => {
    checkStockAvailability(); // Llamamos a la función para comprobar el stock cuando el carrito cambia
  }, [cartItems]); // Ejecutamos cuando el carrito cambie

  const continuarPedido = () => {
    // Verificamos si todos los productos tienen stock disponible antes de continuar
    const allAvailable = Object.values(stockAvailability).every(stock => stock.available);
    if (allAvailable) {
      setErrorMessage(""); // Limpiamos el mensaje de error
      navigate("/formulario"); // Redirige al usuario a la página de confirmación de pedido
    } else {
      console.log("No puedes continuar con el pedido debido a la falta de stock.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Confirmación de Pedido</h2>

      {/* Si el carrito está vacío */}
      {filteredCartItems.length === 0 ? (
        <div className="d-flex flex-column align-items-center">
          <p className="text-center">No tienes productos en tu carrito.</p>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
            Atrás
          </button>
        </div>
      ) : (
        <div className="row">
          {/* Columna de la izquierda (productos) */}
          <div className="col-md-8">
            <div className="row">
              {filteredCartItems.map((item) => (
                <div key={item.id} className="col-12 mb-4">
                  <div className="card d-flex flex-row p-3">
                    {/* Imagen del producto */}
                    <div className="card-img-container" style={{ flex: 1 }}>
                      <img
                        src={item.archivo} // Usamos la propiedad archivo directamente para obtener la imagen
                        className="img-fluid"
                        alt={item.nombre}
                        style={{ width: '35%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Contenido del producto */}
                    <div className="card-body d-flex flex-column justify-content-between" style={{ flex: 2 }}>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        {/* Nombre del producto a la izquierda */}
                        <h5 className="mb-0">{item.nombre}</h5>
                        {/* Precio del producto a la derecha */}
                        <p className="fw-bold fs-5 mb-0">{currencySymbol}{getConvertedPrice(item.precio).toFixed(2)}</p>
                      </div>
                      <p className="mb-0">Cantidad: {item.cantidad}</p>

                      {/* Unidades disponibles (uds) */}
                      <div className="d-flex justify-content-between mt-2">
                        <span>
                          {item.uds <= 10
                            ? <span className="text-danger">Solo quedan {item.uds} unidades</span>
                            : <span className="text-success">En stock</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna de la derecha (resumen de pedido + botones) */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Resumen de Pedido</h5>
                <ul className="list-group">
                  {cartItems.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between">
                      <span>{item.nombre}</span>
                      <span>{currencySymbol}{getConvertedPrice(item.precio * item.cantidad).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                {/* Total del carrito */}
                <div className="mt-3 text-right">
                  <h4 className="fw-bold">Total: {currencySymbol}{getConvertedPrice(getTotalPrice()).toFixed(2)}</h4>
                </div>

                {/* Mostrar la fecha estimada de entrega */}
                <div className="mt-3">
                  <p className="fst-italic fs-6">
                    Tu pedido llegará el {getEstimatedDeliveryDate()}.
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="d-flex flex-column mt-3">
                  <button className="btn btn-success btn-lg mb-2" onClick={continuarPedido}>CONTINUAR</button>
                  <button className="btn btn-danger btn-lg" onClick={clearCart}>BORRAR PEDIDO</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Final */}
      <div className="text-right mt-4">
        <h3 className="fw-bold">Total del Pedido: {currencySymbol}{getConvertedPrice(getTotalPrice()).toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default OrderConfirm;
