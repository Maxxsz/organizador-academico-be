const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/calendario/:calendario_id",
    authenticateToken,
    eventoController.createEvento
);
router.get(
    "/semestre/:semestre_id",
    authenticateToken,
    eventoController.getEventos
);
router.put("/:id", authenticateToken, eventoController.updateEvento);
router.delete("/:id", authenticateToken, eventoController.deleteEvento);

module.exports = router;
