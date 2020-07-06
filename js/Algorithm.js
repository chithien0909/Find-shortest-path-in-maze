
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
        // Manhattan
        return Math.abs(this.goal.currentRow - currentState.currentRow) + Math.abs(this.goal.currentCol - currentState.currentCol);
    }
    heuristic_2(currentState){
        // Euclidean
        return Math.sqrt(Math.pow(Math.abs(this.goal.currentRow - currentState.currentRow), 2) + Math.pow(Math.abs(this.goal.currentCol - currentState.currentCol), 2)).toFixed(1);
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
