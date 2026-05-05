import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import ListadoHorizontalObras from "../components/ListadoHorizontalObras";
import AlphabeticalIndex from "../components/AlphabeticalIndex";
import { apiUrl } from "../config.js";
import getTituloPorIdioma from "../utils/getTituloPorIdioma";

function Mangas() {
  const { selectedLanguage } = useOutletContext();
  const [titulo, setTitulo] = useState([]);

  useEffect(() => {
    async function getObras() {
      let response = await fetch(
        apiUrl + "/obra/getObrasTipo?tipo=manga&orden=titulo"
      );
      if (response.ok) {
        let data = await response.json();
        setTitulo(data.datos);
      }
    }
    getObras();
  }, []);

  const groupedObras = useMemo(() => {
    const groups = {};
    titulo.forEach((obra) => {
      const displayTitle = getTituloPorIdioma(obra);
      const firstLetter = displayTitle.charAt(0).toUpperCase();
      const letter = /^[A-Z]$/.test(firstLetter) ? firstLetter : "#";
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(obra);
    });
    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {});
  }, [titulo, selectedLanguage]); // Añadido selectedLanguage como dependencia

  const letters = useMemo(() => Object.keys(groupedObras), [groupedObras]);

  const scrollToLetter = (letter) => {
    const element = document.getElementById(`letter-section-${letter}`);
    if (element) {
      const offset = 80; // Ajuste para la navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="main-content">
        <AlphabeticalIndex letters={letters} onLetterClick={scrollToLetter} />
        <div className="content">
          {letters.length > 0 ? (
            letters.map((letter) => (
              <div key={letter} id={`letter-section-${letter}`} className="mb-5">
                <h2
                  style={{
                    marginLeft: "2rem",
                    marginTop: "2rem",
                    color: "#000",
                    fontWeight: "800",
                    borderBottom: "2px solid #eee",
                    paddingBottom: "10px",
                  }}
                >
                  {letter}
                </h2>
                <ListadoHorizontalObras obras={groupedObras[letter]} modo="grid" />
              </div>
            ))
          ) : (
            <p className="text-center mt-5">Cargando mangas...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Mangas;