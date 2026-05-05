import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import getTituloPorIdioma from "../utils/getTituloPorIdioma";
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
  MDBIcon,
} from "mdb-react-ui-kit";

import EmailIcon from "@mui/icons-material/Email";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { apiUrl } from "../config.js";

const translations = {
  es: {
    animeList: "Lista de Anime",
    mangaList: "Lista de Manga",
    quizRecord: "Quiz Récord",
    points: "puntos",
    noAnime: "No tienes animes favoritos aún",
    noManga: "No tienes mangas favoritos aún",
  },
  en: {
    animeList: "Anime List",
    mangaList: "Manga List",
    quizRecord: "Quiz Record",
    points: "points",
    noAnime: "You don't have favorite animes yet",
    noManga: "You don't have favorite mangas yet",
  },
  fr: {
    animeList: "Liste d'Anime",
    mangaList: "Liste de Manga",
    quizRecord: "Record du Quiz",
    points: "points",
    noAnime: "Vous n'avez pas encore d'animes favoris",
    noManga: "Vous n'avez pas encore de mangas favoris",
  },
  de: {
    animeList: "Anime-Liste",
    mangaList: "Manga-Liste",
    quizRecord: "Quiz-Rekord",
    points: "Punkte",
    noAnime: "Du hast noch keine Lieblingsanimes",
    noManga: "Du hast noch keine Lieblingsmangas",
  },
  pt: {
    animeList: "Lista de Anime",
    mangaList: "Lista de Manga",
    quizRecord: "Recorde do Quiz",
    points: "pontos",
    noAnime: "Você ainda no tem animes favoritos",
    noManga: "Você ainda não tem mangas favoritos",
  },
  ja: {
    animeList: "アニメリスト",
    mangaList: "マンガリスト",
    quizRecord: "クイズ記録",
    points: "ポイント",
    noAnime: "お気に入りのアニメはまだありません",
    noManga: "お気に入りのマンガはまだありません",
  },
};

function Perfil() {
  const { selectedLanguage } = useOutletContext();
  const t = translations[selectedLanguage] || translations.es;
  const [user, setUser] = useState(null);
  const [basicActive, setBasicActive] = useState("anime");
  const idUsuario = localStorage.getItem("idUsuario");
  const [favoritos, setFavoritos] = useState([]);

  const [imgUrl, setImgUrl] = useState(null);

  const [lista, setLista] = useState([]); // <--- AÑADE ESTA LÍNEA

  useEffect(() => {
    setImgUrl(idUsuario ? `${apiUrl}/usuario/perfil/${idUsuario}` : null);
  }, [idUsuario, apiUrl]);

  useEffect(() => {
    const comprobarImagen = async () => {
      try {
        const res = await fetch(imgUrl);

        if (!res.ok) {
          setImgUrl(null);
          return;
        }

        const data = await res.json();

        if (!data.ok) {
          setImgUrl(null);
        }
      } catch (error) {}
    };

    if (imgUrl) {
      comprobarImagen();
    }
  }, [imgUrl]);

  const handleBasicClick = (value) => {
    if (value === basicActive) return;
    setBasicActive(value);
  };

  useEffect(() => {
    const idUsuario = localStorage.getItem("idUsuario");
    if (!idUsuario) return;

    const cargarFavoritos = async () => {
      try {
        const res = await fetch(`${apiUrl}/listaobra/favoritos/${idUsuario}`);
        const data = await res.json();

        if (data.ok) {
          setFavoritos(data.datos || []);
        }
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
      }
    };

    cargarFavoritos();
  }, [apiUrl, selectedLanguage]); // Añadido selectedLanguage para que se actualice al cambiar de idioma

  useEffect(() => {
    const cargarLista = async () => {
      try {
        const idUsuario = localStorage.getItem("idUsuario");
        if (!idUsuario) return;

        const res = await fetch(`${apiUrl}/lista/favoritos/${idUsuario}`);
        const data = await res.json();

        if (data && data.ok && data.datos) {
          // El backend ahora devuelve el objeto directamente gracias al cambio anterior
          setLista(data.datos);
        }
      } catch (err) {
        console.error("Error cargando lista:", err);
      }
    };

    cargarLista();
  }, [apiUrl]);

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
        const res = await fetch(`${apiUrl}/usuario/${user.idUsuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...user, img_perfil: base64 }),
        });
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

      if (!token) return;

      const res = await fetch(`${apiUrl}/usuario/${idUsuario}`);

      const data = await res.json();

      if (data.ok) {
        setUser(data.datos);
      }
    };

    fetchUser();
  }, [idUsuario]);

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
            backgroundPosition: "center",
          }}
        ></div>

        <MDBCardBody>
          <MDBRow>
            {/* FOTO */}
            <div className="perfil-img-wrapper">
              {user.img_perfil && typeof user.img_perfil === "string" ? (
                <img
                  src={`data:image/jpeg;base64,${user.img_perfil}`}
                  alt="avatar1"
                  className="perfil-img"
                />
              ) : imgUrl ? (
                <img src={imgUrl} alt="avatar2" className="perfil-img" />
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
                  <MDBIcon
                    fas
                    icon="user"
                    style={{ color: "#fff", fontSize: "20px" }}
                  />
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
                {t.animeList}
              </MDBTabsLink>
            </MDBTabsItem>

            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("manga")}
                active={basicActive === "manga"}
              >
                {t.mangaList}
              </MDBTabsLink>
            </MDBTabsItem>

            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("quiz")} // <--- Añade esto
                active={basicActive === "quiz"} // <--- Añade esto
              >
                {t.quizRecord}
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            <MDBTabsPane open={basicActive === "anime"}>
              <div className="lista-favoritos">
                {favoritos.filter((f) => f.tipo === "anime").length === 0 ? (
                  <p>{t.noAnime}</p>
                ) : (
                  favoritos
                    .filter((f) => f.tipo === "anime")
                    .map((obra) => (
                      <div
                        key={obra.idobra}
                        className="favorito-card"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "15px",
                          gap: "15px",
                        }}
                      >
                        <img
                          src={`${apiUrl}/obra/${obra.idobra}/imagen`}
                          alt={getTituloPorIdioma(obra)}
                          style={{
                            width: "80px",
                            height: "110px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h5 style={{ margin: 0 }}>{getTituloPorIdioma(obra)}</h5>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </MDBTabsPane>

            <MDBTabsPane open={basicActive === "manga"}>
              <div className="lista-favoritos">
                {favoritos.filter((f) => f.tipo === "manga").length === 0 ? (
                  <p>{t.noManga}</p>
                ) : (
                  favoritos
                    .filter((f) => f.tipo === "manga")
                    .map((obra) => (
                      <div
                        key={obra.idobra}
                        className="favorito-card"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "15px",
                          gap: "15px",
                        }}
                      >
                        <img
                          src={`${apiUrl}/obra/${obra.idobra}/imagen`}
                          alt={getTituloPorIdioma(obra)}
                          style={{
                            width: "80px",
                            height: "110px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h5 style={{ margin: 0 }}>{getTituloPorIdioma(obra)}</h5>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </MDBTabsPane>

            <MDBTabsContent>
              {/* ... (tus otros panes de anime y manga) ... */}

              <MDBTabsPane open={basicActive === "quiz"}>
                <div className="p-3">
                  <h4>
                    <MDBIcon fas icon="trophy" className="me-2 text-warning" />
                    {t.quizRecord}: <span translate="no">{user.puntuacionquiz || 0}</span> {t.points}
                  </h4>
                </div>
              </MDBTabsPane>
            </MDBTabsContent>
          </MDBTabsContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Perfil;
