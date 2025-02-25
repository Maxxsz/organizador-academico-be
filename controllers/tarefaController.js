const pool = require("../config/database");

exports.createTarefa = async (req, res) => {
    const { planoEstudo_id } = req.params;
    const { descricao, prazo, status } = req.body;

    try {
        const planoEstudo = await pool.query(
            "SELECT * FROM PlanoEstudo WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [planoEstudo_id, req.user.id]
        );

        if (planoEstudo.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Plano de estudo não encontrado ou sem permissão para acessá-lo.",
                });
        }

        const result = await pool.query(
            "INSERT INTO Tarefa (descricao, prazo, status, planoEstudo_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [descricao, prazo, status, planoEstudo_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTarefas = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Tarefa WHERE planoEstudo_id IN (SELECT id FROM PlanoEstudo WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $1))",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTarefa = async (req, res) => {
    const { id } = req.params;
    const { descricao, prazo, status } = req.body;

    try {
        const tarefa = await pool.query(
            "SELECT * FROM Tarefa WHERE id = $1 AND planoEstudo_id IN (SELECT id FROM PlanoEstudo WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2))",
            [id, req.user.id]
        );

        if (tarefa.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Tarefa não encontrada ou sem permissão para editá-la.",
                });
        }

        const result = await pool.query(
            "UPDATE Tarefa SET descricao = $1, prazo = $2, status = $3 WHERE id = $4 RETURNING *",
            [descricao, prazo, status, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTarefa = async (req, res) => {
    const { id } = req.params;

    try {
        const tarefa = await pool.query(
            "SELECT * FROM Tarefa WHERE id = $1 AND planoEstudo_id IN (SELECT id FROM PlanoEstudo WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2))",
            [id, req.user.id]
        );

        if (tarefa.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Tarefa não encontrada ou sem permissão para deletá-la.",
                });
        }

        await pool.query("DELETE FROM Tarefa WHERE id = $1", [id]);
        res.json({ message: "Tarefa deletada com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
