const Respuesta= require("../utils/respuesta");

const {logMensaje} = require("../utils/logger.js");

const initModels=require("../models/init-models.js").initModels;

const sequelize=require("../config/squelize.js");

const models=initModels(sequelize);

const traducciones= models.obra_traduccion;

const { Op } = require("sequelize");

const axios = require("axios");

class traduccionesController{
    async createTraduccion(req, res){

        const traduccion= req.body;

        console.log(traduccion);
        try {

            const newTraduccion= await traducciones.create(traduccion);
            res.status(201).json(Respuesta.exito(newTraduccion,"traduccion insertada"))

        }catch (err){
            logMensaje("Error :"+err);
            res.status(500).json(Respuesta.error(null,"Error al crear la traduccion"))
        }

    }

    async getTraduccionById(req, res){
    
            const id_traduccion=req.params.id_traduccion;
            const id_obra=req.params.id_obra;

    
            try {
    
                const data= await traducciones.findOne({
                    where: {
                        id_traduccion: id_traduccion,
                        obra_id: id_obra
                    }
                });
                if(!data){
                    res.status(404).json(Respuesta.error(null, "Traduccion inexistente"));
                }else{
                res.json(Respuesta.exito(data,"Se recupero la Traduccion"));
            }
    
            }catch (err){
                logMensaje("Error: "+err)
                res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las Traducciones"))
            }
    
        }




    async getAllTraducciones(req, res){

        try {

            const data= await traducciones.findAll();
            res.json(Respuesta.exito(data,"Se recuperaron todos las traducciones"));

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las Traducciones"))
        }

    }

    async deleteTraduccion(req, res){

        const id_traduccion=req.params.id_traduccion;
        const id_obra=req.params.id_obra;

        try {

            const numFilas= await traducciones.destroy({
                where: {
                    id_traduccion: id_traduccion,
                    obra_id: id_obra
                }
            });

            if (numFilas== 0){

                res.status(404).json(Respuesta.error(null,"No se encontro la traduccion del id: "+id_traduccion));
            }else{

                res.status(204).send();
            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar las traducciones"))
        }

    }

    async updateTraduccion(req, res){

        const traduccion= req.body;
        const id_traduccion= req.params.id_traduccion;
        const id_obra= req.params.id_obra;

        if (id_traduccion!= traduccion.id_traduccion){
            return res.status(400).json(Respuesta.error(null,"No existe el id: "+id_traduccion))
        }

        try {

            const numFilas= await traducciones.update({...traduccion},{where:{id_traduccion: id_traduccion, obra_id: id_obra}});

            if (numFilas == 0) {

                res.status(404).json(Respuesta.error(null, "No se pudo modificar la traduccion con el id: " + id_traduccion));
            }else{

                res.status(204).send();

            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron actualizar las traducciones"))
        }

    }

    

        
}
module.exports=new traduccionesController()