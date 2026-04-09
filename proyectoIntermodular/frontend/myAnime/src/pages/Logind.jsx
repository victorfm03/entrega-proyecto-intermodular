import { useState } from "react";
import "../sesion.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/usuario/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: form.email,
        contraseña: form.password
      })
    });

    const data = await res.json();

    if (data.ok) {

      // guardar token
      localStorage.setItem("token", data.token);

      localStorage.setItem("idUsuario", data.datos.idUsuario);
      alert("Login correcto");


      // redirigir a home
      navigate("/", { replace: true });

      setTimeout(() => {
        window.location.reload();
      }, 100);

    } else {
      alert("Error: " + data.mensaje);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">Login</button>

      </form>
    </div>
  );
}

export default Login;