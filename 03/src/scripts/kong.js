var Q = require("q");
require("./three/distort")
require("./three/noise")

function Kong(scene, camera, renderer) {

  var loader = new THREE.OBJLoader()
  var loaded = false;

  var clock = new THREE.Clock();

  var distort = undefined;
  var distortNoise = undefined;
  var twist = undefined;

  var bloat = new MOD3.Bloat( );
  bloat.radius = 0;

  var mod3 = undefined;
  var mod3Wireframe = undefined;
  var mod3Explode = undefined;

  var self = this;

  this.angle = 0;
  this.angleDistort = 0;

  var dragging = false;

  var mouseX = 0;
  var mouseY = 0;
  var initMouseX = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var initAngleX = 0

  var material = undefined;
  var geometry = undefined;
  var geometryWireframe = undefined;
  var geometryExplode = undefined;

  var pressed = false
  var exploding = false;

  var TOTAL_VERTICES = 0;

  function events() {
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)
  }

  events()

  this.update = function() {

    if(dragging) {
      this.angle = (initAngleX + (initMouseX - mouseX) * 0.5) * -1
      this.angleDistort = (initAngleX + (initMouseX - mouseX) * 0.5) * -1
    }

    if(distort)
      distort.angle = this.angleDistort * Math.PI / 180
    if(twist)
      twist.angle = this.angle * Math.PI / 180

    if(bloat)
      bloat.setRadius( bloat.radius );

    updateMesh()
  }

  function onMouseDown(event) {
    dragging = true
    TweenMax.killTweensOf(this);
    initMouseX = ( event.clientX - windowHalfX ) / 2;;
    initAngleX = self.angle;
    document.addEventListener("mousemove", onMouseMove)
  }

  function onMouseMove(event) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
  }

  function onMouseUp(event) {
    dragging = false;
    document.removeEventListener("mousemove", onMouseMove)
    explode()
    TweenMax.to(self, 2, {angleDistort:0, ease:Expo.easeOut})
    TweenMax.to(self, 2, {angle:0, ease:Elastic.easeOut, onComplete:function() {
      exploding = false;
      distort.canExplode = false;
      self.angle = 0;
    }})
  }

  function explode() {
    if(self.angle < 180)
      return;
    // self.outerMesh.material.wireframe = false
    TweenMax.to(bloat, 1, {radius:0.1, ease:Expo.easeOut})
    TweenMax.to(bloat, 2, {radius:0, ease:Expo.easeInOut, delay:0.69})
    distort.explode()
  }

  function updateMesh() {
    if(!loaded)
      return

    var delta = 5 * clock.getDelta();
    mod3.apply()
    mod3Wireframe.apply()
    mod3Explode.apply()

    self.outerMesh.geometry.verticesNeedUpdate = true;
    self.mesh.rotation.y += 0.01 * delta;
    self.outerMesh.rotation.y += 0.01 * delta;
    self.explodeMesh.rotation.y += 0.01 * delta;
  }

  function init() {

    loadOBJ()
    .then(createMesh);
  }

  function createMesh() {
    var basic = new THREE.THREE.MeshPhongMaterial({color:0xcccccc, wireframe:false, shading: THREE.FlatShading, emissive:0x000000, specular:0x111111})
    self.wireframe = new THREE.THREE.MeshPhongMaterial({color:0xbbbbbb, wireframe:true, transparent: true, opacity:0.3 })
    self.wireframeExplode = new THREE.THREE.MeshPhongMaterial({color:0xbbbbbb, wireframe:false, transparent: true, opacity:0, shading: THREE.FlatShading, emissive:0x000000, specular:0x111111})
    self.mesh = new THREE.Mesh(geometry, basic);
    self.outerMesh = new THREE.Mesh(geometryWireframe, self.wireframe);
    self.explodeMesh = new THREE.Mesh(geometryExplode, self.wireframeExplode);
    scene.add(self.mesh)
    scene.add(self.outerMesh)
    scene.add(self.explodeMesh)
    loaded = true;
    TOTAL_VERTICES = self.mesh.geometry.vertices.length

    mod3 = new MOD3.ModifierStack( MOD3.LibraryThree, self.mesh );
    mod3Wireframe = new MOD3.ModifierStack( MOD3.LibraryThree, self.outerMesh );
    mod3Explode = new MOD3.ModifierStack( MOD3.LibraryThree, self.outerMesh );

    distort = new MOD3.Distort( 0 );
    mod3Wireframe.addModifier( distort );

    twist = new MOD3.DistortNoise( 0 );
    mod3Explode.addModifier( twist );
    mod3Explode.addModifier( bloat );

    mod3.addModifier( distort );
  }

  init()

  // Private

  function loadOBJ() {
    var path = './assets/macaco_low.OBJ'
    if(/medium/.test(window.location.href))
      path = './assets/macaco_medium.OBJ'
    if(/high/.test(window.location.href))
      path = './assets/macaco-high.OBJ'

    var deferred = Q.defer();

    loader.load(path,function(object) {
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
          geometryWireframe = new THREE.Geometry().fromBufferGeometry( child.geometry );
          geometryExplode = new THREE.Geometry().fromBufferGeometry( child.geometry );
        }
        deferred.resolve()
      } );
    });

    return deferred.promise;
  }

}

module.exports = Kong;
