const express= require("express");
const router =express.Router();
const traduccionController=require("../controllers/traduccionController");

router.get('/',traduccionController.getAllTraducciones);

router.get('/:id_traduccion/:id_obra', traduccionController.getTraduccionById);

router.post(`/`,traduccionController.createTraduccion);
router.put(`/:id_traduccion/:id_obra`,traduccionController.updateTraduccion);
router.delete(`/:id_traduccion/:id_obra`,traduccionController.deleteTraduccion);

module.exports=router;