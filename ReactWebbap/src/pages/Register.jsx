import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Asegúrate de que la ruta sea correcta
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import logo from "../assets/logo_invert.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirige al usuario a la página de inicio después del registro
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}
    >
      <div
        className="p-4 rounded shadow"
        style={{
          width: "33%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div className="text-center mb-4">
          <img src={logo} style={{ width: '150px' }} alt="logo" />
          <h4 className="mt-3">Regístrate en nuestra plataforma</h4>
        </div>

        <form onSubmit={handleRegister}>
          <MDBInput
            wrapperClass="mb-4"
            label="Dirección de correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="text-center mb-4">
            <MDBBtn className="w-100">Regístrate</MDBBtn>
          </div>
        </form>
      </div>
    </MDBContainer>
  );
}

export default Register;
