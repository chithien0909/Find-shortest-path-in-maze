window.onload = function () {

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
    let AlgorithmFunc = Bfs;
    let HeuristicName = 'h_1';

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
        ctxViewMaxtrix.clearRect(0, 0, 4000, 4000);
        matrix = (new GenerationMaze(rows, columns)).generate();
        graph = new Graph(rows, columns, matrix);
        game = new Game(graph);
        start = randomState(matrix);
        end = randomState(matrix);
        game.drawGraph(start, end);
    }
    function runAgain() {
        if(!matrix)
            generateMap();
        start = randomState(matrix);
        end = randomState(matrix);
        game.drawGraph(start, end);
        run();
    }

    let infoList = null;
    function run(){
        if(!matrix)
            generateMap();

        game.drawGraph(start, end);
        const algorithm = new AlgorithmFunc(graph,start, end, HeuristicName);

        const [nodeGoal, openList, closeList] = algorithm.solve();
        const list = pathOfMaze(nodeGoal);

        drawCurrentPath(list);

        infoList = [...openList, ...closeList];

        infoList = infoList.reduce(function (pre, cur, id) {
            let y = cur.state.currentRow;
            let x = cur.state.currentCol;
            pre[x][y] = {f: cur.f, g: cur.g, h: cur.h, action: cur.action};
            return pre;
        }, Array(rows).fill().map(() => Array(columns).fill(0)));
        /** output timer */
        txtTimer.innerHTML = `${algorithm.endTime - algorithm.startTime}`;
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
                    const _matrix = [];
                    for(let i = 0; i< rows; i++){
                        const listColumn = allArray.splice(  6, columns);
                        _matrix.push(listColumn);
                    }
                    matrix = [..._matrix];
                    graph = new Graph(rows, columns, matrix);
                    game = new Game(graph);
                    start = startState;
                    end = goalState;
                    game.drawGraph(start, end);


                    btnStart.disabled = false;
                    btnRunAgain.disabled = false;
                    btnRun.disabled = false;
                    btnGenerate.disabled = false;
                    selectMap.disabled = false;
                }
            }
        }
        rawFile.send(null);
    }
    selectMap.addEventListener('change', function (event) {
        const mapName = event.target.value;
        ctxViewMaxtrix.clearRect(0, 0, 4000, 4000);
        readTextFile(mapName);
    });
    selectAlgorithm.addEventListener('change', function (event) {
        const alogrithmName = event.target.value;
        switch (alogrithmName) {
            case 'Bfs':
                AlgorithmFunc = Bfs;
                run();
                break;
            case 'A_star':
                AlgorithmFunc = A_star;
                run();
                break;
            default:
                AlgorithmFunc = Bfs;
        }
    });
    selectHeuristic.addEventListener('change', function (event) {
        HeuristicName = event.target.value;
        run();
    });

    btnStart.addEventListener('click', startGame);
    btnRun.addEventListener('click', run);
    btnRunAgain.addEventListener('click', runAgain);
    btnGenerate.addEventListener('click', generateMap);

    viewMatrix.addEventListener('click', function (e) {
        // get coordinates by pixels
        let x = e.offsetX;
        let y = e.offsetY;

        // reduce columns strike devivation
        if (x > WIDTH) {
            // 1px per square (Square WIDTHxHEIGHT)
            x = x - x/WIDTH;
        }
        // reduce rows strike devivation
        if (y > HEIGHT) {
            // 1px per square (Square WIDTHxWIDTH)
            y = y - y/HEIGHT;
        }

        // matrix offset
        var offsetX = Math.floor(x / WIDTH);
        var offsetY = Math.floor(y / HEIGHT);

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
        let msg = `Coordinate: (${offsetY}, ${offsetX})\nf: ${infoList[offsetX][offsetY].f || -1}`;
        if(AlgorithmFunc !== Bfs){
            msg = msg.concat(`\ng: ${infoList[offsetX][offsetY].g || -1}`);
            msg = msg.concat(`\nh: ${infoList[offsetX][offsetY].h || -1}`);
        }
        msg = msg.concat(`\nAction: ${actionsName[infoList[offsetX][offsetY].action] || "No action"}`);

        // output message
        msg = msg.replace(/\n/g, "<br>");
        txtCoor.innerHTML = msg;
    });
}
