
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

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3.2, 48, 48),
  new THREE.MeshBasicMaterial({ color: 0xffcc33 })
);
scene.add(sun);

const sunGlow = new THREE.Mesh(
  new THREE.SphereGeometry(3.9, 48, 48),
  new THREE.MeshBasicMaterial({ color: 0xffaa22, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending })
);
scene.add(sunGlow);

const sunLight = new THREE.PointLight(0xffd9a0, 2.2, 0, 0);
scene.add(sunLight);


const planetData = [
  { radius: 0.45, distance: 6.2, color: 0x9e9e9e, angle: 0.4 },
  { radius: 0.72, distance: 8.8, color: 0xe0a75c, angle: 2.1 },
  { radius: 0.85, distance: 11.8, color: 0x3d7fd1, angle: 3.6 },
  { radius: 0.62, distance: 14.8, color: 0xc1440e, angle: 5.2 },
  { radius: 1.55, distance: 19.5, color: 0xd9b38c, angle: 0.9 },
  { radius: 1.28, distance: 24.5, color: 0xe3d9a5, angle: 2.8, ring: true },
  { radius: 0.98, distance: 29.5, color: 0x8fd6e0, angle: 4.4 }
];

const planets = [];

planetData.forEach((data, index) => {
  const pivot = new THREE.Group();
  pivot.rotation.y = data.angle;

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(data.radius, 32, 32),
    new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.85, metalness: 0.1 })
  );
  mesh.position.x = data.distance;
  mesh.rotation.z = 0.2;
  pivot.add(mesh);

  if (data.ring) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(data.radius * 1.8, 0.16, 2, 64),
      new THREE.MeshStandardMaterial({ color: 0xd8c98a, roughness: 0.7 })
    );
    ring.position.x = data.distance;
    ring.rotation.x = -Math.PI / 2 + 0.3;
    pivot.add(ring);
  }

  const orbitPoints = [];
  for (let k = 0; k <= 128; k++) {
    const a = (k / 128) * Math.PI * 2;
    orbitPoints.push(new THREE.Vector3(Math.cos(a) * data.distance, 0, Math.sin(a) * data.distance));
  }
  const orbit = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(orbitPoints),
    new THREE.LineBasicMaterial({ color: 0x2a3f5f, transparent: true, opacity: 0.7 })
  );
  scene.add(orbit);

  scene.add(pivot);
  planets.push({ pivot: pivot, mesh: mesh, orbitSpeed: 0.02 / (index + 1), spinSpeed: 0.006 / (index * 0.5 + 1) });
});


const beltCount = 900;
const beltPositions = new Float32Array(beltCount * 3);
for (let i = 0; i < beltCount; i++) {
  const a = Math.random() * Math.PI * 2;
  const r = 16.4 + Math.random() * 1.6;
  beltPositions[i * 3] = Math.cos(a) * r;
  beltPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
  beltPositions[i * 3 + 2] = Math.sin(a) * r;
}
const beltGeometry = new THREE.BufferGeometry();
beltGeometry.setAttribute('position', new THREE.BufferAttribute(beltPositions, 3));
const beltMaterial = new THREE.PointsMaterial({ color: 0x9aa7b8, size: 0.35 });
const belt = new THREE.Points(beltGeometry, beltMaterial);
scene.add(belt);


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

renderer.render(scene, camera);
