const pool = require("../config/database");

exports.createPlanoEstudo = async (req, res) => {
    const { cadeira_id } = req.params;

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
            "INSERT INTO PlanoEstudo (cadeira_id) VALUES ($1) RETURNING *",
            [cadeira_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPlanosEstudo = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM PlanoEstudo WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $1)",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePlanoEstudo = async (req, res) => {
    const { id } = req.params;
    const { cadeira_id } = req.body;

    try {
        const planoEstudo = await pool.query(
            "SELECT * FROM PlanoEstudo WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [id, req.user.id]
        );

        if (planoEstudo.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Plano de estudo não encontrado ou sem permissão para editá-lo.",
                });
        }

        const result = await pool.query(
            "UPDATE PlanoEstudo SET cadeira_id = $1 WHERE id = $2 RETURNING *",
            [cadeira_id, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePlanoEstudo = async (req, res) => {
    const { id } = req.params;

    try {
        const planoEstudo = await pool.query(
            "SELECT * FROM PlanoEstudo WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [id, req.user.id]
        );

        if (planoEstudo.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Plano de estudo não encontrado ou sem permissão para deletá-lo.",
                });
        }

        await pool.query("DELETE FROM PlanoEstudo WHERE id = $1", [id]);
        res.json({ message: "Plano de estudo deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
