const express = require("express");
const router = express.Router();
const disciplinaController = require("../controllers/disciplinaController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/semestre/:semestre_id",
    authenticateToken,
    disciplinaController.createDisciplina
);
router.get("/", authenticateToken, disciplinaController.getDisciplinas);
router.put("/:id", authenticateToken, disciplinaController.updateDisciplina);
router.delete("/:id", authenticateToken, disciplinaController.deleteDisciplina);

module.exports = router;
