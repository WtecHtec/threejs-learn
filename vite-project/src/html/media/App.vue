<script setup>
import { onMounted } from 'vue'
import './style.css';

import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2;
  renderer.outputEncoding = THREE.sRGBEncoding


  // 初始化场景
  const scene = new THREE.Scene();
  // 初始化相机
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
  camera.position.set(0, 1.2, 10);
  // 镜头控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;

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


  // 全景背景
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const environmentMap = cubeTextureLoader.load([
    './static/textures/environmentMaps/px.jpg',
    './static/textures/environmentMaps/nx.jpg',
    './static/textures/environmentMaps/py.jpg',
    './static/textures/environmentMaps/ny.jpg',
    './static/textures/environmentMaps/pz.jpg',
    './static/textures/environmentMaps/nz.jpg'
  ]);
  environmentMap.encoding = THREE.sRGBEncoding;
  scene.background = environmentMap;
  scene.environment = environmentMap;



  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);
  // 平行光
  const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.normalBias = 0.05;
  directionalLight.position.set(1, 10, -10);
  scene.add(directionalLight);

  // 创建视频材质
  const video = document.getElementById('video');
  const videoTexture = new THREE.VideoTexture(video);

  // 模型加载
  const screen = {
    mesh: null,
    material: null,
    videoMaterial: new THREE.MeshPhysicalMaterial({
      map: videoTexture,
      envMap: environmentMap
    })
  };

  // 加载管理
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onLoad = () => { }
  // 使用dracoLoader加载用blender压缩过的模型
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./static/draco/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  const loader = new GLTFLoader(loadingManager);
  loader.setDRACOLoader(dracoLoader);

  let model = null;
  loader.load('./static/models/iphone.glb', mesh => {
    if (mesh.scene) {
      mesh.scene.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = environmentMap;
          child.material.envMapIntensity = 2;
          if (child.name === '屏幕') {
            screen.mesh = child;
            screen.material = child.material;
          }
          if (child.name.includes('边框')) {
            child.material.metalness = .8;
          }
          if (child.name.includes('logo')) {
            child.material.metalness = 1;
          }
        }
      })
      mesh.scene.scale.set(60, 60, 60);
      mesh.scene.position.y = -5;
      mesh.scene.rotation.y = -Math.PI;
      model = mesh.scene;
      scene.add(mesh.scene);
    }
  });


  
  // 创建星球
  const SphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x03c03c,
    wireframe: false,
  });
  const SphereGeometry = new THREE.SphereGeometry(5, 5, 5);
  const planet = new THREE.Mesh(SphereGeometry, SphereMaterial);
  planet.position.set(0.5,1.5,12)
  scene.add(planet);

  // 点击事件捕获
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  window.addEventListener('click', event => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([screen.mesh, planet]);
    console.log('intersects====', intersects)
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      if (mesh.material.type === 'MeshStandardMaterial') {
        mesh.material = screen.videoMaterial;
      } else {
        mesh.material = screen.material;
      }
    }
  }, false);


  // 动画
  const tick = () => {
    model && (model.rotation.y += .005);
    controls && controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }
  tick();
})
</script>



<template>
  <canvas class="webgl"></canvas>
  <video id="video" muted autoplay loop>
    <source src="./static/video/demo.mp4">
  </video>
  <div class="tips">
    <svg width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z"
        fill="none" stroke="#FFF" stroke-width="4" />
      <path d="M24 19H12V29H24V19Z" fill="none" stroke="#FFF" stroke-width="4" stroke-linejoin="bevel" />
      <path d="M35 18L30 22V26L35 30V18Z" fill="none" stroke="#FFF" stroke-width="4" stroke-linejoin="bevel" />
    </svg>
    <span class="text">轻触手机屏幕与我聊天！</span>
  </div>
  <a class='github' href='https://github.com/dragonir/threejs-odessey' target='_blank' rel='noreferrer'>
    <svg height='36' aria-hidden='true' viewBox='0 0 16 16' version='1.1' width='36' data-view-component='true'>
      <path fill='#0A0942' fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
      </path>
    </svg>
    <span class='author'>three.js odessey</span>
  </a>
</template>

<style scoped></style>
