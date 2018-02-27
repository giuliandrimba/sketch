//float texture containing the positions of each particle
uniform sampler2D positions;
uniform vec2 positionsResolution;

//size
uniform float pointSize;
varying float colored;

void main() {
  vec2 uv = position.xy / positionsResolution.xy;
  //the mesh is a normalized square so the uvs = the xy positions of the vertices
  vec4 pos = texture2D( positions, position.xy );

  colored =  pos.w;

  //pos now contains the position of a point in space taht can be transformed
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos.xy, 1.0, 1.0 );

  gl_PointSize = 1.0;
}