'use client'
import { useEffect, useRef } from 'react'
import '../styles/three.css'

export default function ThreeBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let raf
    let renderer

    const ua = navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/i.test(ua)
    const isAndroid = /Android/i.test(ua)
    const isMobile = isIOS || isAndroid

    // Much more permissive — only block truly broken WebGL
    const checkGPUCapability = () => {
      try {
        const testCanvas = document.createElement('canvas')
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl')
        if (!gl) return false
        // Skip renderer string check entirely — it's blocked on most mobile browsers
        // and causes false negatives. Just verify basic WebGL works.
        const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE)
        if (maxTexture < 512) return false
        return true
      } catch {
        return false
      }
    }

    if (!checkGPUCapability()) return

    const handleContextLost = (e) => {
      e.preventDefault()
      cancelAnimationFrame(raf)
    }
    canvas.addEventListener('webglcontextlost', handleContextLost)

    const init = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'high-performance',
      })

      renderer.setPixelRatio(
        isMobile
          ? Math.min(window.devicePixelRatio, 1.5)
          : Math.min(window.devicePixelRatio, 2)
      )
      renderer.setClearColor(0x000000, 0)
      renderer.shadowMap.enabled = false
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.3

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)

      // ── Resize — use window size as fallback for mobile ──
      const getSize = () => ({
        w: canvas.clientWidth  || canvas.offsetWidth  || window.innerWidth,
        h: canvas.clientHeight || canvas.offsetHeight || window.innerHeight,
      })

      const resize = () => {
        const { w, h } = getSize()
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)
      // Also listen to window resize as belt-and-suspenders on mobile
      window.addEventListener('resize', resize, { passive: true })

      const ambient = new THREE.AmbientLight(0xc9a8ff, 0.8)
      scene.add(ambient)

      const dirLight = new THREE.DirectionalLight(0x7b35ff, 7)
      dirLight.position.set(5, 3, 5)
      scene.add(dirLight)

      const rimLight = new THREE.DirectionalLight(0x9d4fff, 8)
      rimLight.position.set(-5, 0, -3)
      scene.add(rimLight)

      const fillLight = new THREE.DirectionalLight(0x5a1fd4, 5)
      fillLight.position.set(0, -5, 2)
      scene.add(fillLight)

      const backLight = new THREE.DirectionalLight(0x1a00aa, 4)
      backLight.position.set(0, 6, -4)
      scene.add(backLight)

      let targetScale = 1.0
      let currentScale = 1.0

      const handleScroll = () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const ratio = docHeight > 0 ? window.scrollY / docHeight : 0
        targetScale = 1.0 + ratio * 2.0
      }
      window.addEventListener('scroll', handleScroll, { passive: true })

      const loader = new GLTFLoader()

      loader.load(
        '/venus.glb',
        (gltf) => {
          const model = gltf.scene

          model.traverse((child) => {
            if (child.isMesh && child.material) {
              // Clone to avoid mutating cached material
              child.material = child.material.clone()
              child.material.color.set(0x8844d8)
              child.material.needsUpdate = true
            }
          })

          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)

          const pivot = new THREE.Group()
          model.position.set(-center.x, -center.y, -center.z)
          pivot.add(model)
          scene.add(pivot)

          camera.position.set(0, 0, maxDim * 2.8)
          camera.lookAt(0, 0, 0)
          camera.near = maxDim * 0.01
          camera.far = maxDim * 20
          camera.updateProjectionMatrix()

          // Force a resize now that model is loaded and camera is set
          resize()

          let startTime = null
          const rotSpeed  = isMobile ? 0.03  : 0.05
          const rotSpeedX = isMobile ? 0.012 : 0.02

          const tick = (now) => {
            raf = requestAnimationFrame(tick)
            if (!startTime) startTime = now

            const rawDelta  = (now - (tick._last ?? now)) / 1000
            const safeDelta = Math.min(rawDelta, 0.05)
            tick._last = now

            if (rawDelta > 0.5) startTime += rawDelta * 1000

            const growP     = Math.min((now - startTime) / 1500, 1)
            const growScale = growP === 1 ? 1 : 1 - Math.pow(2, -10 * growP)

            currentScale += (targetScale - currentScale) * 0.12
            const finalScale = Math.max(growScale * currentScale, 0.15)
            pivot.scale.setScalar(finalScale)

            pivot.rotation.y += safeDelta * rotSpeed
            pivot.rotation.x += safeDelta * rotSpeedX

            renderer.render(scene, camera)
          }
          requestAnimationFrame(tick)
        },
        undefined,
        (err) => console.error('[Venus] load error:', err)
      )

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', resize)
        ro.disconnect()
      }
    }

    let cleanup
    init().then((fn) => { cleanup = fn })

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      renderer?.dispose()
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <>
      <div className="threeBgGradient" />
      <div className="threeBgCanvas">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </>
  )
}