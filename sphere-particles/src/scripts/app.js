window.THREE = require("three");
window.TweenMax = require("gsap");

import Dot from "./dot";

var el = undefined;
var scene = undefined;
var camera = undefined;
var renderer = undefined;
var dot = undefined;
var title = undefined;

render();

function render() {

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  renderer = new THREE.WebGLRenderer({alpha: false, antialias : true, transparent: false})

  camera.position.set(0, 0, 4)
  scene.fog = new THREE.Fog(0x000000, 20, -1000);

  dot = new Dot(scene, camera, renderer);

  document.body.appendChild(renderer.domElement);

  loop()
  resize()
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,  window.innerHeight);
}

function loop() {
  window.requestAnimationFrame( loop );
  dot.update()
  camera.lookAt( scene.position )
  renderer.render(scene, camera);
}