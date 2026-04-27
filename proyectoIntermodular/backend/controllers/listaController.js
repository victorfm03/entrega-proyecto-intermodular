const Respuesta= require("../utils/respuesta");

const {logMensaje} = require("../utils/logger.js");

const initModels=require("../models/init-models.js").initModels;

const sequelize=require("../config/squelize.js");

const models=initModels(sequelize);

const Lista= models.lista;

class listaController{
    async createLista(req, res){

        const lista= req.body;

        try {

            const newLista= await Lista.create(lista);
            res.status(201).json(Respuesta.exito(newLista,"lista insertada"))

        }catch (err){
            logMensaje("Error :"+err);
            res.status(500).json(Respuesta.error(null,"Error al crear la lista"))
        }

    }

    async getListaById(req, res){
    
            const id_lista=req.params.idlista;
    
            try {
    
                const data= await Lista.findByPk(id_lista);
                if(!data){
                    res.status(404).json(Respuesta.error(null, "Lista inexistente"));
                }else{
                res.json(Respuesta.exito(data,"Se recupero la Lista"));
            }
    
            }catch (err){
                logMensaje("Error: "+err)
                res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las Listas"))
            }
    
        }

    async getAllListas(req, res){

        try {

            const data= await Lista.findAll();
            res.json(Respuesta.exito(data,"Se recuperaron todas las listas"));

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las listas"))
        }

    }

    async getFavoritosUsuario(req, res) {
        const idUsuario = req.params.idusuario;

        try {
            // Usamos findOrCreate para asegurarnos de que la lista exista
            const [favoritos, created] = await Lista.findOrCreate({
                where: {
                    idusuario: idUsuario,
                    nombrelista: "Favoritos"
                },
                defaults: {
                    idusuario: idUsuario,
                    nombrelista: "Favoritos"
                }
            });

            if (created) {
                logMensaje(`Lista de favoritos creada para el usuario ${idUsuario}`);
            }

            res.json(
                Respuesta.exito(favoritos, "Lista de favoritos recuperada")
            );

        } catch (err) {
            logMensaje("Error: " + err);
            res.status(500).json(
                Respuesta.error(null, "Error al recuperar favoritos")
            );
        }
    }

    async deleteLista(req, res){

        const id_lista=req.params.idlista;

        try {

            const numFilas= await Lista.destroy({
                where: {
                    idlista: id_lista
                }
            });

            if (numFilas== 0){

                res.status(404).json(Respuesta.error(null,"No se encontro la lista del id: "+id_lista));
            }else{

                res.status(204).send();
            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las listas"))
        }

    }

    async updateLista(req, res){

        const lista= req.body;
        const idlista= req.params.idlista;

        if (idlista!= lista.idlista){
            return res.status(400).json(Respuesta.error(null,"No existe el id: "+idlista))
        }

        try {

            const numFilas= await Lista.update({...lista},{where:{idlista}});

            if (numFilas == 0) {

                res.status(404).json(Respuesta.error(null, "No se pudo modificar la lista con el id: " + idlista));
            }else{

                res.status(204).send();

            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron actualizar las listas"))
        }

    }
}
module.exports=new listaController()