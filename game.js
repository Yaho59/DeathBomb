/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLetf = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const heart = document.querySelector('#lives')
const time = document.querySelector('#time')
const record = document.querySelector('#record')
const resulRecord = document.querySelector('#result')

let canvasSize;
let elementsSize;

let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

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
        window.innerHeight * 0.7 : window.innerWidth * 0.7;
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

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowsCol = mapRows.map(row => row.trim().split(''));
    showLives();

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
    console.log("Terminasta el juego");
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem("record_Time")
    timePlayer = Date.now() - timeStart;

    if (recordTime) {
        if (recordTime >= timePlayer) {
            localStorage.setItem('record_Time', timePlayer)
            resulRecord.innerHTML = "Superaste el record";
        }else{
            resulRecord.innerHTML = "Sorry, you didn't break the record. ";
        }
    }else{
        localStorage.setItem('record_Time', timePlayer)
    }
    console.log({recordTime, timePlayer})
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
        timeStart = undefined;
        startGame();
    }
    startGame();
}
function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']);
    heart.innerHTML = "";
    heartsArray.forEach(hearts => heart.append(hearts));
}

function showTime() {
    time.innerHTML = formatTime(Date.now()-timeStart);;
}

function formatTime(ms){
    const cs = parseInt(ms/10) % 100
    const seg = parseInt(ms/1000) % 60
    const min = parseInt(ms/60000) % 60
    const hrs = parseInt(ms/3600000) % 24
    const csStr = `${cs}`.slice(-2)
    const segStr = `${seg}`.slice(-2)
    const minStr = `${min}`.slice(-2)
    const hrsStr = `${hrs}`.slice(-2)
    return`${hrsStr}:${minStr}:${segStr}:${csStr}`
}

function showRecord() {
    record.innerHTML = localStorage.getItem("record_Time")
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
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    if ((playerPosition.x - elementsSize) < elementsSize) {
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}


function moveRight() {
    if ((playerPosition.x + elementsSize) > canvasSize) {
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown() {
    if ((playerPosition.y + elementsSize) > canvasSize) {
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }
}