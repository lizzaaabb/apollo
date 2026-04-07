'use client'
import { useEffect, useRef } from 'react'

export default function ThreeBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let raf
    let renderer

    const isLowEndAndroid = /Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const isMobile = isLowEndAndroid || isIOS

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
        antialias: !isLowEndAndroid,   // safe on iOS + desktop, risky on Android
        powerPreference: 'high-performance',
      })

      renderer.setPixelRatio(
        isLowEndAndroid
          ? 1
          : Math.min(window.devicePixelRatio, 2)
      )
      renderer.setClearColor(0x000000, 0)
      renderer.shadowMap.enabled = false
      renderer.outputColorSpace = THREE.SRGBColorSpace  // always — fixes dark colors on iOS
      renderer.toneMapping = isMobile
        ? THREE.NoToneMapping
        : THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.5

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)

      const resize = () => {
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)

      const ambient = new THREE.AmbientLight(0xc9a8ff, isMobile ? 1.2 : 0.8)
      scene.add(ambient)

      const dirLight = new THREE.DirectionalLight(0x7b35ff, isLowEndAndroid ? 5 : 9)
      dirLight.position.set(5, 3, 5)
      scene.add(dirLight)

      if (!isLowEndAndroid) {
        const rimLight = new THREE.DirectionalLight(0x9d4fff, 8)
        rimLight.position.set(-5, 0, -3)
        scene.add(rimLight)

        const fillLight = new THREE.DirectionalLight(0x5a1fd4, 5)
        fillLight.position.set(0, -5, 2)
        scene.add(fillLight)

        const backLight = new THREE.DirectionalLight(0x1a00aa, 4)
        backLight.position.set(0, 6, -4)
        scene.add(backLight)
      }

      let targetScale = 1.0
      let currentScale = 1.0
      const handleScroll = () => {
        const docHeight = document.body.scrollHeight - window.innerHeight
        targetScale = 1.0 + (docHeight > 0 ? window.scrollY / docHeight : 0) * 2
      }
      window.addEventListener('scroll', handleScroll, { passive: true })

      class SpecularGlossinessPlugin {
        constructor(parser) {
          this.parser = parser
          this.name = 'KHR_materials_pbrSpecularGlossiness'
        }

        getMaterialType() {
          return THREE.MeshStandardMaterial
        }

        async extendMaterialParams(materialIndex, materialParams) {
          const parser = this.parser
          const materialDef = parser.json.materials?.[materialIndex]
          if (!materialDef?.extensions?.[this.name]) return

          const sg = materialDef.extensions[this.name]
          const pending = []

          if (sg.diffuseTexture !== undefined) {
            pending.push(
              parser.assignTexture(materialParams, 'map', sg.diffuseTexture)
            )
          }

          materialParams.color = new THREE.Color(0x7a2fd4)

          if (sg.specularGlossinessTexture !== undefined) {
            pending.push(
              parser.assignTexture(materialParams, 'roughnessMap', sg.specularGlossinessTexture)
            )
          }

          materialParams.roughness = sg.glossinessFactor !== undefined
            ? 1.0 - sg.glossinessFactor
            : 1.0

          materialParams.metalness = 0.0

          await Promise.all(pending)
        }
      }

      const loader = new GLTFLoader()
      loader.register(parser => new SpecularGlossinessPlugin(parser))

      loader.load(
        '/venus.glb',
        (gltf) => {
          const model = gltf.scene

          model.traverse((child) => {
            if (child.isMesh && child.material) {
              const old = child.material

              if (isLowEndAndroid) {
                // Lambert only for weak Android GPUs — skips PBR shader
                child.material = new THREE.MeshLambertMaterial({
                  color: old.color ?? new THREE.Color(0x7a2fd4),
                  map: old.map ?? null,
                  normalMap: old.normalMap ?? null,
                  emissiveMap: old.emissiveMap ?? null,
                  emissive: old.emissive ?? new THREE.Color(0x000000),
                  transparent: old.transparent ?? false,
                  opacity: old.opacity ?? 1,
                })
                requestAnimationFrame(() => old.dispose())
              } else {
                // iOS + desktop: full PBR, keep all textures
                child.material.color.set(0x7a2fd4)
                child.material.needsUpdate = true
              }
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
            const safeDelta = Math.min((now - last) / 1000, 0.1)
            last = now

            currentScale += (targetScale - currentScale) * 0.05
            pivot.scale.setScalar(currentScale)
            pivot.rotation.y += safeDelta * 0.05
            pivot.rotation.x += safeDelta * 0.02

            renderer.render(scene, camera)
          }
          tick()
        },
        null,
        (err) => console.error('[Venus] load error:', err)
      )

      return () => {
        window.removeEventListener('scroll', handleScroll)
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
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 40%, #7c5cbf 0%, #5a3d9a 30%, #3a2570 55%, #1a0f3a 100%)',
      }} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}