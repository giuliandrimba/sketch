export default function(p){

  var canvas = undefined
  var finishing = false;
  var points = [];
  var angle = 0;
  var circleCompleted = false;
  var radius = 300;
  var angleStep = 360 / 10;
  var radiusNoise = 0;

  p.setup = function() {
    p.pixelDensity(window.devicePixelRatio);
    canvas = p.createCanvas(window.innerWidth, window.innerHeight);

    window.setTimeout(finish, 30000)
  }

  p.keyTyped = function() {
    if (p.keyCode === 32) {
      p.saveCanvas('carnations');
    }
  }

  function finish() {
    // finishing = true;
  }

  p.draw = function() {

    p.background(255);

    if(finishing) {
      p.noLoop()
    }

    radiusNoise += 0.01;

    if(p.frameCount % 1 === 0 && angle < 360) {
      var point = {}
      angle += angleStep;
      point.x = (p.width / 2) + Math.cos(angle * Math.PI / 180) * p.noise(radiusNoise) * radius;
      point.y = (p.height / 2) + Math.sin(angle * Math.PI / 180) * p.noise(radiusNoise) * radius;
      points.push(point);
    }

    for(var i = 0; i < points.length; i++) {
      drawPoint(points[i].x, points[i].y);
    }
  }

  function drawPoint(x, y) {
    p.noStroke()
    p.fill(0);
    p.ellipse(x, y, 2,2);
  }
}