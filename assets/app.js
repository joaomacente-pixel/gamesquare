// GameSquare — versão estática para GitHub Pages.
// Os dados ficam no localStorage do navegador, sem servidor ou API externa.
const USERNAME = "usuariolindo";
const STORAGE_KEY = "gamesquare_reviews_v1";
let selectedRating = 0;

const games = [
  {id:1,title:"The Legend of Zelda: Breath of the Wild",genre:"Aventura",platform:"Nintendo Switch",year:2017,cover:"zelda.jpg"},
  {id:2,title:"Elden Ring",genre:"RPG / Ação",platform:"PC, PlayStation, Xbox",year:2022,cover:"elden-ring.jpg"},
  {id:3,title:"Minecraft",genre:"Sandbox",platform:"Multiplataforma",year:2011,cover:"minecraft.jpg"},
  {id:4,title:"Red Dead Redemption 2",genre:"Ação / Aventura",platform:"PC, PlayStation, Xbox",year:2018,cover:"red-dead-redemption-2.jpg"},
  {id:5,title:"Hollow Knight",genre:"Metroidvania",platform:"PC, Console",year:2017,cover:"hollow-knight.jpg"},
  {id:6,title:"Stardew Valley",genre:"Simulação",platform:"Multiplataforma",year:2016,cover:"stardew-valley.jpg"}
];

const $ = selector => document.querySelector(selector);
const coverPath = filename => filename ? `./assets/covers/${filename}` : "";

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function getReviews() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}
function stars(rating) {
  const full = Math.round(Number(rating) || 0);
  return "★".repeat(full) + "☆".repeat(5-full);
}
function coverMarkup(game, compact=false) {
  const src = coverPath(game?.cover);
  const cls = compact ? "selected-cover" : "cover-slot";
  return `<div class="${cls}">
    ${src ? `<img src="${src}" alt="Capa de ${safe(game.title)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">` : ""}
    <div class="cover-placeholder" ${src ? 'style="display:none"' : ""}>ADICIONE<br>SUA IMAGEM</div>
  </div>`;
}
function reviewCard(review) {
  const game = games.find(g => g.id === Number(review.game_id)) || {
    title: review.game_title || "Jogo", genre: review.genre || "Jogo", cover: review.cover || ""
  };
  const date = review.created_at ? new Date(review.created_at).toLocaleDateString("pt-BR") : "Agora";
  return `<article class="review-card">
    ${coverMarkup(game)}
    <div>
      <div class="review-top"><span class="review-user">◉ ${safe(review.username)}</span><span class="stars">${stars(review.rating)} <small>${Number(review.rating).toFixed(1)}</small></span></div>
      <div class="review-game">${safe(game.title)}</div>
      <div class="review-meta">${safe(game.genre || "Jogo")} · ${safe(date)}</div>
      <p class="review-copy">${safe(review.review_text)}</p>
    </div>
  </article>`;
}
function showScreen(name) {
  document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
  $(`#screen-${name}`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.screen === name));
  $("#page-label").textContent = ({home:"INÍCIO",profile:"MEU PERFIL",write:"NOVA REVIEW"})[name];
  if (name === "profile") loadProfile();
  if (name === "write") loadGames();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-screen]").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.screen)));
document.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.go)));

function loadFeed() {
  const reviews = getReviews().sort((a,b) => new Date(b.created_at)-new Date(a.created_at));
  $("#review-count").textContent = `${reviews.length} PUBLICAÇÕES`;
  $("#review-feed").innerHTML = reviews.length ? reviews.map(reviewCard).join("") : '<div class="empty">Ainda não há reviews. Seja o primeiro a publicar!</div>';
}
function loadGames() {
  $("#game-select").innerHTML = '<option value="">Selecione um jogo...</option>' +
    games.map(g => `<option value="${g.id}">${safe(g.title)} (${g.year})</option>`).join("");
}
function loadProfile() {
  const reviews = getReviews().filter(r => r.username === USERNAME);
  const uniqueGames = new Set(reviews.map(r => r.game_id));
  const average = reviews.length ? (reviews.reduce((sum,r) => sum + Number(r.rating),0)/reviews.length).toFixed(1) : "—";
  $("#stat-reviews").textContent = reviews.length;
  $("#stat-games").textContent = uniqueGames.size;
  $("#stat-average").textContent = average;
  $("#profile-reviews").innerHTML = reviews.length ? reviews.sort((a,b) => new Date(b.created_at)-new Date(a.created_at)).map(reviewCard).join("") : '<div class="empty">Você ainda não publicou nenhuma review.</div>';
}

$("#game-select").addEventListener("change", () => {
  const game = games.find(g => g.id === Number($("#game-select").value));
  const box = $("#selected-game");
  if (!game) { box.classList.add("hidden"); box.innerHTML=""; return; }
  box.classList.remove("hidden");
  box.innerHTML = `${coverMarkup(game,true)}<strong>${safe(game.title)} <small class="muted">· ${safe(game.genre)}</small></strong>`;
});
document.querySelectorAll("#rating-picker button").forEach(btn => btn.addEventListener("click", () => {
  selectedRating = Number(btn.dataset.rating);
  document.querySelectorAll("#rating-picker button").forEach(b => b.classList.toggle("selected", Number(b.dataset.rating) <= selectedRating));
  $("#rating-label").textContent = `${selectedRating} de 5 estrelas`;
}));
$("#review-text").addEventListener("input", e => $("#char-count").textContent = `${e.target.value.length} / 700`);

$("#review-form").addEventListener("submit", e => {
  e.preventDefault();
  const message = $("#form-message");
  message.textContent = "";
  const gameId = Number($("#game-select").value);
  const reviewText = $("#review-text").value.trim();
  if (!gameId) { message.textContent = "Selecione um jogo."; return; }
  if (!selectedRating) { message.textContent = "Escolha uma nota antes de publicar."; return; }
  if (!reviewText) { message.textContent = "Escreva sua review."; return; }
  const review = {id:crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), username:USERNAME, game_id:gameId, rating:selectedRating, review_text:reviewText, created_at:new Date().toISOString()};
  try {
    const reviews = getReviews();
    reviews.push(review);
    saveReviews(reviews);
  } catch {
    message.textContent = "Não foi possível salvar. O armazenamento do navegador pode estar cheio.";
    return;
  }
  e.target.reset();
  selectedRating = 0;
  document.querySelectorAll("#rating-picker button").forEach(b => b.classList.remove("selected"));
  $("#rating-label").textContent = "Selecione de 1 a 5";
  $("#char-count").textContent = "0 / 700";
  $("#selected-game").classList.add("hidden");
  message.textContent = "Review salva neste navegador!";
  loadFeed();
  setTimeout(() => showScreen("home"), 650);
});

loadGames();
loadFeed();
