'use client'
import { useEffect, useRef } from 'react'

export default function TestPage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const run = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      const canvas = canvasRef.current
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(600, 600)

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x222222)

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
      camera.position.set(0, 0, 5)

      scene.add(new THREE.AmbientLight(0xffffff, 2))

      console.log('Starting load...')
      new GLTFLoader().load(
        '/apollo.glb',
        (gltf) => {
          console.log('SUCCESS', gltf)
          scene.add(gltf.scene)
        },
        null,
        (err) => console.error('ERROR', err)
      )

      const tick = () => {
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
      }
      tick()
    }
    run()
  }, [])

  return <canvas ref={canvasRef} width={600} height={600} />
}