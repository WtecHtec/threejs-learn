<script setup>
import { onMounted } from 'vue'

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
  // scene.background = new THREE.Color(0xf5f5f5);

  // 初始化相机
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
  camera.position.z = 120
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  scene.add(camera);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

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



  const lostInSpace = () => {
    document.querySelector('.title-zone').style.display = 'block';
    controls.dispose();
    camera.position.z = 150;

    // 从此处正式开始
    const rand = (min, max) => min + Math.random() * (max - min);
    let astronaut = null, t = 0;

    // 宇航员模型
    const loader = new GLTFLoader();
    loader.load('./static/models/astronaut.glb', mesh => {
      astronaut = mesh.scene;
      astronaut.material = new THREE.MeshLambertMaterial();
      astronaut.scale.set(.0005, .0005, .0005);
      // astronaut.scale.set(.5, .5, .5);
      astronaut.position.z = -10;
      scene.add(astronaut);
    });


    // 雾化效果
    scene.fog = new THREE.FogExp2(0x000000, 0.005);
    // 设置光照
    let light = new THREE.PointLight(0xFFFFFF, 0.5);
    light.position.x = -50;
    light.position.y = -50;
    light.position.z = 75;
    scene.add(light);
    light = new THREE.PointLight(0xFFFFFF, 0.5);
    light.position.x = 50;
    light.position.y = 50;
    light.position.z = 75;
    scene.add(light);
    light = new THREE.PointLight(0xFFFFFF, 0.3);
    light.position.x = 25;
    light.position.y = 50;
    light.position.z = 200;
    scene.add(light);
    light = new THREE.AmbientLight(0xFFFFFF, 0.02);
    scene.add(light);


    // 初始化粒子系统
    const geom = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 10,
      alphaTest: .8,
      map: new THREE.TextureLoader().load('./static/images/particle.png')
    });
    let veticsFloat32Array = []
    let veticsColors = []
    for (let p = 0; p < 1000; p++) {
      veticsFloat32Array.push(
        rand(20, 30) * Math.cos(p),
        rand(20, 30) * Math.sin(p),
        rand(-1500, 0)
      );
      const randomColor = new THREE.Color(Math.random() * 0xffffff);
      veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
    }
    const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
    const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
    geom.attributes.position = vertices;
    geom.attributes.color = colors;
    const particleSystem = new THREE.Points(geom, material);
    scene.add(particleSystem);

    // 更新粒子
    const updateParticles = () => {
      particleSystem.position.x = 0.2 * Math.cos(t);
      particleSystem.position.y = 0.2 * Math.cos(t);
      particleSystem.rotation.z += 0.015;
      camera.lookAt(particleSystem.position);
      for (let i = 0; i < veticsFloat32Array.length; i++) {
        if ((i + 1) % 3 === 0) {
          const dist = veticsFloat32Array[i] - camera.position.z;
          if (dist >= 0) veticsFloat32Array[i] = rand(-1000, -500);
          veticsFloat32Array[i] += 2.5;
          const _vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
          geom.attributes.position = _vertices;
        }
      }
      particleSystem.geometry.verticesNeedUpdate = true;
    }

    /** 更新天空人 */
    const updateMeshes = () => {
      if (astronaut) {
        astronaut.position.z = 0.08 * Math.sin(t) + (camera.position.z - 0.2);
        astronaut.rotation.x += 0.015;
        astronaut.rotation.y += 0.015;
        astronaut.rotation.z += 0.01;
      }
    }

    /** 更新画布  */
    const updateRenderer = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
    }

    const tick = () => {
      updateParticles();
      updateMeshes();
      updateRenderer();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
      t += 0.01;
    }
    tick();

    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = -1 * ((cx - e.clientX) / cx);
      const dy = -1 * ((cy - e.clientY) / cy);
      camera && (camera.position.x = dx * 5);
      camera && (camera.position.y = dy * 5);
      astronaut && (astronaut.position.x = dx * 5);
      astronaut && (astronaut.position.y = dy * 5);
    });
  }

  lostInSpace()
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