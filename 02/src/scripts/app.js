window.THREE = require("three")
require("./three/OBJLoader")
var OrbitControls = require('three-orbit-controls')(THREE)
var Kong = require("./kong")

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
var renderer = new THREE.WebGLRenderer({alpha: true})
// var controls = new OrbitControls(camera);
var kingKong = new Kong(scene, camera, renderer);
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

camera.position.set(0, 0, -20)
camera.lookAt(new THREE.Vector3())

kingKong.onLoad = function() {

  // var vec = kingKong.mesh.position;
  // var target = new THREE.Vector3(kingKong.mesh.position.x, kingKong.mesh.position.y, kingKong.mesh.position.z)
  // controls.target.set(target);
  // camera.lookAt(target)
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  requestAnimationFrame( render );

  camera.position.x += ( mouseX - camera.position.x ) * .001;
  camera.position.y += ( - mouseY - camera.position.y ) * .001;

  camera.lookAt( scene.position )
  renderer.render(scene, camera);
}

function events() {
  window.addEventListener("resize", resize);
}

document.body.appendChild( renderer.domElement );
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

  }

resize()
render()
events()

