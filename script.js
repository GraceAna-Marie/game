// Game configuration and state variables
let goalCans = 20;
let startingTime = 30;
let spawnSpeed = 1000;
let difficulty = "normal";

let currentCans = 0;
let timeLeft = startingTime;
let gameActive = false;

let spawnInterval;
let timerInterval;

// Winning and losing messages
const winMessages = [
  "🎉 Amazing! You helped provide clean water!",
  "Great job! Every drop counts!",
  "Mission Complete! Your community has clean water!"
];

const loseMessages = [
  "Keep trying! You can do it!",
  "Almost there! Try again!",
  "Don't give up! Every click matters!"
];

// Difficulty settings
function setDifficulty(mode) {
  difficulty = mode;

  if (mode === "easy") {
    goalCans = 15;
    startingTime = 40;
    spawnSpeed = 1200;
  }

  else if (mode === "normal") {
    goalCans = 20;
    startingTime = 30;
    spawnSpeed = 1000;
  }

  else if (mode === "hard") {
    goalCans = 30;
    startingTime = 20;
    spawnSpeed = 700;
  }

  document.querySelector(".game-instructions").textContent =
    `Collect ${goalCans} water cans before time runs out!`;

  if (!gameActive) {
    document.getElementById("timer").textContent =
      startingTime;
  }
}

// Create the 3x3 grid
function createGrid() {
  const grid = document.querySelector(".game-grid");
  grid.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    grid.appendChild(cell);
  }
}

// Create grid when page loads
createGrid();

// Spawn a water can
function spawnWaterCan() {
  if (!gameActive) return;

  const cells = document.querySelectorAll(".grid-cell");

  // Remove previous can
  cells.forEach(cell => {
    cell.innerHTML = "";
  });

  // Pick random cell
  const randomCell =
    cells[Math.floor(Math.random() * cells.length)];

  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;

  const can = randomCell.querySelector(".water-can");

  can.addEventListener("click", function () {
    if (!gameActive) return;

    currentCans++;

    document.getElementById("current-cans").textContent =
      currentCans;

    document.getElementById("achievements").textContent =
      "💧 Nice! You collected clean water!";

    // Remove the can
    randomCell.innerHTML = "";
  });
}

// Start game
function startGame() {
  if (gameActive) return;

  currentCans = 0;
  timeLeft = startingTime;
  gameActive = true;

  document.getElementById("current-cans").textContent = 0;
  document.getElementById("timer").textContent =
    timeLeft;
  document.getElementById("achievements").textContent =
    "";

  createGrid();

  spawnWaterCan();

  spawnInterval = setInterval(
    spawnWaterCan,
    spawnSpeed
  );

  timerInterval = setInterval(function () {
    timeLeft--;

    document.getElementById("timer").textContent =
      timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// End game
function endGame() {
  gameActive = false;

  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  document
    .querySelectorAll(".grid-cell")
    .forEach(cell => {
      cell.innerHTML = "";
    });

  const messageBox =
    document.getElementById("achievements");

  if (currentCans >= goalCans) {
    const random =
      Math.floor(Math.random() * winMessages.length);

    messageBox.textContent =
      winMessages[random];
  } else {
    const random =
      Math.floor(Math.random() * loseMessages.length);

    messageBox.textContent =
      loseMessages[random];
  }
}

// Reset button
document
  .getElementById("reset-game")
  .addEventListener("click", function () {

    clearInterval(spawnInterval);
    clearInterval(timerInterval);

    currentCans = 0;
    timeLeft = startingTime;
    gameActive = false;

    document.getElementById("current-cans").textContent =
      0;

    document.getElementById("timer").textContent =
      startingTime;

    document.getElementById("achievements").textContent =
      "";

    createGrid();
  });

// Start button
document
  .getElementById("start-game")
  .addEventListener("click", startGame);

// Difficulty buttons
document
  .querySelectorAll(".difficulty-btn")
  .forEach(button => {
    button.addEventListener("click", function () {

      document
        .querySelectorAll(".difficulty-btn")
        .forEach(btn =>
          btn.classList.remove("active")
        );

      this.classList.add("active");

      const mode =
        this.getAttribute("data-mode");

      setDifficulty(mode);
    });
  });