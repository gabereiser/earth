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
	normal?: THREE.Texture
	cloudAlpha?: THREE.Texture
	constructor(diffuse: THREE.Texture, emissive?: THREE.Texture, normal?: THREE.Texture, clouds?: THREE.Texture) {
		super();
		this.diffuse = diffuse;
		this.emissive = emissive;
		this.normal = normal;
		this.cloudAlpha = clouds;
	}
	_ground_update(camera: Camera) {
		const r_group = [this.mesh!.position.x, this.mesh!.position.y, this.mesh!.position.z];
		const r_group_cam = [camera.position.x - r_group[0]!, camera.position.y - r_group[1]!, camera.position.z - r_group[2]!];
		const r_mag = mag(r_group_cam);
		this.material!.uniforms.cPs.value = r_group_cam; //camera position relative to object position. e.g. normalized camera position.
		this.material!.uniforms.fCameraHeight.value = r_mag;
		this.material!.uniforms.fCameraHeight2.value = r_mag * r_mag;
	}

	_atmosphere_update(camera: Camera) {
		const r_group = [this.atmosphere!.position.x, this.atmosphere!.position.y, this.atmosphere!.position.z];
		const r_group_cam = [camera.position.x - r_group[0]!, camera.position.y - r_group[1]!, camera.position.z - r_group[2]!];
		const r_mag = mag(r_group_cam);
		this.atmosphereMaterial!.uniforms.cPs.value = r_group_cam; //camera position relative to object position. e.g. normalized camera position.
		this.atmosphereMaterial!.uniforms.fCameraHeight.value = r_mag;
		this.atmosphereMaterial!.uniforms.fCameraHeight2.value = r_mag * r_mag;
	}
	build(radius = .1) {
		GndUniforms.tDiffuse = { type: "t", value: this.diffuse } as THREE.IUniform;
		GndUniforms.tDiffuseNight = { type: "t", value: this.emissive } as THREE.IUniform;
		GndUniforms.tBump = { type: "t", value: this.normal } as THREE.IUniform;

		this.material = new THREE.ShaderMaterial({
			uniforms: GndUniforms,
			vertexShader: vertexGround,
			fragmentShader: fragmentGround,
			depthWrite: true,
			lights: false,
		});
		this.cloudMaterial = new THREE.MeshStandardMaterial({
			alphaMap: this.cloudAlpha,
			transparent: true,
			depthWrite: false,
			blending: THREE.CustomBlending,
			blendSrc: THREE.SrcAlphaFactor,
			blendDst: THREE.DstColorFactor,
			lights: false,

		})
		this.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(radius, 64, 128),
			this.material
		);
		this.mesh!.geometry.computeTangents();

		this.clouds = new THREE.Mesh(
			new THREE.SphereGeometry(radius * 1.005, 64, 128),
			this.cloudMaterial
		);
		this.atmosphereMaterial = new THREE.ShaderMaterial({
			uniforms: AtmUniforms,
			vertexShader: vertexSky,
			fragmentShader: fragmentSky,
			side: THREE.BackSide,
			transparent: true,
			depthWrite: false,
			lights: false,
		});
		this.atmosphere = new THREE.Mesh(
			new THREE.SphereGeometry(radius * 1.025, 500, 500),
			this.atmosphereMaterial
		);
		//this.mesh.rotateX(0.29); // earth has a tilt positive in the summer, negative in the winter.
		this.add(this.mesh);
		this.add(this.clouds);
		this.add(this.atmosphere);
	}

	render(camera: Camera) {
		this._atmosphere_update(camera);
		//this.mesh?.rotateY(0.0001)
		//this.clouds?.rotateY(0.00012);
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