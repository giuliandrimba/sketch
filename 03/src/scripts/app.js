window.THREE = require("three")
require("gsap");
require("./three/OBJLoader")
window.MOD3 = require("./three/mod3.bundle").MOD3
var OrbitControls = require('three-orbit-controls')(THREE)
var Kong = require("./kong")

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
var renderer = new THREE.WebGLRenderer({alpha: true})
var controls = new OrbitControls(camera);
controls.enableZoom = false
var kingKong = new Kong(scene, camera, renderer);

camera.position.set(0, 0, 4)

scene.fog = new THREE.Fog(0x222222, 20, -20);

var lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[1].position.set( 100, 200, 100 );
lights[2].position.set( -100, -200, -100 );

scene.add( lights[0] );
scene.add( lights[1] );
scene.add( lights[2] );

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  requestAnimationFrame( render );
  kingKong.update()
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

