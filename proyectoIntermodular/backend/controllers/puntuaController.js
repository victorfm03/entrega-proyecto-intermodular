const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/squelize.js");
const { fn, col } = require("sequelize");

const models = initModels(sequelize);
const Puntua = models.puntua;
const Obra = models.obra;

// Función fuera de la clase para evitar problemas con 'this'
const recalcularYActualizarMedia = async (idobra) => {
    if (!idobra) return;
    try {
        const resultado = await Puntua.findAll({
            attributes: [[fn('AVG', col('puntuacion')), 'media']],
            where: { idobra: idobra },
            raw: true
        });

        const nuevaMedia = resultado[0].media || 0;

        await Obra.update(
            { puntuacion: nuevaMedia }, 
            { where: { idobra: idobra } }
        );
        logMensaje(`Media actualizada para obra ${idobra}: ${nuevaMedia}`);
    } catch (error) {
        logMensaje("Error crítico recalculando media: " + error);
    }
};

class puntuaController {
    
    async createPuntua(req, res) {
        const { idusuario, idobra, valoracion } = req.body;
        try {
            // Usamos upsert para que si ya existe la combinación idusuario/idobra se actualice, 
            // evitando el error de SequelizeUniqueConstraintError
            const [instancia, creado] = await Puntua.upsert({
                idusuario: Number(idusuario),
                idobra: Number(idobra),
                puntuacion: valoracion
            });

            await recalcularYActualizarMedia(idobra);

            res.status(creado ? 201 : 200).json(
                Respuesta.exito(instancia, creado ? "puntuación insertada" : "puntuación actualizada")
            );
        } catch (err) {
            logMensaje("Error en createPuntua: " + err);
            res.status(500).json(Respuesta.error(null, "Error al procesar la puntuación"));
        }
    }

    async savePuntua(req, res) {
        const { idusuario, idobra, valoracion } = req.body;
        try {
            const [instancia, creado] = await Puntua.upsert({
                idusuario: Number(idusuario),
                idobra: Number(idobra),
                puntuacion: valoracion
            });

            await recalcularYActualizarMedia(idobra);

            res.status(creado ? 201 : 200).json(
                Respuesta.exito(instancia, creado ? "Puntuación creada" : "Puntuación actualizada")
            );
        } catch (err) {
            logMensaje("Error en savePuntua: " + err);
            res.status(500).json(Respuesta.error(null, "Error al procesar la puntuación"));
        }
    }

    async deletePuntua(req, res) {
        const { idusuario, idobra } = req.params;
        try {
            const numFilas = await Puntua.destroy({
                where: { idusuario, idobra }
            });

            if (numFilas > 0) {
                await recalcularYActualizarMedia(idobra);
                res.status(204).send();
            } else {
                res.status(404).json(Respuesta.error(null, "No existe la puntuación"));
            }
        } catch (err) {
            logMensaje("Error en deletePuntua: " + err);
            res.status(500).json(Respuesta.error(null, "Error al borrar"));
        }
    }

    async updatePuntua(req, res) {
        const { idusuario, idobra } = req.params;
        const { valoracion } = req.body;
        try {
            await Puntua.update(
                { puntuacion: valoracion },
                { where: { idusuario, idobra } }
            );
            await recalcularYActualizarMedia(idobra);
            res.status(204).send();
        } catch (err) {
            logMensaje("Error en updatePuntua: " + err);
            res.status(500).json(Respuesta.error(null, "Error al actualizar"));
        }
    }

    // Métodos GET sin cambios
    async getPuntuaByIdUsuario(req, res) {
        try {
            const data = await Puntua.findAll({ where: { idusuario: req.params.idusuario } });
            res.json(Respuesta.exito(data, "OK"));
        } catch (err) { res.status(500).json(Respuesta.error(null, err)); }
    }

    async getAllPuntua(req, res) {
        try {
            const data = await Puntua.findAll();
            res.json(Respuesta.exito(data, "OK"));
        } catch (err) { res.status(500).json(Respuesta.error(null, err)); }
    }
}

module.exports = new puntuaController();