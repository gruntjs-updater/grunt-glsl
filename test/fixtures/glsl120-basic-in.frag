//#gljs varname: 'glsl120_basic_in', type: 'fragment'

#version 120

uniform float inInit = 13.0; // accept uniform initializers
uniform mat4x3 nonSqMat; // non square matrices
uniform vec4 uniInit = vec4(1.0,2.0,3.0,4.0);

void main()
{
	const float cosPI = cos(3.1415); // built-in calls in constant initializers

	vec4 v;
	v.x = 1.2f; // accepts 'f' suffix
	v.y = 5; // automatic int-to-float
	v.z = inInit;
	v.w = cosPI;
	v.x += nonSqMat[0][0];

	float arr[4] = float[](1,2,3,4); // array initializer
	v.y += arr[0];
	v.z += arr.length(); // array length

	v.w += uniInit.w;

    gl_FragColor = v;
}
