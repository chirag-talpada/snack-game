let speed = 5;
let old_speed = 5;
let speed_flag = false;
let mobile_flag = false;

let last_Timestamp = 0;
let score_val = 0;
let upper_bound = 28;
let isRunning = true;

const snakeBody = [{ x: 2, y: 5 }, { x: 2, y: 6 }];
const snakeFood = { x: 10, y: 10 }
let snakeDir = { x: 1, y: 0 }

const ControlBtn = document.querySelector('.controls');

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
        isRunning = false;

        if (localStorage.getItem('highScore') === null || localStorage.getItem('highScore') < score_val) {
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
            if (index % 2 === 0) {
                snakeElement.classList.add('snake-p2');
            } else {
                snakeElement.classList.add('snake-p1');
            }

        }

        snakeElement.style.gridRowStart = cell.y;
        snakeElement.style.gridColumnStart = cell.x;

        gameBoard.appendChild(snakeElement)
    });
}

function onFood(food) {
    return snakeBody.some(cell => cell.x === food.x && cell.y === food.y);
}

function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`;

}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.backgroundColor = getRandomColor();
    foodElement.style.border = `2px solid black`;
    foodElement.style.borderRadius = `50%`;
    foodElement.style.gridRowStart = snakeFood.y;
    foodElement.style.gridColumnStart = snakeFood.x;
    gameBoard.appendChild(foodElement);


    if (onFood(snakeFood)) {
        score_val++;
        score.innerHTML = `Score : ${score_val}`;
        speed += 1;
        updateFood();
    }

}

function getRandomfood() {

    let x;
    let y;

    while (true) {
        x = Math.floor(Math.random() * upper_bound) + 1;
        y = Math.floor(Math.random() * upper_bound) + 1;
        let isOverlapFood = snakeBody.some(cell => cell.x === x && cell.y === y);

        if (!isOverlapFood) {
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
    if (isRunning) {
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

let timer;

window.addEventListener('keydown', e => {

    if (e.key == " ") {
        clearTimeout(timer);
        if (!speed_flag) {
            old_speed = speed;
        }

        if(mobile_flag){
            speed = 59;
            mobile_flag=false;
        }else{
            speed = 30;
        }
        speed_flag = true;

        timer = setTimeout(() => {
            speed = old_speed;
            speed_flag = false;
        }, 100)


    } else {
        speed = old_speed;
        speed_flag = false;
    }


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

ControlBtn.addEventListener('click', (e) => {

    let className = e.target.closest('div').classList.value;
    let keydown;

    switch (className) {
        case 'left-top':
            keydown = new KeyboardEvent('keydown', { key: '2', code: '2', keyCode: 50 });
            window.dispatchEvent(keydown);
            break;
        case 'top':
            keydown = new KeyboardEvent('keydown', { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 });
            window.dispatchEvent(keydown);
            break;
        case 'right-top':
            keydown = new KeyboardEvent('keydown', { key: '4', code: '4', keyCode: 52 });
            window.dispatchEvent(keydown);
            break;
        case 'left':
            keydown = new KeyboardEvent('keydown', { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 });
            window.dispatchEvent(keydown);
            break;
        case 'middle':
            keydown = new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32 });
            window.dispatchEvent(keydown);
            mobile_flag=true;
            break;
        case 'right':
            keydown = new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 });
            window.dispatchEvent(keydown);
            break;
        case 'left-bottom':
            keydown = new KeyboardEvent('keydown', { key: '3', code: '3', keyCode: 51 });
            window.dispatchEvent(keydown);
            break;
        case 'bottom':
            keydown = new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 });
            window.dispatchEvent(keydown);
            break;
        case 'right-bottom':
            keydown = new KeyboardEvent('keydown', { key: '1', code: '1', keyCode: 49 });
            window.dispatchEvent(keydown);
            break;
        default:
    }



})
