#pragma glslify: curl = require(glsl-curl-noise);

uniform float speed;
uniform float spring;
uniform float radius;
uniform float friction;
uniform float movement;
uniform vec3 movementDir;
uniform float time;
uniform vec3 mousePos;
uniform vec3 oldMouse;
uniform vec2 positionsResolution;
uniform vec2 windowResolution;

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float sdCapsule( vec2 p, vec2 a, vec2 b, float r ) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float sdSphere( vec3 p, float s )
{
  return length( p ) - s;
}

float sdCappedCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}


void main() {
	vec2 uv = gl_FragCoord.xy / positionsResolution.xy;
  vec4 initPos = texture2D(initPosTexture, uv);
  vec4 pos = texture2D(oldPositionTexture, uv);
  vec3 oldVelocity = texture2D(oldVelocityTexture, uv).xyz;
  vec3 initPosition = initPos.xyz;
  float noise = snoise(vec2(initPos.x * 5.0, initPos.y * 5.0));

  vec3 newPos = curl(initPos.xyz + time) * radius + (noise * 10.0);
  newPos.z = 0.0;
  vec3 target = newPos;

  float dist;
	vec3 dir; // direction
	float distSquared;
  float f;
	float percent;

  vec3 velocity = oldVelocity.xyz;


  float dx = target.x - pos.x;
  float dy = target.y - pos.y;
  float dz = target.z - pos.z;


  float ax = dx * spring;
  float ay = dy * spring;
  float az = dz * spring;

  dir = (mousePos - target.xyz) * 0.1;
  dir.z = 0.0;
  dist = length( dir );
  distSquared = dist * dist;
  float preyRadius = 150.0;
  float preyRadiusSq = preyRadius * preyRadius;
  vec3 acc = vec3(ax, ay, az);

  if (dist < preyRadius) {
    f = ( distSquared / preyRadiusSq - 1.0 ) * 100.;
    velocity = normalize( dir ) * f;
    acc += velocity;
  }

  gl_FragColor = vec4(acc, 1.0);
}
