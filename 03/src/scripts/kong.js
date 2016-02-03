var Q = require("q");
var distortion = require("./distortion");

function Kong(scene, camera, renderer) {
  var loader = new THREE.OBJLoader()
  var loaded = false;
  var clock = new THREE.Clock();

  var material = undefined;
  var geometry = undefined;

  function events() {

  }

  this.update = function() {
    updateMesh()
  }

  function updateMesh() {
    if(!loaded)
      return

    var delta = 5 * clock.getDelta();

    // self.mesh.rotation.y += 0.005 * delta;
  }

  function init() {

    loadOBJ()
    .then(createMesh);
  }

  function createMesh() {
    var basic = new THREE.THREE.MeshPhongMaterial({color:0xff5400, wireframe:false, shading: THREE.FlatShading, emissive:0x000000, specular:0x111111})
    this.mesh = new THREE.Mesh(geometry, basic);
    scene.add(this.mesh)
    loaded = true;
    distortion(this.mesh)
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
        }
        deferred.resolve()
      } );
    });

    return deferred.promise;
  }

}

module.exports = Kong;
