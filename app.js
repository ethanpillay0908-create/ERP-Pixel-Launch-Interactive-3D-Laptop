import * as THREE from 'https://unpkg.com/three@0.179.1/build/three.module.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Clock
const clock = new THREE.Clock();

// Laptop Group
const laptop = new THREE.Group();
scene.add(laptop);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 10);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(
    0xffffff,
    100
);

light.position.set(7, 7, 7);

scene.add(light);

const ambient = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambient);

// Laptop Material
const laptopMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.3
    });

// Base
const base = new THREE.Mesh(
    new THREE.BoxGeometry(
        4,
        0.2,
        3
    ),
    laptopMaterial
);

laptop.add(base);

// Trackpad
const trackpad = new THREE.Mesh(
    new THREE.BoxGeometry(
        1,
        0.03,
        0.8
    ),
    new THREE.MeshStandardMaterial({
        color: 0x888888
    })
);

trackpad.position.set(
    0,
    0.12,
    0.5
);

laptop.add(trackpad);

// Screen Group
const screenGroup =
    new THREE.Group();

const screenFrame =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            4,
            2.5,
            0.15
        ),
        laptopMaterial
    );

screenGroup.add(screenFrame);

// Screen
// Screen Background

const screenBackground = new THREE.Mesh(
    new THREE.PlaneGeometry(3.7, 2.2),
    new THREE.MeshBasicMaterial({
        color: 0x111111,
        side: THREE.DoubleSide
    })
);

screenBackground.position.z = 0.09;

screenGroup.add(screenBackground);

// Logo Texture

const logoTexture = new THREE.TextureLoader().load(
    "./erplogo.jpeg",
    () => console.log("LOGO LOADED"),
    undefined,
    (err) => console.log("LOGO ERROR", err)
);

// Logo

const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 1.5),
    new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true,
        side: THREE.DoubleSide
    })
);

logo.position.z = 0.11;

screenGroup.add(logo);

// Position Screen

screenGroup.position.set(
    0,
    1.1,
    -1.14
);

screenGroup.rotation.x = -0.5;

laptop.add(screenGroup);

// Animation
function animate() {

    requestAnimationFrame(animate);

    const time =
        clock.getElapsedTime();

    // Floating effect
    laptop.position.y =
        Math.sin(time * 1.5) * 0.15;

    renderer.render(scene, camera);
}
let isDragging = false;
let previousX = 0;
let previousY = 0;

window.addEventListener("pointerdown", (event) => {

    isDragging = true;
    previousX = event.clientX;
    previousY = event.clientY;

});

window.addEventListener("pointerup", () => {

    isDragging = false;

});

window.addEventListener("pointermove", (event) => {

    if (!isDragging) return;

    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;

    laptop.rotation.y += deltaX * 0.01;
    laptop.rotation.x += deltaY * 0.01;

    previousX = event.clientX;
    previousY = event.clientY;

});
animate();

// Resize
window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);