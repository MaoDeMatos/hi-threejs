import * as THREE from "three";

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#app").appendChild(renderer.domElement);

export default renderer;
