import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js";

// ============= SETUP =============
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// ============= PLAYER CAR ============
function createPlayerCar() {
  const car = new THREE.Group();

  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  body.position.y = 0.5;
  car.add(body);

  // Cabin
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.5, 2),
    new THREE.MeshStandardMaterial({ color: 0x333366 })
  );
  cabin.position.set(0, 0.9, 0);
  car.add(cabin);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const wheels = [];

  function makeWheel(x, z) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.2, z);
    car.add(wheel);
    wheels.push(wheel);
  }
  makeWheel(-0.9, -1.5); makeWheel(0.9, -1.5);
  makeWheel(-0.9, 1.5);  makeWheel(0.9, 1.5);

  car.userData.wheels = wheels;

  // Headlights
  const headlightLeft = new THREE.SpotLight(0xffffaa, 1, 20, Math.PI/6, 0.5);
  headlightLeft.position.set(-0.7, 1, 2);
  headlightLeft.target.position.set(-0.7, 0, 10);
  car.add(headlightLeft); car.add(headlightLeft.target);

  const headlightRight = new THREE.SpotLight(0xffffaa, 1, 20, Math.PI/6, 0.5);
  headlightRight.position.set(0.7, 1, 2);
  headlightRight.target.position.set(0.7, 0, 10);
  car.add(headlightRight); car.add(headlightRight.target);

  return car;
}
const playerCar = createPlayerCar();
scene.add(playerCar);

// Camera initial position
camera.position.set(0, 5, -10);
camera.lookAt(playerCar.position);

// ============= ENVIRONMENT (LOOPING ROAD) ============
const roadLength = 200;
const roadPieces = [];
function createRoadPiece(zOffset) {
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(10, roadLength),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.z = zOffset;
  scene.add(road);

  const grassLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(50, roadLength),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  grassLeft.rotation.x = -Math.PI / 2;
  grassLeft.position.set(-30, 0, zOffset);
  scene.add(grassLeft);

  const grassRight = grassLeft.clone();
  grassRight.position.x = 30;
  scene.add(grassRight);

  return { road, grassLeft, grassRight, zOffset };
}
roadPieces.push(createRoadPiece(0));
roadPieces.push(createRoadPiece(roadLength));

// ============= ROAD SIDE OBJECTS ============
const roadsideObjects = [];
function createTree(x, z) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,2,12), new THREE.MeshStandardMaterial({color:0x8b4513}));
  trunk.position.y = 1; tree.add(trunk);
  const leaves = new THREE.Mesh(new THREE.ConeGeometry(1,2,12), new THREE.MeshStandardMaterial({color:0x228b22}));
  leaves.position.y = 3; tree.add(leaves);
  tree.position.set(x,0,z); return tree;
}
function createCone(x,z){
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5,1,6), new THREE.MeshStandardMaterial({color:0xffa500}));
  cone.position.set(x,0.5,z); return cone;
}
function createBarrier(x,z){
  const barrier = new THREE.Mesh(new THREE.BoxGeometry(1.5,1,0.5), new THREE.MeshStandardMaterial({color:0xffffff}));
  barrier.position.set(x,0.5,z); return barrier;
}
// spawn objects
for(let i=10;i<200;i+=10){
  const side = Math.random()<0.5?-1:1;
  const type=Math.floor(Math.random()*3);
  let obj;
  switch(type){
    case 0: obj=createTree(side*12,i); break;
    case 1: obj=createCone(side*8,i); break;
    case 2: obj=createBarrier(side*10,i); break;
  }
  roadsideObjects.push(obj); scene.add(obj);
}
function updateRoadsideObjects(){
  roadsideObjects.forEach(obj=>{
    obj.position.z -= speed;
    if(obj.position.z<playerCar.position.z-10){
      obj.position.z+=200;
      obj.position.x=(Math.random()<0.5?-1:1)*(obj.userData.sideOffset||10);
    }
  });
}

// ============= CONTROLS ============
let speed = 0;
let maxSpeed = 0.6;
let acceleration = 0.01;
let friction = 0.003;
const laneX = [-3,0,3];
let currentLane = 1;

window.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowLeft" && currentLane < 2) currentLane++; // move left
  if(e.key==="ArrowRight" && currentLane > 0) currentLane--; // move right
  if(e.key==="ArrowUp") speed = Math.min(speed + acceleration, maxSpeed);
  if(e.key==="ArrowDown") speed = Math.max(speed - acceleration, 0);
});


// ============= ENEMY CARS ============
function createEnemyCar(){
  const car = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2,0.5,4), new THREE.MeshStandardMaterial({color:Math.random()*0xffffff}));
  body.position.y=0.5; car.add(body);
  car.position.set(laneX[Math.floor(Math.random()*3)],0,playerCar.position.z+150);
  return car;
}
let enemies=[]; let enemySpawnInterval=2000; let lastSpawnTime=0;
function spawnEnemy(){ const e=createEnemyCar(); enemies.push(e); scene.add(e); }

// ============= COLLISION ============
const playerBox = new THREE.Box3();
const enemyBox = new THREE.Box3();
let gameOver=false;

// ============= HUD ============
let score=0;
const scoreEl=document.getElementById("score");
const speedEl=document.getElementById("speed");
const gameOverEl=document.getElementById("gameOver");

// ============= SOUNDS ============
const engineSound = new Audio("https://actions.google.com/sounds/v1/vehicles/car_idle.ogg");
engineSound.loop=true; engineSound.volume=0.3; engineSound.play();
const crashSound = new Audio("https://actions.google.com/sounds/v1/impacts/crash.ogg");

// ============= ANIMATE ============
function animate(time){
  if(!gameOver){
    requestAnimationFrame(animate);

    // player movement
    playerCar.position.x+=(laneX[currentLane]-playerCar.position.x)*0.2;
    playerCar.position.z+=speed;

    // wheels rotate
    playerCar.userData.wheels.forEach(w=>w.rotation.x-=speed*0.3);

    // camera follow
    camera.position.lerp(new THREE.Vector3(playerCar.position.x,5,playerCar.position.z-10),0.05);
    camera.lookAt(playerCar.position.x,0,playerCar.position.z+5);

    // move road pieces (infinite loop)
    roadPieces.forEach(piece=>{
      if(piece.zOffset+roadLength/2<playerCar.position.z-100){
        piece.zOffset+=roadLength*2;
        piece.road.position.z=piece.zOffset;
        piece.grassLeft.position.z=piece.zOffset;
        piece.grassRight.position.z=piece.zOffset;
      }
    });

    // update roadside objects
    updateRoadsideObjects();

    // spawn enemies dynamically
    if(time-lastSpawnTime>enemySpawnInterval){
      spawnEnemy(); lastSpawnTime=time;
      if(enemySpawnInterval>600) enemySpawnInterval-=20;
    }

    // move enemies
    enemies.forEach(e=>e.position.z-=0.3+speed);

    // collision detection
    playerBox.setFromObject(playerCar);
    enemies.forEach(e=>{
      enemyBox.setFromObject(e);
      if(playerBox.intersectsBox(enemyBox)){
        gameOver=true; gameOverEl.style.display="block";
        crashSound.play(); engineSound.pause();
      }
    });

    // update HUD
    score+=speed*2;
    scoreEl.textContent=Math.floor(score);
    speedEl.textContent=speed.toFixed(2);

    renderer.render(scene,camera);
  }
}
animate();
