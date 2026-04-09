const Respuesta= require("../utils/respuesta");

const {logMensaje} = require("../utils/logger.js");

const initModels=require("../models/init-models.js").initModels;

const sequelize=require("../config/squelize.js");

const models=initModels(sequelize);

const likesComentario= models.likesComentario;

class likesController{
async createLike(req, res) {
        const idcomentario = req.params.idcomentario;
        const { leDioLike } = req.body;
        const idusuario = 1; // Usuario hardcodeado

        try {
            // Verificar si ya existe un voto del usuario para este comentario
            const votoExistente = await likesComentario.findOne({
                where: { idComentario: idcomentario, idUsuario: idusuario }
            });

            if (votoExistente) {
                // Si existe y el voto es diferente, actualizar
                if (votoExistente.leDioLike !== leDioLike) {
                    await likesComentario.update(
                        { leDioLike: leDioLike },
                        { where: { idComentario: idcomentario, idUsuario: idusuario } }
                    );
                    return res.status(200).json(Respuesta.exito(null, "Voto actualizado"));
                } else {
                    // Si es el mismo voto, no hacer nada
                    return res.status(200).json(Respuesta.exito(null, "Voto sin cambios"));
                }
            }

            // Si no existe, crear nuevo
            await likesComentario.create({
                idComentario: idcomentario,
                leDioLike: leDioLike,
                idUsuario: idusuario
            });

            res.status(201).json(Respuesta.exito(null, "Comentario likeado"));
        } catch (err) {
            logMensaje("Error en createLike: " + err);
            res.status(500).json(Respuesta.error(null, "Error al crear el like"));
        }
    }

    async getLikes(req, res) {
            const id_comentario = req.params.idcomentario;

            try {
                const data = await likesComentario.findAll({
                    where: { idComentario: id_comentario, leDioLike: true },
                    attributes: [[sequelize.literal('COUNT(*)'), 'totalLikes']],
                    raw: true
                });

                if (!data || data.length === 0) {
                    return res.json(Respuesta.exito(0, "Likes recuperados"));
                }

                // Devolvemos el número de likes
                res.json(Respuesta.exito(data[0].totalLikes, "Likes recuperados"));
            } catch (err) {
                logMensaje("Error en getLikes: " + err);
                res.status(500).json(Respuesta.error(null, "Error al recuperar los likes"));
            }
        }



    async deleteVote(req, res) {
        const idcomentario = req.params.idcomentario;
        const idusuario = req.params.idusuario;

        try {

            const numFilas = await likesComentario.destroy(
                { where: { 
                            idComentario: idcomentario, 
                            idUsuario: idusuario 
                        } }
            );

            if (numFilas === 0) {
                return res.status(404).json(Respuesta.error(null, "No se encontró el comentario"));
            }

            res.status(200).json(Respuesta.exito(null, "Voto eliminado correctamente"));
        } catch (err) {
            logMensaje("Error en deleteVote: " + err);
            res.status(500).json(Respuesta.error(null, "Error al eliminar el voto"));
        }
    }

    async updateLikes(req, res) {
        const idcomentario = req.params.idcomentario;
        const idusuario = req.params.idusuario;
        const { leDioLike } = req.body; // Espera un booleano puro (true/false)

        try {
            // Sequelize se encarga de convertir true -> 1 y false -> 0 en la BD
            const [numFilas] = await likesComentario.update(
                { leDioLike: leDioLike },
                { where: { idComentario: idcomentario, idUsuario: idusuario } }
            );

            if (numFilas === 0) {
                res.status(404).json(Respuesta.error(null, "No se encontró el comentario"));
            } else {
                // Devolvemos el estado confirmado
                res.status(200).json(Respuesta.exito(leDioLike, "Voto actualizado"));
            }
        } catch (err) {
            logMensaje("Error: " + err);
            res.status(500).json(Respuesta.error(null, "Error al actualizar el voto"));
        }
    }
}

module.exports=new likesController()