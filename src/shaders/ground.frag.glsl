uniform float fNightScale;
uniform vec3 v3LightPosition;
uniform sampler2D tDiffuse;
uniform sampler2D tDiffuseNight;
uniform sampler2D tBump;
varying vec3 c0;
varying vec3 c1;
varying vec3 vNormal;
varying vec2 vUv;
varying mat3 TBN;

void main (void)
{
  vec3 diffuseTex = texture2D( tDiffuse, vUv ).xyz;
  vec3 normalTex = normalize(TBN * texture2D( tBump, vUv ).rgb * 2.0 - 1.0);
  vec3 diffuseNightTex = texture2D( tDiffuseNight, vUv ).xyz;
  float lf = max(dot(normalTex, normalize(-v3LightPosition)), 0.0);
  vec3 day = diffuseTex * c0;
  vec3 night = 2.0 * diffuseNightTex  * ((1.0) - c0);
  gl_FragColor = vec4(c1, 1.0) + vec4(day + night, 1.0) * (lf*2.0);
}