const express = require("express");
const router = express.Router();
const documentoController = require("../controllers/documentoController");
const authenticateToken = require("../middlewares/authMiddleware");
const upload = require("../config/cloudinaryConfig"); // Importa o Multer configurado

// Cria um novo documento em um caderno específico
router.post(
    "/caderno/:caderno_id",
    authenticateToken,
    documentoController.createDocumento
);

// Rota para upload de documentos
router.post(
    "/caderno/:caderno_id/upload",
    authenticateToken,
    upload.single("file"), // Middleware do Multer para processar um único arquivo
    documentoController.uploadDocumento
);

// Lista todos os documentos de um caderno específico
router.get(
    "/caderno/:caderno_id",
    authenticateToken,
    documentoController.getDocumentos
);

// Atualiza um documento específico
router.put(
    "/:id",
    authenticateToken,
    documentoController.updateDocumento
);

// Deleta um documento específico
router.delete(
    "/:id",
    authenticateToken,
    documentoController.deleteDocumento
);

module.exports = router;