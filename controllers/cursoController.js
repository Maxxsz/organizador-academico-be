const pool = require("../config/database");

exports.createCurso = async (req, res) => {
    const { nome, descricao } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO Curso (nome, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *",
            [nome, descricao, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCursos = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Curso WHERE usuario_id = $1",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCurso = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    try {
        const curso = await pool.query(
            "SELECT * FROM Curso WHERE id = $1 AND usuario_id = $2",
            [id, req.user.id]
        );

        if (curso.rows.length === 0) {
            return res.status(403).json({
                error: "Curso não encontrado ou sem permissão para editá-lo.",
            });
        }

        const result = await pool.query(
            "UPDATE Curso SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *",
            [nome, descricao, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCurso = async (req, res) => {
    const { id } = req.params;

    try {
        const curso = await pool.query(
            "SELECT * FROM Curso WHERE id = $1 AND usuario_id = $2",
            [id, req.user.id]
        );

        if (curso.rows.length === 0) {
            return res.status(403).json({
                error: "Curso não encontrado ou sem permissão para deletá-lo.",
            });
        }

        await pool.query("DELETE FROM Curso WHERE id = $1", [id]);
        res.json({
            message: "Curso deletado com sucesso.",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
