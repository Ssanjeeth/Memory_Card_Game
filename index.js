var familyDeck = [
  "Avi", "Anu", "Balan", "Kanish", "Sushanth", "Srinaya",
  "Haarav", "Vidhu", "SriHarith", "Sumi", "Jo", "Shanayra",
  "Avi", "Anu", "Balan", "Kanish", "Sushanth", "Srinaya",
  "Haarav", "Vidhu", "SriHarith", "Sumi", "Jo", "Shanayra"
];

var shuffleDeck = [];
var cardSelected = [];
var flippedArray = [];
var points = 0;
var lockBoard = false;
var timer = 0;
var timeInterval;
var gameStarted = false; // New flag to track game start

// Shuffle deck and create cards
function setupGame() {
  // Reset game state
  shuffleDeck = [];
  flippedArray = [];
  points = 0;
  lockBoard = false;
  timer = 0;
  gameStarted = false; // Reset gameStarted
  clearInterval(timeInterval);

  // Update UI
  document.querySelector(".pointCounter").innerHTML = "Points: 0";
  document.querySelector(".timer").innerHTML = "Time: 0s";
  document.querySelector("h1").innerHTML = "Memory Card Game";
  document.querySelector("h1").classList.remove("dance"); // Remove dance class on reset

  // Enable start button
  var startButton = document.querySelector(".startButton");
  if (startButton) {
    startButton.disabled = false; // Re-enable start button on reset
  }

  // Shuffle deck
  var tempDeck = [...familyDeck]; // Create a copy to shuffle
  while (tempDeck.length > 0) {
    var n = Math.floor(Math.random() * tempDeck.length);
    shuffleDeck.push(tempDeck[n]);
    tempDeck.splice(n, 1);
  }

  // Clear and repopulate game container
  var gameContainer = document.querySelector(".gameContainer");
  if (!gameContainer) {
    console.error("Game container not found!");
    return;
  }
  gameContainer.innerHTML = ""; // Clear existing cards
  shuffleDeck.forEach(name => {
    var cardHTML = `
      <div class="card ${name}">
        <img class="front" src="./images/${name}.jpeg"/>
        <img class="back" src="./images/me.jpeg"/>
      </div>`;
    gameContainer.innerHTML += cardHTML;
  });

  // Reattach event listeners to new cards
  cardSelected = document.querySelectorAll(".card");
  cardSelected.forEach(card => {
    card.addEventListener("click", handleCardClick);
  });
}

// Card click handler
function handleCardClick() {
  // Prevent clicking if game hasn't started, board is locked, card is flipped, or same card is clicked
  if (!gameStarted || lockBoard || this.classList.contains("flipped") || (flippedArray.length === 1 && this === flippedArray[0])) {
    return;
  }

  this.classList.add("flipped");
  flippedArray.push(this);

  if (flippedArray.length === 2) {
    lockBoard = true;

    if (flippedArray[0].classList[1] === flippedArray[1].classList[1]) {
      points++;
      document.querySelector(".pointCounter").innerHTML = `Points: ${points}`;
      flippedArray = [];
      lockBoard = false;

      if (points === 12) {
        clearInterval(timeInterval);
        document.querySelector("h1").innerHTML = "Hurray!, You Won.";
        document.querySelector("h1").classList.add("dance"); // Add dance class
        lockBoard = true;
      }
    } else {
      setTimeout(() => {
        flippedArray[0].classList.remove("flipped");
        flippedArray[1].classList.remove("flipped");
        flippedArray = [];
        lockBoard = false;
      }, 1000);
    }
  }
}

// Timer function
function startTimer() {
  // Disable start button
  var startButton = document.querySelector(".startButton");
  if (startButton) {
    startButton.disabled = true; // Lock start button
  }

  if (timeInterval) clearInterval(timeInterval); // Clear any existing interval
  gameStarted = true; // Set game as started
  timer = 0;
  document.querySelector(".timer").innerHTML = "Time: 0s";
  timeInterval = setInterval(() => {
    timer++;
    document.querySelector(".timer").innerHTML = `Time: ${timer}s`;
    if (timer === 90) {
      clearInterval(timeInterval);
      lockBoard = true;
      if (points === 12) {
        document.querySelector("h1").innerHTML = "Hurray!, You Won.";
        document.querySelector("h1").classList.add("dance"); // Add dance class
      } else {
        document.querySelector("h1").innerHTML = "Time Up!, You Lost";
        document.querySelector("h1").classList.add("dance"); // Add dance class
      }
    }
  }, 1000);
}

// Reset game
function resetGame() {
  setupGame(); // Reset everything
}

// Initialize game on load
setupGame();

// Start button
var startButton = document.querySelector(".startButton");
if (startButton) {
  startButton.addEventListener("click", startTimer);
} else {
  console.error("Start button not found!");
}

// Reset button
var resetButton = document.querySelector(".resetButton");
if (resetButton) {
  resetButton.addEventListener("click", resetGame);
} else {
  console.error("Reset button not found!");
}