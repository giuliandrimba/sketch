#pragma glslify: curl = require(glsl-curl-noise);

uniform vec2 positionsResolution;
uniform sampler2D positions;


void main() {
	vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
  vec4 pos = texture2D(positions, uv);

  gl_FragColor = vec4(vec2(pos.xy), 0.0, 1.0);
}