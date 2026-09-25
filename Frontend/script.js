// URL do servidor Node.js
const API_URL = "http://localhost:3000";

// Filmes iniciais para carregar caso o servidor local não esteja ativo na Vercel
const initialMovies = [
  { id: 1, titulo: "Vingadores", genero: "Ação", duracao: 185, classificacao: "15", bannerBg: "#ff6b6b", icon: "🦸‍♂️" },
  { id: 2, titulo: "Homem-Aranha: Sem Volta Para Casa", genero: "Ação", duracao: 148, classificacao: "12", bannerBg: "#ff4757", icon: "🕷️" },
  { id: 3, titulo: "Interestelar", genero: "Ficção", duracao: 169, classificacao: "10", bannerBg: "#70a1ff", icon: "🚀" },
  { id: 4, titulo: "O Rei Leão", genero: "Animação", duracao: 88, classificacao: "Livre", bannerBg: "#eccc68", icon: "🦁" },
  { id: 5, titulo: "Toy Story", genero: "Animação", duracao: 81, classificacao: "Livre", bannerBg: "#1e90ff", icon: "🤠" },
  { id: 6, titulo: "Titanic", genero: "Romance", duracao: 195, classificacao: "12", bannerBg: "#ff7f50", icon: "🚢" },
  { id: 7, titulo: "Avatar", genero: "Ficção", duracao: 162, classificacao: "12", bannerBg: "#2ed573", icon: "🌌" },
  { id: 8, titulo: "Jurassic Park", genero: "Aventura", duracao: 127, classificacao: "12", bannerBg: "#7bed9f", icon: "🦖" },
  { id: 9, titulo: "Batman Begins", genero: "Ação", duracao: 140, classificacao: "12", bannerBg: "#57606f", icon: "🦇" },
  { id: 10, titulo: "Shrek", genero: "Comédia", duracao: 90, classificacao: "Livre", bannerBg: "#2ed573", icon: "👹" },
  { id: 11, titulo: "Frozen", genero: "Animação", duracao: 102, classificacao: "Livre", bannerBg: "#70a1ff", icon: "❄️" },
  { id: 12, titulo: "Harry Potter e a Pedra Filosofal", genero: "Fantasia", duracao: 152, classificacao: "Livre", bannerBg: "#a55eea", icon: "⚡" },
  { id: 13, titulo: "Carros", genero: "Animação", duracao: 117, classificacao: "Livre", bannerBg: "#ff6348", icon: "🚗" }
];

// Estado dos dados com suporte a localStorage
let movies = JSON.parse(localStorage.getItem("cinebrutal_data")) || initialMovies;
let currentGenre = "todos";
let currentSearch = "";

// Mapeamento de emojis por gênero
const genreIcons = {
  "Ação": "🦸‍♂️",
  "Ficção": "🚀",
  "Animação": "🦁",
  "Romance": "💖",
  "Aventura": "🦖",
  "Comédia": "👹",
  "Fantasia": "⚡"
};

// Elementos do DOM
const moviesGrid = document.getElementById("moviesGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".btn-filter");
const totalCount = document.getElementById("totalCount");

const movieModal = document.getElementById("movieModal");
const btnOpenAddModal = document.getElementById("btnOpenAddModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCancel = document.getElementById("btnCancel");
const movieForm = document.getElementById("movieForm");
const modalTitle = document.getElementById("modalTitle");

function saveLocal() {
  localStorage.setItem("cinebrutal_data", JSON.stringify(movies));
}

// 1. CARREGAR FILMES DO BANCO MYSQL / API
async function fetchMovies() {
  try {
    const res = await fetch(`${API_URL}/listar`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        movies = data;
        saveLocal();
      }
    }
  } catch (err) {
    console.log("Aviso: Servidor backend em localhost não respondeu. Usando dados locais para exibição na Vercel.");
  }
  renderMovies();
}

// 2. RENDERIZAR CARDS NA TELA
function renderMovies() {
  const filtered = movies.filter(movie => {
    const title = movie.titulo || movie.title || "";
    const genre = movie.genero || movie.genre || "";
    
    const matchesGenre = currentGenre === "todos" || genre.toLowerCase() === currentGenre.toLowerCase();
    const matchesSearch = title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                          genre.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  if (totalCount) totalCount.textContent = movies.length;

  if (filtered.length === 0) {
    moviesGrid.innerHTML = `<div class="no-results">💥 Nenhum filme encontrado!</div>`;
    return;
  }

  moviesGrid.innerHTML = filtered.map(movie => {
    const id = movie.id;
    const title = movie.titulo || movie.title;
    const genre = movie.genero || movie.genre;
    const duration = movie.duracao || movie.duration;
    const rating = movie.classificacao || movie.rating;
    const icon = movie.icon || genreIcons[genre] || "🎬";

    return `
      <div class="movie-card">
        <div class="card-banner">
          ${icon}
        </div>
        <div class="card-content">
          <h2 class="movie-title">${title}</h2>
          <div class="movie-info">
            <div class="info-row">
              <span>Gênero:</span>
              <span class="badge badge-genre">${genre}</span>
            </div>
            <div class="info-row">
              <span>Duração:</span>
              <span class="badge badge-duration">${duration} min</span>
            </div>
            <div class="info-row">
              <span>Classificação:</span>
              <span class="badge badge-rating">${rating}</span>
            </div>
          </div>
        </div>

        <!-- REQUISITOS OBRIGATÓRIOS: EDITAR E APAGAR -->
        <div class="card-actions">
          <button class="btn-card-action btn-card-edit" onclick="openEditModal(${id})">✏️ Editar</button>
          <button class="btn-card-action btn-card-delete" onclick="deleteMovie(${id})">🗑️ Apagar</button>
        </div>
      </div>
    `;
  }).join('');
}

// 3. ABRIR E FECHAR MODAL
function openModal(isEdit = false) {
  movieModal.classList.add("active");
  if (!isEdit) {
    modalTitle.textContent = "➕ Cadastrar Filme";
    movieForm.reset();
    document.getElementById("movieId").value = "";
  }
}

function closeModal() {
  movieModal.classList.remove("active");
}

// 4. SUBMIT DO FORMULÁRIO (CADASTRAR / EDITAR)
movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("movieId").value;
  const payload = {
    titulo: document.getElementById("movieTitle").value,
    genero: document.getElementById("movieGenre").value,
    duracao: Number(document.getElementById("movieDuration").value),
    classificacao: document.getElementById("movieRating").value
  };

  if (id) {
    // EDITAR (PUT)
    movies = movies.map(m => m.id == id ? { ...m, ...payload, id: Number(id) } : m);
    try {
      await fetch(`${API_URL}/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {}
  } else {
    // CADASTRAR (POST)
    const newMovie = { id: Date.now(), ...payload };
    movies.unshift(newMovie);
    try {
      await fetch(`${API_URL}/adicionar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {}
  }

  saveLocal();
  renderMovies();
  closeModal();
});

// 5. EDITAR FILME (PREENCHE O MODAL)
window.openEditModal = function(id) {
  const movie = movies.find(m => m.id == id);
  if (!movie) return;

  document.getElementById("movieId").value = movie.id;
  document.getElementById("movieTitle").value = movie.titulo || movie.title;
  document.getElementById("movieGenre").value = movie.genero || movie.genre;
  document.getElementById("movieDuration").value = movie.duracao || movie.duration;
  document.getElementById("movieRating").value = movie.classificacao || movie.rating;

  modalTitle.textContent = "✏️ Editar Filme";
  openModal(true);
};

// 6. APAGAR FILME
window.deleteMovie = async function(id) {
  if (confirm("Tem certeza que deseja apagar este filme?")) {
    movies = movies.filter(m => m.id != id);
    try {
      await fetch(`${API_URL}/deletar/${id}`, { method: "DELETE" });
    } catch (err) {}

    saveLocal();
    renderMovies();
  }
};

// PESQUISA E FILTROS
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderMovies();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentGenre = button.getAttribute("data-genre");
    renderMovies();
  });
});

// EVENTOS DOS BOTÕES DO MODAL
btnOpenAddModal.addEventListener("click", () => openModal(false));
btnCloseModal.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);

// INICIALIZAR DADOS
fetchMovies();