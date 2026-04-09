const express= require("express");
const router =express.Router();
const obraController=require("../controllers/obraController");

router.get('/',obraController.getAllObras);
router.get('/getObrasTipo',obraController.getObrasTipo);
router.get('/obraFiltrada',obraController.getObraFiltrada);
router.get(`/titulo/:titulo`,obraController.getObraByTitulo);
router.get(`/:idobra`,obraController.getObraById);
router.get(`/:idobra/imagen`,obraController.getObraPortada);
router.post(`/`,obraController.createObra);
router.put(`/:idobra`,obraController.updateObra);
router.delete(`/:idobra`,obraController.deleteObra);
router.post(`/extraerObra`,obraController.extraerObra);

module.exports=router;