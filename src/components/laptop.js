'use client'
import React, { useEffect, useRef } from 'react'
import '../styles/laptop.css'

const SCREEN_TEXTURE = '/screen2.png'

function Laptop() {
  const canvasRef = useRef(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    let renderer, animFrameId

    async function init() {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader')
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls')
      const gsap = (await import('gsap')).gsap

      const canvas = canvasRef.current
      if (!canvas) return

      const screenSize = [29.4, 20]
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(40, canvas.offsetWidth / canvas.offsetHeight, 10, 1000)
      camera.position.z = 75

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
      scene.add(ambientLight)

      const lightHolder = new THREE.Group()
      scene.add(lightHolder)
      const light = new THREE.PointLight(0xFFF5E1, 0.8)
      light.position.set(0, 5, 50)
      lightHolder.add(light)

      const orbit = new OrbitControls(camera, renderer.domElement)
      orbit.minDistance = 45
      orbit.maxDistance = 120
      orbit.enablePan = false
      orbit.enableDamping = true

      const macGroup = new THREE.Group()
      macGroup.position.z = -10
      scene.add(macGroup)

      const lidGroup = new THREE.Group()
      macGroup.add(lidGroup)
      const bottomGroup = new THREE.Group()
      macGroup.add(bottomGroup)

      // Materials
      const textLoader = new THREE.TextureLoader()

      const screenImageTexture = await new Promise(resolve =>
        textLoader.load(SCREEN_TEXTURE, tex => {
          tex.flipY = false
          tex.colorSpace = THREE.SRGBColorSpace 
          tex.wrapS = THREE.RepeatWrapping
          tex.repeat.y = tex.image.width / tex.image.height / screenSize[0] * screenSize[1]
          resolve(tex)
        })
      )

      const screenMaterial = new THREE.MeshBasicMaterial({ map: screenImageTexture, transparent: true, opacity: 0, side: THREE.BackSide })
      const keyboardTexture = textLoader.load('https://ksenia-k.com/img/threejs/keyboard-overlay.png')
      const keyboardMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaMap: keyboardTexture, transparent: true })
      const darkPlasticMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9, metalness: 0.9 })
      const cameraMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
      const baseMetalMaterial = new THREE.MeshStandardMaterial({ color: 0xCECFD3 })
      const logoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

      // Load model
      const loader = new GLTFLoader()
      const glb = await new Promise((resolve, reject) =>
        loader.load('https://ksenia-k.com/models/mac-noUv.glb', resolve, undefined, reject)
      )

      // Parse model
      ;[...glb.scene.children].forEach(child => {
        if (child.name === '_top') {
          lidGroup.add(child)
          ;[...child.children].forEach(mesh => {
            if (mesh.name === 'lid') mesh.material = baseMetalMaterial
            else if (mesh.name === 'logo') mesh.material = logoMaterial
            else if (mesh.name === 'screen-frame') mesh.material = darkPlasticMaterial
            else if (mesh.name === 'camera') mesh.material = cameraMaterial
          })
        } else if (child.name === '_bottom') {
          bottomGroup.add(child)
          ;[...child.children].forEach(mesh => {
            if (mesh.name === 'base') mesh.material = baseMetalMaterial
            else mesh.material = darkPlasticMaterial
          })
        }
      })

      // Screen
      const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(screenSize[0], screenSize[1]), screenMaterial)
      screenMesh.position.set(0, 10.5, -0.11)
      screenMesh.rotation.set(Math.PI, 0, 0)
      lidGroup.add(screenMesh)

      const screenLight = new THREE.RectAreaLight(0xffffff, 0, screenSize[0], screenSize[1])
      screenLight.position.set(0, 10.5, 0)
      screenLight.rotation.set(Math.PI, 0, 0)
      lidGroup.add(screenLight)

      const darkScreen = screenMesh.clone()
      darkScreen.position.set(0, 10.5, -0.111)
      darkScreen.rotation.set(Math.PI, Math.PI, 0)
      darkScreen.material = darkPlasticMaterial
      lidGroup.add(darkScreen)

      // Keyboard
      const keyboardKeys = new THREE.Mesh(new THREE.PlaneGeometry(27.7, 11.6), keyboardMaterial)
      keyboardKeys.rotation.set(-0.5 * Math.PI, 0, 0)
      keyboardKeys.position.set(0, 0.045, 7.21)
      bottomGroup.add(keyboardKeys)

      // Timelines
      const floatingTl = gsap.timeline({ repeat: -1 })
        .to([lidGroup.position, bottomGroup.position], { duration: 1.5, y: '+=1', ease: 'power1.inOut' }, 0)
        .to([lidGroup.position, bottomGroup.position], { duration: 1.5, y: '-=1', ease: 'power1.inOut' })
        .timeScale(0)

      const screenOnTl = gsap.timeline({ paused: true })
        .to(screenMaterial, { duration: 0.1, opacity: 0.96 }, 0)
        .to(screenLight, { duration: 0.1, intensity: 0.4 }, 0)

      const laptopOpeningTl = gsap.timeline({ paused: true })
        .from(lidGroup.position, { duration: 0.75, z: '+=.5' }, 0)
        .fromTo(lidGroup.rotation, { duration: 1, x: 0.5 * Math.PI }, { x: -0.2 * Math.PI }, 0)
        .to(screenOnTl, { duration: 0.06, progress: 1 }, 0.05)

      const textureScrollTl = gsap.timeline({ paused: true })
        .to(screenMaterial.map.offset, { duration: 2, y: 0.4, ease: 'power1.inOut' })

      const laptopAppearTl = gsap.timeline({ paused: true })
        .fromTo(macGroup.rotation, { x: 0.5 * Math.PI, y: 0.2 * Math.PI }, { duration: 2, x: 0.05 * Math.PI, y: -0.1 * Math.PI }, 0)
        .fromTo(macGroup.position, { y: -50 }, { duration: 1, y: -8 }, 0)

      gsap.timeline({ defaults: { ease: 'none' } })
        .to(laptopAppearTl, { duration: 1.5, progress: 1 }, 0)
        .to(laptopOpeningTl, { duration: 1, progress: 0.34 }, 0.5)
        .to(textureScrollTl, { duration: 1.5, progress: 1 }, 1.5)
        .to(textureScrollTl, { duration: 1, progress: 0 })
        .to(floatingTl, { duration: 1, timeScale: 1 }, 1)

      // Render loop
      function render() {
        animFrameId = requestAnimationFrame(render)
        orbit.update()
        lightHolder.quaternion.copy(camera.quaternion)
        renderer.render(scene, camera)
      }
      render()

      // Resize
      function onResize() {
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight
        camera.updateProjectionMatrix()
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
      }
      window.addEventListener('resize', onResize)
    }

    init().catch(console.error)

    return () => {
      mountedRef.current = false
      if (animFrameId) cancelAnimationFrame(animFrameId)
      if (renderer) renderer.dispose()
    }
  }, [])

  return (
    <div className="laptop-container">
      <canvas ref={canvasRef} id="laptop-canvas" className="laptop-canvas" />
    </div>
  )
}

export default Laptop