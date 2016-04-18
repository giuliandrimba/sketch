export default function(p){

  var canvas = undefined
  var lines = undefined;
  var pointA = {x:0,y:0};
  var pointB = {x:0,y:0};
  var pointC = {x:0,y:0};
  var pointD = {x:0,y:0};
  var radius = {x:0,y:0};
  var noise = {x:0.0, y:0};
  var angle = 0;
  var size = 0;
  var colorIntensity = 0;
  var finishing = false;
  var noiseSpeed = 1;

  p.setup = function() {
    p.fullscreen(true);
    p.pixelDensity(window.devicePixelRatio);
    canvas = p.createCanvas(window.innerWidth, window.innerHeight);
    lines = p.createGraphics(window.innerWidth, window.innerHeight);

    size = 0;

    radius.x = Math.random() * size;
    radius.y = Math.random() * size;


    window.setTimeout(finish, 30000)
  }

  p.keyTyped = function() {
    if (p.keyCode === 32) {
      p.saveCanvas('carnations');
    }
  }

  function finish() {
    finishing = true;
  }

  p.draw = function() {
    drawLines()

    drawPoint(pointA.x, pointA.y)
    drawPoint(pointB.x, pointB.y)
    drawPoint(pointC.x, pointC.y)
    drawPoint(pointD.x, pointD.y)

    angle += 0.01;

    if(!finishing) {
      size = size + p.noise(noise.x)
      size = p.constrain(size,0,window.innerHeight * 0.7);
    }

    noise.x += 0.005 * noiseSpeed
    noise.y += 0.001 * noiseSpeed;

    if(finishing) {
      size -= Math.random();
      if(size < 0) {
        p.noLoop()
      }
    }

    colorIntensity = p.noise(noise.x) * 255;
    radius.x = p.noise(noise.x) * size
    radius.y = p.noise(noise.y) * size

    updatePoints();

  }

  function drawLines() {

    if(p.frameCount % 100 == 0)
      lines.background('rgba(255,255,255,0.01)');
    
    lines.stroke(colorIntensity);
    lines.strokeWeight(0.1);

    var missLine = Math.round(Math.random() * 10)

    if(missLine > 7) {
      noiseSpeed += 0.02;
      noiseSpeed = p.constrain(noiseSpeed, 0, 2)
    } else {
      if(noiseSpeed > 1)
        noiseSpeed -= 0.01;
    }

    lines.line(pointA.x / 2, pointA.y / 2, pointD.x / 2, pointD.y / 2)
    lines.line(pointB.x / 2, pointB.y / 2, pointC.x / 2, pointC.y / 2)

    p.image(lines, 0,0)
  }

  function updatePoints() {
    pointA.x = (p.width / 2) + (Math.cos(angle) * radius.x);
    pointA.y = (p.height / 2) + (Math.sin(angle) * radius.y);

    pointB.x = (p.width / 2) - (Math.cos(angle) * radius.x);
    pointB.y = (p.height / 2) - (Math.sin(angle) * radius.y);

    pointC.x = (p.width / 2) + (Math.cos(angle - 90) * radius.x);
    pointC.y = (p.height / 2) + (Math.sin(angle - 90) * radius.y);

    pointD.x = (p.width / 2) - (Math.cos(angle - 90) * radius.x);
    pointD.y = (p.height / 2) - (Math.sin(angle - 90) * radius.y);
  }

  function drawPoint(x, y) {
    p.noStroke()
    p.fill(0);
    p.ellipse(x, y, 2,2);
  }
}