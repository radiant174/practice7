

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05060f);           

const camera = new THREE.PerspectiveCamera(
  50,                                    
  window.innerWidth / window.innerHeight, 
  0.1,                                 
  3000                                  
);
camera.position.set(0, 22, 48);       
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const starCount = 2200;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const radius = 320 + Math.random() * 420;           
  const theta = Math.random() * Math.PI * 2;            
  const phi = Math.acos(Math.random() * 2 - 1);          
  starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = radius * Math.cos(phi);
  starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: true });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


scene.add(new THREE.AmbientLight(0xffffff, 0.25));


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

renderer.render(scene, camera);
