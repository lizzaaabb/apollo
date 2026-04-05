'use client'
import { useEffect, useRef } from 'react'

export default function Crystal3() {
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

      new GLTFLoader().load(
        '/crystal3.glb',
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

          camera.position.set(0, 0, maxDim * 1.8)
          camera.lookAt(0, 0, 0)
          camera.near = maxDim * 0.01
          camera.far  = maxDim * 20
          camera.updateProjectionMatrix()

          // Grow-in
          pivot.scale.setScalar(0)
          const t0 = performance.now()
          const grow = (now) => {
            const p = Math.min((now - t0) / 1500, 1)
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
            pivot.rotation.y += d * 0.4
            renderer.render(scene, camera)
          }
          tick()
        },
        null,
        (err) => console.error('[Crystal3] Load error:', err)
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