const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: "dt3bwbkha", // Nome da sua conta no Cloudinary
    api_key: "591776187949643",      // Chave de API do Cloudinary
    api_secret: "5Igphh-85J30RmN9KXPxnywQlJg", // Segredo da API do Cloudinary
});

// Configuração do Multer para upload de arquivos
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "documentos", // Pasta no Cloudinary onde os arquivos serão salvos
        allowed_formats: ["jpg", "jpeg", "png", "pdf"], // Formatos de arquivo permitidos
    },
});

// Cria o middleware do Multer
const upload = multer({ storage: storage });

module.exports = upload;