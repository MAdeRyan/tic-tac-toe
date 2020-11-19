var board;
const human = 'O';
const ai = 'X';
const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]
const cells = document.querySelectorAll('.kotak');


startGame();

function startGame() {
    document.querySelector(".endGame").style.display = "none";
    board = Array.from(Array(9).keys());    
    for (var index = 0; index < cells.length; index++) {
        cells[index].innerText = '';
        cells[index].style.removeProperty('background-color');
        cells[index].addEventListener('click', turnClick, false);         
    }
}

function turnClick(kotak) {    
    if (typeof board[kotak.target.id] == 'number') {
        turn(kotak.target.id, human);
        
        if (!checkTie()) turn(bestSpot(), ai)              
    }
    
}

function turn(kotakId, player) {    
    board[kotakId] = player;
    document.getElementById(kotakId).innerText = player;
    let gameWon = checkWin(board, player)
    if (gameWon) gameOver(gameWon)    
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of combos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of combos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == human ? "blue" : "red"
    }
    for (var index = 0; index < cells.length; index++) {        
        cells[index].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == human ? "You Win" : "you lose");
}

function declareWinner(who) {
    document.querySelector(".endGame").style.display = "block";
    document.querySelector(".endGame .text").innerText = who;
}

function emptySquare() {
    return board.filter(s => typeof s == 'number');
}

function checkTie() {
    if (emptySquare().length == 0) {
        for ( var i = 0 ; i < cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);            
        }
        declareWinner("Tie Game");
        return true;        
    }
    return false;
}

function bestSpot() {    
    return minimax(board, ai).index;
}

function minimax(newBoard, player) {
	var availSpots = emptySquare();

	if (checkWin(newBoard, human)) {
		return {score: -10};
	} else if (checkWin(newBoard, ai)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == ai) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, ai);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === ai) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
