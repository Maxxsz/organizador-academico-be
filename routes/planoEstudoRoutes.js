const express = require("express");
const router = express.Router();
const planoEstudoController = require("../controllers/planoEstudoController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/cadeira/:cadeira_id",
    authenticateToken,
    planoEstudoController.createPlanoEstudo
);
router.get("/", authenticateToken, planoEstudoController.getPlanosEstudo);
router.put("/:id", authenticateToken, planoEstudoController.updatePlanoEstudo);
router.delete(
    "/:id",
    authenticateToken,
    planoEstudoController.deletePlanoEstudo
);

module.exports = router;
