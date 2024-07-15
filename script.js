const canvas = document.getElementById("gameArea");

const ctx = canvas.getContext("2d");

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

let dx = 10;
let dy = 0;

let defaultPosition = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];
let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

function drawSnakePart(snakePart) {
  ctx.fillStyle = "lightgreen";
  ctx.strokeStyle = "darkgreen";
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
  snake.forEach((part) => drawSnakePart(part));
}

let scoreVar = 0;
let score = 0;
function advanceSnake() {
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };
  const eatenFood = foodX === snake[0].x && foodY === snake[0].y;
  snake.unshift(head);
  if (eatenFood) {
    createFood();
    scoreVar += 10;
    score = document.getElementById("score");
    score.innerHTML = scoreVar;
  } else {
    snake.pop();
  }
}

function changeDirection(event) {
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const keypressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingLeft = dx === -10;
  const goingRight = dx === 10;

  if (keypressed === LEFT && !goingRight) {
    dx = -10;
    dy = 0;
  } else if (keypressed === RIGHT && !goingLeft) {
    dx = 10;
    dy = 0;
  } else if (keypressed === UP && !goingDown) {
    dx = 0;
    dy = -10;
  } else if (keypressed === DOWN && !goingUp) {
    dx = 0;
    dy = 10;
  } else {
    console.log("Use the arrow keys to control the snake");
  }
}

function randomNum(max, min) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

let foodX, foodY;

function createFood() {
  foodX = randomNum(0, canvas.width - 10);
  foodY = randomNum(0, canvas.height - 10);
  snake.forEach((part) => {
    const foodIsOnSnake = foodX == part.x && foodY == part.y;
    if (foodIsOnSnake) createFood();
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.strokeStyle = "black";
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

let collided = "";

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const hasCollided = snake[0].x == snake[i].x && snake[0].y == snake[i].y;
    if (hasCollided) {
      collided = "Snake collided with itself!";
      return true;
    }
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;

  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall)
    collided = "Snake hit the wall!";

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

let gameOver = false;

function resetGame() {
  gameOver = false;
  scoreVar = 0;
  snake = [...defaultPosition];
  dx = 10;
  dy = 0;
  createFood();
  score.innerHTML = scoreVar;
}

function main() {
  createFood();
  setInterval(() => {
    if (gameOver) return;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    if (didGameEnd()) {
      gameOver = true;
      alert("Game over! Your score is: " + scoreVar + "... " + collided);
      clearInterval();
      resetGame();
    }
  }, 100);
}

main();
document.addEventListener("keydown", changeDirection);
