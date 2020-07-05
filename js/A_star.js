

class A_star extends Algorithm{
    /**
     * Execute `A Star` algorithm and return how long it takes.
     * @returns {[Node, Array, Array]} returns an array of `Node`, `Open List` and `Close List`
     */
    solve(){
        this.startTime = Date.now();
        const root = new Node(this.start, null, 0, 0, 0, 0);
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
                // Draw node was pushed in close list
                drawVisited(parent, '#F3A712');
            }

            for(let act = 1; act<=4; ++act){
                const child = this.callOperator(parent.state, act);
                if(child){
                    const existInOpen = this.isExist(openList, child);
                    const existInClose = this.isExist(closeList, child);
                    const h = this.heuristic(child); // f = h
                    const g = parent.g + 1;
                    const f = g + h;
                    const childNode = new Node(child, parent, f, g, h, act);

                    if(!existInOpen && !existInClose){
                        openList.push(childNode);
                        if(!this.isGoal(child)){
                            drawVisited(childNode, '#F4E285');
                        }
                    }
                    if(existInOpen && !existInClose){
                        if(existInOpen.g > childNode.g){
                            // Remove exist node in open list
                            openList = openList.filter(node => !this.compareState(node.state, existInOpen.state));
                            // Push childNode into OpenList
                            openList.push(childNode);
                        }
                    }
                    if(existInClose && !existInOpen){
                        if(existInClose.g > childNode.g){
                            // Remove exist node in close list
                            closeList = closeList.filter(node => !this.compareState(node.state, existInClose.state));
                            // Push childNode into openList
                            openList.push(childNode);
                        }
                    }
                }
            }
        }
    }
}
