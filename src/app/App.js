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
  constructor({ canvas, context, width, height, pixelRatio, clear, ...params }) {
    this.canvas = canvas;
    this.clear = clear;
    console.log('clear',clear)
    this.ctx = context;
    this.pixelRatio = pixelRatio;
    this.props = params.props;
    this.Y = 0;
    this.resize(width, height);
    this.draw();
  }

  draw() {
    this.ctx.__clearCanvas()
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0,0, this.width, this.height)
    
    this.ctx.strokeStyle = '#000'
    this.ctx.lineWidth = 1 * this.scale
    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y + this.Y, this.props.radius.value * this.scale, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  update() {
    this.frame ++;
    if (this.frame % this.fps === 0) {
      this.draw()
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
