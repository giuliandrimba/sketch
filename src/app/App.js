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
  constructor({ canvas, context, width, height, pixelRatio, ...params }) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = width;
    this.height = height;
    this.pixelRatio = pixelRatio;
    this.props = params.props;
    this.scale = this.width / this.canvas.parentNode.offsetWidth;
    this.Y = 0;
    this.resize();
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
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

  resize() {
    this.scale = this.width / this.canvas.parentNode.offsetWidth;
    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    }
  }
}
