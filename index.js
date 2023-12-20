class TicTacToe {
	constructor() {
		this.resetBoard();
	}

	resetBoard() {
		this.board = new Array(9).fill(null);
		this.turn = 'X';
		this.winner = null;
		// To handle draws
		this.hasGameEnded = false;
		this.count = 0;
	}

	makeMove(idx) {
		if (idx < 0 || idx >= 9) {
			throw new Error('Invalid move');
		}
		if (this.board[idx]) {
			throw new Error('Invalid square');
		}
		if (this.winner) {
			throw new Error('Game has ended');
		}
		if (this.hasGameEnded) {
			throw new Error('Game has ended');
		}
		// making the move
		this.board[idx] = this.turn;
		this.count++;
		// switch turns
		this.turn = this.turn === 'X' ? 'O' : 'X';
	}

	checkState(idx) {
		// lookup table for a relatively small board
		// implement a index based lookup table
		const lookupObj = {
			0: [
				[1, 2],
				[3, 6],
				[4, 8]
			],
			1: [
				[0, 2],
				[4, 7]
			],
			2: [
				[0, 1],
				[5, 8],
				[4, 6]
			],
			3: [
				[0, 6],
				[4, 5]
			],
			4: [
				[1, 7],
				[3, 5],
				[0, 8],
				[2, 6]
			],
			5: [
				[2, 8],
				[3, 4]
			],
			6: [
				[0, 3],
				[7, 8],
				[2, 4]
			],
			7: [
				[1, 4],
				[6, 8]
			],
			8: [
				[0, 4],
				[2, 5],
				[6, 7]
			]
		};
		// check if the idx play has won the game
		lookupObj[idx].some((item) => {
			if (
				this.board[idx] === this.board[item[0]] &&
				this.board[idx] === this.board[item[1]]
			) {
				this.winner = this.board[idx];
				this.hasGameEnded = true;
			}
		});
		// if board is full and no one has won, then game has ended anyways
		if (this.count === 9 && !this.hasGameEnded) {
			this.hasGameEnded = true;
		}
		return this.hasGameEnded;
	}

	getSquare(idx) {
		return this.board[idx];
	}
}

// hook into the DOM
const board = document.getElementById('board');
const cover = document.getElementById('cover');
const startBtn = document.getElementById('start');
const winner = document.getElementById('winner');
const xWinsEl = document.getElementById('x');
const oWinsEl = document.getElementById('o');
// access the localstorage
const storage = window.localStorage;
// access lifetime wins
const lifetimeWins = storage.getItem('lifetimeWins');
let [xWins, oWins] = lifetimeWins ? lifetimeWins.split(',') : [0, 0];
let game = null;
// add an onclick event listener to the cover, to add the "removed" class
startBtn.addEventListener('click', () => {
	// set winner text to empty
	winner.textContent = 'Current turn: X';
	// create a new game
	game = new TicTacToe();
	// purge and reset the board
	board.innerHTML = '';
	Array.from({ length: 9 }).forEach((_, idx) => {
		const square = document.createElement('button');
		square.className = 'square btn';
		square.id = idx;
		board.appendChild(square);
	});
	// remove the cover
	cover.classList.add('removed');
	// add event listeners to all the squares
	Array.from(board.children).forEach((square) => {
		square.addEventListener('click', onClickHandler);
		square.addEventListener('mouseenter', onHoverHandler);
		square.addEventListener('mouseleave', onLeaveHandler);
	});
});

const onClickHandler = (e) => {
	e.preventDefault();
	// get self id
	const id = e.target.id;
	// make move
	game.makeMove(id);
	// update self text
	e.target.textContent = game.getSquare(id);
	// update self class
	e.target.classList.add('btn-disabled');
	e.target.classList.remove('btn');
	if (game.getSquare(id) === 'X') {
		e.target.classList.add('blue');
	} else if (game.getSquare(id) === 'O') {
		e.target.classList.add('red');
	}
	// update self to be disabled
	e.target.disabled = true;
	// remove all event handlers
	e.target.removeEventListener('click', onClickHandler);
	e.target.removeEventListener('mouseenter', onHoverHandler);
	e.target.removeEventListener('mouseleave', onLeaveHandler);
	// switch turns
	winner.textContent = `Current turn: ${game.turn}`;
	// check if game has ended
	if (game.checkState(id)) {
		// remove all event listeners
		Array.from(board.children).forEach((square) => {
			square.removeEventListener('click', onClickHandler);
			square.removeEventListener('mouseenter', onHoverHandler);
			square.removeEventListener('mouseleave', onLeaveHandler);
		});
		// show the cover
		cover.classList.remove('removed');
		// show the winner
		winner.textContent = game.winner ? `${game.winner} has won!` : 'Draw!';
		if (game.winner === 'X') {
			xWins++;
			storage.setItem('lifetimeWins', `${xWins},${oWins}`);
			xWinsEl.textContent = `X: ${xWins}`;
		} else if (game.winner === 'O') {
			oWins++;
			storage.setItem('lifetimeWins', `${xWins},${oWins}`);
			oWinsEl.textContent = `O: ${oWins}`;
		}
	}
};

const onHoverHandler = (e) => {
	if (e.target.textContent === '') {
		e.target.textContent = game.turn;
		if (game.turn === 'X') {
			e.target.classList.add('blue');
		} else if (game.turn === 'O') {
			e.target.classList.add('red');
		}
	}
};

const onLeaveHandler = (e) => {
	if (e.target.textContent === game.turn) {
		e.target.textContent = '';
	}
	if (game.turn === 'X') {
		e.target.classList.remove('blue');
	} else if (game.turn === 'O') {
		e.target.classList.remove('red');
	}
};

// populate the board with 9 squares with ids 0-8
Array.from({ length: 9 }).forEach((_, idx) => {
	const square = document.createElement('button');
	square.className = 'square btn';
	square.id = idx;
	board.appendChild(square);
});
// populate the lifetime wins
xWinsEl.textContent = `X: ${xWins}`;
oWinsEl.textContent = `O: ${oWins}`;
