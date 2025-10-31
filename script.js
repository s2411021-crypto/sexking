const defaultGames = [
  { name: "엘든 링", year: 2022, rating: 9.5, img: "https://via.placeholder.com/300x150?text=Elden+Ring" },
  { name: "젤다의 전설: 티어스 오브 더 킹덤", year: 2023, rating: 9.8, img: "https://via.placeholder.com/300x150?text=Zelda" },
];

const gameList = document.getElementById("game-list");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const form = document.getElementById("add-game-form");
const nameInput = document.getElementById("game-name");
const yearInput = document.getElementById("game-year");
const ratingInput = document.getElementById("game-rating");
const imgInput = document.getElementById("game-img");

let games = JSON.parse(localStorage.getItem("games")) || defaultGames;

function saveGames() {
  localStorage.setItem("games", JSON.stringify(games));
}

function renderGames(list) {
  gameList.innerHTML = "";
  list.forEach((game, index) => {
    const card = document.createElement("div");
    card.classList.add("game-card");
    card.innerHTML = `
      <button class="delete-btn" data-index="${index}">×</button>
      <img src="${game.img}" alt="${game.name}">
      <div class="game-info">
        <h3>${game.name}</h3>
        <p>📅 ${game.year}</p>
        <p>⭐ ${game.rating}</p>
      </div>
    `;
    gameList.appendChild(card);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = e.target.dataset.index;
      games.splice(i, 1);
      saveGames();
      filterAndSort();
    });
  });
}

function filterAndSort() {
  const searchText = searchInput.value.toLowerCase();
  let filtered = games.filter(g => g.name.toLowerCase().includes(searchText));

  const sortBy = sortSelect.value;
  filtered.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "year") return b.year - a.year;
  });

  renderGames(filtered);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const reader = new FileReader();
  reader.onload = function () {
    const newGame = {
      name: nameInput.value,
      year: parseInt(yearInput.value),
      rating: parseFloat(ratingInput.value),
      img: reader.result || "https://via.placeholder.com/300x150?text=No+Image",
    };
    games.push(newGame);
    saveGames();
    filterAndSort();
    form.reset();
  };

  if (imgInput.files[0]) {
    reader.readAsDataURL(imgInput.files[0]);
  } else {
    reader.onload(); // 기본 이미지로 추가
  }
});

searchInput.addEventListener("input", filterAndSort);
sortSelect.addEventListener("change", filterAndSort);

filterAndSort();