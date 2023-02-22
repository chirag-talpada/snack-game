let speed = 5;
let last_Timestamp = 0;
let score_val = 0;
let upper_bound =28;
let isRunning=true;

const snakeBody = [{ x: 2, y: 5 }, { x: 2, y: 6 }];
const snakeFood = { x: 10, y: 10 }
let snakeDir = { x: 1, y: 0 }

const gameBoard = document.querySelector('.board');
const score = document.querySelector('.score');
const highScore = document.querySelector('.HighScore');

function isGameOver(x, y) {
    return snakeBody.some(bodyPart => {
        return bodyPart.x === x && bodyPart.y === y;
    })
}


function updateSnake() {

    gameBoard.innerHTML = '';

    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }

    if (isGameOver((snakeBody[0].x + snakeDir.x), (snakeBody[0].y + snakeDir.y))) {
        alert('Game Over');
        isRunning=false;

        if(localStorage.getItem('highScore') === null || localStorage.getItem('highScore') < score_val) {
            localStorage.setItem('highScore', score_val);
        }

        window.location.reload();
    }

    snakeBody[0].x += snakeDir.x;
    snakeBody[0].y += snakeDir.y;

    if (snakeBody[0].x === upper_bound + 1) {
        snakeBody[0].x = 1;
    }

    if (snakeBody[0].x === 0) {
        snakeBody[0].x = upper_bound;
    }


    if (snakeBody[0].y === upper_bound + 1) {
        snakeBody[0].y = 1;
    }

    if (snakeBody[0].y === 0) {
        snakeBody[0].y = upper_bound;
    }

}

function drawSnake() {


    snakeBody.forEach((cell, index) => {

        const snakeElement = document.createElement('div');
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');

        }

        snakeElement.style.gridRowStart = cell.y;
        snakeElement.style.gridColumnStart = cell.x;

        gameBoard.appendChild(snakeElement)
    });
}

function onFood(food) {
    return snakeBody.some(cell => cell.x === food.x && cell.y === food.y);
}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.gridRowStart = snakeFood.y;
    foodElement.style.gridColumnStart = snakeFood.x;
    gameBoard.appendChild(foodElement);


    if (onFood(snakeFood)) {
        score_val++;
        score.innerHTML = `Score : ${score_val}`;
        speed++;
        updateFood();
    }

}

function getRandomfood() {

    let x;
    let y;

    while(true){
        x = Math.floor(Math.random() * upper_bound) + 1;
        y = Math.floor(Math.random() * upper_bound) + 1;
        let isOverlapFood = snakeBody.some(cell => cell.x === x && cell.y === y);
        
        if(!isOverlapFood){
            break;
        }
    }

    return [x, y];
    

}

function updateFood() {
    snakeBody.unshift({ x: snakeFood.x, y: snakeFood.y });
    let [x, y] = getRandomfood();

    snakeFood.x = x;
    snakeFood.y = y;

}

function move(time) {
    if(isRunning){
        requestAnimationFrame(move);
    }

    if (((time - last_Timestamp) / 1000) < (1 / speed)) {
        return;
    }
    last_Timestamp = time;

    updateSnake();
    drawSnake(gameBoard);

    drawFood();

}

function getHighestScore() {

    if (localStorage.getItem('highScore') === null) {
        localStorage.setItem('highScore', 0);
    }

    highScore.innerHTML = `High Score : ${localStorage.getItem('highScore')}`;


}

requestAnimationFrame(move);
getHighestScore();

window.addEventListener('keydown', e => {



    switch (e.key) {
        case 'ArrowUp':
            if (snakeDir.y === 1) {
                break;
            }
            snakeDir.x = 0;
            snakeDir.y = -1;
            break;
        case 'ArrowDown':
            if (snakeDir.y === -1) {
                break;
            }
            snakeDir.x = 0;
            snakeDir.y = 1;
            break;
        case 'ArrowLeft':
            if (snakeDir.x === 1) {
                break;
            }
            snakeDir.x = -1;
            snakeDir.y = 0;
            break;
        case 'ArrowRight':
            if (snakeDir.x === -1) {
                break;
            }
            snakeDir.x = 1;
            snakeDir.y = 0;
            break;
        case '1':
            if (snakeDir.x === -1 && snakeDir.y === -1) {
                break;
            }
            snakeDir.x = 1;
            snakeDir.y = 1;
            break;
        case '2':
            if (snakeDir.x === 1 && snakeDir.y === 1) {
                break;
            }
            snakeDir.x = -1;
            snakeDir.y = -1;
            break;
        case '3':
            if (snakeDir.x === 1 && snakeDir.y === -1) {
                break;
            }
            snakeDir.x = -1;
            snakeDir.y = 1;
            break;
        case '4':
            if (snakeDir.x === -1 && snakeDir.y === 1) {
                break;
            }
            snakeDir.x = 1;
            snakeDir.y = -1;
            break;
        default:
    }

})


