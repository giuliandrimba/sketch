uniform vec2 positionsResolution;

void main() {
	vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
  vec2 newValue = texture2D(positionsTexture, uv).xy;
  gl_FragColor = vec4(vec2(newValue), 0.0, 0.0);
}