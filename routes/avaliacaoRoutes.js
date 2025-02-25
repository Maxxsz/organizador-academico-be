const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/cadeira/:cadeira_id",
    authenticateToken,
    avaliacaoController.createAvaliacao
);
router.get("/", authenticateToken, avaliacaoController.getAvaliacoes);
router.put("/:id", authenticateToken, avaliacaoController.updateAvaliacao);
router.delete("/:id", authenticateToken, avaliacaoController.deleteAvaliacao);

module.exports = router;
