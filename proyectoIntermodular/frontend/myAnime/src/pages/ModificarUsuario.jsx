import { useState, useEffect } from "react";
import "../sesion.css";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../config";
import { MDBIcon } from "mdb-react-ui-kit";

function ModificarUsuario() {
  const idUsuario = useParams().idUsuario;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    biografia: "",
    rol: "",
    img_perfil: "",
  });

  const [imgUrl, setImgUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImgUrl(idUsuario ? `${apiUrl}/usuario/perfil/${idUsuario}` : null);
  }, [idUsuario, apiUrl]);

  // Calcular la fuente de la imagen
  const getDisplayImage = () => {
    const img = form.img_perfil;
    if (img && typeof img === "string" && img !== "") {
      return img.startsWith("data:") 
        ? img 
        : `data:image/jpeg;base64,${img}`;
    }
    // Si es un objeto (como un Buffer de Sequelize), no intentamos usar startsWith
    if (img && typeof img === "object" && img.type === "Buffer") {
      return imgUrl; // Preferimos usar la URL de la API para buffers
    }
    return imgUrl;
  };

  const displayImage = getDisplayImage();

  useEffect(() => {
    setImageError(false); // Resetear error cuando cambia la imagen
  }, [displayImage]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${apiUrl}/usuario/${idUsuario}`);
        const data = await res.json();
        if (data.ok) {
          setForm({
            nombre: data.datos.nombre || "",
            biografia: data.datos.biografia || "",
            rol: data.datos.rol || "",
            img_perfil: data.datos.img_perfil || "",
          });
        }
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err);
      }
    };
    if (idUsuario) fetchUserData();
  }, [idUsuario]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // Crear un canvas para redimensionar la imagen
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300; // Tamaño máximo para avatar
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Obtener el base64 comprimido
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 0.7 de calidad
          
          setForm({
            ...form,
            img_perfil: compressedBase64, // Guardamos la URL completa para la preview
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extraer solo la parte base64 para enviar al servidor si es una data URL nueva
    const imgDataToSend = form.img_perfil.includes("base64,") 
      ? form.img_perfil.split(",")[1] 
      : form.img_perfil;

    const res = await fetch(`${apiUrl}/usuario/${idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idUsuario: idUsuario,
        nombre: form.nombre,
        biografia: form.biografia,
        rol: form.rol,
        img_perfil: imgDataToSend
      }),
    });

    const data = await res.json();
    if (data.ok) {
      alert("Usuario modificado correctamente");
      navigate("/admin/usuarios", { replace: true });
    } else {
      alert("Error al modificar el usuario: " + data.mensaje);
    }
  };

  return (
    <div className="register-container" style={{ background: "white" }}>
      <div style={{ 
        width: "400px", 
        backgroundColor: "rgba(0, 0, 0, 0.05)", // Fondo muy sutil para que se vea blanco/transparente
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
        border: "1px solid #eee"
      }}>
        <h2 style={{ color: "#333", marginBottom: "25px" }}>Modificar Usuario</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            placeholder="Nombre"
            onChange={handleChange}
            style={{ backgroundColor: "#e3f2fd", color: "#333", border: "1px solid #bbdefb" }}
          />

          <input
            type="text"
            name="biografia"
            value={form.biografia}
            placeholder="Biografia"
            onChange={handleChange}
            style={{ backgroundColor: "#e3f2fd", color: "#333", border: "1px solid #bbdefb" }}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", margin: "15px 0" }}>
            <div 
              style={{ 
                width: "55px", 
                height: "55px", 
                minWidth: "55px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #4aa3ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#eee"
              }}
            >
              {displayImage && !imageError ? (
                <img
                  src={displayImage}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <MDBIcon fas icon="user" style={{ color: "#aaa", fontSize: "24px" }} />
              )}
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", color: "#333", fontSize: "14px", fontWeight: "600" }}>
                <input
                  type="radio"
                  name="rol"
                  value="cliente"
                  checked={form.rol === "cliente"}
                  onChange={handleChange}
                  style={{ width: "auto", margin: "0" }}
                />
                Cliente
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", color: "#333", fontSize: "14px", fontWeight: "600" }}>
                <input
                  type="radio"
                  name="rol"
                  value="administrador"
                  checked={form.rol === "administrador"}
                  onChange={handleChange}
                  style={{ width: "auto", margin: "0" }}
                />
                Admin
              </label>
            </div>
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ color: "#666", fontSize: "12px", marginBottom: "5px", display: "block", fontWeight: "500" }}>Cambiar imagen de perfil</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ 
                width: "100%", 
                padding: "8px", 
                fontSize: "12px",
                backgroundColor: "#e3f2fd",
                color: "#333",
                border: "1px solid #bbdefb"
              }}
            />
          </div>

          <button type="submit" style={{ marginTop: "15px", width: "100%" }}>Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
}

export default ModificarUsuario;
