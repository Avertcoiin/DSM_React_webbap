import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Asegúrate de que la ruta sea correcta
import { useRoute } from "../context/RouteContext";

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
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary mb-4">Login</button>
        <button type="button" className="btn btn-secondary ms-2 mb-4" onClick={handleRegister}>Registrarse</button>
      </form>
    </div>
  );
}

export default Login;