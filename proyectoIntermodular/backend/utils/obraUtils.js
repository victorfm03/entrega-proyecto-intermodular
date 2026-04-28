const axios = require('axios');
const https = require('https');
const { type } = require('os');

async function imageUrlToBase64(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });

  const contentType = response.headers['content-type'];
  const base64 = Buffer.from(response.data, 'binary').toString('base64');

  return `data:${contentType};base64,${base64}`;
}

function traducirEstado(estado) {
    var estadoTraducido;
    switch (estado.toLowerCase()) {
        case "complete":
        case "finished":
        case "finished airing":
            estadoTraducido = "finalizado";
            break;
        case "airing":
        case "publishing":
        case "currently airing":
            estadoTraducido = "en emision";
            break;
        case "upcoming":
        case "not yet aired":
            estadoTraducido = "proximamente";
            break;
        case "hiatus":
            estadoTraducido = "pausado";
            break;
        case "discontinued":
            estadoTraducido = "cancelado";
    }
    return estadoTraducido;
}

function getTituloPorIdioma(obra, idioma) {
    if(!obra){
        const titles= obra.titles || [];
        const buscarTitulo = titles.find((t) => t.type?.toLowerCase() === type.toLowerCase())?.title;

        switch (idioma) {
            case "es-ES":
                return (
                    buscarTitulo("castellano") ||
                    obra.title_english ||
                    obra.title || null
                );
            case "es-MX":
                return (
                    buscarTitulo("español latino") ||
                    obra.title_english ||
                    obra.title || null
                );
            case "en":
                return (
                    buscarTitulo("English") ||
                    obra.title_english ||
                    obra.title ||
                    "Sin título"
                );

            case "ja":
                return (
                    buscarTitulo("Japanese") ||
                    obra.title_japanese ||
                    obra.title ||
                    "Sin título"
                );

            case "fr":
                return (
                    buscarTitulo("French") ||
                    obra.title_english ||
                    obra.title ||
                    "Sin título"
                );

            case "de":
                return (
                    buscarTitulo("German") ||
                    obra.title_english ||
                    obra.title ||
                    "Sin título"
                );

            default:
                return obra.title || "Sin título";
        }
    }
}

module.exports = { imageUrlToBase64, traducirEstado, getTituloPorIdioma };