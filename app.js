import express from "express";
import cors from "cors";
import sql from "./conexao.js";

const app = express();

app.use(cors());
app.use(express.json());

const TABELA = "filmes_NikolasTchuk";

// ROTA RAIZ (Para evitar o erro "Cannot GET /" na Vercel)
app.get("/", (request, response) => {
    response.json({
        message: "API de Filmes funcionando com sucesso no deploy!"
    });
});

// LISTAR (READ)
app.get("/listar", (request, response) => {
    const selectCommand = `SELECT * FROM ${TABELA}`;

    sql.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error);
            return response.status(500).json(error);
        }
        response.json(data);
    });
});

// ADICIONAR (CREATE)
app.post("/adicionar", (request, response) => {
    const { titulo, genero, duracao, classificacao } = request.body;
    const insertCommand = `INSERT INTO ${TABELA} (titulo, genero, duracao, classificacao) VALUES (?, ?, ?, ?)`;

    sql.query(insertCommand, [titulo, genero, duracao, classificacao], (error, resultado) => {
        if (error) {
            console.log(error);
            return response.status(500).json(error);
        }
        response.json({
            message: "Filme cadastrado com sucesso!",
            id: resultado.insertId
        });
    });
});

// ATUALIZAR (UPDATE)
app.put("/update/:id", (request, response) => {
    const { id } = request.params;
    const { titulo, genero, duracao, classificacao } = request.body;
    const updateCommand = `UPDATE ${TABELA} SET titulo = ?, genero = ?, duracao = ?, classificacao = ? WHERE id = ?`;

    sql.query(updateCommand, [titulo, genero, duracao, classificacao, id], (error) => {
        if (error) {
            console.log(error);
            return response.status(500).json(error);
        }
        response.json({
            message: "Filme atualizado com sucesso!"
        });
    });
});

// DELETAR (DELETE)
app.delete("/delete/:id", (request, response) => {
    const { id } = request.params;
    const deleteCommand = `DELETE FROM ${TABELA} WHERE id = ?`;

    sql.query(deleteCommand, [id], (error) => {
        if (error) {
            console.log(error);
            return response.status(500).json(error);
        }
        response.json({
            message: "Filme apagado com sucesso!"
        });
    });
});

// Executa o listen apenas localmente (A Vercel usa Serverless Functions e ignora o listen direto)
if (process.env.NODE_ENV !== 'production') {
    app.listen(3001, () => {
        console.log("Servidor rodando localmente na porta 3001!");
    });
}

// OBRIGATÓRIO PARA A VERCEL
export default app;
