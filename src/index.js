const sketch = require("canvas-sketch");

const settings = {
  dimensions: [1500, 1500],
  duration: 10,
  units: "px",
  fps: 60,
  animate: true,
};

window.onload = () => {
  sketch((s) => {
    s.context.fillStyle = "#eeeeee";
    s.context.fillRect(0, 0, s.width, s.height);

    return {
      resize(params) {},
      render(params) {},
      unload() {},
    };
  }, settings);
};
