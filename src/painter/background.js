var vector = require("../util/vector");
module.exports = function(drawer, width, height, time) {
  var position = {
    x: 0,
    y: 0
  };
  let velocity = { x: 0, y: 0 };
  const acceleration = { x: 0, y: 0 };
  let startTime;
  let canDraw = true;
  return {
    draw() {
      if (!canDraw) {
        return;
      }
      if (!startTime) {
        startTime = Date.now();
      }
      if (Math.abs(Date.now() - startTime) > time * 3000) {
        canDraw = false;
        this.done = true;
      }
      acceleration.x = Math.random() * 0.1;
      acceleration.y = Math.random() * 0.1;
      velocity.x += acceleration.x;
      velocity.y += acceleration.y;
      velocity = vector.mult(vector.normalize(velocity), 100);

      position.x += velocity.x;
      position.y += velocity.y;

      if (position.x < 0 || position.x > width) {
        velocity.x *= -1;
      }

      if (position.y < 0 || position.y > height) {
        velocity.y *= -1;
      }

      drawer(position.x, position.y);
    }
  };
};
