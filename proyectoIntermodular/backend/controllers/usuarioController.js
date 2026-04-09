const Respuesta= require("../utils/respuesta.js");

const {logMensaje} = require("../utils/logger.js");

const initModels=require("../models/init-models.js").initModels;

const sequelize=require("../config/squelize.js");

const models=initModels(sequelize);

const Usuario= models.usuario;

class UsuarioController{
    async createUsuario(req, res){

        const usuario= req.body;

        try {

            const newUser= await Usuario.create(usuario);
            res.status(201).json(Respuesta.exito(newUser,"Usuario insertado"))

        }catch (err){
            logMensaje("Error :"+err);
            res.status(500).json(Respuesta.error(null,"Error al crear el usuario"))
        }

    }

    async login(req, res){

        const {email, contraseña}= req.body;

        try {

            const user= await Usuario.findOne({
                where: {
                    email: email,
                    contraseña: contraseña
                }
            });

            if (!user){
                res.status(404).json(Respuesta.error(null,"Usuario o contraseña incorrectos"));
            }else{
                res.json(Respuesta.exito(user,"Login correcto"));
            }

        }catch (err){
            logMensaje("Error :"+err);
            res.status(500).json(Respuesta.error(null,"Error al iniciar sesión"))
        }

    }

    async getUsuarioById(req, res){

        const id_usuario=req.params.id_usuario;

        try {

            const data= await Usuario.findByPk(id_usuario);
            if(!data){
                res.status(404).json(Respuesta.error(null, "Usuario inexistente"));
            }else{
            res.json(Respuesta.exito(data,"Se recupero el usuario"));
        }

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar los usuarios"))
        }

    }

    async getAllUsuarios(req, res){

        try {

            const data= await Usuario.findAll();
            res.json(Respuesta.exito(data,"Se recuperaron todos los usuarios"));

        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar los usuarios"))
        }

    }

    async deleteUsuario(req, res){

        const id_usuario=req.params.id_usuario;

        try {

            const numFilas= await Usuario.destroy({
                where: {
                    idUsuario: id_usuario
                }
            });

            if (numFilas== 0){

                res.status(404).json(Respuesta.error(null,"No se encontro el usuario del id: "+id_usuario));
            }else{

                res.status(204).send();
            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron recuperar los usuarios"))
        }

    }

    async updateUsuario(req, res) {
    const usuario = req.body;
    const id_usuario = req.params.id_usuario;

    if (id_usuario != usuario.idUsuario) {
        return res.status(400).json(Respuesta.error(null, "No existe el id: " + id_usuario));
    }

    try {
        const [numFilas] = await Usuario.update(
            { ...usuario },
            { where: { idUsuario: id_usuario } }
        );

        if (numFilas === 0) {
            return res.status(404).json(Respuesta.error(null, "No se pudo modificar el usuario con el id: " + id_usuario));
        }

        // Recuperar el usuario actualizado
        const updatedUser = await Usuario.findByPk(id_usuario);

        res.json(Respuesta.exito(updatedUser, "Usuario actualizado correctamente"));
    } catch (err) {
        logMensaje("Error: " + err);
        res.status(500).json(Respuesta.error(null, "No se pudieron actualizar los usuarios"));
    }
}



    async updateMaxScore(req, res){

        const usuario= req.body;
        const id_usuario= req.params.id_usuario;

        console.log(usuario);

        if (id_usuario!= usuario.idUsuario){
            return res.status(400).json(Respuesta.error(null,"No existe el id: "+id_usuario))
        }

        try {

            const numFilas= await Usuario.update({puntuacionquiz: usuario.puntuacionquiz},{where:{idUsuario:id_usuario}});

            if (numFilas == 0) {

                res.status(404).json(Respuesta.error(null, "No se pudo modificar el usuario con el id: " + id_usuario));
            }else{

                res.status(204).send();

            }


        }catch (err){
            logMensaje("Error: "+err)
            res.status(500).json(Respuesta.error(null, "No se pudieron actualizar los usuarios"))
        }

    }
}
module.exports=new UsuarioController()