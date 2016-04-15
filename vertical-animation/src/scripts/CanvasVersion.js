import TweenMax from "gsap";
import Grid from "./canvas/grid";

var renderer = undefined;
var stage = undefined;
var grid = undefined;
var gridsContainer = undefined;
var numGrids = 10;
var grids = [];

export default function init() {
  renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.view);

  stage = new PIXI.Container();
  gridsContainer = new PIXI.Container;

  for(var i = 0; i < numGrids; i++) {
    let grid = new Grid(gridsContainer)
    grid.el.y = window.innerHeight * i;
    grids.push(grid);
  }

  document.body.addEventListener("mousedown", animate)

  stage.addChild(gridsContainer);

  loop()
}

function loop() {
  window.requestAnimationFrame(loop);

  renderer.render(stage);
}

function animate() {
  gridsContainer.y = 0;
  let _y = window.innerHeight * 9;
  TweenMax.to(gridsContainer, 3, {y:- _y, ease:window.easingName});
}