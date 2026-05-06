import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import ListadoHorizontalObras from "../components/ListadoHorizontalObras";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { apiUrl } from "../config.js";
import GoogleTranslate from "../components/GoogleTranslate";

const translations = {
  es: {
    popAnimes: "Animes Populares",
    recAnimes: "Animes Recientes",
    topAnimes: "Animes con Mayor Puntuación",
    nextAnimes: "Animes Próximamente",
    popMangas: "Mangas Populares",
    recMangas: "Mangas Recientes",
    topMangas: "Mangas con Mayor Puntuación",
    nextMangas: "Mangas Próximamente",
  },
  en: {
    popAnimes: "Popular Animes",
    recAnimes: "Recent Animes",
    topAnimes: "Top Rated Animes",
    nextAnimes: "Upcoming Animes",
    popMangas: "Popular Mangas",
    recMangas: "Recent Mangas",
    topMangas: "Top Rated Mangas",
    nextMangas: "Upcoming Mangas",
  },
  fr: {
    popAnimes: "Animes Populaires",
    recAnimes: "Animes Récents",
    topAnimes: "Animes les Mieux Notés",
    nextAnimes: "Animes à Venir",
    popMangas: "Mangas Populaires",
    recMangas: "Mangas Récents",
    topMangas: "Mangas les Mieux Notés",
    nextMangas: "Mangas à Venir",
  },
  de: {
    popAnimes: "Beliebte Animes",
    recAnimes: "Kürzliche Animes",
    topAnimes: "Bestbewertete Animes",
    nextAnimes: "Kommende Animes",
    popMangas: "Beliebte Mangas",
    recMangas: "Kürzliche Mangas",
    topMangas: "Bestbewertete Mangas",
    nextMangas: "Kommende Mangas",
  },
  pt: {
    popAnimes: "Animes Populares",
    recAnimes: "Animes Recentes",
    topAnimes: "Animes Mais Bem Avaliados",
    nextAnimes: "Próximos Animes",
    popMangas: "Mangas Populares",
    recMangas: "Mangas Recentes",
    topMangas: "Mangas Mais Bem Avaliados",
    nextMangas: "Próximos Mangas",
  },
  ja: {
    popAnimes: "人気の高いアニメ",
    recAnimes: "最近のアニメ",
    topAnimes: "最高評価のアニメ",
    nextAnimes: "近日公開のアニメ",
    popMangas: "人気の高いマンガ",
    recMangas: "最近のマンガ",
    topMangas: "最高評価のマンガ",
    nextMangas: "近日公開のマンガ",
  },
};

function Home() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "es"
  );
  const t = translations[selectedLanguage] || translations.es;

  // --- Estados separados ---
  const [popularesAnimes, setPopularesAnimes] = useState([]);
  const [recientesAnimes, setRecientesAnimes] = useState([]);
  const [puntuacionAnimes, setPuntuacionAnimes] = useState([]);
  const [proximosAnimes, setProximosAnimes] = useState([]);

  const [popularesMangas, setPopularesMangas] = useState([]);
  const [recientesMangas, setRecientesMangas] = useState([]);
  const [puntuacionMangas, setPuntuacionMangas] = useState([]);
  const [proximosMangas, setProximosMangas] = useState([]);

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
                //resultados[tipo].recientes = obras.slice(0, 6);
                resultados[tipo].recientes = obras
                .filter(o=>{
                  if(o.estado==="proximamente"){
                    return false
                  }else{
                    return true
                  }
                })
                .slice(0, 6);
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
            <ListadoHorizontalObras obras={popularesAnimes.map(getTitulo)} titulo={t.popAnimes} />
            <ListadoHorizontalObras obras={recientesAnimes.map(getTitulo)} titulo={t.recAnimes} />
            <ListadoHorizontalObras obras={puntuacionAnimes.map(getTitulo)} titulo={t.topAnimes} />
            <ListadoHorizontalObras obras={proximosAnimes.map(getTitulo)} titulo={t.nextAnimes} />

            {/* --- MANGAS --- */}
            <ListadoHorizontalObras obras={popularesMangas.map(getTitulo)} titulo={t.popMangas} />
            <ListadoHorizontalObras obras={recientesMangas.map(getTitulo)} titulo={t.recMangas} />
            <ListadoHorizontalObras obras={puntuacionMangas.map(getTitulo)} titulo={t.topMangas} />
            <ListadoHorizontalObras obras={proximosMangas.map(getTitulo)} titulo={t.nextMangas} />
          </>
        ) : (
          <Outlet context={{ selectedLanguage }} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;