import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config.js";
import {
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import { ThemeContext } from "../ThemeProvider";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrophyIcon from '@mui/icons-material/EmojiEvents';

const QUESTIONS = [
  {
    id: 1,
    question: "¿Quién es este personaje?",
    image: "https://static.wikia.nocookie.net/espana-anime/images/e/ed/Monkey_D._Luffy.png",
    options: ["Zoro", "Luffy", "Sanji", "Usopp"],
    answer: "Luffy",
  },
  {
    id: 2,
    question: "¿Quién es este personaje?",
    image: "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Uzumaki.png",
    options: ["Sasuke", "Kakashi", "Naruto", "Itachi"],
    answer: "Naruto",
  },
  {
    id: 3,
    question: "¿Quién es este personaje?",
    image: "https://static.wikia.nocookie.net/dragonball/images/5/5b/Goku_In_Super_Saiyan.png",
    options: ["Vegeta", "Gohan", "Piccolo", "Goku"],
    answer: "Goku",
  },
  {
    id: 4,
    question: "¿Quién es este personaje?",
    image: "https://static.wikia.nocookie.net/shingeki-no-kyojin/images/a/a1/Eren_Jaeger_%28Anime%29_Character_Design.png",
    options: ["Levi", "Eren", "Armin", "Erwin"],
    answer: "Eren",
  },
  {
    id: 5,
    question: "¿Quién es este personaje?",
    image: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/d/d9/Tanjiro_Kamado_Character_Design.png",
    options: ["Tanjiro", "Zenitsu", "Inosuke", "Giyu"],
    answer: "Tanjiro",
  },
];

function Quiz() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("start"); // 'start', 'playing', 'finished'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const idUsuario = localStorage.getItem("idUsuario");

  // Obtener récord del usuario
  useEffect(() => {
    if (idUsuario) {
      fetch(`${apiUrl}/usuario/${idUsuario}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.datos.puntuacionquiz) {
            setHighScore(data.datos.puntuacionquiz);
          }
        })
        .catch(err => console.error("Error cargando récord:", err));
    }
  }, [idUsuario]);

  // Actualizar récord si se supera al finalizar
  useEffect(() => {
    if (gameState === "finished" && score > highScore) {
      setHighScore(score);
      if (idUsuario) {
        fetch(`${apiUrl}/usuario/${idUsuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ puntuacionquiz: score })
        })
        .then(res => res.json())
        .catch(err => console.error("Error actualizando récord:", err));
      }
    }
  }, [gameState, score, highScore, idUsuario]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  // Estilos base de la imagen
  const pageStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #7e1b55 0%, #9e1c4e 45%, #4a0404 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: "'Inter', sans-serif",
    margin: "0",
    padding: "0",
    position: "fixed", // Para ocupar toda la pantalla sin bordes
    top: 0,
    left: 0,
    zIndex: 1050
  };

  const buttonStyle = {
    background: "linear-gradient(90deg, #d63384 0%, #8a2be2 100%)",
    border: "none",
    borderRadius: "50px",
    padding: "15px 50px",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    transition: "transform 0.2s ease"
  };

  // Temporizador
  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0 && !showFeedback) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showFeedback) {
      handleOptionClick(null); // Tiempo agotado
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, showFeedback]);

  const handleStart = () => {
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handleOptionClick = (option) => {
    if (showFeedback) return;

    setSelectedOption(option);
    setShowFeedback(true);

    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(15);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameState("finished");
      }
    }, 1500);
  };

  const renderStartScreen = () => (
    <div className="text-center animate__animated animate__fadeIn">
      <div style={{
        width: "100px",
        height: "100px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 30px",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}>
        <AutoAwesomeIcon style={{ fontSize: "50px", color: "#ffd700" }} />
      </div>
      <h1 style={{ fontSize: "4rem", fontWeight: "800", marginBottom: "10px" }}>Quiz de Siluetas</h1>
      <h3 style={{ fontSize: "1.8rem", fontWeight: "400", marginBottom: "40px", opacity: 0.9 }}>Anime & Manga</h3>
      <p style={{ fontSize: "1.2rem", marginBottom: "40px", opacity: 0.8 }}>¿Eres capaz de reconocer a estos personajes solo por su silueta?</p>
      <MDBBtn 
        style={buttonStyle}
        onClick={handleStart}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        Comenzar Quiz
      </MDBBtn>
    </div>
  );

  const renderPlayingScreen = () => {
    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="text-center w-100 px-4 animate__animated animate__fadeIn" style={{ maxWidth: "800px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>Pregunta {currentQuestionIndex + 1}/{QUESTIONS.length}</span>
          <div style={{ display: "flex", alignItems: "center", fontSize: "1.5rem", fontWeight: "700" }}>
            <TimerIcon className="me-2" />
            <span className={timeLeft < 5 ? "text-danger" : ""}>{timeLeft}s</span>
          </div>
        </div>

        <div style={{ width: "100%", height: "8px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "10px", marginBottom: "40px", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#d63384", transition: "width 0.3s ease" }} />
        </div>

        <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "30px" }}>{currentQuestion.question}</h2>

        <div style={{
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "40px",
          position: "relative"
        }}>
          <img 
            src={currentQuestion.image} 
            alt="Silueta" 
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              filter: showFeedback ? "none" : "brightness(0) drop-shadow(0 0 10px rgba(255,255,255,0.3))",
              transition: "filter 0.5s ease",
              objectFit: "contain"
            }}
          />
        </div>

        <MDBRow className="g-4">
          {currentQuestion.options.map((option, index) => {
            let bgColor = "rgba(255, 255, 255, 0.1)";
            let borderColor = "rgba(255, 255, 255, 0.2)";
            
            if (showFeedback) {
              if (option === currentQuestion.answer) {
                bgColor = "rgba(40, 167, 69, 0.4)";
                borderColor = "#28a745";
              } else if (option === selectedOption) {
                bgColor = "rgba(220, 53, 69, 0.4)";
                borderColor = "#dc3545";
              }
            }

            return (
              <MDBCol md="6" key={index}>
                <div 
                  onClick={() => handleOptionClick(option)}
                  style={{
                    padding: "20px",
                    borderRadius: "15px",
                    backgroundColor: bgColor,
                    border: `2px solid ${borderColor}`,
                    cursor: showFeedback ? "default" : "pointer",
                    fontSize: "1.3rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "80px"
                  }}
                  onMouseOver={(e) => !showFeedback && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
                  onMouseOut={(e) => !showFeedback && (e.currentTarget.style.backgroundColor = bgColor)}
                >
                  {option}
                  {showFeedback && option === currentQuestion.answer && <CheckCircleIcon className="ms-2" />}
                  {showFeedback && option === selectedOption && option !== currentQuestion.answer && <CancelIcon className="ms-2" />}
                </div>
              </MDBCol>
            );
          })}
        </MDBRow>
      </div>
    );
  };

  const renderFinishedScreen = () => {
    const percentage = (score / QUESTIONS.length) * 100;
    
    return (
      <div className="text-center animate__animated animate__fadeIn">
        <TrophyIcon style={{ fontSize: "100px", color: "#ffd700", marginBottom: "30px" }} />
        <h1 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "10px" }}>¡Completado!</h1>
        <div style={{ fontSize: "5rem", fontWeight: "800", color: "#ffd700", marginBottom: "30px" }}>
          {score} <span style={{ fontSize: "2rem", color: "white", opacity: 0.6 }}>/ {QUESTIONS.length}</span>
        </div>
        
        <p style={{ fontSize: "1.5rem", marginBottom: "40px" }}>
          Has acertado el <strong>{percentage}%</strong> de las preguntas.
        </p>

        <div className="d-flex flex-column gap-3 align-items-center">
          <MDBBtn 
            style={buttonStyle}
            onClick={handleStart}
          >
            Reintentar Quiz
          </MDBBtn>
          <MDBBtn 
            color="link" 
            style={{ color: "white", opacity: 0.7, textDecoration: "none" }}
            onClick={() => window.history.back()}
          >
            Volver al inicio
          </MDBBtn>
        </div>
      </div>
    );
  };

  return (
    <div style={pageStyle}>
      {/* Botón de volver y Puntuación arriba a la izquierda */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        zIndex: 1100
      }}>
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
            gap: "5px"
          }}
        >
          <MDBIcon fas icon="arrow-left" size="1x" /> Volver
        </MDBBtn>

        {/* Badge de Puntuación */}
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(5px)",
          padding: "8px 16px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
          fontSize: "1.1rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <TrophyIcon style={{ fontSize: "18px", color: "#ffd700" }} />
          <span>{score}</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "#ffd700" }}>{highScore}</span>
        </div>
      </div>

      {gameState === "start" && renderStartScreen()}
      {gameState === "playing" && renderPlayingScreen()}
      {gameState === "finished" && renderFinishedScreen()}
    </div>
  );
}

export default Quiz;
