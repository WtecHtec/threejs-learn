<script setup>
import { onMounted } from 'vue'
import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";

import Island from './environment/island'; // 场景
import Waterfall from './environment/waterfall'; // 瀑布
import Carrot from './environment/carrot'; // 萝卜
import Rabbit from './environment/rabbit'; // 兔子
import Animations from './environment/animation'; // 摄像头移动动画

var island = null;
var rabbit = null;
var carrot = [];
var waterfall = null;
var drops = [];
var count = 0;
var rabbitMoving = false;
var rabbitJumping = false;
var rabbitRunning = false;



// 定义渲染尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


onMounted(() => {

  // 初始化渲染器
  const canvas = document.querySelector('canvas.webgl');
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.needsUpdate = true;

  // 初始化场景
  const scene = new THREE.Scene();
  // 初始化相机
  const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 1, 5000)
  camera.position.set(-2000, -250, 2000);
  // 镜头控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.15;

  // 页面缩放事件监听
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // 更新渲染
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 更新相机
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  });

  // 光照
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.far = 20000;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.normalBias = 0.05;
  directionalLight.shadow.camera.top = 800;
  directionalLight.shadow.camera.bottom = -800;
  directionalLight.shadow.camera.left = -800;
  directionalLight.shadow.camera.right = 800;
  directionalLight.position.set(600, 1200, 800);
  scene.add(directionalLight);

  // 创建场景
  const createWorld = () => {
    // 创建地面
    island = new Island();
    scene.add(island.floorMesh);
    // 创建瀑布
    waterfall = new Waterfall(scene);
    scene.add(waterfall.drop);
    // 创建兔子
    rabbit = new Rabbit();
    camera.lookAt(rabbit.rabbitMesh.position);
    scene.add(rabbit.rabbitMesh);
    rabbit.nod();
    // 创建胡罗卜
    for (let i = 0; i < 20; i++) {
      carrot[i] = new Carrot();
      scene.add(carrot[i].carrotMesh);
      carrot[i].carrotMesh.position.set(-170 * Math.random() * 3 - 300, -12, 1400 * Math.random() * 1.2 - 900);
    }
  }


  // 兔子控制
  const rabbitControl = {
    tureLeft: () => {
      rabbit && (rabbit.rabbitMesh.rotation.y -= Math.PI / 2);
    },
    turnRight: () => {
      rabbit && (rabbit.rabbitMesh.rotation.y += Math.PI / 2);
    },
    stopMove: () => {
      rabbitMoving = false;
      rabbit.killMove();
      rabbit.nod();
    },
  }


  // 键盘监听
  document.addEventListener('keydown', e => {
    if (e && e.keyCode) {
      switch (e.keyCode) {
        // 左
        case 65:
        case 37:
          rabbitControl.tureLeft();
          break;
        // 右
        case 68:
        case 39:
          rabbitControl.turnRight();
          break;
        // 前
        case 87:
        case 38:
          rabbitMoving = true;
          break;
        // 空格键
        case 32:
          !rabbitJumping && rabbit.jump() && (rabbitJumping = true);
          break;
        default:
          break;
      }
    }
  });

  document.addEventListener('keyup', e => {
    if (e && e.keyCode) {
      switch (e.keyCode) {
        case 83:
        case 40:
        case 87:
        case 38:
          rabbitMoving = false;
          rabbit.killMove();
          rabbit.nod();
          break;
        case 32:
          setTimeout(() => {
            rabbitJumping = false;
          }, 800);
          break;
      }
    }
  });

  // 检查边界
  const checkCollision = () => {
    for (let i = 0; i < 20; i++) {
      let rabbCarr = rabbit.rabbitMesh.position.clone().sub(carrot[i].carrotMesh.position.clone());
      if (rabbCarr.length() <= 20) {
        rabbit.jump();
        scene.remove(carrot[i].carrotMesh);
        rabbCarr = null;
      }
    }
    // 检查是否是地面的边界
    var rabbFloor = island.floorMesh.position.clone().sub(rabbit.rabbitMesh.position.clone());
    if (
      rabbFloor.x <= -900 ||
      rabbFloor.x >= 900 ||
      rabbFloor.z <= -900 ||
      rabbFloor.z >= 900
    ) {
      rabbit.fall();
    }
    // 小河检测
    var rabbStream = rabbit.rabbitMesh.position.clone().sub(island.streamMesh.position.clone());
    if (
      (rabbStream.x >= -97 &&
        rabbStream.x <= 97 &&
        rabbStream.z >= -900 &&
        rabbStream.z <= 688) ||
      (rabbStream.x >= -97 && rabbStream.x <= 97 && rabbStream.z >= 712)
    ) {
      rabbit.fall();
    }
  }
  
  // 动画
  const tick = () => {
    // 兔子动画
    if (rabbitMoving === true) {
      checkCollision();
      rabbit.killNod();
      rabbit.move();
    }
    if (rabbitRunning === true) {
      rabbit.killNod();
      rabbit.run();
    }
    // 瀑布动画
    if (count % 3 == 0) {
      for (let i = 0; i < 7; i++) {
        drops.push(new Waterfall(scene));
      }
    }
    count++;
    for (var i = 0; i < drops.length; i++) {
      drops[i].update();
      if (drops[i].lifespan < 0) {
        scene.remove(scene.getObjectById(drops[i].drop.id));
        drops.splice(i, 1);
      }
    }
    TWEEN && TWEEN.update();
    controls && controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  const startButton = document.getElementById('start_button');
  const mask = document.getElementById('mask');
  startButton.addEventListener('click', () => {
    mask.style.display = 'none';
    Animations.animateCamera(camera, controls, { x: 50, y: 120, z: 1000 }, { x: 0, y: 0, z: 0 }, 3600, () => { });
  });
  createWorld();
  tick()
})

</script>

<template>
  <canvas class="webgl"></canvas>
  <div class="mask" id="mask">
    <div class="box">
      <div class="keyboard">
        <div class="row"><span class="key">W/↑</span></div>
        <div class="row"><span class="key">A/←</span><span class="key">S/↓</span><span class="key">D/→</span></div>
        <div class="row"><span class="key space">space</span></div>
      </div>
      <p class="tips"><b>W</b>: 行走&emsp;<b>S</b>: 停止&emsp;<b>A</b>: 向左转&emsp;<b>D</b>: 向右转&emsp;<b>空格键</b>: 跳跃</p>
      <p class="start"><button class="button" id="start_button">开始</button></p>
    </div>
  </div>
  <a class='github' href='https://github.com/dragonir/threejs-odessey' target='_blank' rel='noreferrer'>
    <svg height='36' aria-hidden='true' viewBox='0 0 16 16' version='1.1' width='36' data-view-component='true'>
      <path fill='#ffffff' fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
      </path>
    </svg>
    <span class='author'>three.js odessey</span>
  </a>
  <h1 class="title">RABBIT CRAFT GO!</h1>
  <div class="banner"><i></i></div>
</template>
