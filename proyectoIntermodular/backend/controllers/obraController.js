const { imageUrlToBase64 } = require("../utils/obraUtils.js");

const { traducirEstado } = require("../utils/obraUtils.js");

const Respuesta= require("../utils/respuesta");

const {logMensaje} = require("../utils/logger.js");

const initModels=require("../models/init-models.js").initModels;

const sequelize=require("../config/squelize.js");

const models=initModels(sequelize);

const Obra= models.obra;

const { Op } = require("sequelize");

const axios = require("axios");

class obraController{
    async createObra(req, res){

        const obra= req.body;

        try {

            const newObra= await Obra.create(obra);
            res.status(201).json(Respuesta.exito(newObra,"obra insertada"))

        }catch (err){
            logMensaje("Error :"+err);
            res.status(500).json(Respuesta.error(null,"Error al crear la obra"))
        }

    }

    async getObraById(req, res){
    
            const id_obra=req.params.idobra;
    
            try {
    
                const data= await Obra.findByPk(id_obra);
                if(!data){
                    res.status(404).json(Respuesta.error(null, "Obra inexistente"));
                }else{
                res.json(Respuesta.exito(data,"Se recupero la Obra"));
            }
    
            }catch (err){
                logMensaje("Error: "+err)
                res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las Obras"))
            }
    
        }

            async getObraPortada(req, res){
    
            const id_obra=req.params.idobra;
    
            try {
    
                const data= await Obra.findByPk(id_obra);
                if(!data){
                    res.status(404).json(Respuesta.error(null, "Obra inexistente"));
                }else{
                const base64 = data.portada.toString();
                const tipo = base64.split(';')[0].split(':')[1];
                const image = base64.replace(/^data:image\/\w+;base64,/, "");
                const imgBuffer = Buffer.from(image, 'base64');

                res.set('Content-Type', tipo);
                res.send(imgBuffer);
            }
    
            }catch (err){
                logMensaje("Error: "+err)
                res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las Obras"))
            }
    
        }

    async getObraByTitulo(req, res){

        const titulo=req.params.titulo;

        try {

            const data= await Obra.findAll({
                where: {
                    titulo: {[Op.like]: `%${titulo}%`}
                },
                include: [
                    {
                        model: models.traducciones,
                        as: "traducciones",
                    }
                ]
            });

            if(data.length===0){
                res.status(404).json(Respuesta.error(null, "Obra inexistente"));
            }else{
            res.json(Respuesta.exito(data,"Se recupero la Obra"));
        }

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las Obras"))
        }

    }

    async getAllObras(req, res){

        try {

            const data= await Obra.findAll({
                include: [
                    {
                        model: models.traducciones,
                        as: "traducciones",
                    }
                ]
            }
            );
            res.json(Respuesta.exito(data,"Se recuperaron todos las obras"));

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las obras"))
        }

    }

    async deleteObra(req, res){

        const id_obra=req.params.idobra;

        try {

            const numFilas= await Obra.destroy({
                where: {
                    idobra: id_obra
                }
            });

            if (numFilas== 0){

                res.status(404).json(Respuesta.error(null,"No se encontro la obra del id: "+id_obra));
            }else{

                res.status(204).send();
            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las obras"))
        }

    }

    async updateObra(req, res){

        const obra= req.body;
        const idobra= req.params.idobra;

        if (idobra!= obra.idobra){
            return res.status(400).json(Respuesta.error(null,"No existe el id: "+idobra))
        }

        try {

            const numFilas= await Obra.update({...obra},{where:{idobra}});

            if (numFilas == 0) {

                res.status(404).json(Respuesta.error(null, "No se pudo modificar la obra con el id: " + idobra));
            }else{

                res.status(204).send();

            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron actualizar las obras"))
        }

    }

    
    async extraerObra(req, res) {
    const esperar = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));
  const tipo = req.body.tipo; // 'anime' o 'manga'
  var totalPaginas = 5; // número de páginas a traer (25 obras por página cada una)

  var titulo="";
  
  if(req.body.nombre){
    titulo=`&q=${req.body.nombre}`;
  }
  
  if (req.body.pagina){
    totalPaginas= req.body.pagina
  }

  try {
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
      await esperar(500);
      // 1️⃣ llamar a la API externa con paginación
      console.log(`https://api.jikan.moe/v4/${tipo}?page=${pagina}&limit=25${titulo}`)
      const response = await axios.get(`https://api.jikan.moe/v4/${tipo}?page=${pagina}&limit=25${titulo}`);
      const obrasAPI = response.data.data;

      for (const obra of obrasAPI) {
        // 2️⃣ buscar en la BD
        let obraBD = await Obra.findOne({ where: { idApi: obra.mal_id } });

        // Construir el objeto a guardar/actualizar
        const obraData = {
          tipo,
          idApi: obra.mal_id,
          titulo: obra.title,
          sinopsis: obra.synopsis,
          portada: await imageUrlToBase64(obra.images.jpg.large_image_url),
          genero: (obra.themes || []).map(g => g.name).join(", "),
          estado: traducirEstado(obra.status),
          puntuacion: obra.score,
          popularidad: obra.popularity
        };

        
        if (tipo === "anime") {
          obraData.estudio = (obra.studios || []).map(s => s.name).join(", ");
          obraData.fechalanzamiento = obra.aired?.from?.split("T")[0] || null;
          obraData.trailer=obra.trailer.embed_url;
        } else {
          obraData.autor = (obra.authors || []).map(a => a.name).join(", ");
          obraData.fechalanzamiento = obra.published?.from?.split("T")[0] || null;
        }

        // 3️⃣ crear o actualizar según exista
        if (!obraBD) {
          obraBD= await Obra.create(obraData);
        } else {
          await obraBD.update(obraData);
        }

        for(const idioma of obra.titles){
            let traduccion=null;
            switch(idioma.type.toLowerCase()){
                case "spanish":
                    traduccion="es-ES";
                    break;
                case "english":
                    traduccion="en";
                    break;
                case "french":
                    traduccion="fr";
                    break;
                case "german":
                    traduccion="de";
                    break;
                case "japanese":
                    traduccion="ja";
                    break;
            }
            if(traduccion){
                let traduccionBd= await models.obra_traduccion.findOne({
                        where: {
                            obra_id: obraBD.idobra,
                            idioma: traduccion
                        }
                    });
                    if(traduccionBd){
                        await models.obra_traduccion.update({
                            titulo: idioma.title},{
                            where: {
                                obra_id: obraBD.idobra,
                                idioma: traduccion
                            }
                        });
                    }else{
                        await models.obra_traduccion.create({
                            obra_id: obraBD.idobra,
                            idioma: traduccion,
                            titulo: idioma.title
                        });
                    }
            }
        }

      }
    }

    res.status(204).send(); // sincronización completa
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al sincronizar las obras" });
  }
}

async getObrasTipo(req, res){

    const tipo=req.query.tipo;
    const orden=req.query.orden;
        try {

            var query={
                where: tipo ? { tipo } : {},
                include: [
                    {
                        model: models.obra_traduccion,
                        as: "traducciones",
                    }
                ]
            }

            if(orden){

                switch(orden){

                    case "titulo":
                        query.order=[['titulo', 'ASC']];
                        break;
                    default:
                        break;
                }
            }

            const data= await Obra.findAll(query);

            if(data.length===0){
                res.status(404).json(Respuesta.error(null, "No se encontraron obras del tipo: "+tipo));
            }else{
            res.json(Respuesta.exito(data,"Se recupero la Obra"));
        }

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las Obras"))
        }

    }


    async getObraFiltrada(req, res){

        const tipo=req.query.tipo;
        const numeroDeObras=parseInt(req.query.numeroDeObras);

        const orden=req.query.orden;

        try {

            var query={
                where: tipo ? { tipo } : {},
                limit: numeroDeObras ? parseInt(numeroDeObras) : 10
            }

            if(orden){

                switch(orden){
                    case "popularidad":
                        query.order=[['popularidad', 'ASC']];
                        break;
                    case "puntuacion":
                        query.order=[['puntuacion', 'DESC']];
                        break;
                    case "recientes":
                        query.order=[['fechalanzamiento', 'DESC']];
                        break;
                    default:
                        break;
                }
            }

            const data= await Obra.findAll(query);

            if(data.length===0){
                res.status(404).json(Respuesta.error(null, "No se encontraron obras del tipo: "+tipo));
            }else{
            res.json(Respuesta.exito(data,"Se recupero la Obra"));
        }

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las Obras"))
        }

    }

        
}
module.exports=new obraController()