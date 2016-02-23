require("./three/distort")

var cos = 0;
var angle = 0;
var mod3 = undefined;
var bend = undefined;
var bloat = undefined;
var breaq = undefined;
var noise = undefined;
var skew = undefined;
var taper = undefined;
var twist = undefined;
var distort = undefined;
var mesh = undefined;
var gui = undefined;

var options = {}

module.exports = function(mesh) {
  mesh = mesh;
  mod3 = new MOD3.ModifierStack( MOD3.LibraryThree, mesh );
  gui = new dat.GUI();

  options.tween = tween;

  applyBend()
  applyBloat()
  applyBreak()
  applyNoise()
  applySkew()
  applyTaper()
  applyTwist()
  applyDistort()

  return {
    update:update,
    distort: distort,
    twist:twist
  }
}

function update() {
  mod3.apply()
}


function tween() {

}

function applyBend() {

  options.bend = {}
  options.bend.angle = 0;
  options.bend.force = 0;
  options.bend.offset = 0;

  bend = new MOD3.Bend( );
  bend.switchAxes = true;
  bend.constraint = MOD3.ModConstant.LEFT;

  mod3.addModifier( bend );

  mod3.apply();

  // GUI

  var f1 = gui.addFolder('Bend');
  f1.add(options.bend, 'angle', -180, 180).onChange(updateBend)
  f1.add(options.bend, 'force', -5, 5).onChange(updateBend)
  f1.add(options.bend, 'offset', -1, 1).onChange(updateBend)

  // f1.open()

  function updateBend() {
    bend.setAngle( options.bend.angle );
    bend.force = options.bend.force;
    bend.offset = options.bend.offset;
    mod3.apply()
  }
}

function applyBloat() {
  options.bloat = {}
  options.bloat.radius = 0;

  bloat = new MOD3.Bloat( );
  mod3.addModifier( bloat );
  mod3.apply();

  var f2 = gui.addFolder('Bloat');
  f2.add(options.bloat, 'radius', 0, 2).onChange(updateBloat)

  // f2.open()

  function updateBloat() {
    bloat.setRadius( options.bloat.radius );
    mod3.apply()
  }
}

function applyBreak() {
  options.breaq = {}
  options.breaq.angle = 0;
  options.breaq.offset = 0;

  breaq = new MOD3.Break( 0,0 );
  breaq.angle = options.breaq.angle * Math.PI / 180
  mod3.addModifier( breaq );
  mod3.apply();

  var f2 = gui.addFolder('Break');
  f2.add(options.breaq, 'angle', -180, 180).onChange(updateBreak)
  f2.add(options.breaq, 'offset', -1, 1).onChange(updateBreak)

  // f2.open()

  function updateBreak() {
    breaq.angle = options.breaq.angle * Math.PI / 180
    breaq.offset = options.breaq.offset;
    mod3.apply()
  }
}


function applyNoise() {
  options.noise = {}
  options.noise.force = 1;

  noise = new MOD3.Noise( 20 );
  mod3.addModifier( noise );
  mod3.apply();

  var f3 = gui.addFolder('Noise');
  f3.add(options.noise, 'force', -20, 20).onChange(updateNoise)

  // f3.open()

  function updateNoise() {
    noise.force = options.noise.force;
    mod3.apply()
  }
}

function applySkew() {
  options.skew = {}
  options.skew.force = 0;

  skew = new MOD3.Skew( 0 );
  // mod3.constraintAxes(MOD3.ModConstant.X | MOD3.ModConstant.Y);
  mod3.addModifier( skew );
  mod3.apply();

  var f3 = gui.addFolder('skew');
  f3.add(options.skew, 'force', -10, 10).onChange(updateskew)


  // f3.open()

  function updateskew() {
    skew.force = options.skew.force;
    mod3.apply()
  }
}

function applyTaper() {
  options.taper = {}
  options.taper.force = 0;

  taper = new MOD3.Taper( 0 );
  // mod3.constraintAxes(MOD3.ModConstant.X | MOD3.ModConstant.Y);
  mod3.addModifier( taper );
  mod3.apply();

  var f3 = gui.addFolder('Taper');
  f3.add(options.taper, 'force', -2, 2).onChange(updatetaper)


  // f3.open()

  function updatetaper() {
    taper.force = options.taper.force;
    mod3.apply()
  }
}

function applyTwist() {
  options.twist = {}
  options.twist.angle = 0;

  twist = new MOD3.Twist( 0 );
  // mod3.constraintAxes(MOD3.ModConstant.X | MOD3.ModConstant.Y);
  mod3.addModifier( twist );
  mod3.apply();

  var f3 = gui.addFolder('Twist');
  f3.add(options.twist, 'angle', -180, 180).onChange(updatetwist)


  // f3.open()

  function updatetwist() {
    twist.angle = options.twist.angle * Math.PI / 180;
    mod3.apply()
  }
}

function applyDistort() {
  options.distort = {}
  options.distort.angle = 0;

  distort = new MOD3.Distort( 0 );
  // mod3.constraintAxes(MOD3.ModConstant.X | MOD3.ModConstant.Y);
  mod3.addModifier( distort );
  mod3.apply();

  var f3 = gui.addFolder('Distort');
  f3.add(options.distort, 'angle', -180, 180).onChange(updatedistort)


  f3.open()

  function updatedistort() {
    distort.angle = angle;
    distort.tween()
    mod3.apply()
  }
}
