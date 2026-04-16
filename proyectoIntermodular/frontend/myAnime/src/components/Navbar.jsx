import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBBtn,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";

import { ThemeContext } from "../ThemeProvider";
import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../config.js";

function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar si estamos en DetalleObra
  const enDetalleObra = location.pathname.startsWith("/obra/");
  const enSesiones =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  const [activeTab, setActiveTab] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Menú de perfil
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const idUsuario = localStorage.getItem("idUsuario");

  const avatarUrl = idUsuario ? `${apiUrl}/usuario/perfil/${idUsuario}` : null;

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProfileMenuOpen(false);
    localStorage.removeItem("idUsuario");
    navigate("/");
  };

  // Mantener activeTab sincronizado con la URL
  useEffect(() => {
    if (location.pathname.startsWith("/animes")) setActiveTab("anime");
    else if (location.pathname.startsWith("/mangas")) setActiveTab("manga");
    else setActiveTab(null);
  }, [location.pathname]);

  // Cerrar menú de perfil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileMenuOpen]);

  return (
    <MDBNavbar
      expand="lg"
      light={!darkMode}
      dark={darkMode}
      className={
        darkMode ? "navbar-dark-custom py-2" : "navbar-light-custom py-2"
      }
    >
      <MDBContainer fluid className="flex-column">
        {/* FILA SUPERIOR */}
        <div className="d-flex align-items-center w-100">
          {/* LOGO */}
          <MDBNavbarBrand
            tag={Link}
            to="/"
            className="d-flex align-items-center gap-2"
          >
            <MDBIcon fas icon="tv" />
            AniManga
          </MDBNavbarBrand>

          {/* BUSCADOR */}
          <div className="flex-grow-1 px-4">
            <MDBInput type="search" placeholder="Buscar manga..." />
          </div>

          {/* BOTON DARK MODE */}
          <MDBBtn
            color="link"
            onClick={() => setDarkMode(!darkMode)}
            style={{ padding: "0.25rem" }}
          >
            <MDBIcon fas icon={darkMode ? "sun" : "moon"} size="lg" />
          </MDBBtn>

          {isLoggedIn ? (
  <div style={{ position: "relative" }} ref={profileMenuRef}>
    {/* CONTENEDOR CIRCULAR (Clic aquí para abrir/cerrar) */}
    <div
      onClick={() => setProfileMenuOpen(!profileMenuOpen)} // <-- Cambia el estado
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: "#999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer", // <-- Indica que es clicable
      }}
    >
      <img
        src={avatarUrl}
        alt="Avatar"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />

      <div
        style={{
          display: "none",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MDBIcon
          fas
          icon="user"
          style={{ color: "#fff", fontSize: "20px" }}
        />
      </div>
    </div>

    {/* MENÚ DESPLEGABLE DE PERFIL */}
    {profileMenuOpen && (
      <div
        className="profile-menu-dropdown"
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
          border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          minWidth: "200px",
          marginTop: "8px",
        }}
      >
        <Link
          to="/perfil"
          className="profile-menu-item"
          onClick={() => setProfileMenuOpen(false)}
          style={{
            display: "block",
            padding: "12px 16px",
            color: darkMode ? "#fff" : "#000",
            textDecoration: "none",
            borderBottom: `1px solid ${darkMode ? "#444" : "#eee"}`,
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = darkMode ? "#3a3a3a" : "#f5f5f5")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "transparent")
          }
        >
          <MDBIcon fas icon="user" className="me-2" /> Mi Perfil
        </Link>
        <button
          className="profile-menu-item"
          onClick={handleLogout}
          style={{
            display: "block",
            width: "100%",
            padding: "12px 16px",
            color: darkMode ? "#fff" : "#000",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = darkMode ? "#3a3a3a" : "#f5f5f5")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "transparent")
          }
        >
          <MDBIcon fas icon="sign-out-alt" className="me-2" /> Cerrar Sesión
        </button>
      </div>
    )}
  </div>
) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login">
                <MDBBtn
                  color="link"
                  style={{
                    color: darkMode ? "#fff" : "#000",
                    padding: "0.5rem 0.75rem",
                  }}
                >
                  Iniciar Sesión
                </MDBBtn>
              </Link>
              <Link to="/register">
                <MDBBtn color="primary" style={{ padding: "0.5rem 0.85rem" }}>
                  Registrarse
                </MDBBtn>
              </Link>
            </div>
          )}
        </div>

        {/* FILA INFERIOR (TABS o BOTONES) */}
        <MDBNavbarNav className="mt-3">
          <div className="nav-tabs-container" style={{ position: "relative" }}>
            {/* Slider solo si hay un tab activo */}
            {activeTab && !enDetalleObra && !enSesiones && (
              <div
                className={`nav-slider ${activeTab === "anime" ? "active-anime" : "active-manga"}`}
              />
            )}

            {enDetalleObra || enSesiones ? (
              <>
                <MDBBtn
                  color="link"
                  onClick={() => navigate(-1)}
                  className="nav-tab"
                >
                  <MDBIcon fas icon="arrow-left" /> Volver
                </MDBBtn>
                <Link to="/" className="nav-tab">
                  <MDBIcon fas icon="home" /> Inicio
                </Link>
              </>
            ) : (
              <>
                <NavLink
                  to="/animes"
                  className={({ isActive }) =>
                    isActive ? "nav-tab active" : "nav-tab"
                  }
                >
                  Anime
                </NavLink>

                <div className="nav-tab-divider" style={{ flexGrow: 1 }}></div>

                <NavLink
                  to="/mangas"
                  className={({ isActive }) =>
                    isActive ? "nav-tab active" : "nav-tab"
                  }
                >
                  Manga
                </NavLink>
              </>
            )}
          </div>
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default Navbar;
