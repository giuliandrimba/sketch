export default (grid, startCell) => {
  let cell = grid.cells[0]
  createMaze(grid, cell)
}

function createMaze(grid, cell) {
  cell.visited = true;

  while(cell.totalVisited < cell.neighbours.length) {
    let rand = getRandom(cell.neighbours);
    rand.connect = cell;
    cell.totalVisited++;
    createMaze(grid, rand);
  }
}

function getRandom(arr) {
  let allVisited = true;
  arr.map((a) => {
    if (!a.visited) {
      allVisited = false;
    }
  })
  let randIndex = Math.floor(Math.random() * arr.length);
  let rand = arr[randIndex];
  if (!rand.visited) {
    rand.visited = true;
    return rand;
  }
  if(rand.visited && !allVisited) {
    return getRandom(arr);
  } 
  return rand;
}
