const sketch = require("canvas-sketch");
const backgroundBrush = require("./brush/background");
const bcakgroundPainter = require("./painter/background");
const mouse = require("./painter/mouse");

const settings = {
  dimensions: "a4",
  pixelsPerInch: 300,
  duration: 20,
  units: "px",
  fps: 24,
  animate: true
};

window.onload = () => {
  sketch(s => {
    const background = backgroundBrush(s.context, {
      strokeStyle: "#5a0004",
      lineWidth: 20
    });
    const background1Painter = bcakgroundPainter(
      background.draw.bind(background),
      s.width,
      s.height,
      10 + Math.random() * 10
    );
    const mousePainter = mouse(background.draw.bind(background), s.canvas);

    return {
      resize(params) {},
      render(params) {
        background1Painter.draw();
        mousePainter.draw();
      },
      unload() {}
    };
  }, settings);
};
