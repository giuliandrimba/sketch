var Calc = require("@doublepi/calc");
var curl = require("./curl");

var tmp = new THREE.Vector3();
var res = new THREE.Vector3();

function Particle(x, y, z) {
  let _x = Math.random() * 2;
  let _y = Math.random() * 1;
  let _z = 0;

  this.pos = new THREE.Vector3(_x, _y , _z)
  this.iddlePos = new THREE.Vector3(_x, _y , _z)

  this.vx = 0;
  this.vy = 0;
  this.ac = 0;
  this.speed = 0.2;
  this.dx = 0;
  this.dy = 0;
  this.spring = 0.9;
  this.ax = 0;
  this.ay = 0;
  this.friction = 0.8
  this.target = new THREE.Vector3(this.pos.x, this.pos.y, this.pos.z)
  this.maxRad = 30 + Math.random() * 40;
}

Particle.prototype.update = function(mouseX, mouseY, time) {
  // vec3 positionRandom = curl(position + u_time) * u_radius + (noise * 2.5);
  this.newPos = curl(tmp.copy(this.iddlePos).addScalar(time)).multiplyScalar(70)

  this.mouseDist = Calc.dist(this.newPos.x,this.newPos.y,mouseX,mouseY);

  if(this.mouseDist < 35) {
    this.speed = 0.08;
    this.spring = 0.9;
    this.mouseAngle = Calc.ang(mouseX, mouseY, this.newPos.x, this.newPos.y);
    this.mouseAngle = Calc.deg2rad(this.mouseAngle);
    let dx = Math.cos(this.mouseAngle);
    let dy = Math.sin(this.mouseAngle);
    this.target.x = (mouseX + dx * 35)
    this.target.y = (mouseY + dy * 35)
  } else {
    this.speed = 0.05;
    this.spring = 0.5;
    this.target.x = this.newPos.x
    this.target.y = this.newPos.y
  }

  this.dx = this.target.x - this.pos.x;
  this.dy = this.target.y - this.pos.y;
  this.ax = this.dx * this.spring
  this.ay = this.dy * this.spring
  this.vx += this.ax
  this.vy += this.ay
  this.vx *= this.friction
  this.vy *= this.friction

  this.pos.x += this.vx * this.speed
  this.pos.y += this.vy * this.speed
}

module.exports = Particle;
