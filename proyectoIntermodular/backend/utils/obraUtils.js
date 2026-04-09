const axios = require('axios');
const https = require('https');

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

module.exports = { imageUrlToBase64, traducirEstado};