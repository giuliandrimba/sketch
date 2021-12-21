import Color from 'colorjs.io';

module.exports = (_ctx, opts) => {
  const ctx = _ctx;
  let options = {};
  if (opts) {
    options = opts;
  }
  const config = {
    lineWidth: options.lineWidth || 10,
    strokeStyle: options.strokeStyle || "black"
  };

  const color = new Color(config.strokeStyle);
  // color.chroma *= Math.random();

  return {
    draw(x, y, angle) {
      if (!this.lastPoint) {
        this.lastPoint = { x, y };
      } else if (!x && !y) {
        this.lastPoint = undefined;
      }
      ctx.fillStyle = config.strokeStyle;
      ctx.lineWidth = config.lineWidth * Math.abs(angle);
      this.drawCircle(x, y, angle);
      this.lastPoint = { x, y };
    },
    drawCircle(x, y, angle) {
      ctx.beginPath();
      ctx.arc(x, y, Math.abs(angle) * Math.random() * 10, 0, 2 * Math.PI);
      ctx.fill();
    }
  };
};
