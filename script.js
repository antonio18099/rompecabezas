// Cambia esta URL por el enlace directo de tu imagen si quieres personalizar el juego.
const IMAGE_URL = "puzzle-image.svg";
const SIZE = 4;
const TOTAL = SIZE * SIZE;
const board = document.querySelector("#board");
const movesEl = document.querySelector("#moves");
const timerEl = document.querySelector("#timer");
const messageEl = document.querySelector("#message");
const shuffleBtn = document.querySelector("#shuffleBtn");
const restartBtn = document.querySelector("#restartBtn");
const previewBtn = document.querySelector("#previewBtn");
const previewDialog = document.querySelector("#previewDialog");
const previewImage = document.querySelector("#previewImage");
const winDialog = document.querySelector("#winDialog");
const winSummary = document.querySelector("#winSummary");
const imageUrlInput = document.querySelector("#imageUrl");
const applyImageBtn = document.querySelector("#applyImageBtn");

let tiles = Array.from({ length: TOTAL }, (_, i) => i);
let moves = 0;
let seconds = 0;
let timerInterval = null;
let started = false;
let currentImage = IMAGE_URL;

function setImage(url) {
  currentImage = url;
  document.documentElement.style.setProperty("--puzzle-image", `url("${url.replaceAll('"', '\\"')}")`);
  previewImage.src = url;
  previewImage.onerror = () => {
    messageEl.textContent = "No se pudo cargar esa imagen. Revisa que el enlace sea público y directo.";
  };
  previewImage.onload = () => {
    if (started) messageEl.textContent = "Imagen actualizada. ¡A resolverlo!";
  };
  render();
}

function render() {
  board.innerHTML = "";
  tiles.forEach((tileValue, position) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.setAttribute("aria-label", tileValue === TOTAL - 1 ? "Espacio vacío" : `Ficha ${tileValue + 1}`);
    if (tileValue === TOTAL - 1) {
      tile.classList.add("empty");
      tile.disabled = true;
      tile.setAttribute("aria-hidden", "true");
    } else {
      const row = Math.floor(tileValue / SIZE);
      const col = tileValue % SIZE;
      tile.style.backgroundPosition = `${(col / (SIZE - 1)) * 100}% ${(row / (SIZE - 1)) * 100}%`;
      if (isAdjacent(position, tiles.indexOf(TOTAL - 1))) {
        tile.classList.add("movable");
        tile.addEventListener("click", () => moveTile(position));
      } else {
        tile.disabled = true;
      }
    }
    board.appendChild(tile);
  });
  movesEl.textContent = moves;
}

function isAdjacent(a, b) {
  const ar = Math.floor(a / SIZE), ac = a % SIZE;
  const br = Math.floor(b / SIZE), bc = b % SIZE;
  return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
}

function moveTile(position) {
  const empty = tiles.indexOf(TOTAL - 1);
  if (!isAdjacent(position, empty)) return;
  [tiles[position], tiles[empty]] = [tiles[empty], tiles[position]];
  moves++;
  if (!started) startTimer();
  render();
  if (isSolved()) finishGame();
}

function startTimer() {
  if (started) return;
  started = true;
  messageEl.textContent = "¡Vas bien! Reconstruye la imagen.";
  timerInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function formatTime(value) {
  const min = String(Math.floor(value / 60)).padStart(2, "0");
  const sec = String(value % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function isSolved() {
  return tiles.every((value, index) => value === index);
}

function shuffleBoard() {
  stopTimer();
  started = false;
  seconds = 0;
  moves = 0;
  timerEl.textContent = "00:00";
  // Mezclar mediante movimientos legales garantiza que el puzzle siempre se pueda resolver.
  tiles = Array.from({ length: TOTAL }, (_, i) => i);
  let previousEmpty = -1;
  for (let i = 0; i < 180; i++) {
    const empty = tiles.indexOf(TOTAL - 1);
    const choices = tiles.map((_, index) => index)
      .filter(index => isAdjacent(index, empty) && index !== previousEmpty);
    const choice = choices[Math.floor(Math.random() * choices.length)];
    previousEmpty = empty;
    [tiles[choice], tiles[empty]] = [tiles[empty], tiles[choice]];
  }
  if (isSolved()) return shuffleBoard();
  messageEl.textContent = "¡Listo! Desliza las fichas junto al espacio vacío.";
  render();
}

function resetSolved() {
  stopTimer();
  started = false;
  seconds = 0;
  moves = 0;
  timerEl.textContent = "00:00";
  tiles = Array.from({ length: TOTAL }, (_, i) => i);
  render();
  messageEl.textContent = "Tablero resuelto. Pulsa “Mezclar fichas” para volver a jugar.";
}

function finishGame() {
  stopTimer();
  started = false;
  messageEl.textContent = "¡Imagen completada!";
  winSummary.textContent = `Lo resolviste en ${moves} movimientos y ${formatTime(seconds)}.`;
  winDialog.showModal();
}

shuffleBtn.addEventListener("click", shuffleBoard);
restartBtn.addEventListener("click", resetSolved);
previewBtn.addEventListener("click", () => previewDialog.showModal());
document.querySelector("#playAgainBtn").addEventListener("click", () => {
  winDialog.close();
  shuffleBoard();
});
applyImageBtn.addEventListener("click", () => {
  const url = imageUrlInput.value.trim();
  if (!url) {
    messageEl.textContent = "Pega primero el enlace directo de una imagen.";
    return;
  }
  if (!/^https?:\/\//i.test(url)) {
    messageEl.textContent = "El enlace debe comenzar por http:// o https://.";
    return;
  }
  const testImage = new Image();
  testImage.onload = () => {
    setImage(url);
    shuffleBoard();
  };
  testImage.onerror = () => {
    messageEl.textContent = "No se pudo cargar. Usa un enlace público directo a JPG, PNG, WEBP o SVG.";
  };
  testImage.src = url;
});

setImage(IMAGE_URL);
render();
