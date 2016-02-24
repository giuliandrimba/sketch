var Q = require("q");
require("./three/distort")
require("./three/noise")

function Kong(scene, camera, renderer) {

  var loader = new THREE.OBJLoader()
  var loaded = false;
  var animating = false;

  var clock = new THREE.Clock();

  var distort = undefined;
  var distortNoise = undefined;
  var twist = undefined;

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
      this.angleDistort = this.angle;
    }

    if(distort)
      distort.angle = this.angleDistort * Math.PI / 180
    if(twist)
      twist.angle = this.angle * Math.PI / 180

    updateMesh()
  }

  function onMouseDown(event) {
    if(animating)
      return
    dragging = true
    TweenMax.killTweensOf(self);
    initMouseX = ( event.clientX - windowHalfX ) / 2;
    mouseX = ( event.clientX - windowHalfX ) / 2;
    initAngleX = self.angle;
    document.addEventListener("mousemove", onMouseMove)
  }

  function onMouseMove(event) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
  }

  function onMouseUp(event) {
    dragging = false;
    document.removeEventListener("mousemove", onMouseMove)
    if(animating)
      return

    TweenMax.killTweensOf(self);

    explode()
    var time = 1
    if(Math.abs(self.angle) > 180) {
      animating = true;
      time = 2
      TweenMax.to(self, time, {angleDistort:0, ease:Expo.easeOut})
    } else {
      TweenMax.to(self, time, {angleDistort:0, ease:Elastic.easeOut})
    }

    TweenMax.to(self, time, {angle:0, ease:Elastic.easeOut})

    if(Math.abs(self.angle) > 180) {

      var rotationAngle = 0
      var rot = self.mesh.rotation.y * 180 / Math.PI
      if(rot > 360) {
        var rotationAngle = (rot - (rot % 360)) * Math.PI / 180
      }

      TweenMax.to(self.outerMesh.rotation, 1, {y:rotationAngle, ease:Expo.easeout})
      TweenMax.to(self.mesh.rotation, 1, {y:rotationAngle, ease:Expo.easeout})
      setTimeout(function() {
        animating = false
      }, 2000)
    }
  }

  function explode() {
    if(Math.abs(self.angle) < 180)
      return;

    TweenMax.to(self.mesh.material, 0.3, {opacity:0.9,ease:Expo.easeOut})
    TweenMax.to(self.mesh.material, 1, {opacity:1,ease:Expo.easeInOut, delay:0.9})
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
    self.mesh.geometry.verticesNeedUpdate = true;

    if(!animating) {
      self.mesh.rotation.y += 0.015 * delta;
      self.outerMesh.rotation.y += 0.015* delta;
    }

  }

  function init() {

    loadOBJ()
    .then(createMesh);
  }

  function createMesh() {
    var basic = new THREE.THREE.MeshPhongMaterial({color:0xcccccc, wireframe:false, transparent:true, shading: THREE.FlatShading, emissive:0x000000, specular:0xcccccc})
    self.wireframe = new THREE.THREE.MeshBasicMaterial({color:0xbbbbbb, wireframe:true, transparent: true, opacity:0.4 })
    self.mesh = new THREE.Mesh(geometry, basic);
    self.outerMesh = new THREE.Mesh(geometryWireframe, self.wireframe);
    scene.add(self.mesh)
    scene.add(self.outerMesh)

    loaded = true;
    TOTAL_VERTICES = self.mesh.geometry.vertices.length

    mod3 = new MOD3.ModifierStack( MOD3.LibraryThree, self.mesh );
    mod3Wireframe = new MOD3.ModifierStack( MOD3.LibraryThree, self.outerMesh );
    mod3Explode = new MOD3.ModifierStack( MOD3.LibraryThree, self.outerMesh );

    distort = new MOD3.Distort( 0 );
    mod3Wireframe.addModifier( distort );

    twist = new MOD3.DistortNoise( 0 );
    mod3Explode.addModifier( twist );

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
