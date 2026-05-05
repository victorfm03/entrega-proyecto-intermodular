import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { apiUrl } from "../config.js";
import { MDBBtn, MDBRow, MDBCol, MDBIcon } from "mdb-react-ui-kit";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TrophyIcon from "@mui/icons-material/EmojiEvents";

const charactersCache = [];
const usedCharacters = new Set();

// Diccionario de traducciones
const translations = {
  es: {
    startTitle: "¡Desafío AniManga!",
    startSubtitle: "¿Cuánto sabes de tus personajes favoritos?",
    startBtn: "¡Empezar a Jugar!",
    highScore: "Puntuación Máxima",
    questionText: "¿Quién es este personaje?",
    hits: "Aciertos",
    gameOver: "¡Juego Terminado!",
    finalScore: "Tu puntuación final es de",
    restartBtn: "Volver a Intentar",
    exitBtn: "Salir al Inicio",
    loading: "Cargando...",
  },
  en: {
    startTitle: "AniManga Challenge!",
    startSubtitle: "How much do you know about your favorite characters?",
    startBtn: "Start Playing!",
    highScore: "High Score",
    questionText: "Who is this character?",
    hits: "Hits",
    gameOver: "Game Over!",
    finalScore: "Your final score is",
    restartBtn: "Try Again",
    exitBtn: "Back to Home",
    loading: "Loading...",
  },
  fr: {
    startTitle: "Défi AniManga !",
    startSubtitle: "Que savez-vous de vos personnages préférés ?",
    startBtn: "Commencer à jouer !",
    highScore: "Meilleur score",
    questionText: "Qui est ce personnage ?",
    hits: "Succès",
    gameOver: "Jeu terminé !",
    finalScore: "Votre score final est de",
    restartBtn: "Réessayer",
    exitBtn: "Retour a l'accueil",
    loading: "Chargement...",
  },
  de: {
    startTitle: "AniManga Herausforderung!",
    startSubtitle: "Wie gut kennst du deine Lieblingscharaktere?",
    startBtn: "Spiel starten!",
    highScore: "Höchstpunktzahl",
    questionText: "Wer ist dieser Charakter?",
    hits: "Treffer",
    gameOver: "Spiel vorbei!",
    finalScore: "Deine Endpunktzahl ist",
    restartBtn: "Nochmal versuchen",
    exitBtn: "Zurück zum Start",
    loading: "Laden...",
  },
  pt: {
    startTitle: "Desafio AniManga!",
    startSubtitle: "Quanto você sabe sobre seus personagens favoritos?",
    startBtn: "Começar a jogar!",
    highScore: "Pontuação Máxima",
    questionText: "Quem é este personagem?",
    hits: "Acertos",
    gameOver: "Fim de jogo!",
    finalScore: "Sua pontuação final é",
    restartBtn: "Tentar Novamente",
    exitBtn: "Sair para o Início",
    loading: "Carregando...",
  },
  ja: {
    startTitle: "アニマンガ・チャレンジ！",
    startSubtitle: "お気に入りのキャラクターについてどれだけ知っていますか？",
    startBtn: "プレイ開始！",
    highScore: "最高得点",
    questionText: "このキャラクターは誰？",
    hits: "正解数",
    gameOver: "ゲームオーバー！",
    finalScore: "あなたの最終スコアは",
    restartBtn: "もう一度挑戦",
    exitBtn: "ホームに戻る",
    loading: "読み込み中...",
  },
};

// Recibe selectedLanguage como prop (ahora vía Outlet context)
function Quiz() {
  const { selectedLanguage } = useOutletContext();
  const navigate = useNavigate();
  // Obtener textos según idioma (por defecto español)
  const t = translations[selectedLanguage] || translations.es;

  const [gameState, setGameState] = useState("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const idUsuario = localStorage.getItem("idUsuario");
  const hasLoadedCharacters = useRef(false);

  useEffect(() => {
    // Cargar puntuación si hay un usuario logueado
    if (idUsuario) {
      const idLimpio = idUsuario.replace(/['"]+/g, "").trim();
      fetch(`${apiUrl}/usuario/${idLimpio}`)
        .then((res) => res.json())
        .then((data) => {
          // Accedemos a data.datos.puntuacionquiz según el formato de Respuesta.exito
          const userScore = data.datos?.puntuacionquiz;
          if (userScore !== undefined && userScore !== null) {
            setHighScore(userScore);
          }
        })
        .catch((err) => console.error("Error al obtener puntuación:", err));
    }
  }, [idUsuario]); // Se ejecuta cuando el idUsuario cambia

  useEffect(() => {
    if (hasLoadedCharacters.current) return;
    hasLoadedCharacters.current = true;
    const init = async () => {
      await loadCharacters();
      setLoading(false);
    };
    init();
  }, []);

  const updateHighScore = async (newScore) => {
    const idRaw = localStorage.getItem("idUsuario");
    if (!idRaw) return;
    const idLimpio = idRaw.replace(/['"]+/g, "").trim();
    const urlFinal = `${apiUrl}/usuario/puntuacion/${idLimpio}`;

    try {
      const response = await fetch(urlFinal, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario: Number(idLimpio),
          puntuacionquiz: Number(newScore),
        }),
      });
      if (response.ok) {
        setHighScore(newScore);
      }
    } catch (error) {
      console.error("Fallo de red:", error);
    }
  };

  async function loadCharacters() {
    if (charactersCache.length > 0) return;
    const pagesToFetch = 3;
    for (let page = 1; page <= pagesToFetch; page++) {
      const res = await fetch(
        `https://api.jikan.moe/v4/characters?page=${page}`,
      );
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 6000));
        page--;
        continue;
      }
      const data = await res.json();
      const validCharacters = data.data.filter(
        (c) =>
          c.images?.jpg?.image_url &&
          !c.images.jpg.image_url.includes("questionmark"),
      );
      validCharacters.forEach((c) => {
        charactersCache.push({ name: c.name, image: c.images.jpg.image_url });
      });
    }
  }

  function getRandomCharacter() {
    let character;
    do {
      character =
        charactersCache[Math.floor(Math.random() * charactersCache.length)];
    } while (usedCharacters.has(character.name));
    usedCharacters.add(character.name);
    return character;
  }

  async function generateOptions(correctAnswer) {
    if (!charactersCache.length)
      return [correctAnswer, t.loading, t.loading, t.loading];
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
      const randomCharacter =
        charactersCache[Math.floor(Math.random() * charactersCache.length)];
      if (randomCharacter) options.add(randomCharacter.name);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  }

  async function createQuestion() {
    const character = getRandomCharacter();
    const options = await generateOptions(character.name);
    return {
      id: Date.now(),
      question: t.questionText, // Usar traducción aquí
      image: character.image,
      answer: character.name,
      options,
    };
  }

  const loadNextQuestion = async () => {
    const newQuestion = await createQuestion();
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleStart = async () => {
    usedCharacters.clear();
    setLoading(true);
    const firstQuestion = await createQuestion();
    setQuestions([firstQuestion]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedOption(null);
    setShowFeedback(false);
    setGameState("playing");
    setLoading(false);
  };

  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0 && !showFeedback) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showFeedback) {
      handleOptionClick(null);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, showFeedback]);

  const handleOptionClick = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);

    if (option === questions[currentQuestionIndex].answer) {
      // 1. Aumentamos el score actual
      setScore((prevScore) => {
        const newScore = prevScore + 1;

        // 2. ACTUALIZACIÓN CRÍTICA: Si el nuevo score supera al máximo, actualizamos highScore en el estado
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        return newScore;
      });

      if (currentQuestionIndex + 1 >= questions.length) loadNextQuestion();

      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(15);
        setSelectedOption(null);
        setShowFeedback(false);
      }, 1200);
    } else {
      // Si pierde, enviamos la puntuación definitiva a la DB
      updateHighScore(score > highScore ? score : highScore);
      setTimeout(() => setGameState("finished"), 1200);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const pageStyle = {
    minHeight: "100vh",
    width: "100vw",
    background:
      "linear-gradient(135deg, #7e1b55 0%, #9e1c4e 45%, #4a0404 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: "'Inter', sans-serif",
    margin: "0",
    padding: "0",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1050,
  };

  if (gameState === "start") {
    return (
      <div style={pageStyle}>
        <div style={{ position: "absolute", top: "20px", left: "20px" }}>
          <MDBBtn
            color="link"
            onClick={() => navigate(-1)}
            style={{
              color: "rgba(255, 255, 255, 0.5)", // Gris muy pálido
              padding: "10px",
              textDecoration: "none",
              backgroundColor: "transparent",
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <MDBIcon fas icon="arrow-left" size="1x" /> Volver
          </MDBBtn>
        </div>
        <div
          className="text-center p-5 animate__animated animate__zoomIn"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
          }}
        >
          <AutoAwesomeIcon
            style={{ fontSize: "80px", color: "#ffcc00" }}
            className="mb-4"
          />
          <h1 className="display-3 fw-bold mb-3">{t.startTitle}</h1>
          <p className="lead mb-4">{t.startSubtitle}</p>
          <div className="mb-4">
            <h5
              className="text-uppercase"
              style={{ letterSpacing: "2px", opacity: 0.8 }}
            >
              {t.highScore}
            </h5>
            <div className="display-4 fw-bold text-warning" translate="no">
              {highScore}
            </div>
          </div>
          <div>
          <MDBBtn
            size="lg"
            onClick={handleStart}
            style={{
              background: "linear-gradient(90deg, #d63384 0%, #8a2be2 100%)",
              borderRadius: "50px",
              padding: "15px 40px",
            }}
          >
            {t.startBtn}
          </MDBBtn>
          </div>

          <div className="mt-4">
          <MDBBtn 
            size="lg" 
            style={{
              backgroundColor:"white",
              color:"black",
              borderRadius: "50px",
              padding: "15px 40px",
            }} 
            onClick={() => navigate("/")}>
            {t.exitBtn}
          </MDBBtn>
          </div>
        </div>

      </div>
    );
  }

  if (gameState === "playing" && currentQuestion) {
    return (
      <div style={pageStyle}>
        <div style={{ position: "absolute", top: "20px", left: "20px" }}>
          <MDBBtn
            color="link"
            onClick={() => navigate(-1)}
            style={{
              color: "rgba(255, 255, 255, 0.5)", // Gris muy pálido
              padding: "10px",
              textDecoration: "none",
              backgroundColor: "transparent",
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <MDBIcon fas icon="arrow-left" size="1x" /> Volver
          </MDBBtn>
        </div>
        <div className="text-center w-100 px-4" style={{ maxWidth: "800px" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
              {t.hits}: <span translate="no">{score}</span>
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              <TimerIcon className="me-2" />
              <span
                className={timeLeft < 5 ? "text-danger" : ""}
                translate="no"
              >
                {timeLeft}s
              </span>
            </div>
          </div>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "30px",
            }}
          >
            {currentQuestion.question}
          </h2>
          <div
            style={{
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "40px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: "15px",
            }}
          >
            <img
              src={currentQuestion.image}
              alt="Character"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                filter: !showFeedback
                  ? "saturate(0) contrast(3) drop-shadow(0 0 20px rgba(255,255,255,0.9))"
                  : "none",
                transition: "filter 0.5s ease",
                objectFit: "contain",
              }}
            />
          </div>
          <MDBRow className="g-4">
            {currentQuestion.options.map((option, index) => (
              <MDBCol md="6" key={index}>
                <div
                  onClick={() => handleOptionClick(option)}
                  style={{
                    padding: "20px",
                    borderRadius: "15px",
                    backgroundColor: showFeedback
                      ? option === currentQuestion.answer
                        ? "rgba(40, 167, 69, 0.4)"
                        : option === selectedOption
                          ? "rgba(220, 53, 69, 0.4)"
                          : "rgba(255, 255, 255, 0.1)"
                      : "rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                  }}
                >
                  {option}
                </div>
              </MDBCol>
            ))}
          </MDBRow>
        </div>
      </div>
    );
  }

  if (gameState === "finished") {
    return (
      <div style={pageStyle}>
        <div
          className="text-center p-5"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "20px" }}
        >
          <TrophyIcon
            style={{ fontSize: "100px", color: "#ffcc00" }}
            className="mb-4"
          />
          <h1 className="display-4 fw-bold mb-2">{t.gameOver}</h1>
          <p className="fs-4 mb-4">
            {t.finalScore}:{" "}
            <span className="fw-bold text-warning" translate="no">
              {score}
            </span>
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <MDBBtn size="lg" onClick={handleStart} color="primary">
              {t.restartBtn}
            </MDBBtn>
            <MDBBtn size="lg" color="light" onClick={() => navigate("/")}>
              {t.exitBtn}
            </MDBBtn>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Quiz;
