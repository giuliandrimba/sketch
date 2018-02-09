window.THREE = require("three");
var glslify = require('glslify')
var TweenMax = require('gsap');
var Particles = require("./three/particles");
var Simulation = require("./three/simulation");

class App {
  constructor() {

    const options = {
      fboSize: 512,
      radius: 70
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 300;

    this.renderer = new THREE.WebGLRenderer({alpha: true});
    document.body.appendChild( this.renderer.domElement );

    this.particles = new Particles(options.fboSize,options.fboSize)
    this.scene.add(this.particles);
    this.clock = new THREE.Clock({ autoStart: true })
    this.simulation = new Simulation(this.camera, this.renderer, options);

    this.events();
    this.render()
    this.resize()

  }

  events() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  render() {
    window.requestAnimationFrame( this.render.bind(this) );
    this.simulation.update(this.clock.getElapsedTime() * 0.2)
    this.particles.material.uniforms.positions.value = this.simulation.getTexture();
    this.renderer.render( this.scene, this.camera );
  }

  resize() {
    // this.particles.rotation.y += ;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.camera.aspect = window.innerWidth/window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

new App();
