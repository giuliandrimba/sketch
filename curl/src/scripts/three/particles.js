var glslify = require('glslify')

class ParticlesGeometry extends THREE.Points {

  constructor (width, height) {
    const l = (width * height)
    const vertices = new Float32Array(l * 3)

    for (let i = 0; i < l; i++) {
      const i3 = i * 3
      vertices[i3] = Math.random() * width
      vertices[i3 + 1] = Math.random() * height
      vertices[i3 + 2] = 0
    }

    const geom = new THREE.BufferGeometry()
    geom.addAttribute('position', new THREE.BufferAttribute(vertices, 3))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        positions: {type: 't', value: null},
        time: {type: 'f', value: 0},
        pointSize: {type: 'f', value: 1 * window.devicePixelRatio},
        positionsResolution: {
          value: new THREE.Vector2(width, height)
        },
      },
      vertexShader: glslify('../shader/render_vs.glsl'),
      fragmentShader: glslify('../shader/render_fs.glsl'),
      transparent: true,
      blending: THREE.AdditiveBlending
    })

    super(geom, material)
  }
}

module.exports = ParticlesGeometry