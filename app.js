const board = document.querySelector(".board");
let freeze = false;
let hasComputer = false;

const gameState = {
    board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  currentPlayer: "x",
};

for(let i=0; i<3; i++) {
  for (let j = 0; j < 3; j++){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = `${i}-${j}`;
    board.append(cell);
  }
}

board.addEventListener("click", (e) => {
  if(freeze)
    return;

  const row = e.target.id[0];
  const col = e.target.id[2];

  if (gameState.board[row] [col] !== null) {
    return;
  }
  gameState.board[row][col] = gameState.currentPlayer;

  console.log("Game State: ", gameState);

  renderBoard();
  if(checkWin()) {
    window.alert(`${gameState.currentPlayer} won!`);
    freeze = true;
    return;
  } 
  if(checkTie()) {
    window.alert('Tie Game!');
    freeze = true;
    return;
  }
  switchPlayers();
  if(gameState.currentPlayer === 'o' && hasComputer) {
    makeComputerMove();
  }
});

function makeComputerMove() {
  let coordinates = [];
  for(let i = 0; i < gameState.board.length; i++) {
    for(let j = 0; j < gameState.board[i].length; j++) {
      if(!gameState.board[i][j])
        coordinates.push(`${i}-${j}`);
    }
  }
  if(coordinates.length === 0)
    return;

  const random = Math.floor(Math.random() * coordinates.length);
  document.getElementById(coordinates[random]).click();
}

function checkWin() {

  //checks rows
  let rowWin = checkForMatching(gameState.board);
  let columnWin = checkForMatching(transpose(gameState.board));
  let diagnol1 = [gameState.board[0][0], gameState.board[1][1], gameState.board[2][2]];
  let diagnol2 = [gameState.board[0][2], gameState.board[1][1], gameState.board[2][0]];
  let diagnolWin = checkForMatching([diagnol1, diagnol2]);
  
  return rowWin || columnWin || diagnolWin;
}

function checkTie() {
  for(let i = 0; i < gameState.board.length; i++) {
    for(let j = 0; j < gameState.board[i].length; j++) {
      if(!gameState.board[i][j])
        return false;
    }
  }
  return true;
}

//Found this transpose function on stackoverflow to flip rows to columns
function transpose(a) {
  return Object.keys(a[0]).map((c) => {
      return a.map((r) => { return r[c]; });
  });
}


function checkForMatching(input) {
  for(let i = 0; i < input.length; i++) {
    let arr = input[i];
    //if the first entry in the row is empty we can go to the next one
    if(!arr[0])
      continue;

    //if all entries in that row don't match we can go to the next one
    if(arr.filter((item) => arr[0] === item).length !== arr.length)
      continue;

    //if we make it here all items match so it's true
    return true;
  }

  return false;
}

function renderBoard(){
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.getElementById(`${i}-${j}`);
        cell.innerText = gameState.board[i][j];
    }
  }
}

function switchPlayers() {
  if (gameState.currentPlayer === "x") {
    gameState.currentPlayer = "o";
  } else {
    gameState.currentPlayer = "x";
  }
}

document.getElementById("playerOneButton").addEventListener('click', () => {
  let playerOne = document.getElementById("playerOne").value;
  document.querySelector('.playerOne').innerHTML = `<span>Player One (x): ${playerOne}</span>`;
});

  document.getElementById("playerTwoButton").addEventListener('click', () =>{
    let playerTwo = document.getElementById("playerTwo").value;
    if(!playerTwo) {
      playerTwo = 'Computer';
      hasComputer = true;
    }
    document.querySelector('.playerTwo').innerHTML = `<span>Player Two (o): ${playerTwo}</span>`;
  });

  document.getElementById("restartButton").addEventListener("click", () => {
    gameState.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    gameState.currentPlayer = 'x';
    freeze = false;
    renderBoard();
  });