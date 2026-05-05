const Respuesta= require("../utils/respuesta");

const {logMensaje} = require("../utils/logger.js");

const initModels=require("../models/init-models.js").initModels;

const sequelize=require("../config/squelize.js");

const models=initModels(sequelize);

const ListaObra= models.listaobra;

class listaObraController{
    async createListaObra(req, res){

        const listaObra= req.body;

        try {

            const newListaObra= await ListaObra.create(listaObra);
            res.status(201).json(Respuesta.exito(newListaObra,"listaObra insertada"))

        }catch (err){
            logMensaje("Error :"+err);
            res.status(500).json(Respuesta.error(null,"Error al crear la listaObra "))
        }

    }

    async addFavorito(req, res) {
    const { idlista, idobra } = req.body;

    try {

        if (!idlista || !idobra) {
            return res.status(400).json(
                Respuesta.error(null, "Faltan datos (idlista o idobra)")
            );
        }

        const data = { idlista, idobra };

        const newListaObra = await ListaObra.create(data);

        res.status(201).json(
            Respuesta.exito(newListaObra, "Favorito añadido")
        );

    } catch (err) {
        logMensaje("Error: " + err);
        res.status(500).json(
            Respuesta.error(null, "No se pudo agregar a favoritos")
        );
    }
}

        async removeFavorito(req, res) {

        const idusuario=req.params.idusuario;
        const idobra=req.params.idobra;

        try {

            const listaFavoritos= await models.lista.findAll({
                where: {nombrelista: "Favoritos", idusuario},
            });

            const numFilas= await ListaObra.destroy({
                where: {
                    idlista: listaFavoritos[0].idlista,
                    idobra: idobra
                }
            });

            if (numFilas== 0){

                res.status(404).json(Respuesta.error(null,"No se encontro la listaObra del id: "+id_lista+" y id: "+id_obra));
            }else{

                res.status(204).send();
            }

        }catch (err) {
                    logMensaje("Error: "+err)
                    res.status(500).json(Respuesta.error(null, "No se pudo agregar a favoritos"))
                }
    }

 // backend/controllers/listaObraController.js
async getAllFavoritos(req, res) {
    const idusuario = req.params.idusuario;
    try {
        const favoritos = await models.obra.findAll({
            include: [
                {
                    model: models.listaobra,
                    as: 'listaobras', // OBLIGATORIO: Debe coincidir con init-models.js
                    required: true,
                    include: [{
                        model: models.lista,
                        as: 'idlista_lista', // OBLIGATORIO: Debe coincidir con init-models.js
                        where: { idusuario: idusuario, nombrelista: "Favoritos" },
                    }]
                },
                {
                    model: models.obra_traduccion,
                    as: 'traducciones'
                }
            ]
        });
        res.json(Respuesta.exito(favoritos, "Se recuperaron los favoritos"));
    } catch (err) {
        logMensaje("Error: " + err);
        res.status(500).json(Respuesta.error(null, "No se pudo recuperar los favoritos"));
    }
}

    async getListaObraByIdLista(req, res){
    
            const id_lista=req.params.idlista;
    
            try {
    
                const data= await ListaObra.findAll({
                    where: {
                        idlista: id_lista
                    }
                });
                if(!data){
                    res.status(404).json(Respuesta.error(null, "ListaObra inexistente"));
                }else{
                res.json(Respuesta.exito(data,"Se recupero la ListaObra"));
            }
    
            }catch (err){
                logMensaje("Error: "+err)
                res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las ListaObras"))
            }
    
        }

    async getAllListaObras(req, res){

        try {

            const data= await ListaObra.findAll();
            res.json(Respuesta.exito(data,"Se recuperaron todas las listaObras"));

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las listaObras"))
        }

    }

    async deleteListaObra(req, res){

        const id_lista=req.params.idlista;
        const id_obra=req.params.idobra;

        try {

            const numFilas= await ListaObra.destroy({
                where: {
                    idlista: id_lista,
                    idobra: id_obra
                }
            });

            if (numFilas== 0){

                res.status(404).json(Respuesta.error(null,"No se encontro la listaObra del id: "+id_lista+" y id: "+id_obra));
            }else{

                res.status(204).send();
            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las listaObras"))
        }

    }

    async updateListaObra(req, res){

        const listaObra= req.body;
        const idlista= req.params.idlista;

        const idobra=req.params.idobra;

        if (idlista!= listaObra.idlista){
            return res.status(400).json(Respuesta.error(null,"No existe el id: "+idlista))
        }

        try {

            const numFilas= await ListaObra.update({...listaObra},{where:{idlista,idobra}});

            if (numFilas == 0) {

                res.status(404).json(Respuesta.error(null, "No se pudo modificar la listaObra con el id: " + idlista));
            }else{

                res.status(204).send();

            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron actualizar las listaObras"))
        }

    }
}
module.exports=new listaObraController()