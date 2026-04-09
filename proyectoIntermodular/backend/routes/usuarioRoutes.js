const express= require("express");
const router =express.Router();
const usuarioController=require("../controllers/usuarioController");

router.get('/',usuarioController.getAllUsuarios);

router.get(`/:id_usuario`,usuarioController.getUsuarioById);
router.post(`/login`,usuarioController.login);
router.post(`/`,usuarioController.createUsuario);
router.put(`/:id_usuario`,usuarioController.updateUsuario);
router.put(`/puntuacion/:id_usuario`,usuarioController.updateMaxScore);
router.delete(`/:id_usuario`,usuarioController.deleteUsuario);

module.exports=router;