import TweenMax from "gsap";
import moment from "moment";
import Grid from "./canvas/grid";
import _ from "lodash";

var renderer = undefined;
var stage = undefined;
var grid = undefined;
var gridsContainer = undefined;
var numGrids = 12;
var numGrids = 12;
var grids = [];


export default function init() {

  renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {antialias: true});
  document.body.appendChild(renderer.view);

  stage = new PIXI.Container();
  gridsContainer = new PIXI.Container;

  for(var i = 0; i < numGrids; i++) {
    let grid = new Grid(gridsContainer, i)
    grid.el.y = window.innerHeight * i;
    grids.push(grid);
  }

  document.body.addEventListener("mousedown", animate)
  window.addEventListener("resize", resize)

  stage.addChild(gridsContainer);

  loop()
}

function loop() {
  window.requestAnimationFrame(loop);

  renderer.render(stage);
}

function animate() {
  gridsContainer.y = 0;
  let _y = window.innerHeight * moment().month();
  TweenMax.to(gridsContainer, 3, {y:- _y, ease:Quart.easeInOut});
  for(var i = 0; i < numGrids; i++) {
    grids[i].animate();
  }
}

function resize() {
  renderer.resize(window.innerWidth, window.innerHeight);

  for(var i = 0; i < numGrids; i++) {
    grids[i].resize();
  }
}