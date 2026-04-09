import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../DetalleObra.css";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';


const formatearTiempo = (fecha) => {
  if (!fecha || fecha === "Ahora") return "hace un momento";
  
  const ahora = new Date();
  const fechaComentario = new Date(fecha);
  const diferenciaSegundos = Math.floor((ahora - fechaComentario) / 1000);

  if (diferenciaSegundos < 60) return `hace ${diferenciaSegundos} seg`;
  
  const diferenciaMinutos = Math.floor(diferenciaSegundos / 60);
  if (diferenciaMinutos < 60) return `hace ${diferenciaMinutos} min`;
  
  const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
  if (diferenciaHoras < 24) return `hace ${diferenciaHoras} h`;
  
  const diferenciaDias = Math.floor(diferenciaHoras / 24);
  if (diferenciaDias < 30) return `hace ${diferenciaDias} días`;
  
  const diferenciaMeses = Math.floor(diferenciaDias / 30);
  if (diferenciaMeses < 12) return `hace ${diferenciaMeses} meses`;
  
  return `hace ${Math.floor(diferenciaMeses / 12)} años`;
};

function DetalleObra() {
  const { idobra } = useParams();
  const [obra, setObra] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [openReplyId, setOpenReplyId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("reciente");
  const [openReplies, setOpenReplies] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [likes, setLikes] = useState({});
  const [showMainActions, setShowMainActions] = useState(false);
  const replyTextareaRef = useRef(null);
  const isPointerDownInsideEditor = useRef(false);

  const comentariosRaiz = comentarios.filter((item) => !item.parentId);

  const ordenarComentarios = (lista, ordenamiento) => {
  const copia = [...lista];
  
  return copia.sort((a, b) => {
    // Convertimos a milisegundos para una comparación matemática exacta
    const tiempoA = new Date(a.fecha).getTime();
    const tiempoB = new Date(b.fecha).getTime();

    if (ordenamiento === "mejores") {
      return (likes[b.id] || 0) - (likes[a.id] || 0);
    } else if (ordenamiento === "reciente") {
      // El número más grande (más nuevo) va primero
      return tiempoB - tiempoA;
    } else if (ordenamiento === "antiguo") {
      // El número más pequeño (más viejo) va primero
      return tiempoA - tiempoB;
    }
    return 0;
  });
};

  const comentariosOrdenados = ordenarComentarios(comentariosRaiz, sortBy);

  useEffect(() => {
    if (!idobra) return;
    setCargando(true);
    setError(null);
    fetch(`http://localhost:3000/api/obra/${idobra}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const obraData = data.datos || data;
        if (!obraData) setError("Obra no encontrada");
        else setObra(obraData);
      })
      .catch(() => setError("No se pudo cargar la obra"))
      .finally(() => setCargando(false));
  }, [idobra]);

  useEffect(() => {
    if (!idobra) return;
    fetch(`http://localhost:3000/api/comentario/obra/${idobra}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const baseComentarios = data.datos || data;
        const inicialLikes = {};
        const inicialUserVotes = {};

        const comentariosTransformados = Array.isArray(baseComentarios)
          ? baseComentarios.map((c) => {
              inicialLikes[c.idcomentario] = c.totalLikes || 0;
              if (c.currentUserVote !== undefined && c.currentUserVote !== null) {
                inicialUserVotes[c.idcomentario] = Boolean(c.currentUserVote);
              }

              return {
                id: c.idcomentario,
                usuario: c.usuario || "Usuario",
                fecha: c.fechapublicacion || "",
                texto: c.texto,
                parentId: c.idrespuesta || null,
                idobra: c.idobra
              };
            })
          : [];

        setComentarios(comentariosTransformados);
        setLikes(inicialLikes);
        setUserVotes(inicialUserVotes);
      })
      .catch(() => setComentarios([]));
  }, [idobra]);

  const enviarComentario = () => {
  if (!nuevoComentario.trim() || !obra) return;

  const idUsuarioLogueado = 1; 

  fetch("http://localhost:3000/api/comentario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
        idobra: obra.idobra, 
        texto: nuevoComentario.trim(), 
        idrespuesta: null,
        idusuario: idUsuarioLogueado 
    }),
  })
  .then(res => {
    if (!res.ok) throw new Error("Error en el servidor");
    return res.json();
  })
  .then((data) => {
    const comentarioCreado = data.datos || data;
    const fechaActual = new Date().toISOString();

    const nuevoDesdeBD = {
      id: comentarioCreado.idcomentario || Date.now(),
      usuario: "pepe",
      fecha: fechaActual,
      texto: nuevoComentario.trim(),
      parentId: null,
      idobra: obra.idobra,
    };

    // Usamos la función de actualización de estado para ponerlo al inicio
    setComentarios(prev => [nuevoDesdeBD, ...prev]);
    setNuevoComentario("");
  })
  .catch((err) => {
    console.error(err);
    alert("Error al publicar.");
  });
};

  const actualizarLikes = (id) => {
    fetch(`http://localhost:3000/api/comentario/likes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setLikes((prev) => ({ ...prev, [id]: data.datos || 0 }));
        }
      })
      .catch((err) => console.error("Error al obtener likes actualizado:", err));
  };

  const eliminarVoto = (id) => {
    const idUsuarioLogueado = 1;
    fetch(`http://localhost:3000/api/comentario/likes/${id}/${idUsuarioLogueado}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUserVotes((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          actualizarLikes(id);
        }
      })
      .catch((err) => {
        console.error("Error al eliminar voto:", err);
      });
  };

  const darLike = (id) => {
    const votoActual = userVotes[id];

    if (votoActual === true) {
      eliminarVoto(id);
      return;
    }

    setUserVotes((prev) => ({ ...prev, [id]: true }));

    fetch(`http://localhost:3000/api/comentario/likes/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leDioLike: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          actualizarLikes(id);
        } else {
          setUserVotes((prev) => ({ ...prev, [id]: votoActual }));
        }
      })
      .catch((err) => {
        console.error("Error al guardar like:", err);
        setUserVotes((prev) => ({ ...prev, [id]: votoActual }));
      });
  };

  const darDislike = (id) => {
    const votoActual = userVotes[id];

    if (votoActual === false) {
      eliminarVoto(id);
      return;
    }

    setUserVotes((prev) => ({ ...prev, [id]: false }));

    fetch(`http://localhost:3000/api/comentario/likes/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leDioLike: false }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          actualizarLikes(id);
        } else {
          setUserVotes((prev) => ({ ...prev, [id]: votoActual }));
        }
      })
      .catch((err) => {
        console.error("Error al guardar dislike:", err);
        setUserVotes((prev) => ({ ...prev, [id]: votoActual }));
      });
  };

  const responderComentario = (parentId) => {
    if (!replyText.trim() || !obra) return;

    const idUsuarioLogueado = 1;
    fetch("http://localhost:3000/api/comentario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idobra: obra.idobra,
        texto: replyText.trim(),
        idrespuesta: parentId,
        idusuario: idUsuarioLogueado,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
      })
      .then((data) => {
        const comentarioCreado = data.datos || data;
        const fechaActual = new Date().toISOString();

        const nuevaRespuesta = {
          id: comentarioCreado.idcomentario || Date.now(),
          usuario: "pepe",
          fecha: fechaActual,
          texto: replyText.trim(),
          parentId,
          idobra: obra.idobra,
        };

        setComentarios((prev) => [...prev, nuevaRespuesta]);
        setReplyText("");
        setOpenReplyId(null);
      })
      .catch((err) => {
        console.error(err);
        alert("Error al publicar la respuesta.");
      });
  };

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="detalle-container">
      {/* Header y Sinopsis (Omitidos por brevedad, se mantienen igual) */}
      <div className="detalle-header">
        <img className="detalle-portada" src={`http://localhost:3000/api/obra/${obra.idobra}/imagen`} alt={obra.titulo} />
        <div className="detalle-info">
          <h1 className="detalle-titulo">{obra.titulo}</h1>
          <p><strong>Tipo:</strong> {obra.tipo} | <strong>Género:</strong> {obra.genero}</p>
        </div>
      </div>

      <div className="comentarios-container">
        <div className="comentarios-header-wrapper">
          <h2 className="comentarios-header">
            <span>{comentariosRaiz.length} Comentarios</span>
          </h2>
          <div className="sort-container">
            <button className="btn-sort-trigger" onClick={() => setFilterOpen(!filterOpen)}>
              <i className="fas fa-sort-amount-down"></i> Ordenar por
            </button>
            {filterOpen && (
              <div className="sort-dropdown">
                <button className={sortBy === "mejores" ? "active" : ""} onClick={() => { setSortBy("mejores"); setFilterOpen(false); }}>Mejores comentarios</button>
                <button className={sortBy === "reciente" ? "active" : ""} onClick={() => { setSortBy("reciente"); setFilterOpen(false); }}>Más recientes primero</button>
                <button className={sortBy === "antiguo" ? "active" : ""} onClick={() => { setSortBy("antiguo"); setFilterOpen(false); }}>Más antiguos primero</button>
              </div>
            )}
          </div>
        </div>

        {/* EDITOR PRINCIPAL */}
        <div className="comentario-editor">
          <img className="comentario-avatar" src="https://i.pravatar.cc/50" alt="Avatar" />
          <div
            className="comentario-input-wrap"
            onMouseDown={() => { isPointerDownInsideEditor.current = true; }}
            onMouseUp={() => { setTimeout(() => { isPointerDownInsideEditor.current = false; }, 0); }}
          >
            <textarea
              className="comentario-textarea"
              placeholder="Añade un comentario público..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              onFocus={() => setShowMainActions(true)}
              onBlur={(e) => {
                const related = e.relatedTarget;
                if (related && e.currentTarget.parentNode.contains(related)) {
                  return;
                }
                if (isPointerDownInsideEditor.current) {
                  return;
                }
                if (!nuevoComentario.trim()) {
                  setShowMainActions(false);
                }
              }}
            />
            {showMainActions && (
              <div className="comentario-actions">
                <button className="btn-cancelar" onMouseDown={(e) => e.preventDefault()} onClick={() => {
                  setNuevoComentario("");
                  setShowMainActions(false);
                }}>Cancelar</button>
                <button 
                  className="btn-comentar" 
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={enviarComentario}
                  disabled={!nuevoComentario.trim()}
                >
                  Comentar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="comentarios-list">
          {comentariosOrdenados.map((item) => {
            const respuestas = comentarios.filter((x) => x.parentId === item.id);
            const repliesOpen = openReplies[item.id];

            return (
              <div className="comentario-card-wrapper" key={item.id}>
                <div className="comentario-card">
                  <div className="comentario-meta">
                    <span className="comentario-user">{item.usuario}</span>
                    <span className="comentario-fecha">{formatearTiempo(item.fecha)}</span>
                  </div>
                  <p className="comentario-texto indentado">{item.texto}</p>
                  <div className="comentario-actions-row indentado">
                    <button className="btn-like" onClick={() => darLike(item.id)}>
                      {userVotes[item.id] === true ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                    </button>
                    {likes[item.id] > 0 && <span className="like-count">{likes[item.id]}</span>}
                    <button className="btn-dislike" onClick={() => darDislike(item.id)}>
                      {userVotes[item.id] === false ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                    </button>
                    <button className="btn-responder" onClick={() => {
                      const newId = openReplyId === item.id ? null : item.id;
                      setOpenReplyId(newId);
                      if (newId) {
                        setTimeout(() => replyTextareaRef.current?.focus(), 0);
                      }
                    }}>Responder</button>
                  </div>
                </div>

                {/* EDITOR DE RESPUESTA */}
                {openReplyId === item.id && (
                  <div className="respuesta-editor indentado">
                    <textarea
                      ref={replyTextareaRef}
                      className="comentario-textarea"
                      placeholder={`Respuesta a ${item.usuario}`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="comentario-actions">
                      <button className="btn-cancelar" onMouseDown={(e) => e.preventDefault()} onClick={() => { setReplyText(""); setOpenReplyId(null); }}>Cancelar</button>
                      <button 
                        className="btn-comentar" 
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => responderComentario(item.id)}
                        disabled={!replyText.trim()}
                      >
                        Responder
                      </button>
                    </div>
                  </div>
                )}

                {/* HILO DE RESPUESTAS */}
                {repliesOpen ? (
                  <div className="respuestas-thread-container">
                    {respuestas.map((resp) => (
                      <div className="comentario-card respuesta" key={resp.id}>
                        <div className="comentario-meta">
                          <span className="comentario-user">{resp.usuario}</span>
                          <span className="comentario-fecha">{formatearTiempo(resp.fecha)}</span>
                        </div>
                        <p className="comentario-texto indentado">{resp.texto}</p>
                        <div className="comentario-actions-row indentado">
                          <button className="btn-like" onClick={() => darLike(resp.id)}>
                            {userVotes[resp.id] === true ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                          </button>
                          {likes[resp.id] > 0 && <span className="like-count">{likes[resp.id]}</span>}
                          <button className="btn-dislike" onClick={() => darDislike(resp.id)}>
                            {userVotes[resp.id] === false ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                          </button>
                          <button className="btn-responder" onClick={() => {
                            const newId = openReplyId === resp.id ? null : resp.id;
                            setOpenReplyId(newId);
                            if (newId) {
                              setTimeout(() => replyTextareaRef.current?.focus(), 0);
                            }
                          }}>Responder</button>
                        </div>
                      </div>
                    ))}
                    <button className="btn-ver-respuestas" onClick={() => setOpenReplies(p => ({ ...p, [item.id]: false }))}>
                      <i className="fas fa-chevron-up"></i> Ocultar respuestas
                    </button>
                  </div>
                ) : (
                  respuestas.length > 0 && (
                    <button className="btn-ver-respuestas" onClick={() => setOpenReplies(p => ({ ...p, [item.id]: true }))}>
                      <i className="fas fa-caret-down"></i> {respuestas.length} respuestas
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DetalleObra;