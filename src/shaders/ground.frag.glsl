uniform float fNightScale;
uniform vec3 v3LightPosition;
uniform sampler2D tDiffuse;
uniform sampler2D tDiffuseNight;
varying vec3 c0;
varying vec3 c1;
varying vec3 vNormal;
varying vec2 vUv;

void main (void)
{
  // earf
  vec3 diffuseTex = texture2D( tDiffuse, vUv ).xyz;
  // earth at night
  vec3 diffuseNightTex = texture2D( tDiffuseNight, vUv ).xyz;
  // earth with atmosphric attenuation
  vec3 day = diffuseTex * c0;
  // the meridian line where the day meets the night * a scale you choose to tighten or loosed the band.
  float meridian = dot(vNormal, -v3LightPosition) * fNightScale;
  // earth at night with atmospheric attenuation and meridian calculation
  vec3 night = 1.0 * diffuseNightTex  * ((1.0) - c0) * meridian;
  // final result is atmos factor + day + night;
  gl_FragColor = vec4(c1, 1.0) + vec4(day + night, 1.0);
}