// src/pages/Orders.jsx

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Suponiendo que la URL de Firebase almacena los pedidos
    axios.get('https://dsm-react-clase-2025-default-rtdb.europe-west1.firebasedatabase.app/orders.json')
      .then((response) => {
        const ordersArray = []
        for (let key in response.data) {
          ordersArray.push({
            id: key,
            ...response.data[key]
          })
        }
        setOrders(ordersArray)
      })
      .catch((error) => {
        console.log('¡Error al obtener los pedidos!')
      })
  }, [])

  return (
    <div className="orders">
      <h2>Mis Pedidos</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No tienes pedidos realizados.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <h3>Pedido #{order.id}</h3>
              <p>Total: {order.total}€</p>
              <Link to={`/order/${order.id}`}>
                <button>Ver detalles</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
