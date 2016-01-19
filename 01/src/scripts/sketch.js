function Sketch(scene, camera, renderer) {

  var MAX_PARTICLES = (1024 * 512) / 20

  var geometry = new THREE.Geometry();
  var material = new THREE.PointsMaterial({
      color: 0xCCCCCC,
      size: 10
    });

  var particles = new THREE.Points(geometry, material)
  createParticles()

  scene.add(particles);

  this.update = function() {

  }

  function createParticles() {

    var x = 0;
    var y = 0;

    for(var i = 0; i < MAX_PARTICLES; i++) {
      x += 20;

      if(x % 1024 === 0) {
        x = 0
        y += 20;
      }

      var particle = new THREE.Vector3(x - 1024, y - 256, 0)
      geometry.vertices.push(particle);
    }
  }

  // particles.position.set(window.innerWidth / 2, window.innerHeight / 2, 0)

}

module.exports = Sketch
