// basic simulation: displays the particles in place.
uniform vec2 positionsResolution;
uniform float friction;

void main() {
	vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
    vec3 velocity = texture2D(oldVelocityTexture, uv).xyz;
    vec3 acceleration = texture2D(accelerationTexture, uv).xyz;
    velocity.x = acceleration.x;
    velocity.y = acceleration.y;
    velocity.z = acceleration.z;

    velocity *= friction;

    gl_FragColor = vec4(vec3(velocity), 0.0);
}
