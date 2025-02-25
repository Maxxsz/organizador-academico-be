const pool = require("../config/database");

exports.createCalendario = async (req, res) => {
    const { cadeira_id } = req.params;

    try {
        const cadeira = await pool.query(
            "SELECT * FROM Cadeira WHERE id = $1 AND usuario_id = $2",
            [cadeira_id, req.user.id]
        );

        if (cadeira.rows.length === 0) {
            return res.status(403).json({
                error: "Cadeira não encontrada ou sem permissão para acessá-la.",
            });
        }

        const result = await pool.query(
            "INSERT INTO Calendario (cadeira_id) VALUES ($1) RETURNING *",
            [cadeira_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCalendarios = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Calendario WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $1)",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrCreateCalendario = async (req, res) => {
    const { semestre_id } = req.params;

    try {
        // Verifica se já existe um calendário para esse semestre
        const result = await pool.query(
            `SELECT * FROM Calendario 
             WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE semestre_id = $1 AND usuario_id = $2)`,
            [semestre_id, req.user.id]
        );

        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]); // Retorna o calendário existente
        }

        // Se não existir, cria um novo calendário
        const cadeira = await pool.query(
            `SELECT id FROM Cadeira WHERE semestre_id = $1 AND usuario_id = $2 LIMIT 1`,
            [semestre_id, req.user.id]
        );

        if (cadeira.rows.length === 0) {
            return res.status(404).json({ error: "Nenhuma cadeira encontrada para este semestre." });
        }

        const novaCadeiraId = cadeira.rows[0].id;

        const newCalendario = await pool.query(
            "INSERT INTO Calendario (cadeira_id) VALUES ($1) RETURNING *",
            [novaCadeiraId]
        );

        res.status(201).json(newCalendario.rows[0]); // Retorna o novo calendário criado
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCalendario = async (req, res) => {
    const { id } = req.params;

    try {
        const calendario = await pool.query(
            "SELECT * FROM Calendario WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [id, req.user.id]
        );

        if (calendario.rows.length === 0) {
            return res.status(403).json({
                error: "Calendário não encontrado ou sem permissão para deletá-lo.",
            });
        }

        await pool.query("DELETE FROM Calendario WHERE id = $1", [id]);
        res.json({ message: "Calendário deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
