var vector = require("../util/vector");
const calc = require('@doublepi/calc');
module.exports = function(drawer, width, height, time, field, initX, initY, point) {
  var position = {
    x: initX + Math.random() * width,
    y: initY + Math.random() * height,
    angle: 0
  };
  let velocity = { x: 0, y: 0 };
  const acceleration = { x: 0, y: 0 };
  let startTime;
  let canDraw = true;

  const getAngle = () => {
    let ang = undefined;
    field.filter((cell) => {
      if(position.x >= cell.x && position.x <= cell.x + cell.width && position.y >= cell.y && position.y <= cell.y + cell.height){
        ang= cell.angle;
      }
    });
    return ang;
  }

  return {
    draw() {
      if (!canDraw) {
        return;
      }
      if (!startTime) {
        startTime = Date.now();
      }
      let newAngle = getAngle();
      if(newAngle) {
        position.angle = newAngle;
      } else {
        position.angle = field[Math.floor(field.length - 1)].angle;
      }
      if (Math.abs(Date.now() - startTime) > time * 3000) {
        canDraw = false;
        this.done = true;
      }
      velocity.x = Math.cos(position.angle);
      velocity.y = Math.sin(position.angle) * position.angle;
      velocity = vector.mult(vector.normalize(velocity), 10);

      position.x += velocity.x;
      position.y += velocity.y;

      // if (calc.dist(position.x, position.y, point.x, point.y) < point.radius) {
      //   let angle = calc.ang(position.x, position.y, point.x, point.y);
      //   position.x = point.x + Math.cos(angle) * point.radius;
      //   position.y = point.y + Math.sin(angle) * point.radius;
      // }

      if (position.x < initX ) {
        position.x = initX + width;
      }

      if (position.x > initX + width) {
        position.x = initX ;
      }

      if (position.y < initY) {
        position.y = initY + height;
      }

      if (position.y > initY + height) {
        position.y = initY;
      }

      drawer(position.x, position.y, position.angle);
    }
  };
};
