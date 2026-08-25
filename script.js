'use strict';



// WINNING_COMBOS, check, getNextPlayer, applyMove, createInitialState
// are provided by game.js, loaded before this script.

const cells    = document.querySelectorAll('.cell');
const status   = document.getElementById('status');
const restartBtn     = document.getElementById('restart');

const botaoUndo = document.getElementById('undo')
const botaoRedo = document.getElementById('redo')

var isUndo = false


let data = createInitialState();
const board = document.getElementById('board');

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = data.board[i];
    cell.className   = 'cell' + (data.board[i] ? ` ${data.board[i].toLowerCase()}` : '');
    cell.disabled    = data.board[i] !== '' || data.gameOver;
  });
}

function setStatus(msg, cls = '') {
  status.textContent = msg;
  status.className   = 'status' + (cls ? ` ${cls}` : '');
}


var oldIndex = null
var newIndex = null;

// Função que verifica e executa a jogada de clique no tabuleiro, marcando com X ou O
function handleClick(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (data.board[idx] || data.gameOver) return;

  const nextBoard = applyMove(data.board, idx, data.current);
  if (!nextBoard) return;
  data.board = nextBoard;
  render();


  // Variaveis de controle
  oldIndex = newIndex
  newIndex = idx

  console.log(newIndex)
  console.log(oldIndex)
  isUndo = false


  // Animate the placed cell
  cells[idx].classList.add('placed');

  const result = check(data.board);


  var a = checkWinner(result)

  data.current = getNextPlayer(data.current);
  if (!a) setStatus(`Player ${data.current}'s turn`);



}

// Verifica se há ganahdor no estado atual do jogo e executa animações
function checkWinner(result) {

  if (result) {
    data.gameOver = true;
    if (result.winner) {
      result.combo.forEach(i => cells[i].classList.add('winning'));
      setStatus(`Player ${result.winner} wins!`, 'win');

    } else {
      setStatus("It's a draw!", 'draw');

    }
    // Disable all cells
    return true;
  }


    return false;


}





// Restart game
function restartGame() {
  data = createInitialState();
  render();
  setStatus(`Player ${data.current}'s turn`);
  isUndo = false

}


// desfaz a ultima jogada
function undo() {
  if (isUndo) { 
    setStatus(`Não é possivel dar UNDO`);
    return null

  }
    data.gameOver = false;


  console.log('Fazendo UNDO')

  const nextBoard = applyUndoRedo(data.board, newIndex, '');
  if (!nextBoard) return;
  data.board = nextBoard;
  render();
  
  data.current = data.current === 'X' ? 'O' : 'X';
  isUndo = true
  setStatus(`Player ${data.current}'s turn`);

}


// Refaz a jogada desfeita
function redo() {
  if (!isUndo) {
    setStatus(`Não é possivel dar REDO`);
    return null
  }

  console.log('Fazendo REDO')

  const nextBoard = applyUndoRedo(data.board, newIndex, data.current );
  if (!nextBoard) return;
  data.board = nextBoard;
  render();

  data.current = data.current === 'X' ? 'O' : 'X';
  isUndo = false
  setStatus(`Player ${data.current}'s turn`);

  const result = check(data.board);
  var isWin = checkWinner(result)



}


// Atribuição de funções aos botões
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);

botaoUndo.addEventListener('click', undo);
botaoRedo.addEventListener('click', redo);


// Initial render
render();
setStatus(`Player ${data.current}'s turn`);
