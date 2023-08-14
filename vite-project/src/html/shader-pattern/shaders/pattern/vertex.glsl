
varying vec2 vUv;
uniform mat4 modelMatrix;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
  vUv = uv;
}