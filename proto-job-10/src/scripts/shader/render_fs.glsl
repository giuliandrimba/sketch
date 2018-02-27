uniform sampler2D positions;
uniform sampler2D gradient;
uniform vec2 positionsResolution;
uniform vec2 colorResolution;
uniform vec2 windowResolution;
varying float colored;
uniform float time;

float rand(vec2 n)
{
  return 0.5 + 0.5 * fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

void main()
{
  vec2 st = gl_FragCoord.xy/colorResolution;

  float x = st.x + (cos(time * 2.) - 1.0) + 0.5;
  float y = st.y + (sin(time * 2.) - 1.0) + 1.5;

  vec3 gradientColor = texture2D(gradient, vec2(x, y)).xyz;
  vec3 color = vec3(1.0);
  float intensity = 1. - colored;
  color = vec3(gradientColor.x, gradientColor.y, gradientColor.z);
  color += ((1. - color) * intensity);
  gl_FragColor = vec4(vec3(color), 1.0);

}