import * as THREE from 'three';
import { Camera } from '../core/camera.ts';
import { AtmUniforms, GndUniforms, vertexSky, fragmentSky, vertexGround, fragmentGround } from '../shaders/shaders.ts'


function mag(r: number[]) {
	return Math.pow(Math.pow(r[0], 2) + Math.pow(r[1], 2) + Math.pow(r[2], 2), .5)
};

export class Planet extends THREE.Group {
	mesh?: THREE.Mesh
	clouds?: THREE.Mesh
	atmosphere?: THREE.Mesh
	material?: THREE.ShaderMaterial
	cloudMaterial?: THREE.MeshStandardMaterial
	atmosphereMaterial?: THREE.ShaderMaterial

	diffuse: THREE.Texture
	emissive?: THREE.Texture
	cloudAlpha?: THREE.Texture

	time: number;
	constructor(diffuse: THREE.Texture, emissive?: THREE.Texture, clouds?: THREE.Texture) {
		super();
		this.diffuse = diffuse;
		this.emissive = emissive;
		this.cloudAlpha = clouds;
		this.time = 0;
	}

	_ground_update(camera: Camera) {
		const r_group = [this.position.x, this.position.y, this.position.z];
		const r_group_cam = [camera.position.x - r_group[0]!, camera.position.y - r_group[1]!, camera.position.z - r_group[2]!];
		const r_mag = mag(r_group_cam);
		this.material!.uniforms.cPs.value = r_group_cam; //camera position relative to object position. e.g. normalized camera position.
		this.material!.uniforms.fCameraHeight.value = r_mag;
		this.material!.uniforms.fCameraHeight2.value = r_mag * r_mag;
		this.material!.uniforms.v3LightPosition.value = new THREE.Vector3(1, 0, 0);
		this.material!.uniforms.time.value = this.time;
	}

	_atmosphere_update(camera: Camera) {
		const r_group = [this.position.x, this.position.y, this.position.z];
		const r_group_cam = [camera.position.x - r_group[0]!, camera.position.y - r_group[1]!, camera.position.z - r_group[2]!];
		const r_mag = mag(r_group_cam);
		this.atmosphereMaterial!.uniforms.cPs.value = r_group_cam; //camera position relative to object position. e.g. normalized camera position.
		this.atmosphereMaterial!.uniforms.fCameraHeight.value = r_mag;
		this.atmosphereMaterial!.uniforms.fCameraHeight2.value = r_mag * r_mag;
		this.atmosphereMaterial!.uniforms.v3LightPosition.value = new THREE.Vector3(1, 0, 0)
	}

	build(radius = .1) {
		GndUniforms.tDiffuse = { type: "t", value: this.diffuse } as THREE.IUniform;
		GndUniforms.tDiffuseNight = { type: "t", value: this.emissive } as THREE.IUniform;

		this.material = new THREE.ShaderMaterial({
			uniforms: GndUniforms,
			vertexShader: vertexGround,
			fragmentShader: fragmentGround,
			side: THREE.FrontSide,
			depthWrite: true,
			lights: false,
		});
		this.cloudMaterial = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			map: this.cloudAlpha,
			alphaMap: this.cloudAlpha,
			bumpMap: this.cloudAlpha,
			bumpScale: 16.0,
			transparent: true,
			depthWrite: false,
			dithering: true,
			blending: THREE.CustomBlending,
			blendColor: 0xffffff,
			blendEquation: THREE.AddEquation,
			blendSrc: THREE.SrcAlphaFactor,
			blendDst: THREE.OneFactor,
			blendSrcAlpha: THREE.SrcAlphaFactor,
			blendDstAlpha: THREE.OneFactor

		})
		this.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(radius, 64, 128),
			this.material
		);
		this.mesh?.geometry.computeTangents();

		this.clouds = new THREE.Mesh(
			new THREE.SphereGeometry(radius * 1.0025, 64, 128),
			this.cloudMaterial
		);
		this.clouds?.geometry.computeTangents();
		this.atmosphereMaterial = new THREE.ShaderMaterial({
			uniforms: AtmUniforms,
			vertexShader: vertexSky,
			fragmentShader: fragmentSky,
			side: THREE.BackSide,
			transparent: true,
			depthWrite: true,
			lights: false,
		});
		this.atmosphere = new THREE.Mesh(
			new THREE.SphereGeometry(radius * 1.005, 64, 128),
			this.atmosphereMaterial
		);
		this.atmosphere?.geometry.computeTangents();
		this.add(this.mesh);
		this.add(this.clouds);
		this.add(this.atmosphere);
	}

	update(dt: number) {
		this.time += dt;
		// we don't rotate the planet mesh
		// instead we shift the texture uv's.
		// this is due to an issue with the shader and the modelViewMatrix
		this.clouds?.rotateY(0.00002);
	}

	dispose() {
		this.material?.dispose();
		this.atmosphereMaterial?.dispose();
		this.cloudMaterial?.dispose();
		this.clouds?.geometry.dispose();
		this.atmosphere?.geometry.dispose();
		this.mesh?.geometry.dispose();
	}

}