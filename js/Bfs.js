

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
