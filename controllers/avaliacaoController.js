const pool = require("../config/database");

exports.createAvaliacao = async (req, res) => {
    const { cadeira_id } = req.params;
    const { nome, peso, nota } = req.body;

    try {
        const cadeira = await pool.query(
            "SELECT * FROM Cadeira WHERE id = $1 AND usuario_id = $2",
            [cadeira_id, req.user.id]
        );

        if (cadeira.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Cadeira não encontrada ou sem permissão para acessá-la.",
                });
        }

        const result = await pool.query(
            "INSERT INTO Avaliacao (nome, peso, nota, cadeira_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [nome, peso, nota, cadeira_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAvaliacoes = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Avaliacao WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $1)",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAvaliacao = async (req, res) => {
    const { id } = req.params;
    const { nome, peso, nota } = req.body;

    try {
        const avaliacao = await pool.query(
            "SELECT * FROM Avaliacao WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [id, req.user.id]
        );

        if (avaliacao.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Avaliação não encontrada ou sem permissão para editá-la.",
                });
        }

        const result = await pool.query(
            "UPDATE Avaliacao SET nome = $1, peso = $2, nota = $3 WHERE id = $4 RETURNING *",
            [nome, peso, nota, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAvaliacao = async (req, res) => {
    const { id } = req.params;

    try {
        const avaliacao = await pool.query(
            "SELECT * FROM Avaliacao WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [id, req.user.id]
        );

        if (avaliacao.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Avaliação não encontrada ou sem permissão para deletá-la.",
                });
        }

        await pool.query("DELETE FROM Avaliacao WHERE id = $1", [id]);
        res.json({ message: "Avaliação deletada com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
