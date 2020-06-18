var gameState = {
  whosTurn: undefined,
  playerID: undefined,
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0]
};


// This fills in the DOM with the initial game state
var initializeBoard = () => {
  document.querySelector('.game-info__players-name').innerText = `${gameState.playerID} Player`;
  updateBoard();
}

// This function updates the board and whos turn it is.
var updateBoard = () => {
  let myTurn = gameState.whosTurn === gameState.playerID ? "My Turn" : "Opponents Turn"
  document.querySelector('.game-info__players-turn').innerText = myTurn;

  let board = gameState.board;
  for(let i = 0; i < board.length; i++) {
    let element = document.querySelector(`.game-board__cell[data-id='${i}']`)
    element.classList.remove('game-board__cell--blue')
    element.classList.remove('game-board__cell--red')
    if (board[i] < 0) {
      element.classList.add('game-board__cell--blue')
    }
    if (board[i] > 0) {
      element.classList.add('game-board__cell--red')
    }
  }
}
