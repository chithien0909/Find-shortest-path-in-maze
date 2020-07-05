
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
