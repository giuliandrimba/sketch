function Kong(scene, camera, renderer) {
  var self = this;
  var loader = new THREE.OBJLoader()
  var mod3;
  var twist;
  var noise;
  var angle = {x:0, force:0}
  var loaded = false;
  var dragging = false;
  var clock = new THREE.Clock();

  var material = undefined;
  var geometry = undefined;

  var mouseX = 0;
  var mouseY = 0;
  var initMouseX = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var initAngleX = 0

  this.onLoad = function() {
    mod3 = new MOD3.ModifierStack( MOD3.LibraryThree, self.mesh )
    twist = new MOD3.Twist( 0 );
    twist.angle=0;
    mod3.addModifier( twist );

    noise = new MOD3.Noise(0);
    noise.constraintAxes(MOD3.ModConstant.X | MOD3.ModConstant.Y);
    mod3.addModifier( noise );

    mod3.apply()

    events();
    loaded = true;
  }

  function events() {
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)
  }

  function onMouseDown() {
    dragging = true;
    TweenMax.killTweensOf(angle);
    document.addEventListener("mousemove", onMouseMove)
    initMouseX = ( event.clientX - windowHalfX ) / 2;;
    initAngleX = angle.x
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

    var delta = 5 * clock.getDelta();

    if(dragging) {
      angle.x = (initAngleX + (initMouseX - mouseX) * 0.5) * -1
    }

    // noise.force = angle.force;
    twist.angle = angle.x * Math.PI / 180
    mod3.apply()

    self.mesh.rotation.y += 0.0125 * delta;
  }

  function init() {

    path = './assets/macaco_low.OBJ'

    if(/medium/.test(window.location.href))
      path = './assets/macaco_medium.OBJ'

    if(/high/.test(window.location.href))
      path = './assets/macaco-high.OBJ'

    loader.load(path,function(object) {
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
        }

      } );

      var basic = new THREE.THREE.MeshPhongMaterial({color:0xff5400, wireframe:false, shading: THREE.FlatShading, emissive:0x000000, specular:0x111111})
      self.mesh = new THREE.Mesh(geometry, basic);
      scene.add(self.mesh)
      self.onLoad()
    });
  }

  init()

}

module.exports = Kong;
