/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLetf = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

var canvasSize;
var elementsSize;
let level = 0;
let lives = 3;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const gitPosition = {
    x: undefined,
    y: undefined,
}
const bombPosition = {
    x: undefined,
    y: undefined,
}
let enemyPosition = []

window.addEventListener('load', setcanvasSize);
window.addEventListener('resize', setcanvasSize)

function setcanvasSize() {
    canvasSize = window.innerWidth > window.innerHeight ?
        window.innerHeight * 0.8 : window.innerWidth * 0.8;
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = (canvasSize / 10) - 1;

    startGame()
}

function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end'



    const map = maps[level];
    if (!map) {
        gameWin();
        return;
    }

    const mapRows = map.trim().split('\n');
    const mapRowsCol = mapRows.map(row => row.trim().split(''));

    enemyPosition = [];
    game.clearRect(0, 0, canvasSize, canvasSize);
    mapRowsCol.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1) + 13;
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log({ playerPosition });
                }
            } else if (col == 'I') {
                gitPosition.x = posX;
                gitPosition.y = posY;
            } else if (col == 'X') {
                enemyPosition.push({
                    x: posX,
                    y: posY
                })
            }
            game.fillText(emoji, posX, posY);
        });
    });
    movePlayer();
}

function movePlayer() {
    const gitCollisionX = playerPosition.x.toFixed(3) == gitPosition.x.toFixed(3);
    const gitCollisionY = playerPosition.y.toFixed(3) == gitPosition.y.toFixed(3);
    const gitCollosion = gitCollisionX && gitCollisionY;
    if (gitCollosion) {
        levelWin();
    }

    const enemyCollision = enemyPosition.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        lostGame();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    level++;
    startGame();
}

function gameWin() {
    console.log("Terminasta el juego")
}
function lostGame() {
    for (let i = 1; i <= lives; i++) {
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        lives--
        break
    }
    if (lives == 0) {
        level = 0
        lives = 3
        startGame();
    }

    startGame();
}

btnUp.addEventListener('click', moveUp);
btnLetf.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);
window.addEventListener('keydown', moveByKey);

function moveByKey(event) {
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();
}

function moveUp() {
    if ((playerPosition.y - elementsSize) < elementsSize) {
        console.log('out')
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    if ((playerPosition.x - elementsSize) < elementsSize) {
        console.log('out')
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}


function moveRight() {
    if ((playerPosition.x + elementsSize) > canvasSize) {
        console.log('out')
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown() {
    if ((playerPosition.y + elementsSize) > canvasSize) {
        console.log('out')
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }
}