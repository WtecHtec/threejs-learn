<script setup>
import { onMounted } from 'vue'
import './style.css';

import {TweenMax, Power2, TimelineLite, TimelineMax} from "gsap";
import * as THREE from "three";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


// 页面尺寸
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

onMounted(() => {


  // const getSY = () => {

  // }

	const spanDom = document.getElementById('score')
	let gameStatus = false;
	let score = 0

	function gameOver(collision) {
		const impactStrength = collision.contact.getImpactVelocityAlongNormal();
		if (gameStatus) return

		const { target, body } = collision
		if (body.name === 'bird') {
			console.log('impactStrength-', collision, impactStrength)
			target.name === 'pipe' && (gameStatus = true);
			target.name === 'score' && (score = score + 1, spanDom.innerHTML = score);
		}

	}

	//  场景初始化
	const canvas = document.querySelector("canvas.webgl");

	// Renderer
	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		alpha: true,
		antialias: true,
	});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	// Scene
	const scene = new THREE.Scene();

	// 相机
	// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
	// camera.lookAt(new THREE.Vector3(0, 0, 0))
	// camera.position.set(0, 0, 10);
	// scene.add(camera);

	// 控制器
	// const controls = new OrbitControls(camera, canvas);
	// controls.enableDamping = true;

	// 相机
	const camera = new THREE.OrthographicCamera(- sizes.width / 2, sizes.width / 2, sizes.height / 2, - sizes.height / 2, 1, 100)
	// const camera = new THREE.OrthographicCamera(-20, 20, 10, -10, 1, 10)
	camera.position.set(0, 0, 10);
	// camera.lookAt(THREE.Vec3(0,0,0))
	scene.add(camera);

	// 光照
	// 环境光
	const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
	scene.add(ambientLight);
	// 直射光
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
	directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.set(1024, 1024);
	directionalLight.shadow.camera.far = 15;
	directionalLight.shadow.camera.left = -7;
	directionalLight.shadow.camera.top = 7;
	directionalLight.shadow.camera.right = 7;
	directionalLight.shadow.camera.bottom = -7;
	directionalLight.position.set(5, 5, 5);
	scene.add(directionalLight);

	// 页面缩放监听
	window.addEventListener("resize", () => {
		sizes.width = window.innerWidth;
		sizes.height = window.innerHeight;
		camera.aspect = sizes.width / sizes.height;
		camera.updateProjectionMatrix();
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	});

	// 创建地面
	const floor = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(10, 10),
		new THREE.MeshStandardMaterial({
			color: 0x00aa31,
			metalness: 0.3,
			roughness: 0.2,
		})
	);
	floor.receiveShadow = true;
	floor.rotation.x = -Math.PI * 0.5;
	scene.add(floor);



	// 物理世界
	const world = new CANNON.World();
	world.broadphase = new CANNON.SAPBroadphase(world);
	world.allowSleep = true;
	world.gravity.set(0, -19.82, 0);



	// 默认材质
	const defaultMaterial = new CANNON.Material("default");
	const defaultContactMaterial = new CANNON.ContactMaterial(
		defaultMaterial,
		defaultMaterial,
		{
			friction: 0.1,
			restitution: 0.1,
		}
	);
	world.defaultContactMaterial = defaultContactMaterial;



	// 地面
	// const floorShape = new CANNON.Plane();
	// const floorBody = new CANNON.Body();
	// floorBody.name = 'floor'
	// floorBody.mass = 0;
	// floorBody.addShape(floorShape);
	// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
	// world.addBody(floorBody);



	// 更新对象数组
	// const objectsToUpdate = [];

	// 创建小球
	const sphereGeometry = new THREE.SphereBufferGeometry(1, 24, 24);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		metalness: 0.4,
		roughness: 0.4,
		color: 0xff0000,
	});

	const birdObject = {}
	const createSphere = (radius, position) => {
		// Three.js 网格
		const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
		mesh.castShadow = true;
		mesh.scale.set(radius, radius, radius);
		mesh.position.copy(position);
		scene.add(mesh);
		// Cannon.js 刚体
		const shape = new CANNON.Sphere(radius * 0.5);
		const body = new CANNON.Body({
			mass: 0,
			position: new CANNON.Vec3(0, 0, 0),
			shape: shape,
			material: defaultMaterial,
      collisionResponse: false
		});
		body.position.copy(position);
		// body.addEventListener("collide", playHitound);
		body.name = 'bird'
		world.addBody(body);
    // body.velocity = new CANNON.Vec3(0, 10, 0)
    console.log('velocity----', body.velocity)
		// 保存到更新数组
		// objectsToUpdate.push({ mesh, body });
		birdObject.mesh = mesh
		birdObject.body = body
	};


	// 创建立方体
	const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
	const boxMaterial = new THREE.MeshStandardMaterial({
		metalness: 0.4,
		roughness: 0.4,
		color: 0x0091ff,
	});
	const createBox = (width, height, depth, position, name = 'pipe') => {
		const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
		mesh.scale.set(width, height, depth);
		mesh.castShadow = true;
		mesh.position.copy(position);
		scene.add(mesh);
		const shape = new CANNON.Box(
			new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
		);
		const body = new CANNON.Body({
			mass: 5,
			position: new CANNON.Vec3(0, 0, 0),
			shape: shape,
			material: defaultMaterial,
      isTrigger: false
		});
		body.position.copy(position);
		body.addEventListener("collide", gameOver);
		world.addBody(body);
		body.name = name
		// objectsToUpdate.push({ mesh, body });
		return { mesh, body }
	};

	const pipeDatas = []
	function createPipe() {
		const lowH = 500
		const highH = 750
		const dif = Math.floor(Math.random() * (highH - lowH))
		// const ch = lowH + dif
		// console.log(ch)
		const pipe1 = createBox(50, 800, 2, { x: 800, y: 500 + dif, z: 0 });
		const pipe2 = createBox(50, 800, 2, { x: 800, y: -500 + dif, z: 0 });
		const score = createBox(50, 200, 2, { x: 800, y: dif, z: 0 }, name = 'score');
		score.mesh.visible = false
		pipeDatas.push({ pipe1, pipe2, score })
	}


	function bodyCopyM(pipe, key, speed, score) {
		// const { mesh, body } = pipe
		pipe.mesh.position[key] = pipe.mesh.position[key] + speed
		pipe.body.position.copy(pipe.mesh.position)
		// score.mesh.position.copy(pipe.mesh.position)
		score.mesh.position.x = pipe.mesh.position[key] + 20
		score.body.position.copy(score.mesh.position)
		// console.log(pipe.body.position, pipe.mesh.position)
	}

	function rmEl(pipe, score) {
		const { mesh, body } = pipe
		scene.remove(mesh)
		world.removeBody(body)
		scene.remove(score.mesh)
		world.removeBody(score.body)
	}

	function updatePipe() {
		pipeDatas.forEach(({ pipe1, pipe2, score }, index) => {
			if (pipe1.mesh.position.x < -800) {
				pipeDatas.splice(index, 1)
				rmEl(pipe1, score)
				rmEl(pipe2, score)
				// scene.remove(score)
			} else {
				bodyCopyM(pipe1, 'x', -5, score)
				bodyCopyM(pipe2, 'x', -5, score)
			}
		})
	}


	createSphere(10, {
		x: -100,
		y: 0,
		z: 0,
	});

	createPipe()

  let vy = 0 
  let dt = 5
  let deltaTime = 0
  let G = 1
	function moveBird(speed = -1.82) {
    // birdObject.mesh.position.copy(birdObject.body.position)
    if (birdObject) {
      // const sy = vy * deltaTime + 0.5 + speed * deltaTime * deltaTime
      // vy = vy + speed * deltaTime
			birdObject.mesh.position.y = birdObject.mesh.position.y - G
			birdObject.body.position.copy(birdObject.mesh.position)
			// console.log('sss')
			// console.log(birdObject.body.position, birdObject.mesh.position)
		}
	}


	let keyStatus = false
	const timeout = 400
	let moverTimer = null
	// document.addEventListener('keydown', (e) => {
	//   console.log('KEY DOWN', e)
	//   if (e.keyCode === 32 ) {
	//     moveBird(-29.82)
	//     keyStatus = true
	//   }
	// })

	// document.addEventListener('keyup', (e) => {
	//   console.log('KEY DOWN', e)
	//   keyStatus = false
	// })

	// document.addEventListener('mousedown', () => {

	//   keyStatus = true
	//   clickTime = new Date().getTime();
	// })


	document.addEventListener('click', () => {
    event.preventDefault();
		// moveBird()
		// const upTime = new Date().getTime();
		// moveBird(9.82)
    console.log('mouseup===')
    const { mesh, body } = birdObject
    const t1 = new TimelineMax();
    t1.to(mesh.position, 0.5, {y:mesh.position.y + 19.82, ease: Power2.easesOut})
    const t2 = new TimelineMax();
    t2.to(body.position, 0.5, {y:body.position.y + 19.82, ease: Power2.easesOut})

    // birdObject.body.applyForce(new CANNON.Vec3(0, 1000, 0), birdObject.body.position)
		// keyStatus = true
    // // birdObject.body.position.y = birdObject.body.position.y +  19.82
		// if (moverTimer) {
		// 	clearTimeout(moverTimer)
		// }
		// moverTimer = setTimeout(() => {
		// 	keyStatus = false
		// }, timeout);
	})


	let frame = 0
	let maxFrame = 120
	// 动画
	const clock = new THREE.Clock();
	let oldElapsedTime = 0;
	const tick = () => {
		if (gameStatus) return
		const elapsedTime = clock.getElapsedTime();
		deltaTime = elapsedTime - oldElapsedTime;
		oldElapsedTime = elapsedTime;
		// console.log('deltaTime==', deltaTime)
		// 更新物理效果
		world.step(1 / 60, deltaTime, 100);
		// if ( !keyStatus ) {
		//   console.log('keyStatus===', keyStatus)
		// moveBird();
		// }

		moveBird(keyStatus ? 1.5 : -1);

		updatePipe()

		if (frame >= maxFrame) {
			createPipe()
			frame = 0
		}
		frame = frame + 1

		// birdObject.mesh.position.copy(birdObject.body.position)
		// for (const object of objectsToUpdate) {
		//   object.mesh.position.copy(object.body.position);
		//   object.mesh.quaternion.copy(object.body.quaternion);
		// }
		// controls.update();
		renderer.render(scene, camera);
		window.requestAnimationFrame(tick);
	};

	tick();



})


</script>

<template>
	<canvas class="webgl"></canvas>
	<a class='github' href='https://github.com/dragonir/threejs-odessey' target='_blank' rel='noreferrer'>
		<svg height='36' aria-hidden='true' viewBox='0 0 16 16' version='1.1' width='36' data-view-component='true'>
			<path fill='#ffffff' fillRule="evenodd"
				d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
			</path>
		</svg>
		<span class='author'>three.js odessey</span>
	</a>
</template>
