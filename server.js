const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const cursoRouter = require("./routes/cursoRoutes");
const semestreRouter = require("./routes/semestreRoutes");
const cadeiraRouter = require("./routes/cadeiraRoutes");

const authenticateToken = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/cursos", authenticateToken, cursoRouter);
app.use("/semestres", authenticateToken, semestreRouter);
app.use("/cadeiras", authenticateToken, cadeiraRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
