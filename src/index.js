import './styles/styles.css';
import { 
  gameSettings,
  colors,
  getBricks,
  defaultBall,
  getCurrentLevelSettings,
  getBrickRowCount,
  getBrickColumnCount,
  getBrickWidth,
  getBrickHeight,
  getBrickPadding,
  getBrickOffsetTop,
  getBrickOffsetLeft,
  getBrickBarrierSize
 } from "./settingsHelper";

 import {
  createConfetti,
  clearConfetti
 } from "./confettiHelper"

let canvas = document.getElementById("myCanvas");

let button = document.getElementById("button");
let notes = document.getElementsByClassName("notes")[0];
let level = document.getElementsByClassName("level")[0];
let score = document.getElementsByClassName("score")[0];
let ctx = canvas.getContext("2d");
let drawInterval;
let heightRatio = 0.7;
canvas.height = canvas.width * heightRatio;


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler);
button.addEventListener("click", start);


//шарик
let ball = defaultBall(canvas.width, canvas.height);

//ракетка
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight;
let rightPressed = false;
let leftPressed = false;

let bricks = getBricks();

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function touchMoveHandler(e) {
  let relativeX = e.touches[0].clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = colors.main;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = colors.main;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(let c = 0; c < getBrickColumnCount(); c++) {
    for(let r = 0; r < getBrickRowCount(); r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (getBrickWidth() + getBrickPadding()) + getBrickOffsetLeft();
        let brickY = r * (getBrickHeight() + getBrickPadding()) + getBrickOffsetTop();
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, getBrickWidth(), getBrickHeight());
        ctx.fillStyle = colors.main;
        ctx.fill();
        if (getCurrentLevelSettings().hasBarrier && !bricks[c][r].breakBarrier) {
          ctx.strokeStyle = colors.barrier;
          ctx.lineWidth = getBrickBarrierSize();
          ctx.stroke();
        }
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  score.innerHTML = `Score: ${gameSettings.score}`;
}

function drawLevel() {
 level.innerHTML = `Level: ${gameSettings.currentLevel}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  //мяч отскакивает от стен
  if (ball.x + ball.dx > canvas.width - ball.ballRadius || ball.x + ball.dx < ball.ballRadius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.ballRadius) {
    if (ball.x + ball.ballRadius > paddleX && ball.x + ball.ballRadius < paddleX + paddleWidth) {
      ball.dy = -ball.dy;
    } else {
      notes.innerHTML = `<p> Game over! <br>  Start again </p>`;
      gameSettings.gameOver = true;
      changeButtonStatus(true);
      clearInterval(drawInterval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      createConfetti(canvas, false);
    }
  }
  
  //движение ракетки влево, вправо
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function collisionDetection() {
  for (let c = 0; c < getBrickColumnCount(); c++) {
    for (let r = 0; r < getBrickRowCount(); r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        //столкновение с блоками
        if (
          (ball.x + ball.ballRadius > b.x &&
          ball.x < b.x + getBrickWidth() &&
          ball.y + ball.ballRadius > b.y &&
          ball.y < b.y + getBrickHeight()) || 
          (getCurrentLevelSettings().hasBarrier 
            && ball.x + ball.ballRadius > b.x + getBrickBarrierSize()
            && ball.x < b.x + getBrickWidth() + getBrickBarrierSize()
            && ball.y + ball.ballRadius > b.y + getBrickBarrierSize()
            && ball.y < b.y + getBrickHeight() + getBrickBarrierSize())
        ) {
          ball.dy = -ball.dy;
          if (getCurrentLevelSettings().hasBarrier && !b.breakBarrier) {
            b.breakBarrier = true;
          } else {
            b.status = 0;
            gameSettings.score++;
            drawScore();
            if (gameSettings.score == getBrickRowCount() * getBrickColumnCount()) {
              level.innerHTML = '';
              score.innerHTML = '';
              changeButtonStatus(false);
              clearInterval(drawInterval);
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              createConfetti(canvas, true);

              gameSettings.levels[gameSettings.currentLevel - 1].isWin = true;
              if (gameSettings.levels[gameSettings.currentLevel - 1].isWin 
                  && gameSettings.levels.length == gameSettings.currentLevel) {
                  notes.innerHTML = `<p> There are no more levels <br> Start again </p>`;
              } else {
                  notes.innerHTML = `<p> Play next Level </p>`;
              }
            }
          }
        }
      }
    }
  }
}

function start() {
  if (gameSettings.gameOver == true) {
    clearConfetti();
    document.location.reload();
  }
  else if (gameSettings.levels[gameSettings.currentLevel - 1].isWin && gameSettings.levels.length == gameSettings.currentLevel) {
      //start new game again 
      document.location.reload();
      clearInterval(drawInterval); 
  }
  else if (gameSettings.levels[gameSettings.currentLevel - 1].isWin) {
    //go to next level;  close confetti; reset draw settings
    clearConfetti();
    canvas.width = 480;
    canvas.height = canvas.width * heightRatio;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameSettings.currentLevel++;
    gameSettings.score = 0;
    ball = defaultBall(canvas.width, canvas.height);
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight;
    bricks = getBricks();
    
    drawLevel();
    drawScore();
    notes.innerHTML = '';
  } else if (button.classList.contains("active")) {
    //make pause
    clearInterval(drawInterval);
    changeButtonStatus(false);

  } else {
    //start level
    drawLevel();
    drawInterval = setInterval(draw, 10);
    changeButtonStatus(true);
  }
}

function changeButtonStatus(status) {
  button.classList.toggle("active");
  if (status) {
    button.innerHTML = `<svg id="pause" viewBox="-3.4 -3.4 31 31" height="90px" width="90px" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="1">
          <rect x="-2.4" y="-2.4" width="28.80" height="28.80" rx="14.4" fill="dark" stroke="#0095DD" strokewidth="0.048"></rect>
        </g>
        <g id="SVGRepo_iconCarrier"> 
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9 7C9 6.44772 8.55228 6 8 6C7.44772 6 7 6.44772 7 7V17C7 17.5523 7.44772 18 8 18C8.55228 18 9 17.5523 9 17V7ZM17 7C17 6.44772 16.5523 6 16 6C15.4477 6 15 6.44772 15 7V17C15 17.5523 15.4477 18 16 18C16.5523 18 17 17.5523 17 17V7Z" fill="#0095DD"></path> 
        </g>
      </svg>`
  }
  else {
    button.innerHTML = `<svg id="play" fill="#0095DD" height="90px" width="90px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve">
        <g id="SVGRepo_iconCarrier">
          <g>   
            <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"></path>
            <path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30 S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"></path>
          </g> 
        </g>
      </svg>`
  }
}
