window.onload = function () {
    const openListText = document.getElementById("openList");
    const closeListText = document.getElementById("closeList");
    const selectMap = document.getElementById("select_map");
    const btnStart = document.getElementById("startGame");
    const btnRun = document.getElementById("run");
    const btnRunAgain = document.getElementById("runAgain");
    const btnGenerate = document.getElementById("generateMap");
    const txtTimer = document.getElementById("timer");
    const txtCoor = document.getElementById("coor");
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
        matrix = [];
        constructor(_rows, _columns, _matrix) {
            this.rows = _rows;
            this.columns = _columns;
            this.matrix = _matrix;
            for(let i = 0; i<_rows; ++i){
                for(let j = 0; j< _columns; ++j){
                    try {
                        this.matrix[i][j] = _matrix[i][j];
                    } catch (e) {
                        console.log(`i: ${i}, j: ${j}, matrix: ${this.matrix}`);
                    }
                }
            }

        }

    }
    class Action {
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
    }
    class Algorithm extends Action{
        graph = null;
        start = null;
        goal = null;
        startTime = null;
        endTime = null;
        constructor(_graph, _start, _goal) {
            super();
            this.graph = _graph;
            this.start = new State(_start.currentRow, _start.currentCol);
            this.goal = new State(_goal.currentRow, _goal.currentCol);
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
    }

    class Bfs extends Algorithm{
        /**
         * Execute `BFS` algorithm and return how long it takes.
         * @returns {[Node, Array, Array]} returns an array of `Node`, `Open List` and `Close List`
         */
        solve(){
            this.startTime = Date.now();
            const root = new Node(this.start, null, 0, 0);


            let openList = [];
            openList.push(root);

            let closeList = [];

            while (openList.length){
                const parent = this.minF(openList);
                openList = openList.filter(node => !this.compareState(node.state, parent.state));
                if(this.isGoal(parent.state)){
                    openListText.innerText = openList.length;
                    closeListText.innerText = closeList.length;
                    this.endTime = Date.now();
                    return [parent, openList, closeList];
                }
                closeList.push(parent);
                if(!this.compareState(this.start, parent.state)){

                    drawVisited(parent, '#F3A712');
                }

                for(let act = 1; act<=4; ++act){
                    const child = this.callOperator(parent.state, act);
                    if(child){
                        const existInOpen = this.isExist(openList, child);
                        const existInClose = this.isExist(closeList, child);
                        if(!existInOpen && !existInClose){
                            const f = this.heuristic(child);
                            const childNode = new Node(child, parent, f, act);
                            openList.push(childNode);

                            if(!this.isGoal(child)){
                                drawVisited(childNode, '#F4E285');
                            }
                        }
                    }
                }
            }
        }
    }

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
                        ctxViewMaxtrix.fillStyle = '#000';
                    }
                    ctxViewMaxtrix.fillRect(j*this.w + j, i*this.h + i, this.w, this.h);
                }
            }
            // Draw start state
            drawVisited(new Node(start, null, "", ""), '#A20021');
            drawVisited(new Node(goal, null, 0, 0), '#7FB069');
        }
    }



    function drawVisited(node, color) {
        const state = node.state;

        const w = WIDTH; // Width of cell
        const h = HEIGHT; // Height of cell
        ctxViewMaxtrix.font = "10px Arial";

        ctxViewMaxtrix.fillStyle = color;
        ctxViewMaxtrix.fillRect(state.currentCol*w + state.currentCol, state.currentRow*h + state.currentRow, w, h);

        ctxViewMaxtrix.fillStyle = "black";
        ctxViewMaxtrix.fillText( node.f, (state.currentCol*w + state.currentCol) + w/2 - 5, (state.currentRow*h + state.currentRow) + h/2 + 5);


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
        const w = WIDTH; // Width of cell
        const h = HEIGHT; // Height of cell
        let i = 0;
        btnStart.disabled = true;
        btnRunAgain.disabled = true;
        btnRun.disabled = true;
        btnGenerate.disabled = true;
        selectMap.disabled = true;
        const interval = setInterval( () => {

            if(i === list.length - 2 ){
                clear();

                btnStart.disabled = false;
                btnRunAgain.disabled = false;
                btnRun.disabled = false;
                btnGenerate.disabled = false;
                selectMap.disabled = false;
            }
            const node = list[i];
            drawVisited(node, '#7CC6FE');
            i++;
        }, TIME_DELAY);
        const clear = () => {
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
    selectMap.addEventListener('change', function (event) {
        console.log(event.target.value);
        const mapName = event.target.value;
        ctxViewMaxtrix.clearRect(0, 0, 2000, 2000);
        readTextFile(mapName);
    });
    class GenerationMaze {

        _rows = 40;
        _columns = 40;
        constructor(rows, columns, graph) {
            this._rows = rows;
            this._columns = columns;
            if(!graph){
               this.graph = Array(this._rows).fill().map(() => Array(this._columns).fill(1))
            } else {
                this.graph = graph;
            }
            // this.generate = Object.bind(this);
        }

        upOperator(currentState){
            if(currentState.currentRow > 0){

                return new State(currentState.currentRow - 1, currentState.currentCol);
            }
            return null;
        }
        downOperator(currentState){
            if(currentState.currentRow < this._rows - 1){

                return new State(currentState.currentRow + 1, currentState.currentCol );
            }
            return null;
        }
        leftOperator(currentState){
            if(currentState.currentCol > 0){

                return new State(currentState.currentRow, currentState.currentCol - 1);
            }
            return null;
        }
        rightOperator(currentState){
            if(currentState.currentCol < this._columns - 1){
                return new State(currentState.currentRow, currentState.currentCol + 1);
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
        existed(list, state) {
            return list.find(item => item.currentRow === state.currentRow && item.currentCol === state.currentCol);
        }
        generate(){
            const operator = [1,2,3,4];
            const list = [];
            list.push(new State(Number.parseInt((Math.random() * this._rows)),
                Number.parseInt(Math.random() *this._columns)));
            while (list.length){
                const state = list.pop();
                for(let i = 0; i<4; i++){
                    operator.shuffle();

                    const childState = this.callOperator(state, operator[i]);
                    if(childState){
                        list.push(childState);
                        i = 5;
                        this.graph[state.currentRow][state.currentCol] = 0;
                        this.graph[childState.currentRow][childState.currentCol] = 0;
                    }
                }
            }
            return [...this.graph];
        }

    }
    function randomState(matrix) {
        let randomState = null;
        const len = matrix.length;
        do {
            let x = Number.parseInt(Math.random() * len);
            let y = Number.parseInt(Math.random() * len);
            if(!matrix[x][y]){
                randomState = new State(x, y);
            }
        } while (!randomState);

        return randomState;
    }



    const inputRow = document.getElementById("inputRow");
    const inputColumn = document.getElementById("inputColumn");

    let rows = Number(inputRow.value);
    let columns = Number(inputColumn.value);
    let matrix = null;
    let graph = null;
    let game = null;
    let start, end;
    function startGame() {
        generateMap();
        run();

    }
    inputRow.addEventListener('change', function () {
        rows = Number(inputRow.value);
    })
    inputColumn.addEventListener('change', function () {
        columns = Number(inputColumn.value);
    })
    function generateMap() {
        ctxViewMaxtrix.clearRect(0, 0, 2000, 2000);
        matrix = (new GenerationMaze(rows, columns)).generate();
        graph = new Graph(rows, columns, matrix);
        game = new Game(graph);
        start = randomState(matrix);
        end = randomState(matrix);
        game.drawGraph(start, end);
    }
    function runAgain() {

        start = randomState(matrix);
        end = randomState(matrix);
        game.drawGraph(start, end);
        run();
    }

    let infoList = null;
    function run(){
        if(!matrix)
            generateMap();
        const bfs = new Bfs(graph,start, end);
        const [nodeGoal, openList, closeList] = bfs.solve();
        const list = pathOfMaze(nodeGoal);

        drawCurrentPath(list);

        infoList = [...openList, ...closeList];

        infoList = infoList.reduce(function (pre, cur, id) {
            let y = cur.state.currentRow;
            let x = cur.state.currentCol;
            pre[x][y] = {f: cur.f, action: cur.action};
            return pre;
        }, Array(rows).fill().map(() => Array(columns).fill(0)));
        /** output timer */
        txtTimer.innerHTML = `${bfs.endTime - bfs.startTime}`;
    }

    btnStart.addEventListener('click', startGame);
    btnRun.addEventListener('click', run);
    btnRunAgain.addEventListener('click', runAgain);
    btnGenerate.addEventListener('click', generateMap);

    viewMatrix.addEventListener('click', function (e) {
        // get coordinates by pixels
        let x = e.offsetX;
        let y = e.offsetY;

        // reduce columns strike devivation
        if (x > 20) {
            // 1px per square (Square 20x20)
            x = x - x/20;
        }
        // reduce rows strike devivation
        if (y > 20) {
            // 1px per square (Square 20x20)
            y = y - y/20;
        }

        // matrix offset
        var offsetX = Math.floor(x / 20);
        var offsetY = Math.floor(y / 20);

        // define popup box location
        txtCoor.style.top = `${y}px`;
        txtCoor.style.left = `${x}px`;

        // disable popup box if matrix undefined
        if (!matrix)
            txtCoor.style.display = 'none';
        else txtCoor.style.display = 'block';

        document.addEventListener('mousemove', function (e){
            txtCoor.style.display = 'none';
        });

        // raw message
        let msg = `Coordinate: (${offsetX}, ${offsetY})\nf: ${infoList[offsetX][offsetY].f || -1}`;
        msg = msg.concat(`\nAction: ${actionsName[infoList[offsetX][offsetY].action] || "No action"}`);

        // output message
        msg = msg.replace(/\n/g, "<br>");
        txtCoor.innerHTML = msg;
    });
}
