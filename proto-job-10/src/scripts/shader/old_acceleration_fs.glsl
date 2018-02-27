uniform vec2 positionsResolution;

void main() {
	vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
  vec3 newValue = texture2D(accelerationTexture, uv).xyz;
  gl_FragColor = vec4(vec3(newValue), 0.0);
}