// basic simulation: displays the particles in place.
uniform vec2 positionsResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
    vec3 velocity = texture2D(velocityTexture, uv).xyz;
    gl_FragColor = vec4(vec3(velocity.xyz), 0.0);
}
