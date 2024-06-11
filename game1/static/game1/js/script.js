const pieces = {
    'R': '&#9820;', // Black Rook
    'N': '&#9822;', // Black Knight
    'B': '&#9821;', // Black Bishop
    'Q': '&#9819;', // Black Queen
    'K': '&#9818;', // Black King
    'P': '&#9823;', // Black Pawn
    'r': '&#9814;', // White Rook
    'n': '&#9816;', // White Knight
    'b': '&#9815;', // White Bishop
    'q': '&#9813;', // White Queen
    'k': '&#9812;', // White King
    'p': '&#9817;'  // White Pawn
};
const initialBoard = [
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
];

let currentMoveIndex = -1;
let boardStates = [JSON.parse(JSON.stringify(initialBoard))];

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    drawBoard(initialBoard);
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('prevButton').addEventListener('click', prevMove);
    document.getElementById('nextButton').addEventListener('click', nextMove);
    });

function createBoard() {
    const chessboard = document.getElementById('chessboard');
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
            square.id = String.fromCharCode(97 + j) + (8 - i);
            chessboard.appendChild(square);
        }
    }
}


function drawBoard(board) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.getElementById(String.fromCharCode(97 + j) + (8 - i));
            let color="Wp";
            if  (Object.keys(pieces).indexOf(board[i][j])<=5)
            {   
                color= "Bp";
            }
            if (board[i][j]) {
                square.innerHTML = "<div class='piece" + color + "'>" + pieces[board[i][j]] + "</div>";
            } else {
                square.innerHTML = "<div class='piece'>" + '' + "</div>";
            }
            
        }
    }
}

function startGame() {
    currentMoveIndex = -1;
    boardStates = [JSON.parse(JSON.stringify(initialBoard))];
    executeMoves();
}

function executeMoves() {
    for (let i = currentMoveIndex + 1; i < moves.length; i++) {
        setTimeout(() => {
            makeMove(moves[i]);
            currentMoveIndex++;
        }, 1000 * (i - currentMoveIndex));
    }
    document.querySelector('.notification').style.display = 'none';
    document.querySelector('.full').style.display = 'none';
}
let timeoutID; // Declare a variable to hold the timeout ID

function chess_alerts(move) {
   // Declare variables outside the conditional block
let kingUnderCheckRealElem;
let timeoutID;
let lastMovedPieceColor;
let lastMovedPiece;
if (move.check) {
    const full = document.querySelector('.full');
    const notification = document.querySelector('.notification');
    notification.innerHTML = '<p>Check!</p>';
    full.style.display = 'block';
    notification.style.display = 'block';

    // Highlight previous step
    const pieceGivingCheckCoords = getCoords(move.from);
    const pieceGivingCheckElem = document.getElementById(String.fromCharCode(97 + pieceGivingCheckCoords[1]) + (8 - pieceGivingCheckCoords[0]));
    pieceGivingCheckElem.classList.add('highlight-check');

    // Highlight next step
    const kingUnderCheckCoords = getCoords(move.to);
    const kingUnderCheckElem = document.getElementById(String.fromCharCode(97 + kingUnderCheckCoords[1]) + (8 - kingUnderCheckCoords[0]));
    kingUnderCheckElem.classList.add('highlight-check', 'highlight-king');

    // Highlight real king position under check if available
    if (move.enemy_king_position) {
        const kingUnderCheckCoordsReal = getCoords(move.enemy_king_position);
        kingUnderCheckRealElem = document.getElementById(String.fromCharCode(97 + kingUnderCheckCoordsReal[1]) + (8 - kingUnderCheckCoordsReal[0]));
        kingUnderCheckRealElem.classList.add('highlight-king');
    }

    // Clear previous timeout if it exists
    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    // Set new timeout and store its ID
    timeoutID = setTimeout(() => {
        // Hide notification and full div
        notification.style.display = 'none';
        full.style.display = 'none';
        // Remove highlight classes
        pieceGivingCheckElem.classList.remove('highlight-check');
        kingUnderCheckElem.classList.remove('highlight-check', 'highlight-king');
        if (kingUnderCheckRealElem) {
            kingUnderCheckRealElem.classList.remove('highlight-king');
        }
    }, 2000);
} else {
    document.querySelector('.notification').style.display = 'none';
    document.querySelector('.full').style.display = 'none';
}
}

function makeMove(move) {
    const fromCoords = getCoords(move.from);
    const toCoords = getCoords(move.to);
    const board = JSON.parse(JSON.stringify(boardStates[boardStates.length - 1]));
    board[toCoords[0]][toCoords[1]] = board[fromCoords[0]][fromCoords[1]];
    board[fromCoords[0]][fromCoords[1]] = '';
    boardStates.push(board);
    drawBoard(board);
    chess_alerts(move)
}

function prevMove() {
    if (currentMoveIndex > 0) {
        currentMoveIndex--;
        drawBoard(boardStates[currentMoveIndex + 1]);
    } else if (currentMoveIndex === 0) {
        currentMoveIndex--;
        drawBoard(initialBoard);
    }
}

function nextMove() {
    if (currentMoveIndex < moves.length - 1) {
        currentMoveIndex++;
        applyMove(moves[currentMoveIndex]);
        chess_alerts(moves[currentMoveIndex])
        drawBoard(boardStates[currentMoveIndex + 1]);
    }else {
        const full = document.querySelector('.full');
        const notification = document.querySelector('.notification');
        console.log()
        notification.innerHTML = '<p>'+"Termination :"+ termination+'<br/>'+lastMovedPieceColor+' Wins</p>';
        full.style.display = 'block';
        notification.style.display = 'block';
    if (timeoutID) {
        clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
        notification.style.display = 'none';
        full.style.display = 'none';    
    }, 2000);
    }
}

function applyMove(move) {
    const fromCoords = getCoords(move.from);
    const toCoords = getCoords(move.to);
    const board = JSON.parse(JSON.stringify(boardStates[boardStates.length - 1]));
    board[toCoords[0]][toCoords[1]] = board[fromCoords[0]][fromCoords[1]];
    board[fromCoords[0]][fromCoords[1]] = '';
    boardStates.push(board);
    lastMovedPiece = board[fromCoords[0]][fromCoords[1]]; // Store the last moved piece
    lastMovedPieceColor = (lastMovedPiece===lastMovedPiece.toUpperCase()) ? 'white' : 'black'; 
}

function getCoords(square) {
    const file = square.charCodeAt(0) - 97;
    const rank = 8 - parseInt(square.charAt(1));
    return [rank, file];
}
