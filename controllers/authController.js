const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
require("dotenv").config();

exports.register = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const result = await pool.query(
            "INSERT INTO Usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
            [nome, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await pool.query(
            "SELECT * FROM Usuario WHERE email = $1",
            [email]
        );
        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }
        const validPassword = await bcrypt.compare(senha, user.rows[0].senha);
        if (!validPassword) {
            return res.status(400).json({ error: "Senha incorreta" });
        }
        const token = jwt.sign(
            { id: user.rows[0].id, email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
