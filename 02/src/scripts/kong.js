function Kong(scene, camera, renderer) {
  var self = this;
  var loader = new THREE.OBJLoader()
  var mod3;
  var twist;
  var noise;
  var angle = {x:0, force:0}
  var loaded = false;
  var dragging = false;

  var material = new THREE.MeshBasicMaterial({wireframe:true, color:0x333333})
  var geometry = undefined;

  var mouseX = 0, mouseY = 0;
  var initMouseX = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  loader.load('./assets/test_gorila.OBJ',function(object){
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
          child.material.wireframe = true
        }

      } );
    self.mesh = new THREE.Mesh(geometry, material);
    scene.add(self.mesh)
    self.mesh.rotation.y = 130 * Math.PI / 180;
    self.mesh.rotation.x = -30 * Math.PI / 180;
    self.onLoad()
  });

  this.onLoad = function() {
    loaded = true;
    mod3 = new MOD3.ModifierStack( MOD3.LibraryThree, self.mesh )
    twist = new MOD3.Twist( 0 );
    twist.angle=0;
    mod3.addModifier( twist );

    noise = new MOD3.Noise(0);
    noise.constraintAxes(MOD3.ModConstant.X | MOD3.ModConstant.Y);
    mod3.addModifier( noise );

    mod3.apply()

    events();
  }

  function events() {
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)
  }

  function onMouseDown() {
    dragging = true;
    document.addEventListener("mousemove", onMouseMove)
    initMouseX = ( event.clientX - windowHalfX ) / 2;;
  }

  function onMouseUp() {
    dragging = false;
    document.removeEventListener("mousemove", onMouseMove)
    TweenMax.to(angle,1, {x:0, force:0, ease:Elastic.easeOut});
  }

  function onMouseMove(event) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
  }

  this.update = function() {
    updateMesh()
  }

  function updateMesh() {
    if(!loaded)
      return

    if(dragging) {
      angle.x += (initMouseX - mouseX) * 0.01
    }

    // noise.force = angle.force;
    twist.angle = angle.x * Math.PI / 180
    mod3.apply()
  }

}

module.exports = Kong;
