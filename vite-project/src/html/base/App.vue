


<template>
  <div v-if="false" class='shadow_page'>
    <div class="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div id="loading-text-intro">
      <p>Loading</p>
    </div>
    <div class="content" style="visibility: hidden">
      <nav class="header">
        <a href="https://github.com/dragonir/threejs-odessey" class="active a"><span>首页</span></a>
        <a href="https://github.com/dragonir/threejs-odessey" class="a"><span>关于</span></a>
        <a href="https://github.com/dragonir/threejs-odessey" class="a"><span>作品</span></a>
        <a href="https://github.com/dragonir/threejs-odessey" class="a"><span>我的</span></a>
        <a href="https://github.com/dragonir/threejs-odessey" class="a"><span>更多</span></a>
        <div class="cursor"></div>
      </nav>
      <section class="section first">
        <div class='info'>
          <h2 class='name'>DRAGONIR</h2>
          <h1 class='title'>THREE.JS ODESSEY</h1>
          <p class='description'>&nbsp;</p>
        </div>
        <canvas id='canvas-container' class='webgl'></canvas>
      </section>
      <section class="section second">
        <div class="second-container">
          <ul>
            <li id="one" class="active">入门</li>
            <li id="two">基础</li>
            <li id="three">进阶</li>
          </ul>
          <p class="text" id="content">昨夜西风凋碧树。独上高楼，望尽天涯路。</p>
        </div>
        <canvas id='canvas-container-details' class='webgl'></canvas>
      </section>
    </div>
    <a class='github' href='https://github.com/dragonir/threejs-odessey' target='_blank' rel='noreferrer'
      title='dragonir'>
      <svg height='36' aria-hidden='true' viewBox='0 0 16 16' version='1.1' width='36' data-view-component='true'>
        <path fill='#FFFFFF' fillRule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
        </path>
      </svg>
    </a>
  </div>
  <canvas class="webgl"></canvas>
  <a class='github' href='https://github.com/dragonir/threejs-odessey' target='_blank' rel='noreferrer'>
    <svg height='36' aria-hidden='true' viewBox='0 0 16 16' version='1.1' width='36' data-view-component='true'>
      <path fill='#FFFFFF' fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
      </path>
    </svg>
    <span class='author'>three.js odessey</span>
  </a>
</template>


<script setup>
import { onMounted } from 'vue'
import './style.css';

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 定义渲染尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
onMounted(() => {
  // 初始化渲染器
  const canvas = document.querySelector('canvas.webgl');
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 初始化场景
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1A1A1A);
  scene.fog = new THREE.Fog(0x1A1A1A, 1, 1000);

  // 初始化相机
  const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height)
  scene.add(camera);
  camera.position.set(20, 100, 450);

  // 初始化控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 添加环境光
  const light = new THREE.AmbientLight(0xdeedff, 1.5);
  scene.add(light);

  // 创建星球
  const SphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x03c03c,
    wireframe: true,
  });
  const SphereGeometry = new THREE.SphereGeometry(80, 32, 32);
  const planet = new THREE.Mesh(SphereGeometry, SphereMaterial);
  scene.add(planet);

  // 创建星球轨道环
  const TorusGeometry = new THREE.TorusBufferGeometry(150, 8, 2, 120);
  const TorusMaterial = new THREE.MeshLambertMaterial({
    color: 0x40a9ff,
    wireframe: true
  });
  const ring = new THREE.Mesh(TorusGeometry, TorusMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.rotation.y = -0.1 * (Math.PI / 2);
  scene.add(ring);

  // 创建卫星
  const IcoGeometry = new THREE.IcosahedronGeometry(16, 0);
  const IcoMaterial = new THREE.MeshToonMaterial({ color: 0xfffc00 });
  const satellite = new THREE.Mesh(IcoGeometry, IcoMaterial);
  scene.add(satellite);

  // 创建星星
  const stars = new THREE.Group();
  for (let i = 0; i < 500; i++) {
    const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
    const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 700;
    mesh.position.y = (Math.random() - 0.5) * 700;
    mesh.position.z = (Math.random() - 0.5) * 700;
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;
    stars.add(mesh);
  }
  scene.add(stars);

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

  let rot = 0;
  // 动画
  const axis = new THREE.Vector3(0, 0, 1);
  const tick = () => {
    // 更新渲染器
    renderer.render(scene, camera);
    // 给网格模型添加一个转动动画
    rot += Math.random() * 0.8;
    const radian = (rot * Math.PI) / 180;
    // 星球位置动画
    planet && (planet.rotation.y += .005);
    // 星球轨道环位置动画
    ring && ring.rotateOnAxis(axis, Math.PI / 400);
    // 卫星位置动画
    satellite.position.x = 250 * Math.sin(radian);
    satellite.position.y = 100 * Math.cos(radian);
    satellite.position.z = -100 * Math.cos(radian);
    satellite.rotation.x += 0.005;
    satellite.rotation.y += 0.005;
    satellite.rotation.z -= 0.005;
    // 星星动画
    stars.rotation.y += 0.0009;
    stars.rotation.z -= 0.0003;
    // 更新控制器
    controls.update();
    // 页面重绘时调用自身
    window.requestAnimationFrame(tick);
  }
  tick();
})
</script>


<style scoped>
.flex-1 {
  flex: 1;
}
</style>
