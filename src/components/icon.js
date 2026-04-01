'use client'
import React, { useEffect, useRef } from 'react'

function Icon({ variant = 0 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      const THREE = await import('three')
      const mount = mountRef.current
      if (!mount) return

      const W = mount.clientWidth || 64
      const H = mount.clientHeight || 64

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
      camera.position.z = 2.8

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)

      // Crystal material — shared across all variants
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0xc084fc),
        emissive: new THREE.Color(0x6b21a8),
        emissiveIntensity: 0.4,
        specular: new THREE.Color(0xffffff),
        shininess: 120,
        transparent: true,
        opacity: 0.92,
        wireframe: false,
      })

      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xe9d5ff,
        transparent: true,
        opacity: 0.5,
      })

      let geometry
      switch (variant) {
        case 0: // Web Dev — icosahedron (many faces, complex crystal)
          geometry = new THREE.IcosahedronGeometry(0.9, 0)
          break
        case 1: // E-commerce — octahedron (diamond shape)
          geometry = new THREE.OctahedronGeometry(0.9, 0)
          break
        case 2: // SEO — tetrahedron (sharp, pointed)
          geometry = new THREE.TetrahedronGeometry(0.95, 0)
          break
        case 3: // Content — dodecahedron (rounded, many faces)
          geometry = new THREE.DodecahedronGeometry(0.85, 0)
          break
        default:
          geometry = new THREE.IcosahedronGeometry(0.9, 0)
      }

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      // Crystal edges
      const edges = new THREE.EdgesGeometry(geometry)
      const line = new THREE.LineSegments(edges, edgeMaterial)
      mesh.add(line)

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
      scene.add(ambientLight)

      const light1 = new THREE.DirectionalLight(0xc084fc, 2.0)
      light1.position.set(2, 3, 2)
      scene.add(light1)

      const light2 = new THREE.DirectionalLight(0xe9d5ff, 1.2)
      light2.position.set(-2, -1, 1)
      scene.add(light2)

      const light3 = new THREE.PointLight(0x7c3aed, 1.5, 10)
      light3.position.set(0, 0, 2)
      scene.add(light3)

      let animId
      let t = 0

      const animate = () => {
        animId = requestAnimationFrame(animate)
        t += 0.008

        // Gentle float + spin, slightly different per variant
        mesh.rotation.y = t * (0.6 + variant * 0.1)
        mesh.rotation.x = t * (0.3 + variant * 0.05)
        mesh.position.y = Math.sin(t * 1.2 + variant) * 0.06

        renderer.render(scene, camera)
      }
      animate()

      return () => {
        cancelAnimationFrame(animId)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement)
        }
      }
    }

    let cleanup
    init().then(fn => { cleanup = fn })
    return () => { if (cleanup) cleanup() }
  }, [variant])

  return (
    <div
      ref={mountRef}
      style={{ width: '64px', height: '64px', display: 'block' }}
    />
  )
}

export default Icon