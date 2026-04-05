'use client'
import { useEffect, useRef } from 'react'

export default function Apollo() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let raf
    let renderer

    const init = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)

      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)

      new GLTFLoader().load(
        '/apollo.glb',
        (gltf) => {
          const model = gltf.scene

          const box    = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size   = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)

          const pivot = new THREE.Group()
          model.position.set(-center.x, -center.y, -center.z)
          pivot.add(model)
          scene.add(pivot)

          // Pull camera closer on mobile
          const isMobile = window.innerWidth < 768
          const camDist = isMobile ? maxDim * 1.8 : maxDim * 2.6
          camera.position.set(0, 0, camDist)
          camera.near = maxDim * 0.01
          camera.far  = maxDim * 20
          camera.updateProjectionMatrix()

          model.traverse((child) => {
            if (child.isPoints) {
              const positions = child.geometry.attributes.position
              const count = positions.count
              const colors = new Float32Array(count * 3)
              for (let i = 0; i < count; i++) {
                const y = positions.getY(i)
                const t = (y - box.min.y) / (box.max.y - box.min.y)
                colors[i * 3]     = 1.0
                colors[i * 3 + 1] = 0.3 + t * 0.4
                colors[i * 3 + 2] = t * 0.1
              }
              child.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
              child.material = new THREE.PointsMaterial({
                size: isMobile ? 0.025 : 0.018,  // bigger dots on mobile
                sizeAttenuation: true,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
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

          // Grow-in
          pivot.scale.setScalar(0)
          const t0 = performance.now()
          const grow = (now) => {
            const p = Math.min((now - t0) / 2000, 1)
            const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
            pivot.scale.setScalar(e)
            if (p < 1) requestAnimationFrame(grow)
          }
          requestAnimationFrame(grow)

          let last = performance.now()
          const tick = () => {
            raf = requestAnimationFrame(tick)
            const now = performance.now()
            const d = (now - last) / 1000
            last = now

            // Slow spin
            pivot.rotation.y += d * 0.25

            // Gentle float up and down
            pivot.position.y = Math.sin(now * 0.0008) * (maxDim * 0.04)

            renderer.render(scene, camera)
          }
          tick()
        },
        null,
        (err) => console.error('[Apollo] Load error:', err)
      )
    }

    init()
    return () => { cancelAnimationFrame(raf); renderer?.dispose() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}