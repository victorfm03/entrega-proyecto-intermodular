import React, { useEffect, useState } from "react";
import "../perfil.css";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBIcon
} from "mdb-react-ui-kit";

import EmailIcon from "@mui/icons-material/Email";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function Perfil() {

  const [user, setUser] = useState(null);
  const [basicActive, setBasicActive] = useState("anime");

  const handleBasicClick = (value) => {
    if (value === basicActive) return;
    setBasicActive(value);
  };

  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result.split(",")[1]; // extraer solo Base64

    // Actualizar estado para mostrar la imagen inmediatamente
    setUser({ ...user, img_perfil: base64 });

    // Enviar al backend
    try {
      const res = await fetch(
        `http://localhost:3000/api/usuario/${user.idUsuario}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...user, img_perfil: base64 }),
        }
      );
      const data = await res.json();
      if (!res.ok) console.error("Error al guardar imagen:", data.message);
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  reader.readAsDataURL(file);
};

  useEffect(() => {
    const fetchUser = async () => {

      const token = localStorage.getItem("token");
      const idUsuario = localStorage.getItem("idUsuario");

      if (!token) return;

      const res = await fetch("http://localhost:3000/api/usuario/" + idUsuario);

      const data = await res.json();

      if (data.ok) {
        setUser(data.datos);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <MDBContainer className="mt-5">

      {/* CARD PERFIL */}
      <MDBCard className="mb-4">
        <div
          style={{
            height: "200px",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1595271006365-10f6a04a5228')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>

        <MDBCardBody>

          <MDBRow>

{/* FOTO */}
<div className="perfil-img-wrapper">

  {user.img_perfil && typeof user.img_perfil === "string" ? (
    <img
      src={`data:image/jpeg;base64,${user.img_perfil}`}
      alt="avatar"
      className="perfil-img"
    />
  ) : (
    <div
      className="default-avatar"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#d9d9d9",
      }}
    >
      <MDBIcon fas icon="user" style={{ color: "#fff", fontSize: "20px" }} />
    </div>
  )}

  <div
    className="perfil-overlay"
    onClick={() => document.getElementById("fileInput").click()}
  >
    <span className="icono">📷</span>
  </div>

  <input
    type="file"
    id="fileInput"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handleImageChange}
  />
</div>

            {/* INFO */}
            <MDBCol md="9" style={{ marginLeft: "160px" }}>

              <h3>{user.nombre}</h3>
              <p className="text-muted">{user.biografia}</p>

              <div className="mt-3">

                <p>
                  <EmailIcon /> {user.email}
                </p>

                <p>
                  <InsertLinkIcon /> mariagonzalez.dev
                </p>

                <p>
                  <CalendarMonthIcon /> Miembro desde 2018
                </p>

              </div>

            </MDBCol>

          </MDBRow>

        </MDBCardBody>
      </MDBCard>

      {/* TABS */}
      <MDBCard>

        <MDBCardBody>

          <MDBTabs className="mb-3">

            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("anime")}
                active={basicActive === "anime"}
              >
                Lista de Anime
              </MDBTabsLink>
            </MDBTabsItem>

            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("manga")}
                active={basicActive === "manga"}
              >
                Lista de Manga
              </MDBTabsLink>
            </MDBTabsItem>

            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("quiz")}
                active={basicActive === "quiz"}
              >
                Quiz Récord
              </MDBTabsLink>
            </MDBTabsItem>

          </MDBTabs>

          <MDBTabsContent>

            <MDBTabsPane open={basicActive === "anime"}>
              <p>Aquí irá la lista de anime del usuario</p>
            </MDBTabsPane>

            <MDBTabsPane open={basicActive === "manga"}>
              <p>Aquí irá la lista de manga del usuario</p>
            </MDBTabsPane>

            <MDBTabsPane open={basicActive === "quiz"}>
              <h4>Mejor puntuación: {user.puntuacionquiz}</h4>
            </MDBTabsPane>

          </MDBTabsContent>

        </MDBCardBody>

      </MDBCard>

    </MDBContainer>
  );
}

export default Perfil;