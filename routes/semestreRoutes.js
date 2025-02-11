const express = require("express");
const router = express.Router();
const semestreController = require("../controllers/semestreController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/curso/:curso_id",
    authenticateToken,
    semestreController.createSemestre
);

router.get(
    "/curso/:curso_id",
    authenticateToken,
    semestreController.getSemestres
);

router.get("/:id", authenticateToken, semestreController.getSemestreById);

router.put("/:id", authenticateToken, semestreController.updateSemestre);

router.delete("/:id", authenticateToken, semestreController.deleteSemestre);

module.exports = router;
