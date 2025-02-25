const express = require("express");
const router = express.Router();
const anotacaoController = require("../controllers/anotacaoController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/caderno/:caderno_id",
    authenticateToken,
    anotacaoController.createAnotacao
);
router.get("/", authenticateToken, anotacaoController.getAnotacoes);
router.put("/:id", authenticateToken, anotacaoController.updateAnotacao);
router.delete("/:id", authenticateToken, anotacaoController.deleteAnotacao);

module.exports = router;
