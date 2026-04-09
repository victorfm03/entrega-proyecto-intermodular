const express= require("express");
const router =express.Router();
const likesController=require("../controllers/likesController");
const comentarioController=require("../controllers/comentarioController");

router.get('/',comentarioController.getAllComentarios);

router.get('/obra/:idobra', comentarioController.getComentariosByObraID);

router.get(`/likes/:idcomentario`,likesController.getLikes);
router.post(`/likes/:idcomentario`,likesController.createLike);
router.delete(`/likes/:idcomentario/:idusuario`,likesController.deleteVote);
router.put(`/likes/:idcomentario/:idusuario`,likesController.updateLikes);

router.get(`/:idcomentario`,comentarioController.getComentarioById);
router.post(`/`,comentarioController.createComentario);
router.put(`/:idcomentario`,comentarioController.updateComentario);
router.delete(`/:idcomentario`,comentarioController.deleteComentario);

module.exports=router;