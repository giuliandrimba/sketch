function Kong(scene, camera, renderer) {
  var self = this;
  var loader = new THREE.OBJLoader()
  this.mesh = new THREE.Object3D;

  loader.load('assets/test_gorila.obj',function(object){
    object.rotation.y = 170 * Math.PI / 180;
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material.wireframe = true
          console.log(child.geometry)
        }

      } );
    self.mesh.add(object);
    scene.add(self.mesh)
    self.onLoad()
  });

  this.onLoad = function() {

  }
}

module.exports = Kong;
