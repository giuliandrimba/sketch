uniform float opacity;
varying float vOpacity;

void main()
{  
    gl_FragColor = vec4(1.0,0.0,0.0,1.0 - vOpacity);
}
