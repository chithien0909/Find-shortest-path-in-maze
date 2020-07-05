
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
