window.addEventListener('resize', setupMap, false); 

var cells;
var cellSize;
var nCols;
var nRows;
var nCells;

setupMap();
clearMap();

function setupMap() {
    cells = [[]];
    cellSize = 20;
    nCols = Math.ceil(cv.width / cellSize);
    nRows = Math.ceil(cv.height / cellSize);
    nCells = nCols * nRows;
}

function register(boid) {
    var gridId = word2Grid(boid.x, boid.y);
    var id = point2index(gridId[0], gridId[1]);
    if (id >= cells.length || id < 0)
        return;
    cells[id].push(boid);
}

function word2Grid(x, y) {
    return [Math.floor(x / cellSize), Math.floor(y / cellSize)];
}

function point2index(x, y) {
    return x + y * nCols;
}

function getNeighbours(boid) {
    var neighbours = [];
    var gridId = word2Grid(boid.x, boid.y);
    for (var x = gridId[0] - 1; x <= gridId[0] + 1; x++) {
        for (var y = gridId[1] - 1; y <= gridId[1] + 1; y++) {
            var id = point2index(x, y);
            if (id >= cells.length || id < 0)
                continue;
            var l = cells[id].length;
            for (var i = 0; i < l; i++)
                neighbours.push(cells[id][i]);
        }
    }
    return neighbours;
}

function hasBoids(x, y) {
    return cells[point2index(x, y)].length > 0;
}

function clearMap() {
    for (var i = 0; i < nCells; i++)
        cells[i] = [];
}

function drawMap() {
    for (var x = 0; x < nCols; x++) {
		for (var y = 0; y < nRows; y++) {
			if (hasBoids(x, y))                
                drawSquare(x * cellSize + 1, y * cellSize + 1, 0, cellSize - 2 , x / nCols * 255, y / nRows * 255, 255)
            else
			    drawSquare(x * cellSize, y * cellSize, 0, cellSize, x / nCols * 255, y / nRows * 255, 100)
		}
    }
}
