const express = require("express");
const router = express.Router();
const cadeiraController = require("../controllers/cadeiraController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/semestre/:semestre_id",
    authenticateToken,
    cadeiraController.createCadeira
);
router.get(
    "/semestre/:semestre_id",
    authenticateToken,
    cadeiraController.getCadeiraBySemestreId
);

router.get("/:id", authenticateToken, cadeiraController.getCadeiraById);

router.put("/:id", authenticateToken, cadeiraController.updateCadeira);

router.delete("/:id", authenticateToken, cadeiraController.deleteCadeira);

module.exports = router;
