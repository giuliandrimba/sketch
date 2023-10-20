function DiscoSphere(scene, camera, renderer, environment, depth) {

  this.geometry = undefined;
  this.material = undefined;
  this.mesh = undefined;

  this.rotationSpeed = 0.005;

  this.init = function() {
    this.geometry = new THREE.SphereGeometry( 1, 40, 20 );
    this.geometry.computeFaceNormals()

    var texture = THREE.ImageUtils.loadTexture('./images/grid.jpg')
    // texture.anisotropy = 4;
    // texture.repeat.set( 0.998, 0.998 );
    // texture.offset.set( 0.1, 0);
    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    // texture.format = THREE.RGBFormat;

    this.material = new THREE.MeshPhongMaterial({
      envMap    : environment.getEnvMap(),
      bumpMap: texture,
      shading   : THREE.FlatShading,
      color   : 'white',
      reflectivity  : 1.0,
      specular: 0x222222,
      emissive  : '#fff',
      shininess : 100,
      color: 0xaaaaaa,
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
