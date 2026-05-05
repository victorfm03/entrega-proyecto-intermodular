import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { apiUrl } from "../config.js";
import getTituloPorIdioma from "../utils/getTituloPorIdioma";

const estadoLabels = {
  "en emision": "en emision",
  finalizado: "Completado",
  proximamente: "proximamente",
  cancelado: "cancelado",
  pausado: "Pausado",
  eliminada: "cancelado",
};

const estadoColores = {
  "en emision": "#4e9cff",
  Leyendo: "#7f5cff",
  Completado: "#22c55e",
  "proximamente": "#f59e0b",
  cancelado: "#f87171",
  Pausado: "#f97316",
};

function Search() {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams(); // Añadido setSearchParams
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const titulo = searchParams.get("q") || "";

  // Manejador para el buscador interno de la página de búsqueda
  const handleInternalSearch = (e) => {
    if (e.key === "Enter") {
      const newQuery = e.target.value.trim();
      setSearchParams({ q: newQuery });
    }
  };

  useEffect(() => {
    async function getObras() {
      setLoading(true);
      try {
        let url = `${apiUrl}/obra`; // Por defecto todas las obras
        if (titulo.trim()) {
          url = `${apiUrl}/obra/titulo/${encodeURIComponent(titulo.trim())}`;
        }

        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          const obrasData = Array.isArray(data.datos)
            ? data.datos
            : [data.datos].filter(Boolean);

          if (titulo.trim()) {
            obrasData.sort((a, b) => {
              const tituloA = (getTituloPorIdioma(a) || "").toLowerCase();
              const tituloB = (getTituloPorIdioma(b) || "").toLowerCase();
              const searchTerm = titulo.toLowerCase();

              const startsWithA = tituloA.startsWith(searchTerm);
              const startsWithB = tituloB.startsWith(searchTerm);

              if (startsWithA && !startsWithB) return -1;
              if (!startsWithA && startsWithB) return 1;

              const indexA = tituloA.indexOf(searchTerm);
              const indexB = tituloB.indexOf(searchTerm);
              if (indexA !== indexB) return indexA - indexB;

              return tituloA.length - tituloB.length;
            });
          }

          setObras(obrasData);
        } else {
          setObras([]);
        }
      } catch (error) {
        console.error("Error fetching obras:", error);
        setObras([]);
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(getObras, 300);
    return () => clearTimeout(timeoutId);
  }, [titulo]);

  const filteredObras = useMemo(() => {
    return obras
      .filter((obra) => obra.estado !== "eliminada")
      .filter((obra) => {
        if (!titulo.trim()) return true;
        return getTituloPorIdioma(obra)
          .toLowerCase()
          .includes(titulo.toLowerCase().trim());
      })
      .filter((obra) => {
        if (filterType === "all") return true;
        return obra.tipo === filterType;
      })
      .filter((obra) => {
        if (filterStatus === "all") return true;
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaLanzamiento = obra.fechalanzamiento ? new Date(obra.fechalanzamiento) : null;
        if (fechaLanzamiento) fechaLanzamiento.setHours(0, 0, 0, 0);

        // Detectar si es una obra de un solo evento (película, especial, etc.)
        const tituloObra = (getTituloPorIdioma(obra) || "").toLowerCase();
        const generosObra = (obra.genero || "").toLowerCase();
        const esEventoUnico = 
          tituloObra.includes("movie") || 
          tituloObra.includes("special") || 
          tituloObra.includes("ova") || 
          tituloObra.includes("ona") ||
          generosObra.includes("movie") || 
          generosObra.includes("special") || 
          generosObra.includes("ova") || 
          generosObra.includes("ona");

        // Lógica para "proximamente"
        if (filterStatus === "proximamente") {
          if (obra.estado !== "proximamente") return false;
          if (!fechaLanzamiento) return true; 
          return fechaLanzamiento > hoy;
        }

        // Lógica para "en emision"
        if (filterStatus === "en emision") {
          let matches = false;
          if (obra.estado === "en emision") matches = true;
          if (obra.estado === "proximamente" && fechaLanzamiento && fechaLanzamiento <= hoy) matches = true;
          
          // Si es evento único y ya pasó la fecha, no está en emisión, está finalizado
          if (matches && esEventoUnico && fechaLanzamiento && fechaLanzamiento < hoy) return false;
          
          return matches;
        }

        // Lógica para "finalizado" (Completado)
        if (filterStatus === "finalizado") {
          if (obra.estado === "finalizado") return true;
          // Si es un evento único y la fecha ya pasó, se considera finalizado
          if (esEventoUnico && fechaLanzamiento && fechaLanzamiento < hoy) return true;
          return false;
        }

        return obra.estado === filterStatus;
      });
  }, [obras, filterType, filterStatus, titulo]);

  return (
    <div className="main-content" style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", gap: "24px" }}>
        <aside
          style={{
            minWidth: "260px",
            maxWidth: "280px",
            background: "#f8fafc",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 20px 70px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
              Tipo
            </h2>
            <div style={{ marginTop: "18px", display: "grid", gap: "10px" }}>
              {[
                { value: "all", label: "Todos" },
                { value: "anime", label: "Anime" },
                { value: "manga", label: "Manga" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterType(item.value)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    borderRadius: "16px",
                    padding: "14px 16px",
                    background: filterType === item.value ? "#ffffff" : "transparent",
                    color: filterType === item.value ? "#0f172a" : "#475569",
                    boxShadow: filterType === item.value ? "0 10px 30px rgba(15, 23, 42, 0.08)" : "none",
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
              Estado
            </h2>
            <div style={{ marginTop: "18px", display: "grid", gap: "10px" }}>
              {[
                { value: "all", label: "Todos" },
                { value: "en emision", label: "en emision" },
                { value: "finalizado", label: "finalizado" },
                { value: "proximamente", label: "proximamente" },
                { value: "pausado", label: "pausado" },
                { value: "cancelado", label: "cancelado" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterStatus(item.value)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    borderRadius: "16px",
                    padding: "14px 16px",
                    background: filterStatus === item.value ? "#ffffff" : "transparent",
                    color: filterStatus === item.value ? "#0f172a" : "#475569",
                    boxShadow: filterStatus === item.value ? "0 10px 30px rgba(15, 23, 42, 0.08)" : "none",
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </aside>

        <section style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 800 }}>
                Mi Colección
              </h1>
              <p style={{ margin: "10px 0 0", color: "#64748b" }}>
                Resultados de búsqueda {titulo ? `para "${titulo}"` : ""}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "24px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div
              style={{
                flex: 1,
                minWidth: "280px",
                background: "#ffffff",
                borderRadius: "22px",
                padding: "16px 20px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: "18px" }}>🔎</span>
              <input
                type="text"
                defaultValue={titulo}
                onKeyDown={handleInternalSearch}
                placeholder="Buscar anime o manga..."
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  color: "#0f172a",
                  background: "transparent",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ color: "#64748b" }}>Cargando...</p>
            </div>
          ) : filteredObras.length > 0 ? (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", // Cambiado auto-fit por auto-fill
              gap: "24px" 
            }}>
              {filteredObras.map((obra) => {
                let actualEstado = obra.estado;
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const fechaLanzamiento = obra.fechalanzamiento ? new Date(obra.fechalanzamiento) : null;
                if (fechaLanzamiento) fechaLanzamiento.setHours(0, 0, 0, 0);

                // Detectar si es una obra de un solo evento (película, especial, etc.)
                const tituloObra = (getTituloPorIdioma(obra) || "").toLowerCase();
                const generosObra = (obra.genero || "").toLowerCase();
                const esEventoUnico = 
                  tituloObra.includes("movie") || 
                  tituloObra.includes("special") || 
                  tituloObra.includes("ova") || 
                  tituloObra.includes("ona") ||
                  generosObra.includes("movie") || 
                  generosObra.includes("special") || 
                  generosObra.includes("ova") || 
                  generosObra.includes("ona");

                // Lógica de estado dinámico
                if (actualEstado === "proximamente" && fechaLanzamiento && fechaLanzamiento <= hoy) {
                  // Si es evento único y ya pasó la fecha, ya está finalizado
                  if (esEventoUnico && fechaLanzamiento < hoy) {
                    actualEstado = "finalizado";
                  } else {
                    actualEstado = "en emision";
                  }
                } else if (actualEstado === "en emision" && esEventoUnico && fechaLanzamiento && fechaLanzamiento < hoy) {
                  // Si ya estaba como emisión pero es evento único y ya pasó, marcar como finalizado
                  actualEstado = "finalizado";
                }

                const estadoLabel = estadoLabels[actualEstado] || "Desconocido";
                const badgeColor = estadoColores[estadoLabel] || "#60a5fa";
                const year = obra.fechalanzamiento ? new Date(obra.fechalanzamiento).getFullYear() : "N/A";
                const score = Number(obra.puntuacion);
                const rating = Number.isFinite(score) ? score.toFixed(1) : "N/A";
                const progress = Number.isFinite(score) ? Math.min(Math.max(score * 10, 0), 100) : 0;

                return (
                  <div
                    key={obra.idobra}
                    style={{
                      background: "#ffffff",
                      borderRadius: "28px",
                      overflow: "hidden",
                      boxShadow: "0 20px 70px rgba(15, 23, 42, 0.08)",
                      cursor: "pointer",
                    }}
                    onClick={() => window.location.href = `/obra/${obra.idobra}`}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={`${apiUrl}/obra/${obra.idobra}/imagen`}
                        alt={getTituloPorIdioma(obra)}
                        style={{ width: "100%", height: "280px", objectFit: "cover" }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "18px",
                          left: "18px",
                          background: badgeColor,
                          color: "#ffffff",
                          padding: "8px 14px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {estadoLabel}
                      </span>
                    </div>
                    <div style={{ padding: "22px" }}>
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#64748b" }}>
                        {obra.tipo === "anime" ? "ANIME" : "MANGA"} · {year}
                      </p>
                      <h3 style={{ margin: "12px 0 14px", fontSize: "20px", lineHeight: "1.2", color: "#0f172a" }}>
                        {getTituloPorIdioma(obra)}
                      </h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                        {(obra.genero || "").split(",").slice(0, 3).map((genre) => (
                          <span
                            key={genre}
                            style={{
                              fontSize: "12px",
                              color: "#475569",
                              background: "#f1f5f9",
                              borderRadius: "999px",
                              padding: "8px 12px",
                            }}
                          >
                            {genre.trim()}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ flex: 1, height: "12px", borderRadius: "999px", background: "#e2e8f0", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${progress}%`,
                              height: "100%",
                              background: "#2563eb",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "14px", color: "#475569", fontWeight: 700 }}>
                          {rating}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : titulo ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ color: "#64748b" }}>No se encontraron resultados para "{titulo}"</p>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ color: "#64748b" }}>Escribe un título para buscar...</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Search;
