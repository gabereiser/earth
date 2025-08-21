import * as THREE from 'three';
import './style.css'

import { Engine } from './core/engine';
import { Planet } from './planets/planet';

import { setupControls } from './controls/orbit';

const engine = new Engine();
const stars = engine.cubeLoader.load([
  "skybox/right.png",
  "skybox/left.png",
  "skybox/top.png",
  "skybox/bottom.png",
  "skybox/front.png",
  "skybox/back.png"
], (texture) => {
  engine.scene.background = texture;
});
const diffuse = engine.textureLoader.load(
  "planets/earth/8k_earth_daymap.jpg"
);
const normal = engine.textureLoader.load(
  "planets/earth/8k_earth_normal_map.tif"
);
const specular = engine.textureLoader.load(
  "planets/earth/8k_earth_specular_map.tif"
);
const emissive = engine.textureLoader.load(
  "planets/earth/8k_earth_nightmap.jpg"
);
const clouds = engine.textureLoader.load(
  "planets/earth/8k_earth_clouds.png"
)
const maxAnisotropy = engine.renderer.capabilities.getMaxAnisotropy();
diffuse.anisotropy = maxAnisotropy;
emissive.anisotropy = maxAnisotropy;

const ambient = new THREE.AmbientLight(0x000000);
engine.scene.add(ambient);

const sun = new THREE.PointLight(0xffffff, 1);
sun.position.x = 1;
engine.scene.add(sun);
const planet = new Planet(diffuse, emissive, normal, clouds)
planet.build();

engine.scene.add(planet);

engine.camera = setupControls(engine.camera);
engine.camera.position.z = 1.25;

window.addEventListener("resize", (_: UIEvent) => { engine.resize(); });

const render = () => {
  engine.render();
  engine.camera.orbitX(0.001);
}
engine.renderer.setAnimationLoop(render);
