import * as THREE from 'three';
import './style.css'

import { Engine } from './core/engine';
import { Planet } from './planets/earth';

import { setupControls, setupTouchControls } from './controls/orbit';

const engine = new Engine();
const clock = new THREE.Clock();

// right-handed coordinates means z is *facing* you. y is up. x is right.
const stars = engine.cubeLoader.load([
  "skybox/right.png", //px
  "skybox/left.png", //-px
  "skybox/top.png", //py
  "skybox/bottom.png", //-py
  "skybox/front.png", //pz
  "skybox/back.png" //-pz
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
  "planets/earth/16k_earth_clouds.png"
  , (t) => {
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
  });


const maxAnisotropy = engine.renderer.capabilities.getMaxAnisotropy();
stars.anisotropy = maxAnisotropy;
diffuse.anisotropy = maxAnisotropy;
emissive.anisotropy = maxAnisotropy;

const ambient = new THREE.AmbientLight(0x000000); // space is black yo
engine.scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 3.5);
sun.position.x = 1; // this is also set in the shaders uniforms, must always be normalized
sun.position.y = 0;
sun.position.z = 0;
sun.castShadow = true;
sun.shadow.autoUpdate = true;
engine.scene.add(sun);


const planet = new Planet(diffuse, emissive, clouds)
planet.build();
sun.target = planet;
engine.scene.add(planet);

engine.camera = setupControls(engine.camera);
engine.camera = setupTouchControls(engine.camera);

engine.camera.position.z = 1.25;

planet._ground_update(engine.camera);
planet._atmosphere_update(engine.camera);

window.addEventListener("resize", (_: UIEvent) => { engine.resize(); });

const render = () => {
  engine.render();
  // three.js needs a dedicated update override, till then...
  planet.update(clock.getDelta(), engine.camera);
}
engine.renderer.setAnimationLoop(render);
const transitionDiv = document.createElement("div");
document.body.appendChild(transitionDiv);

transitionDiv.id = "transition";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Done");
  setTimeout(() => { engine.bgm.play(); }, 5000);
  transitionDiv.classList.add("invisible");
})


