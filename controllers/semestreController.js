const pool = require("../config/database");

exports.createSemestre = async (req, res) => {
    const { curso_id } = req.params;
    const { nome, ano } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO Semestre (nome, ano, curso_id, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [nome, ano, curso_id, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSemestres = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Semestre WHERE usuario_id = $1",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

xports.getSemestreById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM Semestre WHERE id = $1 AND usuario_id = $2",
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Semestre não encontrado.",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSemestre = async (req, res) => {
    const { id } = req.params;
    const { nome, ano } = req.body;

    try {
        const semestre = await pool.query(
            "SELECT * FROM Semestre WHERE id = $1 AND usuario_id = $2",
            [id, req.user.id]
        );

        if (semestre.rows.length === 0) {
            return res.status(403).json({
                error: "Semestre não encontrado ou sem permissão para editá-lo.",
            });
        }

        const result = await pool.query(
            "UPDATE Semestre SET nome = $1, ano = $2 WHERE id = $3 RETURNING *",
            [nome, ano, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSemestre = async (req, res) => {
    const { id } = req.params;

    try {
        const semestre = await pool.query(
            "SELECT * FROM Semestre WHERE id = $1 AND usuario_id = $2",
            [id, req.user.id]
        );

        if (semestre.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Semestre não encontrado ou sem permissão para deletá-lo.",
                });
        }

        await pool.query("DELETE FROM Semestre WHERE id = $1", [id]);
        res.json({
            message:
                "Semestre deletado com sucesso, incluindo todas as cadeiras associadas.",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
