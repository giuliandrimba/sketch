module.exports = function(drawer, canvas) {
  const mouse = { x: 0, y: 0 };
  let points = [];
  const bounds = canvas.getBoundingClientRect();
  const scale =
    parseInt(canvas.getAttribute("width")) / parseInt(canvas.style.width);
  let mouseIsDown = false;

  document.onmousedown = e => {
    points = [];
    mouse.x = (e.pageX - bounds.x) * scale;
    mouse.y = (e.pageY - bounds.y) * scale;
    mouseIsDown = true;
  };

  document.onmousemove = e => {
    if (mouseIsDown) {
      mouse.x = (e.pageX - bounds.x) * scale;
      mouse.y = (e.pageY - bounds.y) * scale;
    }
  };

  document.onmouseup = e => {
    mouseIsDown = false;
    drawer();
  };

  return {
    done() {},
    draw() {
      if (mouseIsDown) {
        drawer(mouse.x, mouse.y);
      }
    }
  };
};
