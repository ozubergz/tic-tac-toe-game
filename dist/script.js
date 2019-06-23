const state = {
  board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  human: '',
  computer: '',
  winner: '',
  currPlayer: '',
  twoPlayerMode: false,
  compMove: 0,
  score1: 0,
  score2: 0,
  winCombo: [],
  gameOver: false
}

function loadGame() {
  $('#game-board').fadeIn(1000);
  $('#score-board').fadeIn(1000);
  $('#board-btn').fadeIn(1000);
}

function fadeBackground() {
  $('#board').fadeTo('slow', '0.1');
  $('#score-board').fadeTo('slow', '0.1');
}

function showBackground() {
  $('#board').css('opacity', '1');
  $('#score-board').css('opacity', '1');
}

function loadBoard() {
  state.board.forEach((e, id) => {
    let square = `<div class='square' id=${id} style="background:#9EA7A6" onmouseover="this.style.background='#FFACD9'" onmouseout="this.style.background='#9EA7A6'"></div>`;
    $('#board').append(square);
  });
  $('#score1').text(state.score1);
  $('#score2').text(state.score2);
}

function emptySquares(state) {
  return state.board.filter(elem => typeof elem === "number" );
}

function assignPlayer(mark) {
  state.human = mark;
  state.computer = state.human === 'X' ? 'O' : "X";
  if(state.twoPlayerMode) mpState(state);
}

function onePlayerMode() {
  state.twoPlayerMode = false;
  $('.score-name1').text('You: ');
  $('.score-name2').text('Bot: ');
}

function twoPlayerMode() {
  state.twoPlayerMode = true;
  $('.score-name1').text('Player 1: ');
  $('.score-name2').text('Player 2: ');
}

function mpState(state) {
  state.player1 = state.human;
  state.player2 = state.computer;
  delete state.human;
  delete state.computer;
  delete state.compMove;
  mpRandomTurn(state);
}

function mpRandomTurn(state) {
  if(state.computer !== '' || state.human !== '') {
    let players = [state.player1, state.player2];
    let random = Math.floor(Math.random() * players.length);
    state.currPlayer = players[random];
    switchLight(state.currPlayer);
    clickTurn(state);
  }
}

function clickTurn(state) {
  if(!state.gameOver) {
    $('.square').click((e) =>  multiplayTurns(state, e.target.id));
  }
}

function multiplayTurns(state, index) {
  if(typeof state.board[index] === 'number' && !state.gameOver) {
    if(state.currPlayer === state.player1) {
      mpMarkBoard(state, index, state.player1);
      switchLight(state.player2);
      state.currPlayer = state.player2;
    } else {
      mpMarkBoard(state, index, state.player2);
      switchLight(state.player1);
      state.currPlayer = state.player1;
    }
  }
}

function mpMarkBoard(state, index, player) {
  state.board[index] = player;
  $(`#${index}`).text(player);
  if(checkWin(state) || checkTie(state)) gameOver(state);
}

function humanAIRandomTurn() {
  if(state.computer !== '' || state.human !== "") {
    let players = [state.human, state.computer];
    let random = Math.floor(Math.random() * players.length);
    state.currPlayer = players[random];
    switchLight(state.currPlayer);
    if(state.currPlayer === state.computer) initializeRandomMove(true);
    if(state.currPlayer === state.human) initializeRandomMove(false);
  }
}

function initializeRandomMove(status) {
  if(status) {
    state.compMove = Math.floor(Math.random() * state.board.length);
    setTimeout(() => {
      markBoard(state.compMove, state.computer);
      switchTo(state.human);
    }, 1000);
  } else {
    switchTo(state.human);
  }
}

function switchLight(player) {
  if(player == state.computer || player == state.player2) {
    $('#dot1').css('background', 'red');
    $('#dot2').css('background', 'green');
  } else {
    $('#dot1').css('background', 'green');
    $('#dot2').css('background', 'red');
  }
}

function switchTo(player) {
  if(player == state.computer) {
    state.currPlayer = state.computer;
    switchLight(state.currPlayer);
  } else {
    state.currPlayer = state.human;
    switchLight(state.currPlayer);
  }
}

function humanTurn(index) {
  if(typeof state.board[index] === 'number') {
    if(!state.gameOver && state.currPlayer === state.human) {
      markBoard(index, state.human);
      if(checkWin(state) || checkTie(state)) {
        return gameOver(state);
      } else {
        switchTo(state.computer);
        setTimeout(() => computerTurn(), 500);
      }
    }
  }
}

function computerTurn() {
  if(state.currPlayer === state.computer) {
    minimax(state, state.computer, 0);
    markBoard(state.compMove, state.computer);
    if(checkWin(state) || checkTie(state)) {
      return gameOver(state);
    } else {
      switchTo(state.human);
    }
  }
}

function markBoard(index, player) {
  state.board[index] = player;
  $(`#${index}`).text(player);
}

function minimax(state, player, depth) {
  let newState = JSON.parse(JSON.stringify(state));
  let availSpots = emptySquares(newState);
  
  if(checkWin(newState)) {
    return score(newState, depth);
  } else if(availSpots.length === 0) {
    return 0;
  } else {
    depth++
    let scores = [];
    for(let i = 0; i < availSpots.length; i++) {
      newState.board[availSpots[i]] = player;
      if(player === newState.human) {
        scores.push(minimax(newState, newState.computer, depth));
      } else {
        scores.push(minimax(newState, newState.human, depth));
      }
      newState.board[availSpots[i]] = availSpots[i];
    }
    
    if(player === newState.human) {
      let maxIndex = findIndexMax(scores);
      state.compMove = availSpots[maxIndex];
      return scores[maxIndex];
    } else {
      let minIndex = findIndexMin(scores);
      state.compMove = availSpots[minIndex]
      return scores[minIndex];
    }
    
  }
}

function findIndexMax(scores) {
  var maxIndex = 0;
  if(scores.length > 1) {
    for(var i = 0; i < scores.length; i++) {
      if(scores[i] > scores[maxIndex]) {
        maxIndex = i;
      }
    }
  }
  return maxIndex;
}

function findIndexMin(scores) {
  var minIndex = 0;
  if(scores.length > 1) {
    for(var i = 0; i < scores.length; i++) {
      if(scores[i] < scores[minIndex]) {
        minIndex = i;
      }
    }
  }
  return minIndex;
}

function score(state, depth) {
  if(state.winner === state.human) {
    return 10 - depth;
  } else if(state.winner === state.computer) {
    return -10 + depth;
  }
}

function checkWin(state) {
  let combos  = {
    0: { win: [state.board[0], state.board[1], state.board[2]], index: [0, 1, 2] },
    1: { win: [state.board[3], state.board[4], state.board[5]], index: [3, 4, 5] },
    2: { win: [state.board[6], state.board[7], state.board[8]], index: [6, 7, 8] },
    3: { win: [state.board[0], state.board[3], state.board[6]], index: [0, 3, 6] },
    4: { win: [state.board[1], state.board[4], state.board[7]], index: [1, 4, 7] },
    5: { win: [state.board[2], state.board[5], state.board[8]], index: [2, 5, 8] },
    6: { win: [state.board[0], state.board[4], state.board[8]], index: [0, 4, 8] },
    7: { win: [state.board[2], state.board[4], state.board[6]], index: [2, 4, 6] }
  };
  
  for(let row in combos) {
    let combo = combos[row].win;
    let index = combos[row].index;
    if(combo.every(elem => elem === state.human || elem === state.player1)) { 
      state.winner = state.human || state.player1;
      state.winCombo = index;
      state.gameOver = true;
      return true;
    }
  }
  
  for(let row in combos) {
    let combo = combos[row].win;
    let index = combos[row].index;
    if(combo.every(elem => elem === state.computer || elem === state.player2)) {
      state.winner = state.computer || state.player2;
      state.winCombo = index;
      state.gameOver = true;
      return true;
    }
  }
  return false;
}

function checkTie(state) {
  if(!checkWin(state) && emptySquares(state).length === 0) {
    state.winner = 'draw';
    state.gameOver = true;
    return true;
  }
  return false;
}

function updateScoreBoard(winner) {
  if(winner == state.human || winner == state.player1) {
    $('#score1').text(state.score1+=1)
  } else {
    $('#score2').text(state.score2+=1)
  }
}

function reset(state) {
  showBackground();
  $('.square').css('background', '#9EA7A6');
  $('.square').empty();
  $('#gameOver').hide();
  state.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  state.winCombo = [];
  state.gameOver = false;
  state.currPlayer = '';
  if(!state.twoPlayerMode) humanAIRandomTurn();
  if(state.twoPlayerMode) mpRandomTurn(state);
}

function resetAll () {
  $('#score1').text(state.score1 = 0);
  $('#score2').text(state.score2 = 0);
  state.score1 = 0;
  state.score2 = 0;
  state.computer = '';
  state.human = '';
  reset(state);
}

function gameOver(state) {
  if(checkWin(state)) {
    state.winCombo.forEach(id => $(`#${id}`).css('background', '#FFACD9'));
    $('#gameOver').text(state.winner + ' wins!').fadeIn();
    fadeBackground();
    updateScoreBoard(state.winner);
  }
  if(checkTie(state)) {
    $('#gameOver').text("Its' a draw").fadeIn();
    fadeBackground();
  }
  setTimeout(() => reset(state), 1500);
}


$(document).ready(() => {
  
  loadBoard();
  
  $('.square').click((e) => {
    if(!state.twoPlayerMode) humanTurn(e.target.id);
  });
  
  $('.singlePlay-btn').click(() => {
    $('#first-menu').hide();
    $('#choose-menu').fadeIn();
    onePlayerMode();
  });
  
  $('.doublePlay-btn').click(() => {
    $('#first-menu').hide();
    $('#choose-menu').fadeIn();
    twoPlayerMode();
  });
  
  $('.XBtn').click(() => {
    $('#choose-menu').hide();
    loadGame();
    assignPlayer("X");
    if(!state.twoPlayerMode) humanAIRandomTurn();
  });
  
  $('.OBtn').click(() => {
    $('#choose-menu').hide();
    loadGame();
    assignPlayer("O");
    if(!state.twoPlayerMode) humanAIRandomTurn();
  });
  
  $('.back-btn').click(() => {
    $('#choose-menu').hide();
    $('#first-menu').fadeIn();
  });

  $('#reset-all').click(() => {
    if(!state.gameOver) {
      $('#popup-menu').fadeIn();
      state.gameOver = true;
      fadeBackground();
    }
  });
  
  $('#yes-reset').click(() => {
    $('#popup-menu').hide();
    $('#game-board').hide();
    $('#score-board').hide();
    $('#board-btn').hide();
    $('#choose-menu').fadeIn();
    resetAll();
  });
  
  $('#no-reset').click(() => {
    $('#popup-menu').fadeOut();
    showBackground();
    state.gameOver = false;
  });
  
});