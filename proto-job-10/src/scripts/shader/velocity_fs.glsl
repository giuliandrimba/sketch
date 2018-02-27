// basic simulation: displays the particles in place.
uniform vec2 positionsResolution;
uniform float friction;
uniform vec2 mousePos;
uniform float radius;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
    vec4 oldVelocity = texture2D(accelerationTexture, uv);
    vec4 pos = texture2D(oldPositionTexture, uv);
    vec3 velocity = vec3(0.0);
    vec4 acceleration = texture2D(accelerationTexture, uv);
    velocity.z = acceleration.z;

    velocity.x = oldVelocity.x + acceleration.x;
    velocity.y = oldVelocity.y + acceleration.y;
    velocity *= friction;


    gl_FragColor = vec4(vec3(velocity), acceleration.w);
}