export default class App {
  circle = undefined;
  ctx = undefined;
  canvas = undefined;
  width = undefined;
  height = undefined;
  height = undefined;
  scale = undefined;
  pixelRatio = undefined;
  props = undefined;
  center = undefined;
  fps = 15;
  frame = 0;
  TOTAL_CIRCLES = 30

  constructor({ canvas, context, width, height, pixelRatio, ...params }) {
    this.canvas = canvas;
    this.ctx = context;
    this.pixelRatio = pixelRatio;
    this.props = params.props;
    this.Y = 0;
    this.resize(width, height);
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0,0, this.width, this.height)
    this.draw();
  }

  draw() {
    this.ctx.__clearCanvas()
    
    this.ctx.strokeStyle = '#000'
    this.ctx.lineWidth = 1 * this.scale

    for (let i = 0; i < this.TOTAL_CIRCLES; i++) {
      this.drawCircle(this.center.x, this.center.y, this.props.radius.value * this.scale * (1 - i/this.TOTAL_CIRCLES), 0, 2 * Math.PI)
    }

  }

  drawCircle(x, y, radius) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  update() {
    this.frame ++;
    this.draw()
    if (this.frame % this.fps === 0) {
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.scale = this.width / this.canvas.parentNode.offsetWidth;
    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    }
  }
}
