import * as THREE from 'three'

const atmosphere = {
	Kr: 0.0025,
	Km: 0.0010,
	ESun: 20.0,
	g: -0.950,
	innerRadius: .100,
	outerRadius: .1025,
	wavelength: [0.650, 0.570, 0.475],
	scaleDepth: 0.25,
	mieScaleDepth: 0.1
};

const AtmUniforms = {
	v3LightPosition: {
		type: "v3",
		value: new THREE.Vector3(1, 0, 0)
	},
	cPs: {
		type: "v3",
		value: new THREE.Vector3(1, 0, 0)
	},
	v3InvWavelength: {
		type: "v3",
		value: new THREE.Vector3(1 / Math.pow(atmosphere.wavelength[0], 4), 1 / Math.pow(atmosphere.wavelength[1], 4), 1 / Math.pow(atmosphere.wavelength[2], 4))
	},
	fCameraHeight: {
		type: "f",
		value: 0
	},
	fCameraHeight2: {
		type: "f",
		value: 0
	},
	fInnerRadius: {
		type: "f",
		value: atmosphere.innerRadius
	},
	fInnerRadius2: {
		type: "f",
		value: atmosphere.innerRadius * atmosphere.innerRadius
	},
	fOuterRadius: {
		type: "f",
		value: atmosphere.outerRadius
	},
	fOuterRadius2: {
		type: "f",
		value: atmosphere.outerRadius * atmosphere.outerRadius
	},
	fKrESun: {
		type: "f",
		value: atmosphere.Kr * atmosphere.ESun
	},
	fKmESun: {
		type: "f",
		value: atmosphere.Km * atmosphere.ESun
	},
	fKr4PI: {
		type: "f",
		value: atmosphere.Kr * 4.0 * Math.PI
	},
	fKm4PI: {
		type: "f",
		value: atmosphere.Km * 4.0 * Math.PI
	},
	fScale: {
		type: "f",
		value: 1 / (atmosphere.outerRadius - atmosphere.innerRadius)
	},
	fScaleDepth: {
		type: "f",
		value: atmosphere.scaleDepth
	},
	fScaleOverScaleDepth: {
		type: "f",
		value: 1 / (atmosphere.outerRadius - atmosphere.innerRadius) / atmosphere.scaleDepth
	},
	g: {
		type: "f",
		value: atmosphere.g
	},
	g2: {
		type: "f",
		value: atmosphere.g * atmosphere.g
	},
	nSamples: {
		type: "i",
		value: 3
	},
	fSamples: {
		type: "f",
		value: 3.0
	},
	tDisplacement: {
		type: "t",
		value: 0
	},
	tSkyboxDiffuse: {
		type: "t",
		value: 0
	},
	fNightScale: {
		type: "f",
		value: 1
	}
};

const GndUniforms = {
	...AtmUniforms,
	tDiffuse: {
		type: "t",
		value: 0
	} as THREE.IUniform,
	tDiffuseNight: {
		type: "t",
		value: 0
	} as THREE.IUniform,
	tBump: {
		type: "t",
		value: 0
	} as THREE.IUniform
};


import vertexSky from "./atmosphere.vertex.glsl?raw";
import fragmentSky from "./atmosphere.frag.glsl?raw";
import vertexGround from "./ground.vertex.glsl?raw";
import fragmentGround from "./ground.frag.glsl?raw";

const MoonUniforms = { sunDirection: { value: new THREE.Vector3(1, 0, 0) } };

const vertexMoon: string = `
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentMoon: string = `
uniform sampler2D MoondayTexture;
uniform sampler2D MoonnightTexture;
uniform vec3 sunDirection;
varying vec2 vUv;
varying vec3 vNormal;
void main( void ) {
  vec3 t0 = texture2D( MoondayTexture, vUv ).rgb; // day
  vec3 t1 = texture2D( MoonnightTexture, vUv ).rgb; // night
  float NdotL = dot(normalize(vNormal), sunDirection);
  float y = smoothstep(-0.2, 0.2, NdotL);
  vec3 final_color = t0 * y + t1 * (1.0-y);
  gl_FragColor = vec4(final_color, 1.0);
}
`

export {
	AtmUniforms,
	GndUniforms,
	vertexSky,
	fragmentSky,
	vertexGround,
	fragmentGround
}