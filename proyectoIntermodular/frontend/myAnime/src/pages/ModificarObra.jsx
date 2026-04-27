import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MDBContainer,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import { apiUrl } from "../config";
import "../DetalleObra.css";

function ModificarObra() {
  const { idObra } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [tipoLocal, setTipoLocal] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    sinopsis: "",
    genero: "",
    fechalanzamiento: "",
    estudio: "",
    autor: "",
    portada: "",
    estado: "proximamente",
    trailer: "",
  });

  useEffect(() => {
    const fetchObra = async () => {
      try {
        const res = await fetch(`${apiUrl}/obra/${idObra}`);
        const data = await res.json();
        const obraData = data.datos || data;

        if (obraData) {
          // Obtener la imagen y convertirla a base64
          let base64Image = "";
          try {
            const imgRes = await fetch(`${apiUrl}/obra/${idObra}/imagen`);
            if (imgRes.ok) {
              const blob = await imgRes.blob();
              base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            }
          } catch (imgErr) {
            console.error("Error al cargar la imagen:", imgErr);
          }

          setForm({
            titulo: obraData.titulo || "",
            sinopsis: obraData.sinopsis || "",
            genero: obraData.genero || "",
            fechalanzamiento: obraData.fechalanzamiento || obraData.fechaCreacion || "",
            estudio: obraData.estudio || "",
            autor: obraData.autor || obraData.autores || "",
            portada: base64Image,
            estado: obraData.estado || "proximamente",
            trailer: obraData.trailer || obraData.trailer_url || "",
            puntuacion: obraData.puntuacion || "",
            popularidad: obraData.popularidad || "",
          });
          setTipoLocal(obraData.tipo);
        }
      } catch (err) {
        console.error("Error al cargar la obra:", err);
        alert("Error al cargar los datos de la obra");
      }
    };

    fetchObra();
  }, [idObra]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          portada: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.portada) {
      alert("La portada es obligatoria");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/obra/${idObra}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          idobra: idObra,
          tipo: tipoLocal,
          puntuacion: form.puntuacion || null,
          popularidad: form.popularidad || null,
        }),
      });

      if (res.ok) {
        alert(
          `${tipoLocal.charAt(0).toUpperCase() + tipoLocal.slice(1)} actualizado correctamente`,
        );
        navigate("/admin/obras");
      } else {
        const data = await res.json().catch(() => ({ mensaje: "Error desconocido" }));
        alert("Error al actualizar la obra: " + (data.mensaje || "No se pudo actualizar la obra"));
      }
    } catch (err) {
      console.error("Error al actualizar obra:", err);
      alert("Error al conectar con el servidor");
    }
  };

  const borderlessStyle = {
    border: "none",
    borderBottom: "1px solid transparent",
    padding: "5px 0",
    backgroundColor: "transparent",
    outline: "none",
    width: "100%",
    boxShadow: "none",
  };

  return (
    <MDBContainer className="detalle-container my-5">
      <div className="detalle-header">
        {/* Sección de Portada */}
        <div
          className="detalle-portada d-flex flex-column align-items-center justify-content-center border"
          onClick={() => fileInputRef.current.click()}
          style={{
            cursor: "pointer",
            minHeight: "400px",
            backgroundColor: "#f8f9fa",
            borderStyle: "dashed !important",
            borderWidth: "2px !important",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {form.portada ? (
            <img
              src={form.portada}
              alt="Portada"
              className="w-100 h-100"
              style={{
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          ) : (
            <div className="text-center text-muted">
              <MDBIcon fas icon="plus" size="3x" className="mb-2" />
              <p className="mb-0 fw-bold">añadir imagen</p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="d-none"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {/* Sección de Información Principal */}
        <div className="detalle-info">
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="mb-4"
            style={{
              ...borderlessStyle,
              fontSize: "2.4rem",
              fontWeight: "700",
              color: "#1e1e1e",
            }}
            required
            placeholder="Añadir título"
          />

          <div className="mb-3">
            <div className="d-flex align-items-center flex-wrap">
              <span className="text-muted">
                Tipo: <strong>{tipoLocal}</strong>
              </span>
              <span className="text-muted mx-2">|</span>
              <span className="text-muted me-1">Género:</span>
              <input
                type="text"
                name="genero"
                value={form.genero}
                onChange={handleChange}
                style={{
                  ...borderlessStyle,
                  fontWeight: "600",
                  color: "#222",
                  width: "auto",
                  flex: "1",
                  minWidth: "150px",
                }}
                required
                placeholder="Añadir género"
              />
            </div>
          </div>

          {tipoLocal === "anime" ? (
            <div className="mb-2 d-flex align-items-center">
              <span className="text-muted me-2">
                <strong> Estudio:</strong>
              </span>
              <input
                type="text"
                name="estudio"
                value={form.estudio}
                onChange={handleChange}
                style={{ ...borderlessStyle, color: "#555" }}
                placeholder="Añadir Estudio de animación"
              />
            </div>
          ) : (
            <div className="mb-3 d-flex align-items-center">
              <span className="text-muted me-2">
                <strong>Autor:</strong>
              </span>
              <input
                type="text"
                name="autor"
                value={form.autor}
                onChange={handleChange}
                style={{ ...borderlessStyle, color: "#555" }}
                placeholder="Añadir autor"
              />
            </div>
          )}

          <div className="mb-3 d-flex align-items-start">
            <span className="text-muted me-2 mt-1">
              <strong>Sinopsis:</strong>
            </span>
            <textarea
              name="sinopsis"
              value={form.sinopsis}
              onChange={handleChange}
              rows={8}
              className="flex-grow-1"
              style={{
                ...borderlessStyle,
                color: "#555",
                lineHeight: "1.7",
                resize: "none",
                marginTop: "0",
                paddingTop: "0"
              }}
              placeholder="Añadir sinopsis"
            />
          </div>
        </div>
      </div>

      {/* Otras secciones (Estilo DetalleObra) */}
      <div className="mt-5">
        <MDBRow>
          
          <MDBCol md="4">
            <div className="mb-4">
              <label className="text-muted mb-1 d-block">Estado</label>
              <select
                className="form-select"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                required
              >
                <option value="proximamente">Próximamente</option>
                <option value="en emision">En emisión</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
                <option value="pausado">Pausado</option>
              </select>
            </div>
          </MDBCol>
          {tipoLocal === "anime" && (
            <MDBCol md="4">
              <div className="mb-4">
                <label className="text-muted mb-1 d-block">URL Trailer</label>
                <input
                  type="text"
                  name="trailer"
                  value={form.trailer}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Añadir URL trailer"
                />
              </div>
            </MDBCol>
          )}
        </MDBRow>

      </div>

      <div className="d-flex justify-content-end mt-4">
        <MDBBtn
          type="button"
          color="secondary"
          className="me-2"
          onClick={() => navigate("/admin/obras")}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn type="submit" color="primary" onClick={handleSubmit}>
          Actualizar {tipoLocal}
        </MDBBtn>
      </div>
    </MDBContainer>
  );
}

export default ModificarObra;
