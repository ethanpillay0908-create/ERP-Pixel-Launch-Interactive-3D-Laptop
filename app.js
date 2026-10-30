import * as THREE from 'https://unpkg.com/three@0.179.1/build/three.module.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x09090B);

// Clock
const clock = new THREE.Clock();

// Laptop Group
const laptop = new THREE.Group();
scene.add(laptop);
laptop.scale.set(1.6, 1.6, 1.6);
laptop.rotation.x = 0.15;

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2.5, 10);
camera.lookAt(0, 0, 0);

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

// ERP Glow

const glow = new THREE.PointLight(
    0x5EEAD4,
    120
);
const purpleGlow = new THREE.PointLight(
    0x8B5CF6,
    150
);

purpleGlow.position.set(
    2,
    0,
    1
);

scene.add(purpleGlow);

glow.position.set(
    0,
    -1,
    0
);

scene.add(glow);
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -5.5;

scene.add(floor);

// Laptop Material
// Premium Brushed Aluminium Material
const laptopMaterial = new THREE.MeshPhysicalMaterial({

    color: 0xC8D4E2,
    metalness: 0.45,
    roughness: 0.28,
    reflectivity: 1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    emissive: 0x17243A,
    emissiveIntensity: 0.12

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

const keyMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x151923,
        metalness: 0.25,
        roughness: 0.4
    });

for (let row = 0; row < 5; row++) {

    for (let col = 0; col < 14; col++) {

        const key = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.16,
                0.05,
                0.16
            ),
            keyMaterial
        );

        key.position.set(
            -1.3 + col * 0.2,
            0.13,
            -0.9 + row * 0.22
        );

        laptop.add(key);
    }
}
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
        emissive: 0xffffff,
        emissiveIntensity: 0.8,
        side: THREE.DoubleSide
    })
);

logo.position.z = 0.11;

screenGroup.add(logo);

// Position Screen

screenGroup.position.set(
    0,
    1.2,
    -1.8
);

screenGroup.rotation.x = -0.5;

laptop.add(screenGroup);

// Animation

// Animation & Smooth Controls

let isDragging = false;

let previousX = 0;
let previousY = 0;

// Target rotation
let targetRotationX = laptop.rotation.x;
let targetRotationY = laptop.rotation.y;

// Rotation smoothness
const smoothness = 0.12;

// Enable touchscreen interaction
renderer.domElement.style.touchAction = "none";

// Start dragging
renderer.domElement.addEventListener("pointerdown", (event) => {

    isDragging = true;

    previousX = event.clientX;
    previousY = event.clientY;

    renderer.domElement.setPointerCapture(event.pointerId);

});

// Stop dragging
renderer.domElement.addEventListener("pointerup", () => {

    isDragging = false;

});

renderer.domElement.addEventListener("pointercancel", () => {

    isDragging = false;

});

// Track movement
renderer.domElement.addEventListener("pointermove", (event) => {

    if (!isDragging) return;

    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;

    targetRotationY += deltaX * 0.006;
    targetRotationX += deltaY * 0.006;

    previousX = event.clientX;
    previousY = event.clientY;

});

// Animation
function animate() {

    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Floating effect
    laptop.position.y =
        -1.5 + Math.sin(time * 1.5) * 0.12;

    // Smooth rotation
    laptop.rotation.x +=
        (targetRotationX - laptop.rotation.x) * smoothness;

    laptop.rotation.y +=
        (targetRotationY - laptop.rotation.y) * smoothness;

    renderer.render(scene, camera);

}

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