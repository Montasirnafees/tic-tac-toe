const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");

let board = ["","","","","","","","",""];
let currentPlayer = "x";
let gameActive = true;

let scoreX = 0;
let scoreO = 0;

let gameMode = "PVP";       // PVP | PVAI | AIVAI
let difficulty = "easy";   // easy | hard

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

/* ------------------ MODE & DIFFICULTY ------------------ */

function setMode(mode){
    gameMode = mode;
    resetGame();
    if(mode === "AIVAI") startAIVsAI();
}

function setDifficulty(level){
    difficulty = level;
}

/* ------------------ CELL CLICK ------------------ */

cells.forEach((cell, index)=>{
    cell.addEventListener("click", ()=>{
        if(!gameActive || board[index]) return;

        if(gameMode === "PVAI" && currentPlayer === "o") return;
        if(gameMode === "AIVAI") return;

        makeMove(index);
    });
});

/* ------------------ GAME LOGIC ------------------ */

function makeMove(index){
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer.toUpperCase();
    cells[index].classList.add(currentPlayer);

    if(checkResult()) return;

    currentPlayer = currentPlayer === "x" ? "o" : "x";

    if(gameMode === "PVAI" && currentPlayer === "o"){
        setTimeout(aiMove, 400);
    }
}

function checkResult(){
    for(let p of winPatterns){
        const [a,b,c] = p;
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            gameActive = false;
            highlightWin(p);
            updateScore(board[a]);
            statusText.textContent = `Player ${board[a].toUpperCase()} Wins!`;
            
            return true;
        }
    }

    if(!board.includes("")){
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        
        return true;
    }
    return false;
}

/* ------------------ AI LOGIC ------------------ */

function aiMove(){
    if(!gameActive) return;

    let move;
    if(difficulty === "easy"){
        move = randomMove();
    } else {
        move = minimax(board, "o").index;
    }
    makeMove(move);
}

function randomMove(){
    let empty = board
        .map((v,i)=> v==="" ? i : null)
        .filter(v=>v!==null);
    return empty[Math.floor(Math.random()*empty.length)];
}

/* ------------------ MINIMAX (UNBEATABLE) ------------------ */

function minimax(newBoard, player){
    let availSpots = newBoard
        .map((v,i)=> v==="" ? i : null)
        .filter(v=>v!==null);

    if(isWinner(newBoard, "x")) return {score:-10};
    if(isWinner(newBoard, "o")) return {score:10};
    if(availSpots.length === 0) return {score:0};

    let moves = [];

    for(let i=0;i<availSpots.length;i++){
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if(player === "o"){
            let result = minimax(newBoard, "x");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "o");
            move.score = result.score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if(player === "o"){
        let bestScore = -Infinity;
        moves.forEach((m,i)=>{
            if(m.score > bestScore){
                bestScore = m.score;
                bestMove = i;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((m,i)=>{
            if(m.score < bestScore){
                bestScore = m.score;
                bestMove = i;
            }
        });
    }
    return moves[bestMove];
}

function isWinner(b, player){
    return winPatterns.some(p =>
        b[p[0]] === player &&
        b[p[1]] === player &&
        b[p[2]] === player
    );
}

/* ------------------ AI vs AI ------------------ */

function startAIVsAI(){
    let interval = setInterval(()=>{
        if(!gameActive){
            clearInterval(interval);
            return;
        }
        aiMove();
        currentPlayer = currentPlayer === "x" ? "o" : "x";
    }, 500);
}

/* ------------------ UI HELPERS ------------------ */

function highlightWin(pattern){
    const winner = board[pattern[0]]; // "x" or "o"

    pattern.forEach(i=>{
        cells[i].classList.add(
            winner === "x" ? "win-x" : "win-o"
        );
    });
}


function updateScore(winner){
    if(winner === "x"){
        scoreX++;
        scoreXEl.textContent = scoreX;
    } else {
        scoreO++;
        scoreOEl.textContent = scoreO;
    }
}

function resetGame(){
    board = ["","","","","","","","",""];
    cells.forEach(c=>{
        c.textContent="";
        c.className="cell";
    });
    currentPlayer = "x";
    gameActive = true;
    statusText.textContent="";
}
