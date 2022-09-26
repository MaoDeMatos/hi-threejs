import * as THREE from "three";
import { FlyControls } from "three/addons/controls/FlyControls";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import Stats from "three/addons/libs/stats.module";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";

import camera from "./camera";
import renderer from "./renderer";
import scene from "./scene";
import "./style.css";

let SCREEN_HEIGHT = window.innerHeight;
let SCREEN_WIDTH = window.innerWidth;

// Settings
// camera.position.set(0, 2, 3);
camera.position.set(-6, 4, 4);

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Lights
// const ambientLight = new THREE.AmbientLight(0xa0a0a0, 0.5); // soft white light
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
directionalLight.position.set(0, 8, 4);
directionalLight.target.position.set(0, 2, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dirLightHelper);

const smallPointLight = new THREE.PointLight(0xffffff, 1.2, 7);
smallPointLight.position.set(1.5, 2.5, -0.5);
scene.add(smallPointLight);

const smallPointLightHelper = new THREE.PointLightHelper(smallPointLight, 0.5);
scene.add(smallPointLightHelper);

const largePointLight = new THREE.PointLight(0xffffff, 2, 7, 1);
largePointLight.position.set(-5, 5, 3);
scene.add(largePointLight);

const largePointLightHelper = new THREE.PointLightHelper(largePointLight);
scene.add(largePointLightHelper);

// Controls
// const controls =
new OrbitControls(camera, renderer.domElement);

// controls.target.set(0, 5, 0);

// const controls = new FlyControls(camera, renderer.domElement);

// controls.movementSpeed = 1000;
// // controls.domElement = renderer.domElement;
// controls.rollSpeed = Math.PI / 24;
// controls.autoForward = false;
// controls.dragToLook = false;

/** Rendered elements */
// Plane
const planeSize = 40;

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("checker.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;

const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.FrontSide,
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = Math.PI * -0.5;
plane.position.y = -0.85;
scene.add(plane);

// Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

const defaultCube = new THREE.Mesh(cubeGeometry, cubeMaterial);

defaultCube.position.setX(3);
scene.add(defaultCube);

// // Line (Blue arrow pointing up)
// const points = [
//   new THREE.Vector3(-1, 0, 0),
//   new THREE.Vector3(0, 1, 0),
//   new THREE.Vector3(1, 0, 0),
// ];

// const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
// const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
// const line = new THREE.Line(lineGeometry, lineMaterial);
// line.position.setZ(0.5);

// scene.add(line);

// 3D Model
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  "./DragonAttenuation/DragonAttenuation.gltf",
  (gltf) => {
    gltf.scene?.traverse((c) => {
      c.castShadow = true;
    });
    scene.add(gltf.scene);
  },
  (xhr) => {
    console.info(`${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error(error);
  }
);

window.addEventListener("resize", onWindowResize);

renderer.setAnimationLoop(render);

function render(time) {
  rotateMesh(defaultCube, time);
  stats.update();

  // controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  SCREEN_HEIGHT = window.innerHeight;
  SCREEN_WIDTH = window.innerWidth;

  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}

function rotateMesh(mesh, time) {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;
}
