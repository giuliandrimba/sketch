window.THREE = require("three");
var glslify = require('glslify');
require("./ExplodeModifier");

export default class Dot {
  constructor(scene, camera, renderer) {

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = undefined;
    this.geometry = undefined;
    this.mesh = undefined;
    this.time = 1.0;
    this.frame = 0;
    this.total_frames = 60 * 4;
    this.canCountFrames = false;
    this.timeout = undefined;
    this.animType = 0;

    Dot.scope = this;

    this.createMesh()

    document.body.addEventListener("mousedown", this.implode.bind(this))
  } 

  createMesh() {
    var geometry = new THREE.IcosahedronGeometry(1, 6);

    var explodeModifier = new THREE.ExplodeModifier();
    explodeModifier.modify( geometry );

    var numFaces = geometry.faces.length;
    var numVertices = geometry.vertices.length

    this.geometry = new THREE.BufferGeometry().fromGeometry( geometry );
    var center = new THREE.Vector3(0,0,0);

    var displacement = new Float32Array( numFaces * 3 * 3 );
    var initPos = new Float32Array( numFaces * 3 * 3 );
    var springs = new Float32Array( numFaces * 3 * 3 );

    for ( var f = 0; f < geometry.vertices.length; f ++ ) {
      var index = 3 * f;
      initPos[ index ] = geometry.vertices[ f ].x;
      initPos[ index + 1 ] = geometry.vertices[ f ].y;
      initPos[ index + 2 ] = geometry.vertices[ f ].z;


      if(f % 3 === 0) {
        var rnd = 0.9 + (((geometry.vertices[ f ].y / 2) + (geometry.vertices[ f ].x / 2 * -1)) * -1);
      }

      if(f % 3 === 0) {
        // var d = 20 * (2 - Math.random());
        var d = (50 * Math.random());
      }

      displacement[ index      ] = d;
      displacement[ index  + 1 ] = d;
      displacement[ index  + 2 ] = d;
      
      springs[ index     ] = 0.8 + rnd;
      springs[ index + 1 ] = 0.8 + rnd;
      springs[ index + 2 ] = 0.8 + rnd;
    }

    // console.log(geometry.vertices[0].distanceTo(new THREE.Vector3(0,0,0)))

    this.geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );
    this.geometry.addAttribute( 'springs', new THREE.BufferAttribute( springs, 3 ) );
    this.geometry.addAttribute( 'initPos', new THREE.BufferAttribute( initPos, 3 ) );

    this.material = new THREE.ShaderMaterial({
      uniforms : {
        total_frames : {type: 'f', value: this.total_frames},
        v_frame      :{type: 'f', value: 0.0},
        opacity      : {type: 'f', value: 0.0},
        animType      : {type: 'f', value: 0.0}
      },
      vertexShader : glslify('./shader/vert.glsl'),
      fragmentShader : glslify('./shader/frag.glsl'),
      transparent : true
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);  
    // this.mesh.rotation.y += Math.PI

    this.implode()
  }

  implode() {
    TweenMax.killTweensOf(this.mesh.material.uniforms[ 'opacity' ]);
    this.canCountFrames = false;
    this.frame = 0;
    this.mesh.rotation.y = 0;
    this.mesh.material.uniforms[ 'opacity' ].value = 0.0;
    this.mesh.material.uniforms['v_frame'].value = this.frame;
    this.mesh.material.uniforms['animType'].value = this.animType;
    TweenMax.to(this.mesh.material.uniforms[ 'opacity' ], 2, {value:1.0, ease:Expo.easeOut})
    window.clearTimeout(this.timeout);
    this.timeout = setTimeout(()=>{
      this.canCountFrames = true;
    }, 1000)

    this.animType++;
    if(this.animType > 2)
      this.animType = 0
  }

  update() {
    if(this.canCountFrames) {
      this.frame+= 1;
      this.mesh.material.uniforms['v_frame'].value = this.frame;
    }
    if(this.mesh.rotation.y < 3.8)
      this.mesh.rotation.y += 0.02;
      
  }
}