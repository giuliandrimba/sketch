const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');
const Random = require('canvas-sketch-util/random');

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default (ctx, grid) => {
  let paths = [];
  grid.cells.forEach((cell, i) => {
    // if (i === 15) {
    //   cell.neighbours.map((n, i) => {
    //     // ctx.moveTo(cell.x + cell.width / 2, cell.y  + cell.height / 2);
    //     // ctx.lineTo(n.x + n.width / 2, n.y + n.height / 2);
    //     ctx.fillStyle = 'purple'
    //     ctx.beginPath();
    //     ctx.rect(n.x, n.y, n.width, n.height)
    //     ctx.fill();
    //   })
    //   if (cell.visited) {
    //     ctx.fillStyle = 'red'
    //     ctx.beginPath();
    //     ctx.rect(cell.x, cell.y, cell.width, cell.height)
    //     ctx.fill();
    //   }
    // }
    if (cell.connect) {
      const p = createPath();
      p.strokeStyle = 'black'
      p.lineWidth = 5 
      p.arc(cell.x, cell.y, cell.width / 2, 0, Math.PI * 2)
      // p.arc(cell.connect.x + cell.width / 4, cell.connect.y + cell.width / 4, cell.width / 2, 0, Math.PI * 2)
      // p.arc(cell.connect.x, cell.connect.y, cell.connect.width / 4)
      // p.beginPath();
      p.moveTo(cell.x , cell.y)

      let curveLevel = .3;

      let bezier = {
        x1:  cell.connect.x,
        y1:  cell.connect.y,
        x2:  cell.x + rand(-1, 1) * cell.width * curveLevel,
        y2:  cell.y + rand(-1, 1) * cell.height * curveLevel,
      }
      p.bezierCurveTo(cell.connect.x, cell.connect.y, bezier.x1, bezier.y1, bezier.x2, bezier.y2);
      // p.lineTo(cell.connect.x, cell.connect.y)
      // p.stroke();
      paths.push(p);
    }
  })
  return paths;
}

export const drawGrid = (ctx, grid) => {
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1;
  grid.cells.forEach((cell) => {
    ctx.rect(cell.x, cell.y, cell.width, cell.height);
  })
  ctx.stroke();
}
