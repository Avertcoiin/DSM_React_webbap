import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'; // Asegúrate de que esta importación esté correcta
import { useNavigate } from 'react-router-dom'; // Para la navegación
import { db, auth } from '../firebase'; // Importa la instancia de la base de datos
import { ref, set, push, get, update } from "firebase/database"; // Importa las funciones de Firebase
import { onAuthStateChanged } from 'firebase/auth';

function OrderForm() {
    const navigate = useNavigate(); // Hook para manejar la navegación
    const { cartItems, getTotalPrice, clearCart, removeFromCart, addToCart } = useCart();
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [selectedItem, setSelectedItem] = useState(null); // Producto que tiene el problema de stock
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        correo: '',
        tarjeta: '',
        cvv: '',
        direccion: ''
    });

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

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    
        // Comprobar que el carrito no tiene productos con cantidades superiores al stock
        let stockExcedido = false;
        let mensajeError = '';
    
        // Crear un array de promesas para las validaciones de stock
        const stockChecks = cartItems.map(item => {
            const productRef = ref(db, `productos/${item.id}/uds`); // Referencia al stock del producto
            return get(productRef).then(snapshot => {
                if (snapshot.exists()) {
                    const stockActual = snapshot.val();
                    if (item.cantidad > stockActual) {
                        stockExcedido = true;
                        mensajeError = `El producto "${item.nombre}" tiene una cantidad superior al stock disponible. Solo hay ${stockActual} unidades disponibles.`;
                        setSelectedItem({ ...item, stock: stockActual }); // Guardamos el producto con el stock
                    }
                }
            });
        });
    
        // Esperar que todas las validaciones de stock terminen antes de continuar
        Promise.all(stockChecks)
            .then(() => {
                // Si alguna cantidad excede el stock, mostramos el mensaje y no procedemos con la compra
                if (stockExcedido) {
                    setShowModal(true); // Activa el modal
                    return; // Evita proceder con el resto del código
                }
    
                // Eliminar los datos sensibles antes de subir a Firebase
                const { tarjeta, cvv, ...formDataWithoutSensitive } = formData;
    
                // Obtener los detalles de la compra
                const itemsDetails = cartItems.map(item => ({
                    id: item.id,
                    cantidad: item.cantidad,
                    precio: item.precio,
                    nombre: item.nombre,
                    archivo: item.archivo
                }));
    
                // Calcular el tiempo de envío máximo
                const maxTiempoEnvio = Math.max(...cartItems.map(item => item.tiempoEnv));
    
                // Crear el objeto de la orden
                const orderData = {
                    ...formDataWithoutSensitive,
                    userId: userid, // ID del usuario
                    items: itemsDetails, // Productos comprados
                    totalPrice: getTotalPrice(), // Precio total de la compra
                    tiempoEnvio: maxTiempoEnvio, // Tiempo máximo de entrega
                    timestamp: new Date().toISOString(), // Fecha de la compra
                };
    
                // Subir la orden a Firebase
                const orderRef = ref(db, 'orders'); // Define el path donde se almacenarán los datos
                const newOrderRef = push(orderRef); // Crea una nueva referencia única para la orden
    
                set(newOrderRef, orderData) // Sube los datos de la orden a Firebase
                    .then(() => {
                        // Ahora actualizamos las unidades de los productos en la base de datos
                        const updates = [];
    
                        // Recorremos los productos del carrito y actualizamos el stock
                        cartItems.forEach(item => {
                            const productRef = ref(db, `productos/${item.id}/uds`);
                            get(productRef).then(snapshot => {
                                if (snapshot.exists()) {
                                    const stockActual = snapshot.val();
                                    // Si la cantidad es mayor que el stock disponible, actualizamos el stock
                                    if (item.cantidad <= stockActual) {
                                        const newStock = stockActual - item.cantidad;
                                        updates.push({
                                            path: `productos/${item.id}/uds`,
                                            value: newStock
                                        });
                                    }
                                }
                            });
                        });
    
                        // Esperar a que todas las promesas de actualizaciones de stock se resuelvan
                        return Promise.all(updates.map(update => updateProductStock(update)));
                    })
                    .then(() => {
                        // Vaciamos el carrito después de que el stock ha sido actualizado
                        clearCart(); // Borra el carrito
                        navigate('/thank-you'); // Redirige al usuario a la página de agradecimiento
                    })
                    .catch((error) => {
                        // Manejar errores, si ocurren
                        console.error("Error al subir la orden o actualizar el stock:", error);
                    });
            })
            .catch((error) => {
                // Manejar cualquier error en las promesas de validación
                console.error("Error en las verificaciones de stock:", error);
            });
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
