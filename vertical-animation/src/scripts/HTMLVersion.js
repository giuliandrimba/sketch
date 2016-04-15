import TweenMax from "gsap";
import Grid from "./grid";

var numGrids = 10;
var grids = [];
var blur = undefined;
var main = undefined;
var effect = {blur:-1, y:0}
var filters = undefined;
var defs = undefined;
var blurFilter = undefined;

export default function init() {
  main = document.getElementById("main");

  filters = document.querySelector(".filters"); // the SVG that contains the filters
  defs = filters.querySelector("defs"); // the  element inside the SVG
  blur = defs.querySelector("#blur"); // the blur filter
  blurFilter = blur.firstElementChild; // the feGaussianBlur primitive

  while(numGrids-- > 0) {
    grids.push(new Grid());
  }

  document.body.addEventListener("mousedown", animate)
}

function animate() {
  TweenMax.set(effect, {y:0})
  main.style.transform = `translate3d(0,${effect.y}px, 0)`;
  effect.blur = -1;

  let _y = window.innerHeight * 9;
  TweenMax.to(effect, 3, {y:-_y, ease:window.easingName, onUpdate:function() {
    main.style.transform = `translate3d(0,${effect.y}px, 0)`;
  }})
  // TweenMax.to(effect, 2, { blur:1, ease:window.easingName, onUpdate:function() {
  //   var b = Math.round(50 - Math.abs(effect.blur * 50))
  //   blurFilter.setAttribute("stdDeviation",`0,${b}`);  
  // }})
}