const pool = require("../config/database");

exports.createCaderno = async (req, res) => {
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
            "INSERT INTO Caderno (cadeira_id) VALUES ($1) RETURNING *",
            [cadeira_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCadernos = async (req, res) => {
    const { cadeira_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM Caderno WHERE cadeira_id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [cadeira_id, req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCaderno = async (req, res) => {
    const { id } = req.params;
    const { cadeira_id } = req.body;

    try {
        const caderno = await pool.query(
            "SELECT * FROM Caderno WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [id, req.user.id]
        );

        if (caderno.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Caderno não encontrado ou sem permissão para editá-lo.",
                });
        }

        const result = await pool.query(
            "UPDATE Caderno SET cadeira_id = $1 WHERE id = $2 RETURNING *",
            [cadeira_id, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.ensureCadernoExists = async (req, res) => {
    const { cadeira_id } = req.params;

    try {
        // Verifica se o caderno já existe para essa cadeira
        const cadernoExistente = await pool.query(
            "SELECT * FROM Caderno WHERE cadeira_id = $1",
            [cadeira_id]
        );

        let caderno;

        // Se não existir, cria um novo caderno
        if (cadernoExistente.rows.length === 0) {
            const result = await pool.query(
                "INSERT INTO Caderno (cadeira_id) VALUES ($1) RETURNING *",
                [cadeira_id]
            );
            caderno = result.rows[0];
        } else {
            caderno = cadernoExistente.rows[0];
        }

        res.status(200).json(caderno);
    } catch (error) {
        console.error("Erro ao garantir caderno:", error);
        res.status(500).json({ error: "Erro ao garantir caderno." });
    }
};

exports.deleteCaderno = async (req, res) => {
    const { id } = req.params;

    try {
        const caderno = await pool.query(
            "SELECT * FROM Caderno WHERE id = $1 AND cadeira_id IN (SELECT id FROM Cadeira WHERE usuario_id = $2)",
            [id, req.user.id]
        );

        if (caderno.rows.length === 0) {
            return res
                .status(403)
                .json({
                    error: "Caderno não encontrado ou sem permissão para deletá-lo.",
                });
        }

        await pool.query("DELETE FROM Caderno WHERE id = $1", [id]);
        res.json({ message: "Caderno deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
