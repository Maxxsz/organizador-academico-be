const pool = require("../config/database");

exports.createAnotacao = async (req, res) => {
    const { caderno_id } = req.params;
    const { conteudo, dataCriacao } = req.body;

    try {
        const caderno = await pool.query(
            "SELECT * FROM Caderno WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [caderno_id, req.user.id]
        );

        if (caderno.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Caderno não encontrado ou sem permissão para acessá-lo.",
                });
        }

        const result = await pool.query(
            "INSERT INTO Anotacao (conteudo, dataCriacao, caderno_id) VALUES ($1, $2, $3) RETURNING *",
            [conteudo, dataCriacao, caderno_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAnotacoes = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Anotacao WHERE caderno_id IN (SELECT id FROM Caderno WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $1))",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAnotacao = async (req, res) => {
    const { id } = req.params;
    const { conteudo, dataCriacao } = req.body;

    try {
        const anotacao = await pool.query(
            "SELECT * FROM Anotacao WHERE id = $1 AND caderno_id IN (SELECT id FROM Caderno WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2))",
            [id, req.user.id]
        );

        if (anotacao.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Anotação não encontrada ou sem permissão para editá-la.",
                });
        }

        const result = await pool.query(
            "UPDATE Anotacao SET conteudo = $1, dataCriacao = $2 WHERE id = $3 RETURNING *",
            [conteudo, dataCriacao, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAnotacao = async (req, res) => {
    const { id } = req.params;

    try {
        const anotacao = await pool.query(
            "SELECT * FROM Anotacao WHERE id = $1 AND caderno_id IN (SELECT id FROM Caderno WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2))",
            [id, req.user.id]
        );

        if (anotacao.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Anotação não encontrada ou sem permissão para deletá-la.",
                });
        }

        await pool.query("DELETE FROM Anotacao WHERE id = $1", [id]);
        res.json({ message: "Anotação deletada com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
