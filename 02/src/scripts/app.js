window.THREE = require("three")
require("./three/OBJLoader")
var OrbitControls = require('three-orbit-controls')(THREE)
var Kong = require("./kong")

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
var renderer = new THREE.WebGLRenderer({alpha: true})
var controls = new OrbitControls(camera);
var kingKong = new Kong(scene, camera, renderer);

camera.position.set(0, 0, -20)

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  requestAnimationFrame( render );

  camera.lookAt( scene.position )
  renderer.render(scene, camera);
}

function events() {
  window.addEventListener("resize", resize);
}

document.body.appendChild( renderer.domElement );

resize()
render()
events()

