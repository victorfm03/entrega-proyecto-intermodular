import React, { useState } from "react";

function AlphabeticalIndex({ letters, onLetterClick }) {
  const [activeLetter, setActiveLetter] = useState(null);

  const handleClick = (letter) => {
    setActiveLetter(letter);
    onLetterClick(letter);
  };

  return (
    <div
      style={{
        position: "fixed",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "15px 8px",
        borderRadius: "30px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        zIndex: 1000,
        maxHeight: "85vh",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        border: "1px solid rgba(0,0,0,0.05)",
        backdropFilter: "blur(4px)",
      }}
    >
      {letters.map((letter) => (
        <button
          key={letter}
          onClick={() => handleClick(letter)}
          className={`alphabet-btn ${activeLetter === letter ? "active" : ""}`}
          style={{
            border: "none",
            background: "none",
            fontSize: "0.9rem",
            fontWeight: "700",
            color: activeLetter === letter ? "#fff" : "#333", // Color negro/gris oscuro por defecto
            cursor: "pointer",
            padding: "5px",
            width: "32px",
            height: "32px",
            textAlign: "center",
            borderRadius: "50%",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: activeLetter === letter ? "#000000ff" : "transparent",
            marginBottom: "2px"
          }}
        >
          {letter}
        </button>
      ))}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
        .alphabet-btn:hover {
          background-color: #f0f0f0;
          color: #000 !important;
          transform: scale(1.2);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .alphabet-btn.active {
          background-color: #000000ff !important;
          color: #fff !important;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(214, 51, 132, 0.3);
        }
      `}</style>
    </div>
  );
}

export default AlphabeticalIndex;
