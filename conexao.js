import mysql from "mysql2";

const connection = mysql.createConnection({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03TB"
});

connection.connect((erro) => {
    if (erro) {
        console.log(erro);
    } else {
        console.log("Banco conectado!");
    }
});

export default connection;
