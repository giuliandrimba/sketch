uniform sampler2D positions;
uniform vec2 positionsResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
  vec4 currentPosition = texture2D(oldPositionTexture, uv);
  vec4 velocity = texture2D(velocityTexture, uv);

  vec3 newPos = currentPosition.xyz + velocity.xyz * .2;

  gl_FragColor = vec4(vec3(newPos.xyz), 1.0);
}
