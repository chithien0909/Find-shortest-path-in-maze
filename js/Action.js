
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
