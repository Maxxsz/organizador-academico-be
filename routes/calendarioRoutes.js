const express = require("express");
const router = express.Router();
const calendarioController = require("../controllers/calendarioController");
const authenticateToken = require("../middlewares/authMiddleware");

// Obtém ou cria um calendário baseado no semestre
router.get("/semestre/:semestre_id", authenticateToken, calendarioController.getOrCreateCalendario);

// Criar calendário manualmente (caso necessário)
router.post("/cadeira/:cadeira_id", authenticateToken, calendarioController.createCalendario);

// Listar calendários do usuário
router.get("/", authenticateToken, calendarioController.getCalendarios);

// Deletar um calendário
router.delete("/:id", authenticateToken, calendarioController.deleteCalendario);

module.exports = router;
