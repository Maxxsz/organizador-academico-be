const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: "dt3bwbkha", // Nome da sua conta no Cloudinary
    api_key: "591776187949643",      // Chave de API do Cloudinary
    api_secret: "5Igphh-85J30RmN9KXPxnywQlJg", // Segredo da API do Cloudinary
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "documentos",
        format: file.originalname.split(".").pop(),
        resource_type: "auto", // Permite arquivos de diferentes tipos (imagem, vídeo, raw)
    }),
});


// Cria o middleware do Multer
const upload = multer({ storage: storage });

module.exports = upload;