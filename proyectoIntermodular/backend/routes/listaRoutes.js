const express= require("express");
const router =express.Router();
const listaController=require("../controllers/listaController");

router.get('/',listaController.getAllListas);

router.get('/favoritos/:idusuario', listaController.getFavoritosUsuario);
router.get(`/:idlista`,listaController.getListaById);
router.post(`/`,listaController.createLista);
router.put(`/:idlista`,listaController.updateLista);
router.delete(`/:idlista`,listaController.deleteLista);

module.exports=router;