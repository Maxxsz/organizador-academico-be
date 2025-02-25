const pool = require("../config/database");

exports.createEvento = async (req, res) => {
    const { calendario_id } = req.params;
    const { titulo, descricao, data } = req.body;

    try {
        const calendario = await pool.query(
            "SELECT * FROM Calendario WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [calendario_id, req.user.id]
        );

        if (calendario.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Calendário não encontrado ou sem permissão para acessá-lo.",
                });
        }

        const result = await pool.query(
            "INSERT INTO Evento (titulo, descricao, data, calendario_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [titulo, descricao, data, calendario_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEventos = async (req, res) => {
    const { semestre_id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM Evento WHERE calendario_id IN (SELECT id FROM Calendario WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE semestre_id = $1 AND usuario_id = $2))",
            [semestre_id, req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEvento = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, data } = req.body;

    try {
        const evento = await pool.query(
            "SELECT * FROM Evento WHERE id = $1 AND calendario_id IN (SELECT id FROM Calendario WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2))",
            [id, req.user.id]
        );

        if (evento.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Evento não encontrado ou sem permissão para editá-lo.",
                });
        }

        const result = await pool.query(
            "UPDATE Evento SET titulo = $1, descricao = $2, data = $3 WHERE id = $4 RETURNING *",
            [titulo, descricao, data, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvento = async (req, res) => {
    const { id } = req.params;

    try {
        const evento = await pool.query(
            "SELECT * FROM Evento WHERE id = $1 AND calendario_id IN (SELECT id FROM Calendario WHERE cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2))",
            [id, req.user.id]
        );

        if (evento.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Evento não encontrado ou sem permissão para deletá-lo.",
                });
        }

        await pool.query("DELETE FROM Evento WHERE id = $1", [id]);
        res.json({ message: "Evento deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
