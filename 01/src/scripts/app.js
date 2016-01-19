var Sketch = require("./sketch")
window.THREE = require("three")
var OrbitControls = require('three-orbit-controls')(THREE)
require("./three/Three.MeshLine")
require("./three/GPUParticleSystem")

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer()
var sketch = new Sketch(scene, camera, renderer);
var controls = new OrbitControls(camera);

camera.position.set(0, 0, -500)
camera.lookAt(new THREE.Vector3())

renderer.setClearColor(0xFFFFFF,1)

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  requestAnimationFrame( render );
  sketch.update()
  renderer.render(scene, camera);
}

function events() {
  window.addEventListener("resize", resize);
}

document.body.appendChild( renderer.domElement );

resize()
render()
events()

