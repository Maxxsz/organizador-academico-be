const express = require("express");
const cursoController = require("../controllers/cursoController");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authenticateToken, cursoController.createCurso);
router.get("/", authenticateToken, cursoController.getCursos);
router.put("/:id", authenticateToken, cursoController.updateCurso);
router.delete("/:id", authenticateToken, cursoController.deleteCurso);

module.exports = router;
