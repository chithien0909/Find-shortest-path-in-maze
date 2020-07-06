
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
