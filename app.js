import express from "express";
import cors from "cors";
import mysql from "mysql2";

// Conexão com o Banco de Dados MySQL
const sql = mysql.createConnection({
  host: "benserverplex.ddns.net",
  user: "alunos",
  password: "senhaAlunos",
  database: "alunos_filmes03TB"
});

sql.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
  } else {
    console.log("✅ Conectado ao banco de dados MySQL com sucesso!");
  }
});

const app = express();

app.use(cors());
app.use(express.json());

const TABELA = "filmes_NikolasTchuk";

// ROTA RAIZ
app.get("/", (request, response) => {
  response.json({ message: "API de Filmes rodando com sucesso!" });
});

// 1. LISTAR FILMES (GET)
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

// 2. ADICIONAR FILME (POST)
app.post("/adicionar", (request, response) => {
  const { titulo, genero, duracao, classificacao } = request.body;
  const insertCommand = `INSERT INTO ${TABELA} (titulo, genero, duracao, classificacao) VALUES (?, ?, ?, ?)`;

  sql.query(insertCommand, [titulo, genero, duracao, classificacao], (error, resultado) => {
    if (error) {
      console.log(error);
      return response.status(500).json(error);
    }
    response.json({ message: "Filme adicionado com sucesso!", id: resultado.insertId });
  });
});

// 3. EDITAR FILME (PUT)
app.put("/editar/:id", (request, response) => {
  const { id } = request.params;
  const { titulo, genero, duracao, classificacao } = request.body;
  const updateCommand = `UPDATE ${TABELA} SET titulo = ?, genero = ?, duracao = ?, classificacao = ? WHERE id = ?`;

  sql.query(updateCommand, [titulo, genero, duracao, classificacao, id], (error, resultado) => {
    if (error) {
      console.log(error);
      return response.status(500).json(error);
    }
    response.json({ message: "Filme atualizado com sucesso!" });
  });
});

// 4. DELETAR FILME (DELETE)
app.delete("/deletar/:id", (request, response) => {
  const { id } = request.params;
  const deleteCommand = `DELETE FROM ${TABELA} WHERE id = ?`;

  sql.query(deleteCommand, [id], (error, resultado) => {
    if (error) {
      console.log(error);
      return response.status(500).json(error);
    }
    response.json({ message: "Filme apagado com sucesso!" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});