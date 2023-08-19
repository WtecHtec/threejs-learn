/* eslint-disable react/no-unknown-property */

import './App.css'
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <>
      <Canvas>
        <mesh>
        <boxGeometry attach="geometry" />
          <meshBasicMaterial color="#03c03c" />
        </mesh>
        <ambientLight args={[0xff0000]} intensity={0.1} />
        <directionalLight position={[0, 0, 5]} intensity={0.5} />
      </Canvas>

    </>
  )
}

export default App
