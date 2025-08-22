// Elements
const gameEl = document.getElementById('game');
const statusEl = document.getElementById('status');
const modeEl = document.getElementById('mode');
const scoreOEl = document.getElementById('scoreO');
const scoreXEl = document.getElementById('scoreX');
const scoreDEl = document.getElementById('scoreD');
const newBtn = document.getElementById('newGame');
const resetBtn = document.getElementById('resetAll');
const swapStarterBtn = document.getElementById('swapStarter');

// Game State
let board = Array(9).fill('');
let currentPlayer = 'O'; // who is to play now
let starter = 'O';       // who starts new games
let gameActive = true;
let scores = { O:0, X:0, D:0 };

const lines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Build cells
const cells = [];
for(let i=0;i<9;i++){
  const b = document.createElement('button');
  b.className = 'box';
  b.setAttribute('role','gridcell');
  b.setAttribute('aria-label',`Cell ${i+1}`);
  b.addEventListener('click', ()=> onCellClick(i));
  gameEl.appendChild(b);
  cells.push(b);
}

// Utilities
const emptyIndices = (b)=> b.map((v,i)=> v===''? i:null).filter(i=> i!==null);
function checkWinner(b){
  for(const [a,c,d] of lines){
    if(b[a] && b[a]===b[c] && b[a]===b[d]) return { winner: b[a], line:[a,c,d] };
  }
  if(emptyIndices(b).length===0) return { winner:'D', line:[] };
  return null;
}

function render(highlight = []){
  board.forEach((v,i)=>{
    cells[i].textContent = v;
    cells[i].classList.toggle('O', v==='O');
    cells[i].classList.toggle('X', v==='X');
    cells[i].disabled = !gameActive || v!=='';
    cells[i].classList.toggle('win', highlight.includes(i));
  });
}

function setStatus(){
  const mode = modeEl.value;
  if(!gameActive){ return; }
  if(mode==='ai'){
    if(currentPlayer===starter){
      statusEl.textContent = `Player ${currentPlayer}'s turn`;
    } else {
      // If AI is X when starter is O, then AI plays when currentPlayer !== starter
      const isAITurn = (starter==='O' && currentPlayer==='X') || (starter==='X' && currentPlayer==='O');
      statusEl.textContent = isAITurn ? `AI's turn (${currentPlayer})` : `Player ${currentPlayer}'s turn`;
    }
  } else {
    statusEl.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// Smart AI: win > block > center > corner > side
function pickSmartMove(b, aiMark, humanMark){
  const empties = emptyIndices(b);
  if(empties.length===0) return null;
  // 1) Win
  for(const i of empties){ const copy=b.slice(); copy[i]=aiMark; if(checkWinner(copy)?.winner===aiMark) return i; }
  // 2) Block
  for(const i of empties){ const copy=b.slice(); copy[i]=humanMark; if(checkWinner(copy)?.winner===humanMark) return i; }
  // 3) Center
  if(b[4]==='') return 4;
  // 4) Corners
  const corners=[0,2,6,8].filter(i=> b[i]===''); if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
  // 5) Sides
  const sides=[1,3,5,7].filter(i=> b[i]===''); return sides.length? sides[Math.floor(Math.random()*sides.length)]: null;
}

// Handlers
function onCellClick(i){
  if(!gameActive || board[i]!=='' ) return;
  board[i]=currentPlayer;
  render();
  const res = checkWinner(board);
  if(res){ return endRound(res); }

  // Next turn
  currentPlayer = currentPlayer==='O' ? 'X' : 'O';
  setStatus();

  // If AI mode and it's AI's turn, move with slight delay
  if(modeEl.value==='ai'){
    const aiMark = (starter==='O') ? 'X' : 'O';
    const isAITurn = currentPlayer === aiMark;
    if(isAITurn){ setTimeout(aiMove, 450); }
  }
}

function aiMove(){
  if(!gameActive) return;
  const aiMark = (starter==='O') ? 'X' : 'O';
  const humanMark = aiMark==='X' ? 'O' : 'X';
  const move = pickSmartMove(board, aiMark, humanMark);
  if(move===null) return;
  board[move] = aiMark;
  render();
  const res = checkWinner(board);
  if(res){ return endRound(res); }
  currentPlayer = humanMark;
  setStatus();
}

function endRound({ winner, line }){
  gameActive = false;
  render(line);
  if(winner==='D'){
    scores.D++; scoreDEl.textContent = scores.D; statusEl.textContent = `It's a draw!`;
  } else {
    scores[winner]++; if(winner==='O') scoreOEl.textContent = scores.O; else scoreXEl.textContent = scores.X;
    statusEl.textContent = `${winner} wins!`;
  }
}

function newGame(){
  board = Array(9).fill('');
  gameActive = true;
  currentPlayer = starter;
  // Update starter button text
  swapStarterBtn.textContent = `Starter: ${starter}`;
  render();
  setStatus();

  // If AI mode and AI is starter, let AI move first
  if(modeEl.value==='ai'){
    const aiMark = (starter==='O') ? 'X' : 'O';
    if(starter === aiMark){ setTimeout(aiMove, 450); }
  }
}

function resetAll(){
  scores = { O:0, X:0, D:0 };
  scoreOEl.textContent = '0';
  scoreXEl.textContent = '0';
  scoreDEl.textContent = '0';
  starter = 'O';
  newGame();
}

// Event bindings
newBtn.addEventListener('click', newGame);
resetBtn.addEventListener('click', resetAll);
modeEl.addEventListener('change', ()=>{ newGame(); });
swapStarterBtn.addEventListener('click', ()=>{
  starter = (starter==='O') ? 'X' : 'O';
  newGame();
});

// Init
newGame();