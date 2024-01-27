/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

var canvasZise;
var elmentsZise;

window.addEventListener('load', setCanvasZise);
window.addEventListener('resize', setCanvasZise)

function setCanvasZise() {
    canvasZise = window.innerWidth > window.innerHeight ?
        window.innerHeight * 0.8 : window.innerWidth * 0.8;
    canvas.setAttribute('width', canvasZise);
    canvas.setAttribute('height', canvasZise);

    elmentsZise = (canvasZise / 10) - 1;

    startGame()
}

function startGame() {
    game.font = elmentsZise + 'px Verdana';
    game.textAlign = 'end'

    const map = maps[1];
    const mapRows = map.trim().split('\n');
    const mapRowsCol = mapRows.map(row => row.trim().split(''));
    

    for (let i = 1; i <= 10; i++) {
        for (let z = 1; z <= 10; z++) {
            game.fillText(emojis[mapRowsCol[i - 1][z - 1]], elmentsZise * z + 15, elmentsZise * i )

        }
    }
}