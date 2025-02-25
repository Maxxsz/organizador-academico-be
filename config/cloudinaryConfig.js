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
    params: (req, file) => {
        return {
            folder: "documentos", // Pasta no Cloudinary
            resource_type: file.mimetype.startsWith("image") ? "image" : "raw", // Define o tipo de recurso
            public_id: file.originalname.split(".")[0], // Nome do arquivo sem extensão
            flags: "inline", // Força o navegador a exibir o arquivo (em vez de baixá-lo)
        };
    },
});

// Cria o middleware do Multer
const upload = multer({ storage: storage });

module.exports = upload;