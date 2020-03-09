window.THREE = require("three")
var PostProcessing = require("PostProcessing");
var OrbitControls = require('three-orbit-controls')(THREE)

var Environment = require("./three/environment")
var DiscoSphere = require("./three/disco_sphere")

var scene = undefined;
var renderer = undefined;
var camera = undefined;

var cmposer = undefined;
var renderPass = undefined;

var directionalLight = undefined;
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6 );
var pointLight = new THREE.PointLight( 0xffffff, 1, 60 );

var environment = undefined;

var discoSphere = undefined;
var outerDiscoSphere = undefined;

function init() {
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x2d200f, 0.0025);

  renderer =  new THREE.WebGLRenderer()
  renderer.setClearColor(0xcccccc, 1.0);
  renderer.setSize(500, 500)



  addlights()

  camera = new THREE.PerspectiveCamera(45, 500 / 500, 0.1, 1000);
  camera.position.z = 4;
  camera.lookAt(scene.position);

  composer = new PostProcessing.EffectComposer(renderer);
  renderPass = new PostProcessing.RenderPass(scene, camera, {depth: true});
  composer.addPass(renderPass);
  var pass = new PostProcessing.BokehPass(renderPass.depthTexture, {
    focus: 1.0,
    aperture: 0.2,
    maxBlur: 5
  });

  composer.addPass(pass);

  var film = new PostProcessing.FilmPass({
    grayscale: false,
    sepia: false,
    vignette: false,
    eskil: false,
    scanlines: false,
    noise: true,
    noiseIntensity: 1.0,
    greyscaleIntensity: 1.0,
    sepiaIntensity: 1.0,
    vignetteOffset: 0.0,
    vignetteDarkness: 0.5,
  });

  composer.addPass(film);

  var bloom = new PostProcessing.BloomPass({
    resolutionScale: 0.5,
    blurriness: 1.0,
    strength: 1.0,
    distinction: 4.0
  });

  bloom.renderToScreen = true;
  composer.addPass(bloom);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.damping = 0.2;
  controls.enablePan = false;
  controls.minDistance = 2.5;
  createScene()

  document.getElementById("three").appendChild(renderer.domElement);
  render();
}

function addlights() {
  directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
  directionalLight.position.y = 30;
  directionalLight.position.z = 30;
  directionalLight.position.x = 30;
  scene.add(directionalLight);

  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  pointLight.position.set(10,10, 10)
  scene.add( pointLight );
}

function createScene() {
  environment = new Environment(scene, camera, renderer)
  outerDiscoSphere = new DiscoSphere(scene, camera, renderer, environment, false);
  outerDiscoSphere.mesh.scale.set(15,15,15);
  outerDiscoSphere.rotationSpeed = 0.003;
  discoSphere = new DiscoSphere(scene, camera, renderer, environment, true);
}


function render() {
  var clock = new THREE.Clock(true);

  outerDiscoSphere.update();
  discoSphere.update();
  requestAnimationFrame(render);
  // renderer.render(scene, camera);
  composer.render();
}

function handleResize() {
  camera.aspect = 500 / 500;
  camera.updateProjectionMatrix();
  renderer.setSize(500, 500);
}

window.onload = init()
window.addEventListener('resize', handleResize, false);
