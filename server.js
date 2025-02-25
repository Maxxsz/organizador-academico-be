const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const cursoRouter = require("./routes/cursoRoutes");
const semestreRouter = require("./routes/semestreRoutes");
const cadeiraRouter = require("./routes/cadeiraRoutes");
const eventoRouter = require("./routes/eventoRoutes");
const calendarioRouter = require("./routes/calendarioRoutes");
const disciplinaRouter = require("./routes/disciplinaRoutes");
const cadernoRouter = require("./routes/cadernoRoutes");
const anotacaoRouter = require("./routes/anotacaoRoutes");
const planoEstudoRouter = require("./routes/planoEstudoRoutes");
const tarefaRouter = require("./routes/tarefaRoutes");
const avaliacaoRouter = require("./routes/avaliacaoRoutes");
const documentoRouter = require("./routes/documentoRoutes");

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
app.use("/eventos", authenticateToken, eventoRouter);
app.use("/calendarios", authenticateToken, calendarioRouter);
app.use("/disciplinas", authenticateToken, disciplinaRouter);
app.use("/cadernos", authenticateToken, cadernoRouter);
app.use("/anotacoes", authenticateToken, anotacaoRouter);
app.use("/planos-estudo", authenticateToken, planoEstudoRouter);
app.use("/tarefas", authenticateToken, tarefaRouter);
app.use("/avaliacoes", authenticateToken, avaliacaoRouter);
app.use("/documentos", authenticateToken, documentoRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
