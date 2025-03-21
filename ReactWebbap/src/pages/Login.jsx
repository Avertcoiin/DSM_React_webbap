import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Asegúrate de que la ruta sea correcta
import { useRoute } from "../context/RouteContext";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import logo from "../assets/logo_invert.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { desiredRoute, setDesiredRoute } = useRoute();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(desiredRoute || "/");
      setDesiredRoute(null); // Limpiar la ruta deseada después de redirigir
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    navigate("/Register"); // Redirige al usuario a la página de registro
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
          <h4 className="mt-3">Inicia sesión en tu cuenta</h4>
        </div>

        <form onSubmit={handleLogin}>
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

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="text-center mb-4">
            <MDBBtn className="w-100">Iniciar sesión</MDBBtn>
          </div>
        </form>

        <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
          <p className="mb-0">¿No tienes cuenta?</p>
          <MDBBtn outline color="success" className="mx-2" onClick={handleRegister}>
            Regístrate
          </MDBBtn>
        </div>
      </div>
    </MDBContainer>
  );
}

export default Login;
