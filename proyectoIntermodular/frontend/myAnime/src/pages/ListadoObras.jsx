import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn
} from "mdb-react-ui-kit";

function ListadoObras() {
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [placeholder, setPlaceholder] = useState("Buscar por nombre de obra...");
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setCargando(true);
    fetch(`${apiUrl}/obra`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setObras(data.datos || []);
        }
      })
      .catch((err) => console.error("Error al cargar obras:", err))
      .finally(() => setCargando(false));
  }, []);

  const handleDelete = async (idobra, nuevoEstado) => {
    try {
      const res = await fetch(`${apiUrl}/obra/${idobra}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idobra: idobra,
          estado: nuevoEstado
        })
      });

      if (res.ok) {
        // Actualizamos el estado local primero para que el cambio sea instantáneo
        setObras((prevObras) =>
          prevObras.map((o) => {
            const id = o.idobra || o.idObra;
            return id === idobra ? { ...o, estado: nuevoEstado } : o;
          })
        );
        alert(nuevoEstado === "eliminada" ? "Obra eliminada" : "Obra readmitida");
      } else {
        // Si no es ok, intentamos leer el mensaje de error si existe
        const data = await res.json().catch(() => ({ mensaje: "Error desconocido" }));
        alert("Error: " + (data.mensaje || "No se pudo actualizar la obra"));
      }
    } catch (error) {
      console.error("Error en handleDelete:", error);
      alert("Error de conexión al intentar actualizar la obra");
    }
  };

  const obrasFiltradas = obras.filter((obra) =>
    obra.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <MDBContainer className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Obras</h2>
        <MDBBtn color="secondary" onClick={() => navigate("/admin")}>
          Volver al Panel
        </MDBBtn>
      </div>

      <MDBTable align="middle" hover responsive>
        <MDBTableHead dark>
          <tr className="text-start">
            <th style={{ width: "100px" }}>ID</th>
            <th>Título</th>
            <th>Tipo</th>
            <th>Fecha de Creación</th>
            <th>Estudio</th>
            <th>Autor/es</th>
            <th>Estado</th>
            <th style={{ width: "250px" }}>
              <input
                type="text"
                className="form-control"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setPlaceholder("Escribe un título...")}
                onBlur={() => setPlaceholder("Buscar por título...")}
                style={{ backgroundColor: "white", border: "1px solid #ced4da" }}
              />
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {cargando ? (
            <tr>
              <td colSpan="8" className="text-center py-5">
                <h4>cargando obras...</h4>
              </td>
            </tr>
          ) : obrasFiltradas.length > 0 ? (
            obrasFiltradas.map((obra, index) => (
              <tr key={obra.idobra || obra.idObra || index} className="text-start">
                <td>{obra.idobra || obra.idObra}</td>
                <td>{obra.titulo}</td>
                <td>{obra.tipo}</td>
                <td>{obra.fechaCreacion}</td>
                <td>{obra.estudio || "sin estudio"}</td>
                <td>{obra.autores}</td>
                <td>{obra.estado === "eliminada" ? "eliminada" : obra.estado}</td>
                <td>
                  <div className="d-flex justify-content-start align-items-center gap-2 flex-nowrap">
                    <MDBBtn 
                      className="btn-info" 
                      size="sm"
                      onClick={() => navigate(`/admin/obras/modificar/${obra.idobra || obra.idObra}`)}
                    >
                      Modificar
                    </MDBBtn> 
                    {obra.estado === "eliminada" ? (
                      <MDBBtn onClick={() => handleDelete(obra.idobra || obra.idObra, "en emision")} size="sm" className="btn-success">
                        Readmitir
                      </MDBBtn>
                    ) : (
                      <MDBBtn onClick={() => handleDelete(obra.idobra || obra.idObra, "eliminada")} size="sm" className="btn-danger">
                        Eliminar
                      </MDBBtn>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr key="no-data">
              <td colSpan="8" className="text-start">
                No se encontraron obras
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
    </MDBContainer>
  );
}

export default ListadoObras;
