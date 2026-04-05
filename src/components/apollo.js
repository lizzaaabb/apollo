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
        './afrodite.glb',
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

          const isMobile = window.innerWidth < 768
          const camDist = isMobile ? maxDim * 1.4 : maxDim * 1.6
          camera.position.set(0, 0, camDist)
          camera.near = maxDim * 0.01
          camera.far  = maxDim * 20
          camera.updateProjectionMatrix()

          // purple (bottom) → pink (mid) → light sky-blue (top)
          const getColor = (t) => {
            const c = Math.max(0, Math.min(1, t))
            if (c < 0.5) {
              const s = c * 2
              // deep purple → hot pink
              return [
                0.55 + s * 0.45,  // R: 0.55 → 1.0
                0.1  + s * 0.2,   // G: 0.1  → 0.3
                0.95 - s * 0.35,  // B: 0.95 → 0.6
              ]
            } else {
              const s = (c - 0.5) * 2
              // hot pink → light sky-blue
              return [
                1.0  - s * 0.65,  // R: 1.0  → 0.35
                0.3  + s * 0.55,  // G: 0.3  → 0.85
                0.6  + s * 0.4,   // B: 0.6  → 1.0
              ]
            }
          }

          const makeMaterial = () =>
            new THREE.PointsMaterial({
              size: isMobile ? 0.065 : 0.035,
              sizeAttenuation: true,
              vertexColors: true,
              transparent: true,
              opacity: 1.0,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            })

          const buildColoredPoints = (geometry) => {
            // Clone geometry so the color attribute is fresh and isolated
            const geo = geometry.clone()
            const positions = geo.attributes.position
            const count = positions.count
            const colors = new Float32Array(count * 3)

            for (let i = 0; i < count; i++) {
              const y = positions.getY(i)
              const t = (y - box.min.y) / (box.max.y - box.min.y)
              const [r, g, b] = getColor(t)
              colors[i * 3]     = r
              colors[i * 3 + 1] = g
              colors[i * 3 + 2] = b
            }

            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
            return new THREE.Points(geo, makeMaterial())
          }

          model.traverse((child) => {
            if (child.isPoints) {
              const points = buildColoredPoints(child.geometry)
              child.parent.add(points)
              child.visible = false
            }

            if (child.isMesh) {
              const points = buildColoredPoints(child.geometry)
              child.parent.add(points)
              child.visible = false
            }
          })

          // Grow-in animation
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

            pivot.rotation.y += d * 0.25
            pivot.position.y = Math.sin(now * 0.0008) * (maxDim * (isMobile ? 0.01 : 0.04))

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