import * as THREE from 'three';


export class Camera extends THREE.PerspectiveCamera {

	cam_mag: number = 1.250;
	mpx: number = 0;
	mpy: number = 0;

	constructor() {
		super(15, window.innerWidth / window.innerHeight, 0.01, 1000)
	}

	update() {
		this.position.z = this.cam_mag * Math.cos(this.mpx) * Math.cos(this.mpy);
		this.position.x = -this.cam_mag * Math.sin(this.mpx) * Math.cos(this.mpy);
		this.position.y = this.cam_mag * Math.sin(this.mpy);
		this.lookAt(0, 0, 0);
	}

	orbitX(angle: number) {
		this.mpx += angle;
	}
}