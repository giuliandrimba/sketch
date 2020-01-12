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

  return {
    draw(x, y) {
      if (!this.lastPoint) {
        this.lastPoint = { x, y };
      } else if (!x && !y) {
        this.lastPoint = undefined;
      }
      ctx.strokeStyle = config.strokeStyle;
      ctx.lineWidth = config.lineWidth;
      this.drawLine(this.lastPoint.x, this.lastPoint.y, x, y);
      this.lastPoint = { x, y };
    },
    drawLine(fromX, fromY, x, y) {
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
};
