const express = require("express");
const router = express.Router();
const calendarioController = require("../controllers/calendarioController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/cadeira/:cadeira_id",
    authenticateToken,
    calendarioController.createCalendario
);
router.get("/", authenticateToken, calendarioController.getCalendarios);
router.delete("/:id", authenticateToken, calendarioController.deleteCalendario);

module.exports = router;
