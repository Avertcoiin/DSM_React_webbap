import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase"; // Asegúrate de que la ruta sea correcta
import { ref, onValue, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [userId, setUserid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Estado para controlar el despliegue

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
    if (userId) {
      const ordersRef = ref(db, 'orders');
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ordersList = Object.keys(data)
            .map(key => ({
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

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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
                <div className="d-flex justify-content-between align-items-center">
                  <span>{new Date(order.timestamp).toLocaleString()}</span>
                  <span>{order.totalPrice}€</span>
                  <button
                    className="btn btn-link"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {expandedOrderId === order.id ? "Ocultar" : "Mostrar"} detalles
                  </button>
                </div>
                <div className="mt-3">
                  <h6>Productos:</h6>
                  <ul className="list-group">
                  {order.items.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          <img src={item.archivo} alt={item.nombre} className="img-thumbnail" style={{ width: '50px', height: '50px' }} />
                          <span>{item.nombre}</span>
                          <span>{item.cantidad} x {item.precio}€</span>
                        </li>
                      ))}
                    </ul>
                </div>

                {expandedOrderId === order.id && (
                  <div className="mt-3">
                    <p>Nombre: {order.nombre}</p>
                    <p>Apellidos: {order.apellidos}</p>
                    <p>Teléfono: {order.telefono}</p>
                    <p>Correo: {order.correo}</p>
                    <p>Dirección: {order.direccion}</p>
                    <button
                      className="btn btn-danger mt-3"
                      onClick={() => handleDelete(order.id)}
                    >
                      Borrar Pedido
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas borrar este pedido?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Pedidos;