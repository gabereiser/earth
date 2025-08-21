import * as THREE from 'three';
import './style.css'

import { Engine } from './core/engine';
import { Planet } from './planets/planet';

import { setupControls, setupTouchControls } from './controls/orbit';

const engine = new Engine();
const clock = new THREE.Clock();

// right-handed coordinates means z is *facing* you. y is up. x is right.
const stars = engine.cubeLoader.load([
  "skybox/right.png", //px
  "skybox/left.png", //-px
  "skybox/top.png", //py
  "skybox/bottom.png", //-py
  "skybox/back.png", //pz
  "skybox/front.png" //-pz
], (texture) => {
  engine.scene.background = texture;
});
const diffuse = engine.textureLoader.load(
  "planets/earth/8k_earth_daymap.jpg"
  , (t) => {
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
  });
const emissive = engine.textureLoader.load(
  "planets/earth/8k_earth_nightmap.jpg"
  , (t) => {
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
  });
const clouds = engine.textureLoader.load(
  "planets/earth/8k_earth_clouds.png"
  , (t) => {
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
  })
const maxAnisotropy = engine.renderer.capabilities.getMaxAnisotropy();
stars.anisotropy = maxAnisotropy;
diffuse.anisotropy = maxAnisotropy;
emissive.anisotropy = maxAnisotropy;

const ambient = new THREE.AmbientLight(0x000000); // space is black yo
engine.scene.add(ambient);

const sun = new THREE.PointLight(0xffffff, 1);
sun.position.x = 1; // this is also set in the shaders uniforms, must always be normalized
engine.scene.add(sun);


const planet = new Planet(diffuse, emissive, clouds)
planet.build();

engine.scene.add(planet);

engine.camera = setupControls(engine.camera);
engine.camera = setupTouchControls(engine.camera);

engine.camera.position.z = 1.25;

planet._ground_update(engine.camera);
planet._atmosphere_update(engine.camera);

window.addEventListener("resize", (_: UIEvent) => { engine.resize(); });

const render = () => {
  engine.render();
  planet.update(clock.getDelta());
  planet._ground_update(engine.camera);
  planet._atmosphere_update(engine.camera);

}
engine.renderer.setAnimationLoop(render);
