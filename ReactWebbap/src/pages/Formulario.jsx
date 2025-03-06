// src/pages/OrderConfirm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para la navegación
import {db} from '../firebase'; // Importa la instancia de la base de datos

function OrderForm() {
    const navigate = useNavigate(); // Hook para manejar la navegación
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        correo: '',
        tarjeta: '',
        cvv: '',
        direccion: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita el comportamiento predeterminado del formulario
        console.log('Datos enviados:', formData);

        // Redirige al usuario a la página de agradecimiento
        navigate('/thank-you');
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
        </div>
    );
}

export default OrderForm;
