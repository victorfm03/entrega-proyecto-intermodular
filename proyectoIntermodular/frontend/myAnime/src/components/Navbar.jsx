import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBBtn,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

import { ThemeContext } from "../ThemeProvider";
import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../config.js";

import "flag-icons/css/flag-icons.min.css";

const translations = {
  es: {
    search: "Buscar obras...",
    profile: "Mi Perfil",
    admin: "Administración",
    quiz: "Quiz",
    logout: "Cerrar Sesión",
    login: "Iniciar Sesión",
    register: "Registrarse",
    back: "Volver",
    home: "Inicio",
    anime: "Anime",
    manga: "Manga",
  },
  en: {
    search: "Search works...",
    profile: "My Profile",
    admin: "Administration",
    quiz: "Quiz",
    logout: "Logout",
    login: "Login",
    register: "Register",
    back: "Back",
    home: "Home",
    anime: "Anime",
    manga: "Manga",
  },
  fr: {
    search: "Rechercher...",
    profile: "Mon Profil",
    admin: "Administration",
    quiz: "Quiz",
    logout: "Déconnexion",
    login: "Connexion",
    register: "S'inscrire",
    back: "Retour",
    home: "Accueil",
    anime: "Animé",
    manga: "Manga",
  },
  de: {
    search: "Suche...",
    profile: "Mein Profil",
    admin: "Administration",
    quiz: "Quiz",
    logout: "Abmelden",
    login: "Anmelden",
    register: "Registrieren",
    back: "Zurück",
    home: "Startseite",
    anime: "Anime",
    manga: "Manga",
  },
  pt: {
    search: "Buscar...",
    profile: "Meu Perfil",
    admin: "Administração",
    quiz: "Quiz",
    logout: "Sair",
    login: "Entrar",
    register: "Registrar",
    back: "Voltar",
    home: "Início",
    anime: "Anime",
    manga: "Mangá",
  },
  ja: {
    search: "検索...",
    profile: "プロフィール",
    admin: "管理",
    quiz: "クイズ",
    logout: "ログアウト",
    login: "ログイン",
    register: "会員登録",
    back: "戻る",
    home: "ホーム",
    anime: "アニメ",
    manga: "マンガ",
  },
};

function Navbar({ selectedLanguage, setSelectedLanguage }) {
  const t = translations[selectedLanguage] || translations.es;
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const query = searchTerm.trim();
      setSearchTerm(""); // Limpiar la barra al buscar
      navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
    }
  };

  // Detectar si estamos en DetalleObra
  const enDetalleObra = location.pathname.startsWith("/obra/");
  const enSesiones =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");
  const enPaginasUsuario =
    location.pathname.startsWith("/perfil") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/quiz");

  const [activeTab, setActiveTab] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Menú de perfil
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef(null);

  const languages = [
  { code: "es", label: "CASTELLANO", flag: "es" },
  { code: "en", label: "ENGLISH", flag: "gb" },
  { code: "fr", label: "FRANÇAIS", flag: "fr" },
  { code: "de", label: "DEUTSCH", flag: "de" },
  { code: "pt", label: "PORTUGUÊS", flag: "pt" },
  { code: "ja", label: "日本語", flag: "jp" },
];

  const currentLanguage =
    languages.find((lang) => lang.code === selectedLanguage) || languages[0];

  const changeLanguage = (code) => {
    setSelectedLanguage(code);
    localStorage.setItem("language", code);
    setLanguageMenuOpen(false);

    // Si es español, a veces es mejor limpiar la traducción de Google para que no intente traducir lo que ya está en español
    if (code === "es") {
      const restoreOriginal = () => {
        const iframe = document.querySelector('iframe.goog-te-banner-frame');
        if (iframe) {
          const closeBtn = iframe.contentWindow.document.querySelector('.goog-close-link');
          if (closeBtn) closeBtn.click();
        }
        
        const combo = document.querySelector(".goog-te-combo");
        if (combo) {
          combo.value = "es";
          combo.dispatchEvent(new Event("change"));
        }
      };
      restoreOriginal();
    }

    const applyTranslate = () => {
    const combo = document.querySelector(".goog-te-combo");

    if (!combo) {
      setTimeout(applyTranslate, 500);
      return;
    }

    combo.value = code;
    combo.dispatchEvent(new Event("change"));
  };

  applyTranslate();
};

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
    localStorage.removeItem("admin");
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

  // Cerrar menú de idioma al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    if (languageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [languageMenuOpen]);

  

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
            <MDBInput
              type="search"
              label={t.search}
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div
            style={{ position: "relative", marginRight: "12px" }}
            ref={languageMenuRef}
          >
            <MDBBtn
              color="link"
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              style={{
                padding: "0.4rem 0.6rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: darkMode ? "#fff" : "#000",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              <span
                className={`fi fi-${currentLanguage.flag}`}
                style={{
                  width: "20px",
                  height: "15px",
                  borderRadius: "2px",
                }}
              ></span>
              <span translate="no">{currentLanguage.label}</span>
              <MDBIcon fas icon="angle-down" />
            </MDBBtn>
            {languageMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
                  border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  minWidth: "220px",
                  marginTop: "8px",
                  overflow: "hidden",
                }}
              >
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      color: darkMode ? "#fff" : "#000",
                      borderBottom: `1px solid ${darkMode ? "#444" : "#eee"}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontWeight:
                        selectedLanguage === lang.code ? "bold" : "normal",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode
                        ? "#3a3a3a"
                        : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <span
                      className={`fi fi-${lang.flag}`}
                      style={{
                        width: "20px",
                        height: "15px",
                        borderRadius: "2px",
                      }}
                    ></span>
                    <span translate="no">{lang.label}</span>
                  </div>
                ))}
              </div>
            )}
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
                      (e.target.style.backgroundColor = darkMode
                        ? "#3a3a3a"
                        : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <MDBIcon fas icon="user" className="me-2" /> {t.profile}
                  </Link>
                  {localStorage.getItem("admin") ? (
                    <Link
                      to="/admin"
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
                        (e.target.style.backgroundColor = darkMode
                          ? "#3a3a3a"
                          : "#f5f5f5")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      <MDBIcon fas icon="key" className="me-2" /> {t.admin}
                    </Link>
                  ) : null}

                  <Link
                    to="/quiz"
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
                      (e.target.style.backgroundColor = darkMode
                        ? "#3a3a3a"
                        : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <SportsEsportsIcon
                      className="me-2"
                      style={{ fontSize: "20px", verticalAlign: "middle" }}
                    />{" "}
                    {t.quiz}
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
                      (e.target.style.backgroundColor = darkMode
                        ? "#3a3a3a"
                        : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <MDBIcon fas icon="sign-out-alt" className="me-2" /> {t.logout}
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
                  {t.login}
                </MDBBtn>
              </Link>
              <Link to="/register">
                <MDBBtn color="primary" style={{ padding: "0.5rem 0.85rem" }}>
                  {t.register}
                </MDBBtn>
              </Link>
            </div>
          )}
        </div>

        {/* FILA INFERIOR (TABS o BOTONES) */}
        <MDBNavbarNav className="mt-3">
          <div className="nav-tabs-container" style={{ position: "relative" }}>
            {/* Slider solo si hay un tab activo */}
            {activeTab &&
              !enDetalleObra &&
              !enSesiones &&
              !enPaginasUsuario && (
                <div
                  className={`nav-slider ${activeTab === "anime" ? "active-anime" : "active-manga"}`}
                />
              )}

            {enDetalleObra || enSesiones || enPaginasUsuario ? (
              <>
                <MDBBtn
                  color="link"
                  onClick={() => navigate(-1)}
                  className="nav-tab"
                >
                  <MDBIcon fas icon="arrow-left" /> {t.back}
                </MDBBtn>
                <Link to="/" className="nav-tab">
                  <MDBIcon fas icon="home" /> {t.home}
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
                  <span translate="no">{t.anime}</span>
                </NavLink>

                <div className="nav-tab-divider" style={{ flexGrow: 1 }}></div>

                <NavLink
                  to="/mangas"
                  className={({ isActive }) =>
                    isActive ? "nav-tab active" : "nav-tab"
                  }
                >
                  <span translate="no">{t.manga}</span>
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
