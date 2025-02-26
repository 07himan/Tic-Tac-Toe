const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Player always starts first
let running = true;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
];

// Initialize game
function startGame() {
    cells.forEach(cell => cell.addEventListener("click", playerMove));
    resetButton.addEventListener("click", resetGame);
    statusText.textContent = `${currentPlayer}'s Turn`;
}

// Handle player move
function playerMove() {
    if (currentPlayer !== "X" || !running) return;

    const cellIndex = this.id.split("-")[1];
    if (board[cellIndex] !== "") return;

    board[cellIndex] = "X";
    this.textContent = "X";

    checkWinner();
    if (running) setTimeout(aiMove, 500); // AI plays after a short delay
}

// AI Move
function aiMove() {
    if (!running) return;

    let bestMove = findBestMove();
    board[bestMove] = "O";
    document.getElementById(`cell-${bestMove}`).textContent = "O";

    checkWinner();
}

// AI Logic - Find the best move
function findBestMove() {
    // 1. Check if AI can win
    for (let pattern of winPatterns) {
        let move = checkWinningMove(pattern, "O");
        if (move !== -1) return move;
    }

    // 2. Check if player is about to win, then block
    for (let pattern of winPatterns) {
        let move = checkWinningMove(pattern, "X");
        if (move !== -1) return move;
    }

    // 3. Take center if available
    if (board[4] === "") return 4;

    // 4. Pick a random available spot
    let availableMoves = board.map((val, idx) => (val === "" ? idx : null)).filter(idx => idx !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Check if there’s a winning move available
function checkWinningMove(pattern, player) {
    let [a, b, c] = pattern;
    let values = [board[a], board[b], board[c]];

    if (values.filter(val => val === player).length === 2 && values.includes("")) {
        return [a, b, c].find(idx => board[idx] === "");
    }
    return -1;
}

// Check for win or draw
function checkWinner() {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            statusText.textContent = `${board[a]} Wins! 🎉`;
            running = false;
            return;
        }
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw! 🤝";
        running = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s Turn`;
}

// Reset Game
function resetGame() {
    board.fill("");
    cells.forEach(cell => (cell.textContent = ""));
    currentPlayer = "X";
    statusText.textContent = `${currentPlayer}'s Turn`;
    running = true;
}

// Start the game
startGame();
