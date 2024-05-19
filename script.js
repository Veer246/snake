const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');

const gridSize = 20;
const canvasSize = 600;
let speed = 100;

let snake = [{ x: 100, y: 100 }];
let direction = { x: gridSize, y: 0 };
let food = { x: 200, y: 200 };
let obstacles = [];
let score = 0;
let level = 1;

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

function generateObstacles() {
    obstacles = [];
    for (let i = 0; i < level; i++) {
        let obstacle;
        do {
            obstacle = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
                y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
            };
        } while (obstacle.x === food.x && obstacle.y === food.y);

        obstacles.push(obstacle);
    }
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();
        if (score % 5 === 0) {
            level++;
            levelElement.textContent = level;
            speed -= 10;
            generateObstacles();
        }
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) ||
        obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)
    ) {
        alert('Game Over! Your score was ' + score);
        resetGame();
    }
}

function resetGame() {
    snake = [{ x: 100, y: 100 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    level = 1;
    levelElement.textContent = level;
    speed = 100;
    generateFood();
    generateObstacles();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(food.x, food.y, 'red');
    snake.forEach(segment => drawRect(segment.x, segment.y, 'lime'));
    obstacles.forEach(obstacle => drawRect(obstacle.x, obstacle.y, 'grey'));
}

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, speed);
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: -gridSize };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: gridSize };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -gridSize, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: gridSize, y: 0 };
            }
            break;
    }
}

window.addEventListener('keydown', changeDirection);
generateFood();
generateObstacles();
gameLoop();
