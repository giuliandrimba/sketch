var GPUComputationRenderer = require("./utils/GPUComputationRenderer");
var ProjectorHelper = require('./utils/projectorHelper');
var glslify = require('glslify')

class Simulation {
  constructor(camera, renderer, options) {
    this.FBO_SIZE = options.fboSize;
    this.RADIUS = options.radius;
    this.renderer = renderer;
    this.camera = camera;
    this.mouse = new THREE.Vector3();
    this.screenMouse = new THREE.Vector2();

    this.SPEED = 0.1;
    this.TIME_SPEED = 0.4;
    this.ANIMATING = true;
    this.TOTAL = this.FBO_SIZE * this.FBO_SIZE;

    this.gpuCompute = new GPUComputationRenderer(this.FBO_SIZE, this.FBO_SIZE, this.renderer)

    this.createTextures()
    this.createVariableTextures()
    this.addDependencies()

    this.Helper = new ProjectorHelper();


    this.events()
    this.gpuCompute.init()
    this.H_W = window.innerWidth / 2;

    TweenMax.to(this.acceleration.material.uniforms.radius, 1.35, { value: this.RADIUS, ease: Expo.easeInOut})
    TweenMax.to(this.velocity.material.uniforms.radius, 1.35, { value: this.RADIUS, ease: Expo.easeInOut})
    TweenMax.to(this, 1.35, {
      TIME_SPEED: 0.006, ease: Expo.easeInOut, onComplete: () => {
        this.ANIMATING = false;
      }
    })

  }

  createVariableTextures() {
    this.initPos = this.gpuCompute.addVariable('initPosTexture', glslify('../shader/init_pos_fs.glsl'), this.initPosTexture)
    this.initPos.wrapS = THREE.RepeatWrapping
    this.initPos.wrapT = THREE.RepeatWrapping
    this.initPos.material.uniforms = {
      positions: {
        value: this.initPosTexture
      },
      positionsResolution: {
        value: new THREE.Vector2(this.FBO_SIZE, this.FBO_SIZE)
      }
    }

    this.velocity = this.gpuCompute.addVariable('velocityTexture', glslify('../shader/velocity_fs.glsl'), this.emptyTexture)
    this.velocity.wrapS = THREE.RepeatWrapping
    this.velocity.wrapT = THREE.RepeatWrapping
    this.velocity.material.uniforms = {
      positionsResolution: {
        value: new THREE.Vector2(this.FBO_SIZE, this.FBO_SIZE)
      },
      mousePos: {
        value: new THREE.Vector2(0, 0)
      },
      friction: {
        value: 0.99
      },
      radius: {
        value: 0
      }
    }

    this.acceleration = this.gpuCompute.addVariable('accelerationTexture', glslify('../shader/acceleration_fs.glsl'), this.emptyTexture)
    this.acceleration.wrapS = THREE.RepeatWrapping
    this.acceleration.wrapT = THREE.RepeatWrapping
    this.acceleration.material.uniforms = {
      time: {
        value: 0
      },
      delta: {
        value: 0
      },
      repulseRadius: {
        value: this.RADIUS * 0.3
      },
      mousePos: {
        value: new THREE.Vector2(window.innerWidth, 0)
      },
      spring: {
        value: 0.3
      },
      positionsResolution: {
        value: new THREE.Vector2(this.FBO_SIZE, this.FBO_SIZE)
      },
      windowResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      },
      speed: {
        value: 0.05
      },
      radius: {
        value: 0
      }
    }

    this.positions = this.gpuCompute.addVariable('positionsTexture', glslify('../shader/positions_fs.glsl'), this.positionsTexture)
    this.positions.wrapS = THREE.RepeatWrapping
    this.positions.wrapT = THREE.RepeatWrapping
    this.positions.material.uniforms = {
      positions: {
        value: this.positionsTexture
      },
      positionsResolution: {
        value: new THREE.Vector2(this.FBO_SIZE, this.FBO_SIZE)
      }
    }

    this.oldPosition = this.gpuCompute.addVariable('oldPositionTexture', glslify('../shader/old_positions_fs.glsl'), this.positionsTexture)
    this.oldPosition.wrapS = THREE.RepeatWrapping
    this.oldPosition.wrapT = THREE.RepeatWrapping
    this.oldPosition.material.uniforms = {
      positionsResolution: {
        value: new THREE.Vector2(this.FBO_SIZE, this.FBO_SIZE)
      }
    }

    this.oldVelocity = this.gpuCompute.addVariable('oldVelocityTexture', glslify('../shader/old_velocity_fs.glsl'), this.emptyTexture)
    this.oldVelocity.wrapS = THREE.RepeatWrapping
    this.oldVelocity.wrapT = THREE.RepeatWrapping
    this.oldVelocity.material.uniforms = {
      positionsResolution: {
        value: new THREE.Vector2(this.FBO_SIZE, this.FBO_SIZE)
      }
    }
  }

  addDependencies() {
    this.gpuCompute.setVariableDependencies(this.oldPosition, [this.positions])
    this.gpuCompute.setVariableDependencies(this.positions, [this.velocity, this.oldPosition])
    this.gpuCompute.setVariableDependencies(this.acceleration, [this.oldPosition, this.initPos])
    this.gpuCompute.setVariableDependencies(this.velocity, [this.acceleration, this.oldVelocity, this.oldPosition])
    this.gpuCompute.setVariableDependencies(this.oldVelocity, [this.velocity])
  }

  createTextures() {

    var positionsData = new Float32Array(this.TOTAL * 4)
    var emptyData = new Float32Array(this.TOTAL * 4);
    var index = 0;
    for ( var i = 0; i < this.TOTAL; i ++ ) {
      positionsData[index++] = Math.random() * 2
      positionsData[index++] = Math.random() * 1
      positionsData[index++] = 0.2
      positionsData[index++] = Math.random()
    }

    this.initPosTexture = new THREE.DataTexture(positionsData, this.FBO_SIZE, this.FBO_SIZE, THREE.RGBAFormat, THREE.FloatType);
    this.initPosTexture.needsUpdate = true

    this.positionsTexture = new THREE.DataTexture(positionsData, this.FBO_SIZE, this.FBO_SIZE, THREE.RGBAFormat, THREE.FloatType);
    this.positionsTexture.needsUpdate = true

    this.emptyTexture = new THREE.DataTexture(emptyData, this.FBO_SIZE, this.FBO_SIZE, THREE.RGBAFormat, THREE.FloatType);
    this.emptyTexture.needsUpdate = true
  }

  getTexture() {
    return this.gpuCompute.getCurrentRenderTarget(this.positions).texture
  }

  events() {
    document.body.addEventListener('mousemove', this.mouseMove.bind(this))
  }

  mouseMove(event) {
    this.Helper.compute( event.clientX, event.clientY, this.camera, this.mouse );
    this.acceleration.material.uniforms.mousePos.value.x = this.mouse.x;
    this.acceleration.material.uniforms.mousePos.value.y = -this.mouse.y;
    this.velocity.material.uniforms.mousePos.value.x = this.mouse.x;
    this.velocity.material.uniforms.mousePos.value.y = -this.mouse.y;

    this.screenMouse.x = Math.abs(event.clientX - window.innerWidth / 2);
    this.screenMouse.y = Math.abs(event.clientY - window.innerHeight / 2);

    TweenMax.to(this.acceleration.material.uniforms.repulseRadius, 0.5, { value: this.RADIUS * 0.4 + ((this.RADIUS * 0.2) * (1 - (this.screenMouse.length() / (window.innerWidth / 2)))) })
  }

  update(time) {
    this.gpuCompute.compute()
    if (this.ANIMATING) {
      this.acceleration.material.uniforms.time.value += time
    } else {
      this.acceleration.material.uniforms.time.value += this.TIME_SPEED * (0.3 *(1 - this.screenMouse.length() / this.H_W ))
    }
  }
}

module.exports = Simulation;
