function DiscoSphere(scene, camera, renderer, environment, depth) {

  this.geometry = undefined;
  this.material = undefined;
  this.mesh = undefined;

  this.rotationSpeed = 0.005;

  this.init = function() {
    this.geometry = new THREE.SphereGeometry( 1, 40, 20 );
    this.geometry.computeFaceNormals()

    this.material = new THREE.MeshPhongMaterial({
      envMap    : environment.getEnvMap(),
      shading   : THREE.FlatShading,
      color   : 'white',
      reflectivity  : 1.0,
      specular: 0x222222,
      emissive  : '#222',
      shininess : 50,
      color: 0x634140,
      side: THREE.DoubleSide,
      depthWrite: depth
    } );

    this.mesh = new THREE.Mesh( this.geometry, this.material);
    scene.add(this.mesh);
  }

  this.update = function() {
    this.mesh.rotation.y += this.rotationSpeed;
  }

  this.init()
}

module.exports = DiscoSphere;
