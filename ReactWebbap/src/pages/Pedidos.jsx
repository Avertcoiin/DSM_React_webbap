import React, { useEffect, useState } from "react";
import { db,auth } from "../firebase"; // Asegúrate de que la ruta sea correcta
import { ref, onValue, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import {modal, Button} from 'react-bootstrap';

function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [userId, setUserid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserid(user.uid); // Guarda la ID del usuario en el estado
      } else {
        setUserid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if(userId){
      const ordersRef = ref(db, 'orders');
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ordersList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }))
          .filter(order => order.userId === userId); // Filtra los pedidos por la ID del usuario
          setOrders(ordersList);
        }
      });
    }
  }, [userId]);

  const handleDelete = (orderId) => {
    setOrderToDelete(orderId);
    setShowModal(true);
  };
  const confirmDelete = () => {
    if (orderToDelete) {
      const orderRef = ref(db, `orders/${orderToDelete}`);
      remove(orderRef)
        .then(() => {
          setOrders(orders.filter(order => order.id !== orderToDelete));
          setShowModal(false);
          setOrderToDelete(null);
        })
        .catch((error) => {
          console.error("Error al borrar el pedido: ", error);
        });
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Pedidos</h2>
      <div className="card p-4">
        {orders.length === 0 ? (
          <p>No hay pedidos disponibles.</p>
        ) : (
          <ul className="list-group">
            {orders.map(order => (
              <li key={order.id} className="list-group-item">
                <h5>Pedido ID: {order.id}</h5>
                <p>Nombre: {order.nombre}</p>
                <p>Apellidos: {order.apellidos}</p>
                <p>Teléfono: {order.telefono}</p>
                <p>Correo: {order.correo}</p>
                <p>Dirección: {order.direccion}</p>
                <p>Total: {order.totalPrice}€</p>
                <p>Fecha: {new Date(order.timestamp).toLocaleString()}</p>
                <h6>Productos:</h6>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.nombre} - {item.cantidad} x {item.precio}€
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-danger mt-3"
                  onClick={() => handleDelete(order.id)}
                >
                  Borrar Pedido
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Pedidos;