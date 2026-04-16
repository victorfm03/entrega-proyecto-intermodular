const Respuesta= require("../utils/respuesta");

const {logMensaje} = require("../utils/logger.js");

const initModels=require("../models/init-models.js").initModels;

const sequelize=require("../config/squelize.js");

const models=initModels(sequelize);

const Comentario= models.comentario;
const likesComentario= models.likesComentario;

class comentarioController{
    async createComentario(req, res){

        const { idobra, texto, idrespuesta, idusuario } = req.body;

        try {
            const newComentario = await Comentario.create({
                idobra,
                texto,
                idrespuesta: idrespuesta || null,
                idusuario,
            });

            const usuario= await models.usuario.findByPk(idusuario);

            newComentario.dataValues.nombre = usuario.nombre;
            res.status(201).json(Respuesta.exito(newComentario, "comentario insertado"));

        } catch (err) {
            logMensaje("Error :" + err);
            res.status(500).json(Respuesta.error(null, "Error al crear el comentario"));
        }

    }

    async getComentarioById(req, res){
    
            const id_comentario=req.params.idcomentario;
    
            try {
    
                const data= await Comentario.findByPk(id_comentario);
                if(!data){
                    res.status(404).json(Respuesta.error(null, "Comentario inexistente"));
                }else{
                res.json(Respuesta.exito(data,"Se recupero el Comentario"));
            }
    
            }catch (err){
                logMensaje("Error: "+err)
                res.status(500).json(Respuesta.error(null, "No se pudieron recuperar los Comentarios"))
            }
    
        }

    async getAllComentarios(req, res){

        try {

            const data= await Comentario.findAll();
            res.json(Respuesta.exito(data,"Se recuperaron todos los comentarios"));

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar los comentarios"))
        }

    }


    async getComentariosByObraID(req, res){

        const id_obra=req.params.idobra;

        try {

            const comentarios= await Comentario.findAll({
                where: {idobra: id_obra},
                include: [
                    {
                        model: models.usuario,
                        as: "idusuario_usuario",
                        attributes: ['nombre']
                    }]
            });

            // Obtener likes para cada comentario usando la lógica de getLikes
            const comentariosConLikes = await Promise.all(comentarios.map(async (comentario) => {
                const likesData = await likesComentario.findAll({
                    where: { idComentario: comentario.idcomentario, leDioLike: true },
                    attributes: [[sequelize.literal('COUNT(*)'), 'totalLikes']],
                    raw: true
                });

                const votoUsuario = await likesComentario.findOne({
                    where: { idComentario: comentario.idcomentario, idUsuario: 1 },
                    attributes: ['leDioLike'],
                    raw: true
                });
                
                return {
                    ...comentario.toJSON(),
                    totalLikes: likesData?.[0]?.totalLikes || 0,
                    currentUserVote: votoUsuario ? Boolean(votoUsuario.leDioLike) : null
                };
            }));

            res.json(Respuesta.exito(comentariosConLikes,"Se recuperaron los comentarios de la obra con likes"));
        } catch (err) {
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar los comentarios"))
        }

    }

    async deleteComentario(req, res){

        const id_comentario=req.params.idcomentario;

        try {

            const numFilas= await Comentario.destroy({
                where: {
                    idcomentario: id_comentario
                }
            });

            if (numFilas== 0){

                res.status(404).json(Respuesta.error(null,"No se encontro el comentario del id: "+id_comentario));
            }else{

                res.status(204).send();
            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar los comentarios"))
        }

    }

    async updateComentario(req, res){

        const comentario= req.body;
        const idcomentario= req.params.idcomentario;

        if (idcomentario!= comentario.idcomentario){
            return res.status(400).json(Respuesta.error(null,"No existe el id: "+idcomentario))
        }

        try {

            const numFilas= await Comentario.update({...comentario},{where:{idcomentario}});

            if (numFilas == 0) {

                res.status(404).json(Respuesta.error(null, "No se pudo modificar el comentario con el id: " + idcomentario));
            }else{

                res.status(204).send();

            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron actualizar los comentarios"))
        }

    }
}
module.exports=new comentarioController()