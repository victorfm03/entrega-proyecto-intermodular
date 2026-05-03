import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import ListadoHorizontalObras from "../components/ListadoHorizontalObras";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { apiUrl } from "../config.js";
import GoogleTranslate from "../components/GoogleTranslate";

function Home() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // --- Estados separados ---
  const [popularesAnimes, setPopularesAnimes] = useState([]);
  const [recientesAnimes, setRecientesAnimes] = useState([]);
  const [puntuacionAnimes, setPuntuacionAnimes] = useState([]);
  const [proximosAnimes, setProximosAnimes] = useState([]);

  const [popularesMangas, setPopularesMangas] = useState([]);
  const [recientesMangas, setRecientesMangas] = useState([]);
  const [puntuacionMangas, setPuntuacionMangas] = useState([]);
  const [proximosMangas, setProximosMangas] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "es"
  );

  const getTitulo = (obra) => {
    const traduccion = obra.traducciones?.find(
      (t) => t.idioma === selectedLanguage
    );

    return {
      ...obra,
      titulo: traduccion?.titulo || obra.titulo_original || obra.titulo,
    };
  };

  const handleLanguageChange = (nuevoIdioma) => {
    localStorage.setItem("language", nuevoIdioma);
    setSelectedLanguage(nuevoIdioma);
  };

  useEffect(() => {
    if (!isHome) return;

    async function getObras() {
      const hoy = new Date();
      const tipos = ["anime", "manga"];
      const ordenes = ["popularidad", "recientes", "puntuacion"];
      const resultados = {
        anime: { populares: [], recientes: [], puntuacion: [], proximos: [] },
        manga: { populares: [], recientes: [], puntuacion: [], proximos: [] },
      };

      const promesas = [];

      tipos.forEach(tipo => {
        ordenes.forEach(orden => {
          // Traemos más obras para filtrar Próximamente
          const url = `${apiUrl}/obra/obraFiltrada?tipo=${tipo}&numeroDeObras=50&orden=${orden}`;
          const promesa = fetch(url)
            .then(res => res.ok ? res.json() : { datos: [] })
            .then(data => {
              const obras = data.datos || [];

              if (orden === "popularidad") resultados[tipo].populares = obras.slice(0, 6);
              if (orden === "recientes") {
                resultados[tipo].recientes = obras.slice(0, 6);
                // Filtrar Próximamente - obras con estado proximamente cuya fecha no ha pasado
                const proximos = obras
                  .filter(o => {
                    if (o.estado !== "proximamente") return false;
                    if (!o.fechalanzamiento) return true; // Mostrar obras sin fecha confirmada
                    // Comparar solo la fecha, ignorando hora
                    const fecha = new Date(o.fechalanzamiento);
                    fecha.setHours(0, 0, 0, 0);
                    const hoyNormalized = new Date();
                    hoyNormalized.setHours(0, 0, 0, 0);
                    return fecha > hoyNormalized;
                  })
                  .slice(0, 6);
                resultados[tipo].proximos = proximos;
              }
              if (orden === "puntuacion") resultados[tipo].puntuacion = obras.slice(0, 6);
            });
          promesas.push(promesa);
        });
      });

      await Promise.all(promesas);

      // Actualizar estados
      setPopularesAnimes(resultados.anime.populares);
      setRecientesAnimes(resultados.anime.recientes);
      setPuntuacionAnimes(resultados.anime.puntuacion);
      setProximosAnimes(resultados.anime.proximos);

      setPopularesMangas(resultados.manga.populares);
      setRecientesMangas(resultados.manga.recientes);
      setPuntuacionMangas(resultados.manga.puntuacion);
      setProximosMangas(resultados.manga.proximos);
    }

    getObras();
  }, [isHome]);

  return (
    
    <div className="main-content">
      <GoogleTranslate language={selectedLanguage} />
      <Navbar 
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      <div className="content">
        {isHome ? (
          <>
            {/* --- ANIMES --- */}
            <ListadoHorizontalObras obras={popularesAnimes.map(getTitulo)} titulo="Animes Populares" />
            <ListadoHorizontalObras obras={recientesAnimes.map(getTitulo)} titulo="Animes Recientes" />
            <ListadoHorizontalObras obras={puntuacionAnimes.map(getTitulo)} titulo="Animes con Mayor Puntuación" />
            <ListadoHorizontalObras obras={proximosAnimes.map(getTitulo)} titulo="Animes Próximamente" />

            {/* --- MANGAS --- */}
            <ListadoHorizontalObras obras={popularesMangas.map(getTitulo)} titulo="Mangas Populares" />
            <ListadoHorizontalObras obras={recientesMangas.map(getTitulo)} titulo="Mangas Recientes" />
            <ListadoHorizontalObras obras={puntuacionMangas.map(getTitulo)} titulo="Mangas con Mayor Puntuación" />
            <ListadoHorizontalObras obras={proximosMangas.map(getTitulo)} titulo="Mangas Próximamente" />
          </>
        ) : (
          <Outlet />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;