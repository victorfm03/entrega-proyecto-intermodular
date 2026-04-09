import { useState } from "react";
import "../sesion.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    nombre: "",
    contraseña: "",
    logeado: ""
  });
    
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        const res= await fetch("http://localhost:3000/api/usuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: form.email,
                nombre: form.username,
                contraseña: form.password,
                logeado: 0
            })
        });

        const data = await res.json();
        if (data.ok){
            alert("Usuario registrado correctamente");

            localStorage.setItem("token", "usuario_logeado");
            localStorage.setItem("user", JSON.stringify(data.data));
            localStorage.setItem("idUsuario", data.datos.idUsuario);

            

            navigate("/", { replace: true });
        }else{
            alert("Error al registrar el usuario: "+data.mensaje);
        }
    };

    return (
        <div className="register-container">
            <h2>Registrate en myAnime</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                />

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
}

export default Register;