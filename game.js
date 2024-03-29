/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLetf = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const btnPause = document.querySelector('#pause')
const btnRestart = document.querySelector('#restart');
const heart = document.querySelector('#lives')
const time = document.querySelector('#time')
const record = document.querySelector('#record')
// const resulRecord = document.querySelector('#result')
const divEmblem = document.querySelector('.emblem')


let canvasSize;
let elementsSize;

let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;
let off = false;

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

function fixNumber(n) {
    return Number(n.toFixed(0));
}

window.addEventListener('load', setcanvasSize);
window.addEventListener('resize', setcanvasSize)
btnRestart.addEventListener('click', reload)
btnPause.addEventListener('click', pause)

function setcanvasSize() {
    windowHeight = window.innerHeight * 0.7;
    windowWidth = window.innerWidth * 0.7;

    if (window.innerHeight > window.innerWidth) {
        if ((windowWidth % 10) !== 0) {
            canvasSize = Math.ceil(windowWidth / 10) * 10;
        } else {
            canvasSize = windowWidth;
        }
    }
    else {
        if ((windowHeight % 10) !== 0) {
            canvasSize = Math.ceil(windowHeight / 10) * 10;
        } else {
            canvasSize = windowHeight;
        }
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    elementsSize = (canvasSize / 10);

    playerPosition.x = undefined;
    playerPosition.y = undefined;

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
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);
            fixNumber(posX)
            fixNumber(posY)

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
                    x: fixNumber(posX),
                    y: fixNumber(posY)
                })
            }
            game.fillText(emoji, posX, posY);
        });
    });
    movePlayer();
}

function movePlayer() {
    const gitCollisionX = playerPosition.x.toFixed(0) == gitPosition.x.toFixed(0);
    const gitCollisionY = playerPosition.y.toFixed(0) == gitPosition.y.toFixed(0);
    const gitCollosion = gitCollisionX && gitCollisionY;
    if (gitCollosion) {
        levelWin();
    }

    const enemyCollision = enemyPosition.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(0) == playerPosition.x.toFixed(0);
        const enemyCollisionY = enemy.y.toFixed(0) == playerPosition.y.toFixed(0);
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
    clearInterval(timeInterval);
    styles()
    const recordTime = localStorage.getItem("record_Time")
    timePlayer = Date.now() - timeStart;

    const resulRecord = document.createElement('p');
    resulRecord.style.color = "black";


    if (recordTime) {
        if (recordTime >= timePlayer) {
            localStorage.setItem('record_Time', timePlayer)
            resulRecord.innerHTML = "Superaste el record";
        } else {
            resulRecord.innerHTML = "Sorry, you didn't break the record. ";
            localStorage.removeItem("record_Time");
        }
    } else {
        localStorage.setItem('record_Time', timePlayer)
    }
    divEmblem.append(resulRecord)

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
    if (timeInterval !== null) {
        time.innerHTML = formatTime(Date.now() - timeStart);
    }
}

function formatTime(ms) {
    const seg = parseInt(ms / 1000) % 60
    const min = parseInt(ms / 60000) % 60
    const hrs = parseInt(ms / 3600000) % 24
    const segStr = `${seg}`.slice(-2)
    const minStr = `${min}`.slice(-2)
    const hrsStr = `${hrs}`.slice(-2)
    return `${hrsStr}:${minStr}:${segStr}`
}

function showRecord() {
    record.innerHTML = localStorage.getItem("record_Time")
}

function reload() {
    location.reload();
}
function pause() {
    if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
        timePlayer = Date.now() - timeStart; // Guardar el tiempo transcurrido
    } else {
        timeStart = Date.now() - timePlayer; // Ajustar el tiempo al reanudar
        timeInterval = setInterval(showTime, 100);
    }
}

function styles() {
    document.querySelector('.game-container').style.opacity = "0.5";

    var styles = {
        "padding": "10px",
        "display": "flex",
        "flex-direction": "column",
        "gap": "10px",
        'width': '380px',
        'height': '300px'

    };
    Object.assign(divEmblem.style, styles);

    const icon = document.createElement('img');
    icon.setAttribute('src', './icons/x_icon.svg');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');

    icon.addEventListener('click', disguise)
    function disguise() {
        divEmblem.classList.add('inactive')
        document.querySelector('.game-container').style.opacity = "1";
    }

    const trophy = document.createElement('img');
    trophy.setAttribute('src', './icons/trophy.svg');
    trophy.setAttribute('width', '100');
    trophy.setAttribute('height', '100');
    trophy.style.alignSelf = 'center'

    const text = document.createElement('p');
    text.innerHTML = "FELICIDADES TERMINASTE EL JUEGO"
    text.style.color = "black"
    divEmblem.append(icon, text, trophy);
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