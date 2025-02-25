const pool = require("../config/database");

exports.createDisciplina = async (req, res) => {
    const { semestre_id } = req.params;
    const { nome, codigo } = req.body;

    try {
        const semestre = await pool.query(
            "SELECT * FROM Semestre WHERE id = $1 AND usuario_id = $2",
            [semestre_id, req.user.id]
        );

        if (semestre.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Semestre não encontrado ou sem permissão para acessá-lo.",
                });
        }

        const result = await pool.query(
            "INSERT INTO Cadeira (nome, codigo, semestre_id, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [nome, codigo, semestre_id, req.user.id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDisciplinas = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Cadeira WHERE usuario_id = $1",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDisciplina = async (req, res) => {
    const { id } = req.params;
    const { nome, codigo } = req.body;

    try {
        const disciplina = await pool.query(
            "SELECT * FROM Cadeira WHERE id = $1 AND usuario_id = $2",
            [id, req.user.id]
        );

        if (disciplina.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Disciplina não encontrada ou sem permissão para editá-la.",
                });
        }

        const result = await pool.query(
            "UPDATE Cadeira SET nome = $1, codigo = $2 WHERE id = $3 RETURNING *",
            [nome, codigo, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDisciplina = async (req, res) => {
    const { id } = req.params;

    try {
        const disciplina = await pool.query(
            "SELECT * FROM Cadeira WHERE id = $1 AND usuario_id = $2",
            [id, req.user.id]
        );

        if (disciplina.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Disciplina não encontrada ou sem permissão para deletá-la.",
                });
        }

        await pool.query("DELETE FROM Cadeira WHERE id = $1", [id]);
        res.json({ message: "Disciplina deletada com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
