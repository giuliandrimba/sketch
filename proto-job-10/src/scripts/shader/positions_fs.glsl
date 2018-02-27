uniform sampler2D positions;
uniform vec2 positionsResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
  vec4 currentPosition = texture2D(oldPositionTexture, uv);
  vec4 velocity = texture2D(velocityTexture, uv);

  vec2 newPos = currentPosition.xy + (velocity.xy * (velocity.z));

  gl_FragColor = vec4(vec3(newPos.xy, 0.0), velocity.w);
}