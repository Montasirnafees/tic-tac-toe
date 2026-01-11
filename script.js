const boardEl = document.getElementById('board');
const cells = [...boardEl.children];
const statusEl = document.getElementById('status');
const timerEl = document.getElementById('timer');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreT = document.getElementById('scoreT');
const newGameBtn = document.getElementById('newGameBtn');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameMode = null;
let gameActive = false;
let timer;
let timeLeft = 10;
let scores = { X:0, O:0, T:0 };

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function startGame(mode) {
  gameMode = mode;
  document.getElementById('menu').classList.remove('active');
  document.getElementById('game').classList.add('active');
  resetGame();
}

function backToMenu() {
  document.getElementById('game').classList.remove('active');
  document.getElementById('menu').classList.add('active');
  clearInterval(timer);
}

function resetGame() {
  board.fill(null);
  currentPlayer = 'X';
  gameActive = true;
  cells.forEach(c => {
    c.textContent = '';
    c.className = 'cell';
  });
  statusEl.textContent = currentPlayer + " starts";
  startTimer();
  updateScores();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timerEl.textContent = `Time: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      gameActive = false;
    }
  }, 1000);
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreT.textContent = scores.T;
}

function checkWin(player) {
  return winCombos.some(c => c.every(i => board[i] === player));
}

function handleClick(e) {
  const i = +e.target.dataset.i;
  if (!gameActive || board[i]) return;
  makeMove(i, currentPlayer);
}

function makeMove(i, player) {
  board[i] = player;
  cells[i].textContent = player;
  cells[i].classList.add(player.toLowerCase());

  if (checkWin(player)) {
    statusEl.textContent = `${player} wins!`;
    scores[player]++;
    updateScores();
    gameActive = false;
    return;
  }

  if (board.every(Boolean)) {
    statusEl.textContent = "Draw!";
    scores.T++;
    updateScores();
    gameActive = false;
    return;
  }

  currentPlayer = player === 'X' ? 'O' : 'X';
  statusEl.textContent = currentPlayer + "'s turn";
  startTimer();
}

cells.forEach(c => c.addEventListener('click', handleClick));
newGameBtn.addEventListener('click', resetGame);
