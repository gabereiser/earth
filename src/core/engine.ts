import * as THREE from 'three';
import { Camera } from './camera';
import { EffectComposer, SMAAPreset, ToneMappingMode } from 'postprocessing';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ToneMappingEffect, EffectPass, RenderPass, SMAAEffect } from 'postprocessing';
import { Planet } from '../planets/planet';

export class Engine {
	loader: GLTFLoader
	cubeLoader: THREE.CubeTextureLoader
	textureLoader: THREE.TextureLoader
	controls?: THREE.Controls<any>

	camera: Camera
	renderer: THREE.WebGLRenderer

	scene: THREE.Scene
	composer: EffectComposer

	constructor() {
		this.renderer = new THREE.WebGLRenderer({ antialias: false, stencil: false, depth: false });
		this.renderer.setClearColor(0x000000, 1);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

		this.scene = new THREE.Scene();

		this.camera = new Camera();
		this.textureLoader = new THREE.TextureLoader();
		this.cubeLoader = new THREE.CubeTextureLoader();
		this.loader = new GLTFLoader();
		//this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.composer = new EffectComposer(this.renderer, {
			frameBufferType: THREE.HalfFloatType
		});
		this.composer.setSize(window.innerWidth, window.innerHeight);

		this.composer.addPass(new RenderPass(this.scene, this.camera));

		this.composer.addPass(new EffectPass(this.camera, new ToneMappingEffect({
			adaptive: true,
			mode: ToneMappingMode.REINHARD2_ADAPTIVE,
			resolution: 1.0,
			whitePoint: 0xffffff,
			middleGrey: 0x888888,
			adaptationRate: 0.9
		}), new SMAAEffect({
			preset: SMAAPreset.MEDIUM
		})));

		document.body.appendChild(this.renderer.domElement)
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.composer.setSize(window.innerWidth, window.innerHeight);

		this.render();
	}

	getControls(): THREE.Controls<any> {
		return this.controls!;
	}

	setControls(controls: OrbitControls | THREE.Controls<any>) {
		this.controls = controls;
	}
	update() {
		this.camera.orbitX(0.0001);
		this.camera.update();
		this.camera.updateProjectionMatrix();
	}
	render() {
		this.camera.update();
		this.camera.updateProjectionMatrix();
		this.composer.render();

	}

	dispose() {
		this.composer.dispose();
	}
}