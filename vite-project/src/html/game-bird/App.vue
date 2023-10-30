<script setup>
import { onMounted } from 'vue'
import './style.css';
import * as THREE from "three";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";
const colors = require('nice-color-palettes');
 

console.log(colors.length);
// => 100
 
console.log(colors[0]);
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


// 页面尺寸
const sizes = {
  width: 1080 || window.innerWidth,
  height: 800,
};


let over = false

onMounted(() => {

  const blocks = []
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

  // renderer.center();

  // Scene
  const scene = new THREE.Scene();
  // scene.position.set(10, 10, 0)
  scene.background = new THREE.Color('0xFFDFDF')

  

  // 相机
  // const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  const camera = new THREE.OrthographicCamera(sizes.width / - 2, sizes.width / 2, sizes.height / 2, sizes.height / - 2, 1, 100)
  // camera.position.set(-3, 3, 3);
  camera.position.set(0, 0, 10)
  // camera.lookAt(mesh.position)
  scene.add(camera);



  // 光照
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
  scene.add(ambientLight);
  // 直射光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
  // directionalLight.castShadow = true;
  // directionalLight.shadow.mapSize.set(1024, 1024);
  // directionalLight.shadow.camera.far = 15;
  // directionalLight.shadow.camera.left = -7;
  // directionalLight.shadow.camera.top = 7;
  // directionalLight.shadow.camera.right = 7;
  // directionalLight.shadow.camera.bottom = -7;
  // directionalLight.position.set(5, 5, 5);
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



  // 物理世界
  const world = new CANNON.World();
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  world.gravity.set(0, -10, 0);



  // 默认材质
  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7,
    }
  );
  world.defaultContactMaterial = defaultContactMaterial;



  // 地面
  // const floorShape = new CANNON.Plane();
  // const floorBody = new CANNON.Body();
  // floorBody.mass = 0;
  // floorBody.addShape(floorShape);
  // floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  // world.addBody(floorBody);




  const createBox = () => {
      // 创建立方体 6 3 6
      const boxGeometry = new THREE.BoxBufferGeometry(108, 800, 10);
      const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0x607d8b,
      });
      const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
      mesh.position.set(0, 500, 0)
      // mesh.scale.set(width, height, depth);
      // mesh.castShadow = true;
      // mesh.position.copy(position);
      scene.add(mesh);

      // const shape1 = new CANNON.Box(
      //   new CANNON.Vec3(108, 800,  10)
      // );
      // const body1 = new CANNON.Body({
      //   mass: 1,
      //   position: new CANNON.Vec3(0, 3, 0),
      //   shape: shape1,
      //   material: defaultMaterial,
      // });
      // body1.position.copy(mesh.position);
      // world.addBody(body1);

      // const boxGeometry = new THREE.BoxBufferGeometry(1, 6, 1);
      // const boxMaterial = new THREE.MeshStandardMaterial({
      //   color: 0x607d8b,
      // });
      const mesh2 = new THREE.Mesh(boxGeometry, boxMaterial);
      mesh2.position.set(0, -500, 0)

      // mesh.scale.set(width, height, depth);
      // mesh.castShadow = true;
      // mesh.position.copy(position);
      // scene.add(mesh2);

      // const shape2 = new CANNON.Box(
      //   new CANNON.Vec3(108, 800,  10)
      // );
      // const body2 = new CANNON.Body({
      //   mass: 1,
      //   position: new CANNON.Vec3(0, 3, 0),
      //   shape: shape2,
      //   material: defaultMaterial,
      // });
      // body2.position.copy(mesh2.position);
      // // body.addEventListener("collide", playHitSound);
      // world.addBody(body2);

      const group = new THREE.Group();
      group.add(mesh, mesh2);
      group.position.set(600, (Math.floor(Math.random() * 2)  > 0 ? 1 : -1) * (Math.floor(Math.random() * 250)), 0)
      group.name = 'bllllllllllllllock'

      const shape3 = new CANNON.Box(
        new CANNON.Vec3(108 * 0.5, 16000,  10)
      );
      const body3 = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape3,
        material: defaultMaterial,
      });
      body3.position.copy(group.position);
      // body.addEventListener("collide", playHitSound);
      world.addBody(body3);

      blocks.push({
        body: body3,
        mesh: group,
      })

      return group
  }



  const boxGeometry = new THREE.BoxBufferGeometry(40, 40, 10);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: '#192655',
  });
  const bird = new THREE.Mesh(boxGeometry, boxMaterial);
  // mesh.position.set(0, 500, 0)
  // mesh.scale.set(width, height, depth);
  // mesh.castShadow = true;
  // mesh.position.copy(position);
  scene.add(bird);
  const shape = new CANNON.Box(
    new CANNON.Vec3(40 * 0.5, 40 * 0.5, 10 * 0.5)
  );
  const biridBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial,
  });
  biridBody.position.copy(bird.position);
  
  const handlePlay = (e) => {
    console.log('handlePlay========')
    console.log(e)
    over = true
    // alert('1')
  }
  biridBody.addEventListener("collide", handlePlay);
  world.addBody(biridBody);





  const block = createBox()
  // blocks.push(block)
  scene.add(block);

  // 动画
  const clock = new THREE.Clock();
  let oldElapsedTime = 0;
  let step = 0
  const tick = () => {
    if (over) return
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // 更新物理效果
    world.step(1 / 60, deltaTime, 3);
    // console.log('biridBody.position----', biridBody.position)
    bird.position.copy(biridBody.position);
    
    // for (const object of objectsToUpdate) {
    //   object.mesh.position.copy(object.body.position);
    //   object.mesh.quaternion.copy(object.body.quaternion);
    // }

    step = step + 1
    if ( step > 500) {
      const block = createBox()
      // blocks.push(block)
      scene.add(block);
      step = 0
    }
    // console.log('oldElapsedTime===', deltaTime)
    // 更新物理效果
    // world.step(1 / 60, deltaTime, 3);
    // for (const object of objectsToUpdate) {
    //   object.mesh.position.copy(object.body.position);
    //   object.mesh.quaternion.copy(object.body.quaternion);
    // }
    // controls.update();
    // console.log('blocks===', blocks.length)

    // blocks.forEach((b, i )=> {
    //   if ( b.position.x < - sizes.width / 2 - 120) {
    //     scene.remove(b);
    //     blocks.splice(i, 1)
    //   } else {
    //     b.position.x -= 1
    //   }
    // })

    blocks.forEach((object, index) => {
      // console.log('object==', object)
      // object.mesh.position.copy(object.body.position);
      object.mesh.position.x -= 1
      object.body.position.copy(object.mesh.position)

      // console.log('blocks===', body.position)
    })

    // group.position.x -= 1
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
