const sketch = require("canvas-sketch");
const backgroundBrush = require("./brush/background");
const circleBrush = require("./brush/circle");
const backgroundPainter = require("./painter/background");
const mouse = require("./painter/mouse");
const flowfield = require('./flowfield');

const settings = {
  dimensions: "a4",
  pixelsPerInch: 300,
  duration: 1,
  units: "px",
  fps: 24,
  animate: true
};


window.onload = () => {
  sketch(s => {
    const numberPoints = s.height * 3;
    // const numberPoints = 500;
    const points = [];
    const field = flowfield({
      width: s.width * 0.8,
      height: s.height - s.width * 0.2,
      columns: Math.round(Math.random() * 10),
      rows: Math.round(Math.random() * 10),
      intensity: 21,
      initX: s.width * 0.1,
      initY: s.width * 0.1,
    });

    for(let i = 0; i < numberPoints; i += 1) {

      let brush = circleBrush(s.context, {
        strokeStyle: "#000000",
        lineWidth: Math.random() * 50
      });

      points.push(backgroundPainter(
        brush.draw.bind(brush),
        s.width * 0.8,
        s.height - s.width * 0.2,
        10 + Math.random() * 30,
        field,
        s.width * 0.1,
        s.width * 0.1,
      ))
    }
    var grd = s.context.createLinearGradient(0, 0, s.width, 0);
    grd.addColorStop(0, "#3F2A8C");
    grd.addColorStop(1, "#22164D");
    s.context.fillStyle = 'white';
    s.context.fillRect(0, 0, s.width, s.height);

    return {
      resize(params) {},
      render(params) {
        
        points.map((p) => {
          p.draw()
        })
      },
      unload() {}
    };
  }, settings);
};
