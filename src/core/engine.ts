import * as THREE from 'three';
import { Camera } from './camera';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { OutputPass, RenderPass, SMAAPass } from 'three/examples/jsm/Addons.js';


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
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0x000000, 1);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;

		this.scene = new THREE.Scene();

		this.camera = new Camera();
		this.textureLoader = new THREE.TextureLoader();
		this.cubeLoader = new THREE.CubeTextureLoader();
		this.loader = new GLTFLoader();
		//this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.composer = new EffectComposer(this.renderer);
		this.composer.setSize(window.innerWidth, window.innerHeight);
		this.composer.setPixelRatio(window.devicePixelRatio);

		this.composer.addPass(new RenderPass(this.scene, this.camera, null, null, null));

		this.composer.addPass(new SMAAPass());
		this.composer.addPass(new OutputPass());
		//(this.controls as OrbitControls).enableZoom = false;
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

	render() {
		this.camera.update();
		this.camera.updateProjectionMatrix();
		for (const o of this.scene.children) {
			if (o instanceof THREE.Group) {
				//@ts-ignore
				o.render(this.camera)
			}
		}
		//this.renderer.render(this.scene, this.camera);
		this.composer.render();
	}

	dispose() {
		this.composer.dispose();
	}
}