const express = require("express");
const router = express.Router();
const cadernoController = require("../controllers/cadernoController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post(
    "/cadeira/:cadeira_id",
    authenticateToken,
    cadernoController.createCaderno
);
router.get(
    "/cadeira/:cadeira_id",
    authenticateToken,
    cadernoController.getCadernos
);
router.put("/:id", authenticateToken, cadernoController.updateCaderno);
router.delete("/:id", authenticateToken, cadernoController.deleteCaderno);

module.exports = router;
