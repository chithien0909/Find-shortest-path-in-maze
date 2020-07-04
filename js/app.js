window.onload = function () {
    const openListText = document.getElementById("openList");
    const closeListText = document.getElementById("closeList");
    const WIDTH = 20;
    const HEIGHT = 20;
    class State{

        currentRow;
        currentCol;
        constructor(_rows, _columns) {
            this.currentCol = Number(_columns);
            this.currentRow = Number(_rows);
        }
        print(){
            console.log(`(${this.currentRow}, ${this.currentCol})`);
        }
    }

    class Node {
        state = null; // State
        parent = null; // Parent node
        f = 0;
        action = -1;

        constructor(_state, _parent, _f, _action) {
            this.state = _state;
            this.parent = _parent;
            this.f = _f;
            this.action = _action;
        }

    }

    class Graph{
        rows = 0; // Number of rows
        columns = 0; // Number of columns
        matrix = []
        constructor(_rows, _columns, _matrix) {
            this.rows = _rows;
            this.columns = _columns;

            this.matrix = _matrix;
        }

    }
    class Bfs{
        graph = null;
        start = null;
        goal = null;
        constructor(_graph, _start, _goal) {
            this.graph = _graph;
            this.start = new State(_start.currentRow, _start.currentCol);
            this.goal = new State(_goal.currentRow, _goal.currentCol);
        }
        upOperator(currentState){
            const tempState = new State(currentState.currentRow - 1, currentState.currentCol);
            if(currentState.currentRow > 0 && !Number(this.graph.matrix[tempState.currentRow][tempState.currentCol])){
                return tempState;
            }
            return null;
        }
        downOperator(currentState){
            const tempState = new State(currentState.currentRow + 1, currentState.currentCol)
            if(currentState.currentRow < this.graph.rows - 1 && !Number(this.graph.matrix[tempState.currentRow][ tempState.currentCol])){
                return tempState;
            }
            return null;
        }
        leftOperator(currentState){
            const tempState = new State(currentState.currentRow, currentState.currentCol - 1)
            if(currentState.currentCol > 0 && !Number(this.graph.matrix[tempState.currentRow][tempState.currentCol])){
                return tempState;
            }
            return null;
        }
        rightOperator(currentState){
            const tempState = new State(currentState.currentRow, currentState.currentCol + 1);
            if(currentState.currentCol < this.graph.columns - 1 && !Number(this.graph.matrix[tempState.currentRow][ tempState.currentCol])){
                return tempState;
            }
            return null;
        }
        callOperator(state, action){
            switch (action) {
                case 1: return this.upOperator(state);
                case 2: return this.downOperator(state);
                case 3: return this.leftOperator(state);
                case 4: return this.rightOperator(state);
                default: {
                    console.log("No operator!");
                    return null;
                }
            }
        }
        heuristic(currentState){
            return Math.abs(this.goal.currentRow - currentState.currentRow) + Math.abs(this.goal.currentCol - currentState.currentCol);
        }

        compareState(state1, state2){
            return state1.currentRow === state2.currentRow && state1.currentCol === state2.currentCol;
        }
        isGoal(state){
            return state.currentCol === this.goal.currentCol && state.currentRow === this.goal.currentRow;
        }
        isExist(list, state){
            return list.find(node => this.compareState(node.state, state));
        }
        minF(list){
            let min = 99999;
            let findNode;
            if(!list || !list.length) return null;
            for(let i = 0; i< list.length; i++){
                if(list[i].f < min){
                    min = list[i].f;
                    findNode = list[i];
                }
            }
            return findNode;
        }
        solve(){
            const root = new Node(this.start, null, 0, 0);


            let openList = [];
            openList.push(root);

            const closeList = [];

            while (openList.length){
                const parent = this.minF(openList);
                openList = openList.filter(node => !this.compareState(node.state, parent.state));
                if(this.isGoal(parent.state)){
                    openListText.innerText = openList.length;
                    closeListText.innerText = closeList.length;
                    return parent;
                }
                closeList.push(parent);
                for(let act = 1; act<=4; ++act){
                    const child = this.callOperator(parent.state, act);
                    if(child){
                        const existInOpen = this.isExist(openList, child);
                        const existInClose = this.isExist(closeList, child);
                        if(!existInOpen && !existInClose){
                            if(!this.isGoal(child)){
                                drawVisited(child, '#7BE0AD');
                            }
                            const f = this.heuristic(child);
                            const childNode = new Node(child, parent, f, act);
                            openList.push(childNode);
                        }
                    }
                }
            }
        }
    }


    const viewMatrix = document.getElementById("viewMatrix");
    const ctxViewMaxtrix = viewMatrix.getContext('2d');

    class Game{
        graph = null;
        w = WIDTH; // Width of cell
        h = HEIGHT; // Height of cell
        constructor(_graph) {
            this.graph = _graph;
        }
        // Draw graph from matrix
        drawGraph(start, goal){
            for(let i = 0; i< this.graph.rows; i++){
                for(let j = 0; j< this.graph.columns; j++){
                    ctxViewMaxtrix.fillStyle = '#CED3DC';
                    if(Number(this.graph.matrix[i][j]) === 1){
                        ctxViewMaxtrix.fillStyle = '#364652';
                    }
                    ctxViewMaxtrix.fillRect(j*this.w + j, i*this.h + i, this.w, this.h);
                }
            }
            // Draw start state
            ctxViewMaxtrix.fillStyle = '#A20021';
            ctxViewMaxtrix.fillRect(start.currentCol*this.w + start.currentCol, start.currentRow*this.h + start.currentRow, this.w, this.h);
            // Draw goal state
            ctxViewMaxtrix.fillStyle = '#0C8346';
            ctxViewMaxtrix.fillRect(goal.currentCol*this.w + goal.currentCol, goal.currentRow*this.h + goal.currentRow, this.w, this.h);
        }
    }

    function pathOfMaze(node) {
        let newNode = node;
        let list = [];
        while (newNode.parent){
            list.unshift(newNode.state);

            newNode = newNode.parent;
        }
        return list;

    }
    function drawVisited(state, color) {


        const w = WIDTH; // Width of cell
        const h = HEIGHT; // Height of cell
        ctxViewMaxtrix.fillStyle = color;
        // ctx.font = "10px Arial";
        // ctx.fillText(, state.currentCol*w + state.currentCol, state.currentRow*h + state.currentRow);

        ctxViewMaxtrix.fillRect(state.currentCol*w + state.currentCol, state.currentRow*h + state.currentRow, w, h);


    }
    function drawCurrentPath(list) {

        const w = WIDTH; // Width of cell
        const h = HEIGHT; // Height of cell
        ctxViewMaxtrix.fillStyle = '#E5C2C0';
        let i = 0;
        const interval = setInterval( () => {

            if(i === list.length - 2 ){
                clear();
            }
            const state = list[i];
            drawVisited(state, '#E5C2C0');
            i++;
        }, 50);
        clear = () => {
            clearInterval(interval);
        }

    }

    function readTextFile(nameFile) {
        const rawFile = new XMLHttpRequest();
        rawFile.open("GET", nameFile, false);
        rawFile.onreadystatechange = function () {
            if(rawFile.readyState === 4 ){
                if(rawFile.status === 200 || rawFile.status === 0){
                    let allText = rawFile.responseText;
                    allText = allText.replace(/\n/g, " ");
                    const allArray = allText.split(" ");
                    const rows = allArray[0];
                    const columns = allArray[1];
                    const startState = new State(allArray[2], allArray[3]);
                    const goalState = new State(allArray[4], allArray[5]);
                    const matrix = [];
                    for(let i = 0; i< rows; i++){
                        const listColumn = allArray.splice(  6, columns);
                        matrix.push(listColumn);
                    }
                    const graph = new Graph(rows, columns, matrix);
                    const game = new Game(graph);

                    game.drawGraph(startState, goalState);
                    const bfs = new Bfs(graph, startState, goalState);
                    const nodeGoal = bfs.solve();
                    const list = pathOfMaze(nodeGoal);
                    // console.log(bfs.graph);
                    drawCurrentPath(list);
                }
            }
        }
        rawFile.send(null);
    }
    readTextFile('Map4.txt');
}
