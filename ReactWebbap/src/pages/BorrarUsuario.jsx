import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Asegúrate de que la ruta sea correcta
import { deleteUser } from "firebase/auth";
import { ref, remove, query, orderByChild, equalTo, get } from "firebase/database";
import { Modal, Button } from 'react-bootstrap'; // Importa los componentes Modal y Button de react-bootstrap

function BorrarUsuario() {
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const ordersRef = ref(db, 'orders');
          const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(user.uid));
          const snapshot = await get(userOrdersQuery);
          if (snapshot.exists()) {
            const orders = snapshot.val();
            const ordersArray = Object.values(orders);
            const lastOrder = ordersArray[ordersArray.length - 1];
            setUserInfo({
              email: user.email,
              totalOrders: ordersArray.length,
              lastOrder: lastOrder ? {
                nombre: lastOrder.nombre,
                apellidos: lastOrder.apellidos,
                telefono: lastOrder.telefono,
                direccion: lastOrder.direccion
              } : null
            });
          } else {
            setUserInfo({
              email: user.email,
              totalOrders: 0,
              lastOrder: null
            });
          }
        } catch (error) {
          setError(error.message);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Eliminar todos los pedidos del usuario
        const ordersRef = ref(db, 'orders');
        const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(user.uid));
        const snapshot = await get(userOrdersQuery);
        if (snapshot.exists()) {
          const orders = snapshot.val();
          for (const orderId in orders) {
            await remove(ref(db, `orders/${orderId}`));
          }
        }

        // Eliminar la cuenta del usuario
        await deleteUser(user);
        navigate("/"); // Redirige al usuario a la página de inicio después de borrar la cuenta
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("No hay ningún usuario autenticado.");
    }
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
  };

  const handleCloseModal = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="container mt-5">
      <h2>Borrar Cuenta</h2>
      {userInfo && (
        <div className="mb-4">
          <h5>Información del Usuario</h5>
          <ul className="list-group">
            <li className="list-group-item"><strong>Email:</strong> {userInfo.email}</li>
            <li className="list-group-item"><strong>Total de Pedidos:</strong> {userInfo.totalOrders}</li>
            {userInfo.lastOrder && (
              <>
                <li className="list-group-item"><strong>Nombre:</strong> {userInfo.lastOrder.nombre}</li>
                <li className="list-group-item"><strong>Apellidos:</strong> {userInfo.lastOrder.apellidos}</li>
                <li className="list-group-item"><strong>Teléfono:</strong> {userInfo.lastOrder.telefono}</li>
                <li className="list-group-item"><strong>Dirección:</strong> {userInfo.lastOrder.direccion}</li>
              </>
            )}
          </ul>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-danger mb-4" onClick={handleConfirmDelete}>
        Borrar Cuenta
      </button>

      <Modal show={confirmDelete} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Borrado de Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas borrar tu cuenta? Esta acción es irreversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Confirmar Borrado de Cuenta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BorrarUsuario;