import express from "express";
import cors from "cors";

import mysql from "mysql2";

const sql = mysql.createConnection({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03TB"
});

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

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001")
})