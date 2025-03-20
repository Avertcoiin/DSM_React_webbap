import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea el contexto
const OrderFormContext = createContext();

// Crea el proveedor de contexto
export const OrderFormProvider = ({ children }) => {
    const [formData, setFormData] = useState(() => {
        // Intenta recuperar datos guardados en localStorage
        const savedData = localStorage.getItem('orderFormData');
        return savedData ? JSON.parse(savedData) : {
            nombre: '',
            apellidos: '',
            telefono: '',
            correo: '',
            tarjeta: '',
            cvv: '',
            direccion: ''
        };
    });

    // Guardar en localStorage cada vez que el estado cambie
    useEffect(() => {
        localStorage.setItem('orderFormData', JSON.stringify(formData));
    }, [formData]);

    return (
        <OrderFormContext.Provider value={{ formData, setFormData }}>
            {children}
        </OrderFormContext.Provider>
    );
};

// Hook personalizado para acceder al contexto
export const useOrderForm = () => {
    return useContext(OrderFormContext);
};
