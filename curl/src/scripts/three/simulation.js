var GPUComputationRenderer = require("./utils/GPUComputationRenderer");
var ProjectorHelper = require('./utils/projectorHelper');
var glslify = require('glslify')
var TweenMax = require('gsap');

class Simulation {
  constructor(camera, renderer, options) {
    this.FBO_SIZE = options.fboSize;
    this.RADIUS = options.radius;
    this.renderer = renderer;
    this.camera = camera;
    this.mouse = new THREE.Vector3();
    this.oldMouse = new THREE.Vector3();
    this.mouseDest = new THREE.Vector3();

    this.TOTAL = this.FBO_SIZE * this.FBO_SIZE;

    this.gpuCompute = new GPUComputationRenderer(this.FBO_SIZE, this.FBO_SIZE, this.renderer)

    this.createTextures()
    this.createVariableTextures()
    this.addDependencies()

    this.Helper = new ProjectorHelper();


    this.events()
    this.gpuCompute.init()

  }

  addDependencies() {
    this.gpuCompute.setVariableDependencies( this.oldVelocity, [ this.velocity  ] )
    this.gpuCompute.setVariableDependencies( this.oldPosition, [ this.positions  ] )
    this.gpuCompute.setVariableDependencies( this.positions, [ this.velocity, this.oldPosition  ] )
    this.gpuCompute.setVariableDependencies( this.acceleration, [ this.oldPosition, this.initPos, this.oldVelocity ] )
    this.gpuCompute.setVariableDependencies( this.velocity, [ this.acceleration, this.oldVelocity ] )
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
      friction: {
        value: 0.8
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

    this.acceleration = this.gpuCompute.addVariable('accelerationTexture', glslify('../shader/acceleration_fs.glsl'), this.emptyTexture)
    this.acceleration.wrapS = THREE.RepeatWrapping
    this.acceleration.wrapT = THREE.RepeatWrapping
    this.acceleration.material.uniforms = {
      time: {
        value: 0
      },
      movement: {
        value: 0
      },
      movementDir: {
        value: new THREE.Vector3()
      },
      mousePos: {
        value: new THREE.Vector2(5,5)
      },
      oldMouse: {
        value: new THREE.Vector2(5, 5)
      },
      spring: {
        value: 0.9
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
      friction: {
        value: 0.9
      },
      radius: {
        value: this.RADIUS
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
  }

  createTextures() {

    var positionsData = new Float32Array(this.TOTAL * 4)
    var emptyData = new Float32Array(this.TOTAL * 4);
    var index = 0;
    for ( var i = 0; i < this.TOTAL; i ++ ) {
      positionsData[index++] = Math.random() * 0.9
      positionsData[index++] = Math.random() * 0.5
      positionsData[index++] = Math.random() * 0.5;
      positionsData[index++] = 0;
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
    window.clearTimeout(this.stopInterval)
    this.Helper.compute(event.clientX, event.clientY, this.camera, this.mouseDest );
    // TweenMax.to(this.acceleration.material.uniforms.oldMouse.value, 0.5, {x:this.acceleration.material.uniforms.mousePos.value.x, y:this.acceleration.material.uniforms.mousePos.value.y})
    // TweenMax.to(this.acceleration.material.uniforms.mousePos.value, 0.5, {x:this.mouse.x, y:-this.mouse.y})
  }
  
  update(time) {
    // console.log((this.mouseDest.x - this.mouse.x))
    this.mouse.x = this.mouseDest.x;
    this.mouse.y = this.mouseDest.y;
    this.acceleration.material.uniforms.oldMouse.value.x = this.oldMouse.x
    this.acceleration.material.uniforms.oldMouse.value.y = this.oldMouse.y
    this.acceleration.material.uniforms.mousePos.value.x = this.mouse.x;
    this.acceleration.material.uniforms.mousePos.value.y = -this.mouse.y;
    this.oldMouse.x = this.mouseDest.x;
    this.oldMouse.y = this.mouseDest.y;
    // this.oldMouse.y = -this.mouse.y;

    this.gpuCompute.compute()
    this.acceleration.material.uniforms.time.value = time
  }
}

module.exports = Simulation;
