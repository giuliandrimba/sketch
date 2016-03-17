function Environment(camera, scene, renderer) {
  var cubeMap = undefined;


  // var textureCube = THREEx.createTextureCube([
  //   'left', 'right',
  //   'top', '.bottom',
  //   'front', 'back'
  // ])

  var textureCube = THREEx.createTextureCube([
    './images/panorama/env.threejs3.png', './images/panorama/env.threejs1.png',
    './images/panorama/env.threejs4.png', './images/panorama/env.threejs5.png',
    './images/panorama/env.threejs2.png', './images/panorama/env.threejs0.png'
  ])

  cubeMap = THREEx.createSkymap({textureCube:textureCube})
  // scene.add(cubeMap);

  this.getEnvMap = function() {
    return cubeMap.material.uniforms.tCube.value
  }
}

module.exports = Environment;
