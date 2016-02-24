var Q = require("q");
require("./three/distort")

function Kong(scene, camera, renderer) {
  var loader = new THREE.OBJLoader()
  var loaded = false;
  var clock = new THREE.Clock();
  var distort = undefined;
  var twist = undefined;
  var bloat = new MOD3.Bloat( );
  bloat.radius = 0;
  var mod3 = undefined;
  var mod32 = undefined;
  var self = this;
  this.angle = 0;
  var dragging = false;

  var mouseX = 0;
  var mouseY = 0;
  var initMouseX = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var initAngleX = 0

  var material = undefined;
  var geometry = undefined;
  var geometry2 = undefined;

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
    }

    if(distort)
      distort.angle = this.angle * Math.PI / 180
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
    TweenMax.to(self, 2, {angle:0, ease:Elastic.easeOut, onComplete:function() {
      exploding = false;
      distort.canExplode = false;
      self.angle = 0;
    }})
  }

  function explode() {
    // self.outerMesh.material.opacity = 0;
    if(self.angle < 180)
      return;
    TweenMax.to(bloat, 0.5, {radius:0.1, yoyo:true, repeat:1})
    distort.explode()
    TweenMax.to(self.outerMesh.material, 0.5, {opacity:1, repeat:1, yoyo:true,ease:Linear.easeNone});
    // TweenMax.to(self.outerMesh.material, 3, {opacity:0, ease:Expo.easeOut})
  }

  function updateMesh() {
    if(!loaded)
      return

    var delta = 5 * clock.getDelta();
    mod3.apply()
    mod32.apply()

    self.outerMesh.geometry.verticesNeedUpdate = true;
    self.mesh.rotation.y += 0.005 * delta;
    self.outerMesh.rotation.y += 0.005 * delta;
  }

  function init() {

    loadOBJ()
    .then(createMesh);
  }

  function createMesh() {
    var basic = new THREE.THREE.MeshPhongMaterial({color:0xcccccc, wireframe:false, shading: THREE.FlatShading, emissive:0x000000, specular:0x111111})
    self.wireframe = new THREE.THREE.MeshBasicMaterial({color:0xbbbbbb, wireframe:true, transparent: true, opacity:0.3})
    self.mesh = new THREE.Mesh(geometry, basic);
    self.outerMesh = new THREE.Mesh(geometry2, self.wireframe);
    // self.outerMesh.scale.set(1.2,1.2,1.2)
    scene.add(self.mesh)
    scene.add(self.outerMesh)
    loaded = true;
    TOTAL_VERTICES = self.mesh.geometry.vertices.length

    mod3 = new MOD3.ModifierStack( MOD3.LibraryThree, self.mesh );
    mod32 = new MOD3.ModifierStack( MOD3.LibraryThree, self.outerMesh );

    distort = new MOD3.Distort( 0 );
    mod32.addModifier( distort );

    twist = new MOD3.Twist( 0 );
    mod3.addModifier( twist );
    mod3.addModifier( bloat );
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
          geometry2 = new THREE.Geometry().fromBufferGeometry( child.geometry );
        }
        deferred.resolve()
      } );
    });

    return deferred.promise;
  }

}

module.exports = Kong;
