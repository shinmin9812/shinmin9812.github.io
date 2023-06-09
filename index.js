var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); //캔버스 안에 그림을 그릴 도구

var rabbitImage = new Image();
var jsImage = new Image();
var nodeImage = new Image();

rabbitImage.src = "./images/rabbit.png";
jsImage.src = "./images/js.png";
nodeImage.src = "./images/node.png";

// 맵 랜덤 값
var rand = Math.round(Math.random());

//공 좌표
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

//하단 바
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

//벽돌
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//점수 및 생명
var score = 0;
var lives = 3;

//벽돌 위치 설정
var bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0, check: 1 };
  }
}

//키보드 움직임 체크
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

//벽돌 충돌 체크
function collisionDetection() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      var b = bricks[i][j];
      if (b.check === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.check = 0;
          score++;
          if (rand === 0) {
            if (score === brickColumnCount * brickRowCount) {
              alert("축하합니다! 게임에서 승리했습니다!");
              document.location.reload();
              clearInterval(interval);
            }
          } else if (rand === 1) {
            if (score === 16) {
              alert("축하합니다! 게임에서 승리했습니다!");
              document.location.reload();
              clearInterval(interval);
            }
          }
        }
      }
    }
  }
}

//하단 바 그리기
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#8639EB";
  ctx.fill();
  ctx.closePath();
}

//공 그리기
function drawBall() {
  //ctx.beginPath();
  //ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  //ctx.fillStyle = "#8639EB";
  //ctx.fill();
  //ctx.closePath();
  ctx.drawImage(rabbitImage, x, y, ballRadius * 2, ballRadius * 2);
}

//벽돌 그리기
function drawBricks() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].check === 1) {
        if (rand === 0) {
          var brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[i][j].x = brickX;
          bricks[i][j].y = brickY;
          //ctx.beginPath();
          //ctx.rect(brickX, brickY, brickWidth, brickHeight);
          //ctx.fillStyle = "#8639EB";
          //ctx.fill();
          //ctx.closePath();
          ctx.drawImage(jsImage, brickX, brickY, brickWidth, brickHeight);
        } else if (rand === 1) {
          if (
            (i === 0 && j === 0) ||
            (i === 2 && j === 0) ||
            (i === 4 && j === 0) ||
            (i === 0 && j === 3) ||
            (i === 3 && j === 4) ||
            (i === 0 && j === 4) ||
            (i === 1 && j === 4) ||
            (i === 4 && j === 3) ||
            (i === 4 && j === 4)
          ) {
            continue;
          }
          var brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[i][j].x = brickX;
          bricks[i][j].y = brickY;
          ctx.drawImage(nodeImage, brickX, brickY, brickWidth, brickHeight);
        }
      }
    }
  }
}

//점수 그리기
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#8639EB";
  ctx.fillText(`점수 : ${score}`, 8, 20);
}

//생명 그리기
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#8639EB";
  ctx.fillText(`생명 : ${lives}`, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawBricks();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("게임 종료...");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}
draw();
