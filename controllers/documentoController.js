const pool = require("../config/database");

exports.createDocumento = async (req, res) => {
    const { caderno_id } = req.params;
    const { nome, tipo, dataUpload } = req.body;

    try {
        // Verifica se o caderno pertence ao usuário logado
        const caderno = await pool.query(
            "SELECT * FROM Caderno WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [caderno_id, req.user.id]
        );

        if (caderno.rows.length === 0) {
            return res.status(403).json({
                error: "Caderno não encontrado ou sem permissão para acessá-lo.",
            });
        }

        // Insere o novo documento
        const result = await pool.query(
            "INSERT INTO Documento (nome, tipo, dataUpload, caderno_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [nome, tipo, dataUpload, caderno_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDocumentos = async (req, res) => {
    const { caderno_id } = req.params;

    try {
        // Verifica se o caderno pertence ao usuário logado
        const caderno = await pool.query(
            "SELECT * FROM Caderno WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [caderno_id, req.user.id]
        );

        if (caderno.rows.length === 0) {
            return res.status(403).json({
                error: "Caderno não encontrado ou sem permissão para acessá-lo.",
            });
        }

        // Busca todos os documentos do caderno
        const result = await pool.query(
            "SELECT * FROM Documento WHERE caderno_id = $1",
            [caderno_id]
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDocumento = async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, dataUpload } = req.body;

    try {
        // Verifica se o documento pertence a um caderno do usuário logado
        const documento = await pool.query(
            "SELECT * FROM Documento WHERE id = $1 AND caderno_id IN (SELECT id FROM Caderno WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2))",
            [id, req.user.id]
        );

        if (documento.rows.length === 0) {
            return res.status(403).json({
                error: "Documento não encontrado ou sem permissão para editá-lo.",
            });
        }

        // Atualiza o documento
        const result = await pool.query(
            "UPDATE Documento SET nome = $1, tipo = $2, dataUpload = $3 WHERE id = $4 RETURNING *",
            [nome, tipo, dataUpload, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadDocumento = async (req, res) => {
    const { caderno_id } = req.params;

    try {
        // Verifica se o caderno pertence ao usuário logado
        const caderno = await pool.query(
            "SELECT * FROM Caderno WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [caderno_id, req.user.id]
        );

        if (caderno.rows.length === 0) {
            return res.status(403).json({
                error: "Caderno não encontrado ou sem permissão para acessá-lo.",
            });
        }

        // Verifica se o arquivo foi enviado
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }

        // Obtém o tipo do arquivo a partir da extensão
        const tipo = req.file.originalname.split(".").pop().toLowerCase(); // Ex: "pdf", "jpg", etc.

        // Salva o documento no banco de dados
        const result = await pool.query(
            "INSERT INTO Documento (nome, tipo, dataUpload, caderno_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.file.path, tipo, new Date(), caderno_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDocumento = async (req, res) => {
    const { id } = req.params;

    try {
        // Verifica se o documento pertence a um caderno do usuário logado
        const documento = await pool.query(
            "SELECT * FROM Documento WHERE id = $1 AND caderno_id IN (SELECT id FROM Caderno WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2))",
            [id, req.user.id]
        );

        if (documento.rows.length === 0) {
            return res.status(403).json({
                error: "Documento não encontrado ou sem permissão para deletá-lo.",
            });
        }

        // Deleta o documento
        await pool.query("DELETE FROM Documento WHERE id = $1", [id]);

        res.json({ message: "Documento deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};