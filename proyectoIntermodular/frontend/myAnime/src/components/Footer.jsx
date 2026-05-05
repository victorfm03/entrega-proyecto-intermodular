import { ThemeContext } from "../ThemeProvider";
import { useContext } from "react";
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { Link, useOutletContext } from "react-router";

const translations = {
  es: {
    description: "Descubre tus animes y mangas favoritos",
    links: "Enlaces",
    home: "Inicio",
    rights: "Todos los derechos reservados",
  },
  en: {
    description: "Discover your favorite animes and mangas",
    links: "Links",
    home: "Home",
    rights: "All rights reserved",
  },
  fr: {
    description: "Découvrez vos animes et mangas préférés",
    links: "Liens",
    home: "Accueil",
    rights: "Tous droits réservés",
  },
  de: {
    description: "Entdecke deine Lieblings-Animes und Mangas",
    links: "Links",
    home: "Startseite",
    rights: "Alle Rechte vorbehalten",
  },
  pt: {
    description: "Descubra seus animes e mangás favoritos",
    links: "Links",
    home: "Início",
    rights: "Todos os direitos reservados",
  },
  ja: {
    description: "お気に入りのアニメやマンガを見つけよう",
    links: "リンク",
    home: "ホーム",
    rights: "著作権所有",
  },
};

/**
 
Componente del pie de página.
@returns {JSX.Element} El componente del pie de página.*/
function Footer() {
  const context = useOutletContext();
  const selectedLanguage = context?.selectedLanguage || localStorage.getItem("language") || "es";
  const t = translations[selectedLanguage] || translations.es;
  const { darkMode } = useContext(ThemeContext);

  const backgroundColor = darkMode ? "#0047AB" : "#00BFFF";
  const subBackground = darkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)";

  return (
    <MDBFooter className="text-center text-lg-start text-light mt-4 " style={{backgroundColor}}>
      <MDBContainer className="p-4">
        <MDBRow>
          <MDBCol lg="6" md="12" className="mb-4">
            <h5 className="text-uppercase">AniMangaList</h5>
            <p>{t.description}</p>
          </MDBCol>
          <MDBCol lg="3" md="6" className="mb-4">
            <h5 className="text-uppercase">{t.links}</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <Link to="/" className="link">
                  {t.home}
                </Link>
              </li>
            </ul>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div
        className="text-center p-3"
        style={{ backgroundColor: subBackground }}
      >
        © 2026 AniMangaList - {t.rights}
      </div>
    </MDBFooter>
  );
}

export default Footer;