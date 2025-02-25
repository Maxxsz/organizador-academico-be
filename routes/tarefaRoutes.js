const express = require("express");
const router = express.Router();
const tarefaController = require("../controllers/tarefaController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/plano-estudo/:planoEstudo_id",
    authenticateToken,
    tarefaController.createTarefa
);
router.get("/", authenticateToken, tarefaController.getTarefas);
router.put("/:id", authenticateToken, tarefaController.updateTarefa);
router.delete("/:id", authenticateToken, tarefaController.deleteTarefa);

module.exports = router;
