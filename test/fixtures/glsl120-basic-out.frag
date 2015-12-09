//#gljs varname: 'glsl120_basic_in', type: 'fragment'

#version 120
uniform float inInit = 13.0;
uniform mat4x3 nonSqMat;
uniform vec4 uniInit = vec4(1.0, 2.0, 3.0, 4.0);
void main ()
{
  vec4 v_1;
  v_1.x = (1.2 + nonSqMat[0].x);
  v_1.y = 6.0;
  v_1.z = (inInit + 4.0);
  v_1.w = (-1.0 + uniInit.w);
  gl_FragColor = v_1;
}


// stats: 4 alu 0 tex 0 flow
// uniforms: 3 (total size: 0)
//  #0: inInit (high float) 1x1 [-1]
//  #1: nonSqMat (high float) 3x4 [-1]
//  #2: uniInit (high float) 4x1 [-1]
