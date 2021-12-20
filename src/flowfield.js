const SimplexNoise = require('simplex-noise');

module.exports = ({ width, height, columns, rows, intensity, initX, initY }) => {
  const field = [];
  const simplex = new SimplexNoise(Math.random);
  let noise2D = simplex.noise2D(0, 0);
  let columnWidth = width / columns;
  let initWidth = width / columns;
  let columnHeight = height / rows;
  let initHeight = height / rows;
  let x;
  let y;
  for (let c = 0; c < columns; c+= 1) {
    x = initX + columnWidth * c;
    columnWidth = initWidth * (1 + 0.01 * c)
    for (let r = 0; r < rows; r+= 1) {
      // columnHeight =  initHeight * (1 + Math.random())
      y = initY + columnHeight * r;
      noise2D = simplex.noise3D(x * intensity, y * intensity, c * 1);
      field.push({
        x: x + columnWidth / 2,
        y: y + columnHeight / 2, 
        angle: noise2D,
        width: columnWidth,
        height: columnHeight,
      })
    }
  }
  return field; 
}