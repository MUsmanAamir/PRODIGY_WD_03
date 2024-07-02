
let cells, currentPlayer, board, gameMode, winningCombination;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame(mode) {
    gameMode = mode;
    currentPlayer = 'X';
    board = Array(9).fill(null);
    cells = document.querySelectorAll('.cell');
    document.getElementById('game-board').classList.remove('hidden');
    document.getElementById('game-settings').classList.add('hidden');
    document.getElementById('winner-display').classList.add('hidden');
    document.getElementById('winning-line').classList.add('hidden');
    document.getElementById('winning-line').classList.remove('horizontal', 'vertical', 'diagonal');
    updateTurnDisplay();
    cells.forEach(cell => {
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function handleClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (board[index] !== null || checkWinner()) {
        return;
    }

    cell.textContent = currentPlayer;
    board[index] = currentPlayer;

    if (checkWinner()) {
        document.getElementById('winner-player').textContent = (gameMode === 'ai' && currentPlayer === 'O') ? 'AI Wins' : 'Player Wins';
        document.getElementById('winner-display').classList.remove('hidden');
        showWinningLine();
        return;
    } else if (board.every(cell => cell !== null)) {
        document.getElementById('winner-player').textContent = 'Draw';
        document.getElementById('winner-display').classList.remove('hidden');
        return;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnDisplay();
        if (gameMode === 'ai' && currentPlayer === 'O') {
            setTimeout(aiMove, 500);
        }
    }
}

function checkWinner() {
    return winningCombinations.some(combination => {
        if (combination.every(index => board[index] === currentPlayer)) {
            winningCombination = combination;
            return true;
        }
        return false;
    });
}

function updateTurnDisplay() {
    document.getElementById('current-player').textContent = currentPlayer;
}

function aiMove() {
    let availableCells = board.map((val, index) => val === null ? index : null).filter(val => val !== null);
    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    cells[randomIndex].click();
}

function showWinningLine() {
    const winningLine = document.getElementById('winning-line');
    winningLine.classList.remove('hidden');
    const [a, b, c] = winningCombination;

    if (a % 3 === b % 3 && b % 3 === c % 3) {
        // Vertical win
        winningLine.classList.add('vertical');
        winningLine.style.transform = `translateX(${(a % 3) * 100 + 50}px) scaleY(1)`;
    } else if (Math.floor(a / 3) === Math.floor(b / 3) && Math.floor(b / 3) === Math.floor(c / 3)) {
        // Horizontal win
        winningLine.classList.add('horizontal');
        winningLine.style.transform = `translateY(${Math.floor(a / 3) * 100 + 50}px) scaleX(1)`;
    } else if ((a === 0 && c === 8) || (a === 2 && c === 6)) {
        // Diagonal win
        winningLine.classList.add('diagonal');
        if (a === 0) {
            winningLine.style.transform = 'rotate(45deg) translate(0, -100px) scaleX(1)';
        } else {
            winningLine.style.transform = 'rotate(-45deg) translate(0, 100px) scaleX(1)';
        }
    }
}
