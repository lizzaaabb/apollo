'use client'
import { useEffect, useRef } from 'react'

export default function Crystal1() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let raf
    let renderer
    let growing = true

    const init = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance', // ← hint GPU to use dedicated card
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // ← was 2, saves ~30% fill rate
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.2

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)

      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)

      // Pause rendering when tab is hidden
      const onVisibility = () => {
        if (document.hidden) cancelAnimationFrame(raf)
        else tick()
      }
      document.addEventListener('visibilitychange', onVisibility)

      const ambient = new THREE.AmbientLight(0xffffff, 1.5)
      scene.add(ambient)
      const dirLight1 = new THREE.DirectionalLight(0xffffff, 3)
      dirLight1.position.set(5, 10, 7)
      scene.add(dirLight1)
      const dirLight2 = new THREE.DirectionalLight(0xaaddff, 2)
      dirLight2.position.set(-5, -3, -5)
      scene.add(dirLight2)
      const pointLight = new THREE.PointLight(0xff88ff, 2, 100)
      pointLight.position.set(3, 5, 3)
      scene.add(pointLight)

      let pivot // declared here so tick() can reference it

      let last = performance.now()
      const t0 = performance.now()

      // Single unified loop — no separate grow loop
      const tick = () => {
        raf = requestAnimationFrame(tick)
        const now = performance.now()
        const d = Math.min((now - last) / 1000, 0.05) // ← cap delta so tab-switch spike doesn't jump
        last = now

        if (!pivot) return

        if (growing) {
          const p = Math.min((now - t0) / 1500, 1)
          const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
          pivot.scale.setScalar(e)
          if (p >= 1) growing = false
        }

        pivot.rotation.y += d * 0.4
        renderer.render(scene, camera)
      }
      tick()

      new GLTFLoader().load(
        '/crystal1.glb',
        (gltf) => {
          const model = gltf.scene
          const box    = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size   = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)

          pivot = new THREE.Group()
          model.position.set(-center.x, -center.y, -center.z)
          pivot.add(model)
          scene.add(pivot)
          pivot.scale.setScalar(0)

          camera.position.set(0, 0, maxDim * 1.8)
          camera.lookAt(0, 0, 0)
          camera.near = maxDim * 0.01
          camera.far  = maxDim * 20
          camera.updateProjectionMatrix()
        },
        null,
        (err) => console.error('[Crystal1] Load error:', err)
      )

      return () => {
        document.removeEventListener('visibilitychange', onVisibility)
        ro.disconnect()
      }
    }

    let cleanup
    init().then(fn => { cleanup = fn })

    return () => {
      cancelAnimationFrame(raf)
      renderer?.dispose()
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}