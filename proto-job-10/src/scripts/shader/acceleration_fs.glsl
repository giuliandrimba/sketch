#pragma glslify: curl = require(glsl-curl-noise);

uniform float speed;
uniform float spring;
uniform float radius;
uniform float friction;
uniform float time;
uniform float delta;
uniform vec2 mousePos;
uniform vec2 positionsResolution;
uniform vec2 windowResolution;
uniform float repulseRadius;

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}


void main() {
	vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
  vec4 initPos = texture2D(initPosTexture, uv);
  vec4 pos = texture2D(oldPositionTexture, uv);
  vec2 initPosition = initPos.xy;

  vec3 newPos = curl(initPos.xyz + time).xyz * radius;
  vec3 delay = curl(initPos.xyz).xyz;
  vec3 target = newPos;

  float dx;
  float dy;
  vec2 dir; // direction
  float f;
  float distSquared;
  dir = mousePos - pos.xy;
  float dist = length( dir );
  distSquared = dist * dist;
  float lMouse = length(mousePos);

  float preyRadius = repulseRadius + dist / 2.0;
  float preyRadiusSq = preyRadius * preyRadius;
  float colored = 0.0;
  target.z = 0.0;
  float outside = 0.2;


  dx = target.x - pos.x;
  dy = target.y - pos.y;

  float capsule = sdCapsule(vec3(mousePos.xy, 0.), vec3(mousePos.xy,0.) + 1.1, vec3(mousePos.xy,0.) - 1.1, 10.);
  
  if (dist < preyRadius) {
    f = ( distSquared / (preyRadiusSq) - 1.0 ) * 100.;
    vec2 velocity = normalize( dir ) * f;
    target.x += velocity.x;
    target.y += velocity.y;
    target.z = 1.0;

    dx = target.x - pos.x;
    dy = target.y - pos.y;
  }

  float ax = dx * spring;
  float ay = dy * spring;

  float diff = preyRadius * 0.2;

  if (dist < (preyRadius * 0.8)) {
    float minDist = max(preyRadius * 0.6, dist);
    colored = 1.0 - ( (minDist - (preyRadius * 0.6)) / ((preyRadius * 0.8) - (preyRadius * 0.6)));
  }

  gl_FragColor = vec4(vec2(ax, ay), outside, colored);
}
