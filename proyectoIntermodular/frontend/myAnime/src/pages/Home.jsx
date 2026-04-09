import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import ListadoHorizontalObras from "../components/ListadoHorizontalObras";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { apiUrl } from "../config.js";

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
                // Filtrar Próximamente
                const proximos = obras
                  .filter(o => {
                    if (!o.fechalanzamiento) return false;
                    // Comparar solo la fecha, ignorando hora
                    const fecha = new Date(o.fechalanzamiento);
                    return fecha.setHours(0,0,0,0) > hoy.setHours(0,0,0,0);
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
      <Navbar />
      <div className="content">
        {isHome ? (
          <>
            {/* --- ANIMES --- */}
            <ListadoHorizontalObras obras={popularesAnimes} titulo="Animes Populares" />
            <ListadoHorizontalObras obras={recientesAnimes} titulo="Animes Recientes" />
            <ListadoHorizontalObras obras={puntuacionAnimes} titulo="Animes con Mayor Puntuación" />
            <ListadoHorizontalObras obras={proximosAnimes} titulo="Animes Próximamente" />

            {/* --- MANGAS --- */}
            <ListadoHorizontalObras obras={popularesMangas} titulo="Mangas Populares" />
            <ListadoHorizontalObras obras={recientesMangas} titulo="Mangas Recientes" />
            <ListadoHorizontalObras obras={puntuacionMangas} titulo="Mangas con Mayor Puntuación" />
            <ListadoHorizontalObras obras={proximosMangas} titulo="Mangas Próximamente" />
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