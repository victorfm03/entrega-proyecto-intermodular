const getTituloPorIdioma = (obra) => {
  const selectedLanguage =
    localStorage.getItem("language") || "es-ES";

  if (!obra) return "Sin título";

  const traduccion = obra.traducciones?.find(
    (t) => t.idioma === selectedLanguage
  );

  return (
    traduccion?.titulo ||
    obra.titulo_original ||
    obra.titulo ||
    "Sin título"
  );
};

export default getTituloPorIdioma;