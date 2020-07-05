
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
