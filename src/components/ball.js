'use client'
import { useEffect, useRef } from 'react'

export default function Ball() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let raf
    let renderer

    const init = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.5

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

      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      const envTex = pmremGenerator.fromScene(new RoomEnvironment()).texture
      scene.environment = envTex

      scene.add(new THREE.AmbientLight(0xffffff, 2))
      const dir1 = new THREE.DirectionalLight(0xffffff, 4)
      dir1.position.set(5, 10, 7)
      scene.add(dir1)

      // Muted violet + touch of sky blue — visible through ~0.24 opacity
      const palette = [
        { color: 0x8866cc, emissive: 0x5533aa },  // muted violet
        { color: 0x6644bb, emissive: 0x442299 },  // medium violet
        { color: 0x9977dd, emissive: 0x6644bb },  // soft violet
        { color: 0x7755bb, emissive: 0x4433aa },  // violet-gray
        { color: 0x5588bb, emissive: 0x336699 },  // sky blue-violet
        { color: 0x7799cc, emissive: 0x4466aa },  // soft sky blue
      ]

      new GLTFLoader().load('/ball.glb', (gltf) => {
        const model = gltf.scene
        let i = 0

        model.traverse((child) => {
          if (child.isMesh) {
            const p = palette[i % palette.length]
            const mats = Array.isArray(child.material) ? child.material : [child.material]
            mats.forEach((mat) => {
              mat.color.setHex(p.color)
              mat.emissive.setHex(p.emissive)
              mat.emissiveIntensity = 0.6
              mat.needsUpdate = true
            })
            i++
          }
        })

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

        // Play GLB animations
        let mixer = null
        if (gltf.animations?.length > 0) {
          mixer = new THREE.AnimationMixer(model)
          gltf.animations.forEach((clip) => mixer.clipAction(clip).play())
        }

        // Grow-in
        pivot.scale.setScalar(0)
        const t0 = performance.now()
        const grow = (now) => {
          const p = Math.min((now - t0) / 1500, 1)
          pivot.scale.setScalar(p === 1 ? 1 : 1 - Math.pow(2, -10 * p))
          if (p < 1) requestAnimationFrame(grow)
        }
        requestAnimationFrame(grow)

        // Pulse emissive for a living glow
        let lt = 0
        let last = performance.now()
        const tick = () => {
          raf = requestAnimationFrame(tick)
          const now = performance.now()
          const d = (now - last) / 1000
          last = now
          lt += d

          model.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.emissiveIntensity = 0.4 + Math.sin(lt * 1.8) * 0.25
            }
          })

          if (mixer) mixer.update(d)
          pivot.rotation.y += d * 0.4
          renderer.render(scene, camera)
        }
        tick()
      }, null, (err) => console.error('[Ball] Load error:', err))
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