'use client'
import { useEffect, useRef } from 'react'

export default function TestPage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const run = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      const canvas = canvasRef.current
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setSize(600, 600)
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)

      new GLTFLoader().load(
        '/apollo.glb',
        (gltf) => {
          const model = gltf.scene

          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          model.position.sub(center)

          const maxDim = Math.max(size.x, size.y, size.z)
          camera.position.set(0, 0, maxDim * 1.8)
          camera.near = maxDim * 0.01
          camera.far = maxDim * 10
          camera.updateProjectionMatrix()

          model.traverse((child) => {
            if (child.isPoints) {
              // Replace with additive blending glowing points
              const positions = child.geometry.attributes.position
              const count = positions.count

              // Create gradient colors — bright core, orange edges
              const colors = new Float32Array(count * 3)
              for (let i = 0; i < count; i++) {
                const y = positions.getY(i)
                const t = (y - box.min.y) / (box.max.y - box.min.y)
                // Bottom: deep orange, top: bright white-gold
                colors[i * 3]     = 1.0              // R
                colors[i * 3 + 1] = 0.3 + t * 0.4   // G
                colors[i * 3 + 2] = t * 0.1          // B
              }
              child.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

              child.material = new THREE.PointsMaterial({
                size: 0.018,
                sizeAttenuation: true,
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              })
            }
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xff6020,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0xff3000,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.15,
              })
            }
          })

          scene.add(model)

          const tick = () => {
            requestAnimationFrame(tick)
            model.rotation.y += 0.004
            renderer.render(scene, camera)
          }
          tick()
        },
        null,
        (err) => console.error('ERROR', err)
      )
    }
    run()
  }, [])

  return (
    <div style={{ background: '#0a0405', width: 600, height: 600 }}>
      <canvas ref={canvasRef} width={600} height={600} />
    </div>
  )
}
