import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'; // Asegúrate de que esta importación esté correcta
import { useOrderForm } from '../context/OrderFormContext'; // Usa el contexto para el formulario
import { useNavigate } from 'react-router-dom'; // Para la navegación
import { db, auth } from '../firebase'; // Importa la instancia de la base de datos
import { ref, set, push, get, update } from "firebase/database"; // Importa las funciones de Firebase
import { onAuthStateChanged } from 'firebase/auth';

function OrderForm() {
    const navigate = useNavigate(); // Hook para manejar la navegación
    const { cartItems, getTotalPrice, clearCart, removeFromCart, addToCart } = useCart();
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [selectedItem, setSelectedItem] = useState(null); // Producto que tiene el problema de stock
    const { formData, setFormData } = useOrderForm();

    // capturar el id del usuario
    const [userid, setUserid] = useState(null);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Función para manejar las acciones del modal (reducir cantidad, eliminar producto, o aceptar)
    const handleModalAction = (action) => {
        if (action === 'remove' && selectedItem) {
            // Eliminar el producto del carrito
            removeFromCart(selectedItem.id);
        }

        setShowModal(false); // Cerrar el modal
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita el comportamiento predeterminado del formulario

        let stockExcedido = false;
        let mensajeError = '';

        // 1) Verificar stock antes de proceder
        for (const item of cartItems) {
            const productRef = ref(db, `productos/${item.id}/uds`);
            const snapshot = await get(productRef);
            if (snapshot.exists()) {
                const stockActual = snapshot.val();
                if (item.cantidad > stockActual) {
                    stockExcedido = true;
                    mensajeError = `El producto "${item.nombre}" tiene una cantidad superior al stock disponible. Solo hay ${stockActual} unidades disponibles.`;
                    setSelectedItem({ ...item, stock: stockActual });
                }
            }
        }

        if (stockExcedido) {
            setShowModal(true);
            return; // No continuar si hay problema de stock
        }

        try {
            // 2) Eliminar datos sensibles antes de subir a Firebase
            const { tarjeta, cvv, ...formDataWithoutSensitive } = formData;

            // 3) Obtener los detalles de la compra
            const itemsDetails = cartItems.map(item => ({
                id: item.id,
                cantidad: item.cantidad,
                precio: item.precio,
                nombre: item.nombre,
                archivo: item.archivo
            }));

            // 4) Calcular el tiempo de envío máximo
            const maxTiempoEnvio = Math.max(...cartItems.map(item => item.tiempoEnv));

            // 5) Crear el objeto de la orden
            const orderData = {
                ...formDataWithoutSensitive,
                userId: userid,
                items: itemsDetails,
                totalPrice: getTotalPrice(),
                tiempoEnvio: maxTiempoEnvio,
                timestamp: new Date().toISOString(),
            };

            // 6) Subir la orden a Firebase
            const orderRef = ref(db, 'orders');
            const newOrderRef = push(orderRef);
            await set(newOrderRef, orderData);

            // 7) Actualizar el stock de los productos
            const updates = {};
            for (const item of cartItems) {
                const productRef = ref(db, `productos/${item.id}/uds`);
                const snapshot = await get(productRef);
                if (snapshot.exists()) {
                    const stockActual = snapshot.val();
                    if (item.cantidad <= stockActual) {
                        updates[`productos/${item.id}/uds`] = stockActual - item.cantidad;
                    }
                }
            }

            // 8) Aplicar las actualizaciones en Firebase
            await update(ref(db), updates);

            // 9) Limpiar el localStorage y vaciar el carrito
            localStorage.removeItem('orderFormData');
            clearCart();
            navigate('/thank-you');

        } catch (error) {
            console.error("Error al procesar la compra:", error);
        }
    };


    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Datos Personales</h2>
            <div className="card p-4">
                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className="mb-3">
                        <label className="form-label">Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-control"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Apellidos */}
                    <div className="mb-3">
                        <label className="form-label">Apellido(s):</label>
                        <input
                            type="text"
                            name="apellidos"
                            className="form-control"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Teléfono */}
                    <div className="mb-3">
                        <label className="form-label">Nº Teléfono:</label>
                        <input
                            type="tel"
                            name="telefono"
                            className="form-control"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{9,}"
                            title="Introduce un número de teléfono válido"
                        />
                    </div>

                    {/* Correo Electrónico */}
                    <div className="mb-3">
                        <label className="form-label">Correo:</label>
                        <input
                            type="email"
                            name="correo"
                            className="form-control"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Tarjeta y CVV (misma fila) */}
                    <div className="row mb-3">
                        <div className="col-md-8">
                            <label className="form-label">Tarjeta bancaria:</label>
                            <input
                                type="text"
                                name="tarjeta"
                                className="form-control"
                                value={formData.tarjeta}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{16}"
                                title="Introduce un número de tarjeta válido (16 dígitos)"
                                placeholder="1234567890123456"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">CVV:</label>
                            <input
                                type="text"
                                name="cvv"
                                className="form-control"
                                value={formData.cvv}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{3}"
                                title="Introduce un CVV válido (3 dígitos)"
                                placeholder="123"
                            />
                        </div>
                    </div>

                    {/* Dirección de Envío */}
                    <div className="mb-3">
                        <label className="form-label">Dirección de envío:</label>
                        <textarea
                            name="direccion"
                            className="form-control"
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                            rows="3"
                        ></textarea>
                    </div>

                    {/* Botones de acción */}
                    <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
                            Atrás
                        </button>
                        <button type="submit" className="btn btn-success btn-lg">
                            Realizar Pedido
                        </button>
                    </div>
                </form>
            </div>
            {showModal && selectedItem && (
                <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">¡Problema con el Stock!</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>El producto "{selectedItem.nombre}" tiene una cantidad superior al stock disponible.</p>
                                <p>Solo hay {selectedItem.stock} unidades disponibles.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => handleModalAction('remove')}>
                                    Eliminar del carrito
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default OrderForm;
