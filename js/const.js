
const openListText = document.getElementById("openList");
const closeListText = document.getElementById("closeList");
const selectMap = document.getElementById("select_map");
const selectAlgorithm = document.getElementById("select_algorithm");
const btnStart = document.getElementById("startGame");
const btnRun = document.getElementById("run");
const btnRunAgain = document.getElementById("runAgain");
const btnGenerate = document.getElementById("generateMap");
const txtTimer = document.getElementById("timer");
const txtCoor = document.getElementById("coor");
const txtPathLength = document.getElementById("pathLength");
const WIDTH = 20;
const HEIGHT = 20;
const TIME_DELAY = 20;
const actionsName = ["", "Up", "Down", "Left", "Right"];

Array.prototype.shuffle = function () {
    let input = this;

    for (let i = input.length - 1; i >= 0; i--) {

        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}
const viewMatrix = document.getElementById("viewMatrix");
const ctxViewMaxtrix = viewMatrix.getContext('2d');


function drawVisited(node, color) {
    const state = node.state;

    const w = WIDTH; // Width of cell
    const h = HEIGHT; // Height of cell
    ctxViewMaxtrix.font = "8px Arial";

    ctxViewMaxtrix.fillStyle = color;
    ctxViewMaxtrix.fillRect(state.currentCol*w + state.currentCol, state.currentRow*h + state.currentRow, w, h);

    ctxViewMaxtrix.fillStyle = "black";
    let scale = 5;
    if(node.f < 10){
        scale = 3;
    } else if(node < 100){
        scale = 3.5;
    } else {
        scale = 6;
    }
    ctxViewMaxtrix.fillText( node.f, (state.currentCol*w + state.currentCol) + w/2 - scale, (state.currentRow*h + state.currentRow) + h/2 + 4);


}

function pathOfMaze(node) {
    let newNode = node;
    let list = [];
    if(!node) return null;
    while (newNode.parent){
        list.unshift(newNode);

        newNode = newNode.parent;
    }
    return list;

}

function drawCurrentPath(list) {
    if(!list) return;
    let i = 0;
    btnStart.disabled = true;
    btnRunAgain.disabled = true;
    btnRun.disabled = true;
    btnGenerate.disabled = true;
    selectMap.disabled = true;
    txtPathLength.innerHTML = list.length - 1;
    const interval = setInterval( () => {

        if(i === list.length - 2 ){

            btnStart.disabled = false;
            btnRunAgain.disabled = false;
            btnRun.disabled = false;
            btnGenerate.disabled = false;
            selectMap.disabled = false;
            clear();
        }
        const node = list[i];
        drawVisited(node, '#7CC6FE');
        i++;
    }, TIME_DELAY);
    const clear = () => {
        clearInterval(interval);
    }

}
