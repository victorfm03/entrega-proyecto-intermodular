import { useState } from "react";
import "../sesion.css";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";

function RegisterAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
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

        try {
            const res = await fetch(`${apiUrl}/usuario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: form.email,
                    nombre: form.username,
                    contraseña: form.password,
                    rol: 'administrador' // Forzamos el rol de administrador
                })
            });

            const data = await res.json();
            if (data.ok){
                alert("Administrador creado correctamente");
                navigate("/admin"); // Volvemos al panel de admin
            } else {
                alert("Error al crear el administrador: " + data.mensaje);
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("Error al conectar con el servidor");
        }
    };

    return (
        <div className="register-container">
            <h2>Añade un nuevo usuario Administrador</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    required
                />

                <button type="submit">Crear Admin</button>
                <button type="button" onClick={() => navigate("/admin")} style={{ marginTop: '10px', backgroundColor: '#6c757d' }}>Cancelar</button>
            </form>
        </div>
    );
}

export default RegisterAdmin;
