// ===== 3D SCENE SETUP =====
const canvas = document.getElementById("snakeCanvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef2f7);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== LIGHT =====
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// ===== GROUND =====
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x88aa88 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// ===== SNAKE BODY =====
const snakeSegments = [];
const segmentGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
const segmentMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });

for(let i=0; i<5; i++){
    const segment = new THREE.Mesh(segmentGeo, segmentMat);
    segment.position.set(-i, 0.5, 0);
    segment.rotation.z = Math.PI/2;
    scene.add(segment);
    snakeSegments.push(segment);
}

// ===== ANIMATION =====
let direction = new THREE.Vector3(1,0,0);
function animate() {
    requestAnimationFrame(animate);

    // Move snake forward
    const head = snakeSegments[0];
    const prevPositions = snakeSegments.map(seg => seg.position.clone());
    head.position.addScaledVector(direction, 0.05);

    // Make segments follow head
    for(let i=1; i<snakeSegments.length; i++){
        snakeSegments[i].position.lerp(prevPositions[i-1], 0.2);
    }

    renderer.render(scene, camera);
}
animate();

// ===== HANDLE RESIZE =====
window.addEventListener("resize", ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
