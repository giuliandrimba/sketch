const sketch = require("canvas-sketch");
const backgroundBrush = require("./brush/background");
const circleBrush = require("./brush/circle");
const backgroundPainter = require("./painter/background");
const mouse = require("./painter/mouse");
const flowfield = require('./flowfield');
const transform = require('./transform');

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
      intensity: 21 * Math.random(),
      initX: s.width * 0.1,
      initY: s.width * 0.1,
    });

    const getField = () => {
      return transform.distort(field, s);
    }
    let flow = getField()
    const point = transform.point();
    for(let i = 0; i < numberPoints; i += 1) {

      let brush = circleBrush(s.context, {
        strokeStyle: "#e04141",
        lineWidth: Math.random() * 50
      });

      points.push(backgroundPainter(
        brush.draw.bind(brush),
        s.width * 0.8,
        s.height - s.width * 0.2,
        10 + Math.random() * 30,
        flow,
        s.width * 0.1,
        s.width * 0.1,
        point
      ))
    }
    var grd = s.context.createLinearGradient(0, 0, s.width, 0);
    grd.addColorStop(0, "#3F2A8C");
    grd.addColorStop(1, "#22164D");
    s.context.fillStyle = 'white';
    s.context.fillRect(0, 0, s.width, s.height);

    // s.context.fillStyle = 'red';
    // s.context.arc(point.x, point.y, point.radius, 0, 2 * Math.PI);
    // s.context.fill();
    // flow.map((f) => {
    //   s.context.strokeStyle = 'black';
    //   s.context.lineWidth = 10;
    //   s.context.rect(f.x, f.y, f.width, f.height);
    //   s.context.stroke();
    // })

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
