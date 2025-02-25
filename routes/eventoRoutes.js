const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");
const authenticateToken = require("../middlewares/authMiddleware");

// Criar evento automaticamente vinculado ao calendário do semestre
router.post("/semestre/:semestre_id", authenticateToken, eventoController.createEvento);

// Listar eventos do semestre
router.get("/semestre/:semestre_id", authenticateToken, eventoController.getEventos);

// Atualizar um evento
router.put("/:id", authenticateToken, eventoController.updateEvento);

// Deletar um evento
router.delete("/:id", authenticateToken, eventoController.deleteEvento);

module.exports = router;
