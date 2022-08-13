import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
//import * as dat from "dat.gui";
import { getCoordinatesByIP } from "./utils/getLocationByIp";

//Loading
const textureLoader = new THREE.TextureLoader();

const normalTexture = textureLoader.load("public/textures/earth.jpg");

// Debug
//const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.sphere") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereGeometry(1, 64, 32);

// Materials

const material = new THREE.MeshStandardMaterial({
  map: normalTexture,
});

material.color = new THREE.Color(0x292929);

// Mesh
const sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);

// Lights
const pointLight = new THREE.AmbientLight(0xfffffff, 5);
pointLight.castShadow = false;
scene.add(pointLight);

//Location Point
let LocationPoint = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.01, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

const setLocation = async () => {
  const coordinates = await getCoordinatesByIP();
  LocationPoint.position.set(coordinates!.x, coordinates!.y, coordinates!.z);
};
setLocation();

sphere.add(LocationPoint);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;

scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const controls = new TrackballControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 5;

document.addEventListener("mousedown", dragGlobe);
document.addEventListener("mouseup", leaveGlobe);

let letRot = false;

function dragGlobe() {
  letRot = true;
}

function leaveGlobe() {
  letRot = false;
}

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  if (letRot) {
    clock.stop();
  } else {
    sphere.rotation.y = 0.1 * elapsedTime;
    clock.running = true;
  }

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
