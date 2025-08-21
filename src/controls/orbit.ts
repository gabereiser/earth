import * as THREE from 'three';
import { Camera } from '../core/camera';

let mp_refx: number = 0, mp_refy: number = 0, eci: boolean = true, isClicking: boolean = false;

const pi_over2 = Math.PI / 2, mouse: THREE.Vector2 = new THREE.Vector2();

export function setupControls(camera: Camera): Camera {
	document.addEventListener('mousedown', (e: MouseEvent) => {
		mp_refx = (e.clientX / innerWidth) * 2 - 1;
		mp_refy = (e.clientY / innerHeight) * 2 + 1;
		isClicking = true;
	});
	document.addEventListener('mousemove', (e: MouseEvent) => {
		const innermx = (e.clientX / innerWidth) * 2 - 1;

		const innermy = - (e.clientY / innerHeight) * 2 - 1;
		mouse.x = innermx; mouse.y = innermy + 2;
		if (isClicking) {
			camera.mpx -= (mp_refx - innermx) / 25;
			if (Math.abs(camera.mpy) < pi_over2 * .98) { camera.mpy -= (mp_refy + innermy) / 25; }
			else {
				if (camera.mpy < -pi_over2 * .98) { if ((mp_refy + innermy) < 0) { camera.mpy -= (mp_refy + innermy) / 25; } }
				else { if ((mp_refy + innermy) > 0) { camera.mpy -= (mp_refy + innermy) / 25; } }
			};
		};
	});
	document.addEventListener('mouseup', (_: MouseEvent) => { if (isClicking) { isClicking = false; }; });
	document.addEventListener('wheel', (event) => {
		if (camera.cam_mag < 12) {
			if (camera.cam_mag > .105) { camera.cam_mag += Math.pow(camera.cam_mag, 1.5) * event.deltaY / (20000); }
			else { if (event.deltaY > 0) { camera.cam_mag += Math.pow(camera.cam_mag, 1.5) * event.deltaY / (20000); } }
		}
		else { if (event.deltaY < 0) { camera.cam_mag += Math.pow(camera.cam_mag, 1.5) * event.deltaY / (20000); }; };
	});
	return camera;
}
let lastZoomTouch: Touch | null;
export function setupTouchControls(camera: Camera): Camera {
	document.addEventListener("touchcancel", (_: TouchEvent) => {
		isClicking = false;
	});
	document.addEventListener("touchend", (e: TouchEvent) => {
		if (e.touches.length > 1) {
			lastZoomTouch = null;
		} else {
			isClicking = false;
		}
	});
	document.addEventListener("touchstart", (e: TouchEvent) => {
		if (e.touches.length > 1) {
			//we are scrolling/zooming
			const event = e.touches.item(0);
			if (lastZoomTouch == null) {
				lastZoomTouch = event!;
			}
		} else {
			const event = e.touches.item(0);
			mp_refx = (event!.clientX / innerWidth) * 2 - 1;
			mp_refy = (event!.clientY / innerHeight) * 2 + 1;
			isClicking = true;
		}
	});
	document.addEventListener("touchmove", (e: TouchEvent) => {
		if (e.touches.length > 1) {
			// we are scrolling/zooming
			const event = e.touches.item(0);
			const delta = new THREE.Vector2(event!.clientX - lastZoomTouch!.clientX, event!.clientY - lastZoomTouch!.clientY);
			if (camera.cam_mag < 12) {
				if (camera.cam_mag > .105) { camera.cam_mag += Math.pow(camera.cam_mag, 1.5) * delta.y / (20000); }
				else { if (delta.y > 0) { camera.cam_mag += Math.pow(camera.cam_mag, 1.5) * delta.y / (20000); } }
			}
			else { if (delta.y < 0) { camera.cam_mag += Math.pow(camera.cam_mag, 1.5) * delta.y / (20000); }; };
			lastZoomTouch = event!
		} else {
			const event = e.touches.item(0);
			const innermx = (event!.clientX / innerWidth) * 2 - 1;
			const innermy = - (event!.clientY / innerHeight) * 2 - 1;
			mouse.x = innermx; mouse.y = innermy + 2;
			if (isClicking) {
				camera.mpx -= (mp_refx - innermx) / 25;
				if (Math.abs(camera.mpy) < pi_over2 * .98) { camera.mpy -= (mp_refy + innermy) / 25; }
				else {
					if (camera.mpy < -pi_over2 * .98) { if ((mp_refy + innermy) < 0) { camera.mpy -= (mp_refy + innermy) / 25; } }
					else { if ((mp_refy + innermy) > 0) { camera.mpy -= (mp_refy + innermy) / 25; } }
				};
			};
		}
	});
	// disable gestures to prevent mobile devices from fucking with the view.
	document.addEventListener("gesturestart", function (e) {
		e.preventDefault();
	});

	document.addEventListener("gesturechange", function (e) {
		e.preventDefault();
	});

	document.addEventListener("gestureend", function (e) {
		e.preventDefault();
	});
	return camera;
}