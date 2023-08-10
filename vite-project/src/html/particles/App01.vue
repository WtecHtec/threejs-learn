<script setup>
import { onMounted } from 'vue'
import './style.css';

import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


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

  // 初始化相机
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
  camera.position.z = 120
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  scene.add(camera);

  // 镜头控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;


  // const createParticlesBySprite = () => {
  //   for (let x = -15; x < 15; x++) {
  //     for (let y = -10; y < 10; y++) {
  //       let material = new THREE.SpriteMaterial({
  //         color: Math.random() * 0xffffff
  //       });
  //       let sprite = new THREE.Sprite(material);
  //       sprite.position.set(x * 4, y * 4, 0);
  //       scene.add(sprite);
  //     }
  //   }
  // }
  // createParticlesBySprite()


  // const createParticlesByPoints = () => {
  //   const geom = new THREE.BufferGeometry();
  //   const material = new THREE.PointsMaterial({
  //     size: 3,
  //     vertexColors: true,
  //     color: 0xffffff
  //   });
  //   let veticsFloat32Array = []
  //   let veticsColors = []
  //   for (let x = -15; x < 15; x++) {
  //     for (let y = -10; y < 10; y++) {
  //       veticsFloat32Array.push(x * 4, y * 4, 0);
  //       const randomColor = new THREE.Color(Math.random() * 0xffffff);
  //       veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
  //     }
  //   }
  //   const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
  //   const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
  //   geom.attributes.position = vertices;
  //   geom.attributes.color = colors;
  //   const particles = new THREE.Points(geom, material);
  //   scene.add(particles);
  // }

  // createParticlesByPoints()



  const createParticlesByGeometry = () => {
  // 创建发光canvas纹理
  const generateSprite = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.4, 'rgba(0, 120, 20, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
  // 创建立方体
  const sphereGeometry = new THREE.SphereGeometry(15, 32, 16);
  // 创建粒子材质
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3,
    transparent: true,
    blending: THREE.AdditiveBlending,
    // map: generateSprite(),
    map: new THREE.TextureLoader().load('./static/images/heart.png'),
    depthWrite: false
  })
  const particles = new THREE.Points(sphereGeometry, material)
  scene.add(particles)
}

createParticlesByGeometry()


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

  // 页面重绘动画
  const tick = () => {
    controls && controls.update();
    // 更新渲染器
    renderer.render(scene, camera);
    // 页面重绘时调用自身
    window.requestAnimationFrame(tick);
  }
  tick();


})
</script>



<template>
  <canvas class="webgl"></canvas>
  <div class="title-zone">
    <h1 class="title">GRAVITY</h1>
    <h2 class="subtitle">迷失太空</h2>
  </div>
  <a class='github' href='https://github.com/dragonir/threejs-odessey' target='_blank' rel='noreferrer'>
    <svg height='36' aria-hidden='true' viewBox='0 0 16 16' version='1.1' width='36' data-view-component='true'>
      <path fill='#ffffff' fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
      </path>
    </svg>
    <span class='author'>three.js odessey</span>
  </a>
</template>

<style scoped></style>
