window.THREE = require("three");
var glslify = require('glslify')
var TweenMax = require('gsap');
var Particles = require("./three/particles");
var Simulation = require("./three/simulation");

class App {
  constructor() {
    console.log(this.getParticlesCount())

    const options = {
      fboSize: this.getParticlesCount(),
      radius: 125
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
    this.simulation.update(this.clock.getElapsedTime() * 0.02)
    this.particles.material.uniforms.positions.value = this.simulation.getTexture();
    this.particles.material.uniforms.time.value = this.clock.getElapsedTime() * 0.5;
    this.renderer.render( this.scene, this.camera );
  }

  resize() {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.camera.aspect = window.innerWidth/window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  getParticlesCount() {
    let n = 256
    if (window.innerWidth > 1280) {
      n = 512
    }
    if(window.innerWidth > 1920) {
      n = 1024
    }

    return n;
  }
}

new App();
