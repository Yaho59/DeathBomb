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

const playerPosition = {
    x: undefined,
    y: undefined,
};

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

    const map = maps[0];
    const mapRows = map.trim().split('\n');
    const mapRowsCol = mapRows.map(row => row.trim().split(''));

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
                    console.log({playerPosition});
                  }
            }

            game.fillText(emoji, posX, posY);
        });
    });
    movePlayer();
}

function movePlayer() {
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
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
    playerPosition.y -= elementsSize;
    startGame();

}

function moveLeft() {
    playerPosition.x -= elementsSize;
    startGame();
}

function moveRight() {
    playerPosition.x += elementsSize;
    startGame();
}

function moveDown() {
    playerPosition.y += elementsSize;
    startGame();
}