'use client'
import { useEffect, useRef } from 'react'

function makeGeo(THREE, shape) {
  if (shape === 'tetrahedron') return new THREE.TetrahedronGeometry(1, 0)
  if (shape === 'octahedron')  return new THREE.OctahedronGeometry(1, 0)
  if (shape === 'icosahedron') return new THREE.IcosahedronGeometry(1, 0)
  return new THREE.DodecahedronGeometry(1, 0)
}

export default function ShapeCanvas({ shape, solidColor, emissive }) {
  const canvasRef = useRef(null)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    let animId, renderer

    const init = async () => {
      try {
        const THREE = await import('three')
        if (!alive.current) return

        const canvas = canvasRef.current
        if (!canvas) return

        const RW = 800
        const RH = 220

        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        renderer.setClearColor(0x000000, 0)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(RW, RH, false)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(90, RW / RH, 0.1, 100)
        camera.position.z = 3.8

        const geo = makeGeo(THREE, shape)

        const solidMat = () => new THREE.MeshPhongMaterial({
          color: solidColor,
          emissive,
          emissiveIntensity: 0.28,
          shininess: 22,
          flatShading: true,
          side: THREE.DoubleSide,
        })

        const wireMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        })

        const wireMesh = new THREE.Mesh(geo, wireMat)
        wireMesh.scale.setScalar(2.2)
        wireMesh.position.set(0.3, 0.0, -0.4)
        wireMesh.rotation.set(0.3, 0.5, 0.1)
        scene.add(wireMesh)

        const mesh1 = new THREE.Mesh(geo, solidMat())
        mesh1.scale.setScalar(1.4)
        mesh1.position.set(-0.3, 0.0, 0.5)
        mesh1.rotation.set(0.2, -0.4, 0.15)
        scene.add(mesh1)

        const mesh2 = new THREE.Mesh(geo, solidMat())
        mesh2.scale.setScalar(0.9)
        mesh2.position.set(3.8, 0.1, 0.0)
        mesh2.rotation.set(-0.6, 0.9, 0.4)
        scene.add(mesh2)

        const mesh3 = new THREE.Mesh(geo, solidMat())
        mesh3.scale.setScalar(0.65)
        mesh3.position.set(-3.6, -0.3, -0.1)
        mesh3.rotation.set(1.1, 0.3, -0.5)
        scene.add(mesh3)

        scene.add(new THREE.AmbientLight(0xffffff, 0.5))
        const pt1 = new THREE.PointLight(0xffffff, 2.2, 30)
        pt1.position.set(4, 5, 5)
        scene.add(pt1)
        const pt2 = new THREE.PointLight(solidColor, 1.5, 20)
        pt2.position.set(-5, -3, 2)
        scene.add(pt2)
        const dir = new THREE.DirectionalLight(0xffffff, 0.9)
        dir.position.set(1, 4, 3)
        scene.add(dir)

        const mouse = { x: 0, y: 0 }
        const card = canvas.closest('.pricing-card')
        const onMove = (e) => {
          if (!card) return
          const rect = card.getBoundingClientRect()
          mouse.x =  ((e.clientX - rect.left) / rect.width  - 0.5) * 2
          mouse.y = -((e.clientY - rect.top)  / rect.height - 0.5) * 2
        }
        card?.addEventListener('mousemove', onMove)

        const animate = () => {
          if (!alive.current) return
          animId = requestAnimationFrame(animate)
          mesh1.rotation.y += 0.005
          mesh1.rotation.x += (mouse.y * 0.4 - mesh1.rotation.x) * 0.025
          mesh1.rotation.y += mouse.x * 0.003
          wireMesh.rotation.x += (mesh1.rotation.x * 0.85 - wireMesh.rotation.x) * 0.04
          wireMesh.rotation.y += (mesh1.rotation.y * 0.85 - wireMesh.rotation.y) * 0.04
          mesh2.rotation.y += 0.007
          mesh2.rotation.x -= 0.004
          mesh3.rotation.y -= 0.006
          mesh3.rotation.x += 0.005
          renderer.render(scene, camera)
        }
        animate()

        return () => card?.removeEventListener('mousemove', onMove)
      } catch (err) {
        console.error('ShapeCanvas error:', err)
      }
    }

    let cleanup
    init().then(fn => { cleanup = fn })

    return () => {
      alive.current = false
      cancelAnimationFrame(animId)
      renderer?.dispose()
    }
  }, [shape, solidColor, emissive])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}