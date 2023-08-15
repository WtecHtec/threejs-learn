<script setup>
import { onMounted } from 'vue'
import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// 官方的 UnrealBloomPass 有问题，会导致scene背景设置失效
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { UnrealBloomPass } from './libs/UnrealBloompass';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';

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
  renderer.autoClear = false;
  renderer.setClearAlpha(0);
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.CineonToneMapping;
  renderer.toneMappingExposure = 2;

  // 初始化场景
  const scene = new THREE.Scene();
  // 初始化相机
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
  camera.position.set(0, 1, 5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  // 最大仰角
  controls.minPolarAngle = .5;
  controls.maxPolarAngle = 2.5;
  // 水平旋转角度限制
  controls.minAzimuthAngle = -1;
  controls.maxAzimuthAngle = 1;

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
  const light = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.normalBias = 0.05;
  directionalLight.position.set(.25, 3, -1.25);
  scene.add(directionalLight);
  // tick();
})
</script>



<template>
  <canvas class="webgl"></canvas>
</template>

<style scoped></style>  
