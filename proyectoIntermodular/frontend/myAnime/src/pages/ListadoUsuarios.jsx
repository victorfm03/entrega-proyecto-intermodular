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

function ListadoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [placeholder, setPlaceholder] = useState("Buscar por nombre de usuario...");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/usuario`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUsuarios(data.datos || []);
        }
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  const handleDelete= async (idUsuario, bloqueado)=>{
    const res = await fetch(`${apiUrl}/usuario/${idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idUsuario: idUsuario,
        bloqueado: bloqueado
      })
    });
    const data = await res.json();
    if (data.ok) {
      alert(bloqueado ? "Usuario bloqueado" : "Usuario desbloqueado");
      setUsuarios(usuarios.map((u) => (u.idUsuario === idUsuario ? { ...u, bloqueado: bloqueado } : u)));
      
    } else {
      alert("Error: " + data.mensaje);
    }
  }

  const usuariosFiltrados = usuarios.filter((user) =>
    user.rol === "cliente" && 
    user.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <MDBContainer className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Clientes</h2>
        <MDBBtn color="secondary" onClick={() => navigate("/admin")}>
          Volver al Panel
        </MDBBtn>
      </div>

      <MDBTable align="middle" hover responsive>
        <MDBTableHead dark>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>
              <input
                type="text"
                className="form-control"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setPlaceholder("Escribe un nombre...")}
                onBlur={() => setPlaceholder("Buscar por nombre de usuario...")}
                style={{ backgroundColor: "white", border: "1px solid #ced4da" }}
              />
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {usuariosFiltrados.length > 0 ? (
            usuariosFiltrados.map((user) => (
              <tr key={user.idUsuario}>
                <td>{user.idUsuario}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td><MDBBtn className="btn-info mx-3" onClick={() => navigate(`/admin/usuarios/modificar/${user.idUsuario}`)}>Modificar</MDBBtn> 
                {user.bloqueado ? <MDBBtn onClick={() => handleDelete(user.idUsuario, false)} className="btn-success">desbloquear</MDBBtn> : <MDBBtn onClick={() => handleDelete(user.idUsuario, true)} className="btn-danger">bloquear</MDBBtn>}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No se encontraron clientes
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
    </MDBContainer>
  );
}

export default ListadoUsuarios;
