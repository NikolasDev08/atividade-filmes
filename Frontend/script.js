async function buscarFilmes() {
    // acessar a rota GET do backend e exibir os filmes na tela
    const resposta = await fetch("http://localhost:3001/listar")
    const filmes = await resposta.json()
    const sectionFilmes = document.querySelector(".filmes")

    filmes.forEach((filme) => {
        sectionFilmes.innerHTML += `
            <div>
                <h2>${filme.titulo}</h2>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p><strong>Duração:</strong> ${filme.duracao} minutos</p>
                <p><strong>Classificação indicativa:</strong> ${filme.classificacao}</p>
            </div>
        `
    })
}

buscarFilmes()
