'use client'
import React, { useEffect, useRef } from 'react'
import '../styles/pricing.css'

const CONTENT = [
  {
    category: 'Graphic Design',
    items: [
      {
        title: 'Simple Logo',
        price: '₾50',
        description: 'Clean, minimal logo to represent your brand identity.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#c084fc" strokeWidth="1.8"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        title: 'Professional Logo',
        price: '₾300',
        description: 'Detailed, unique logo with full concept and multiple variations.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Brand Identity',
        price: '₾600',
        description: 'Logo, color palette, typography and full usage guidelines.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#c084fc" strokeWidth="1.8"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#c084fc" strokeWidth="1.8"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#c084fc" strokeWidth="1.8"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#c084fc" strokeWidth="1.8"/>
          </svg>
        ),
      },
      {
        title: 'Brand Book',
        price: '₾1,200',
        description: 'Full brand system — print and digital ready, complete style guide.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" stroke="#c084fc" strokeWidth="1.8"/>
          </svg>
        ),
      },
    ],
  },
  {
    category: 'Web Development',
    items: [
      {
        title: 'Landing Page',
        price: '₾700',
        description: 'Single page, fast and modern. Perfect for showcasing a product or service.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="3" width="20" height="18" rx="2" stroke="#c084fc" strokeWidth="1.8"/>
            <path d="M2 7h20" stroke="#c084fc" strokeWidth="1.8"/>
            <path d="M6 5h.01M9 5h.01M12 5h.01" stroke="#c084fc" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        title: 'Business Website',
        price: '₾1,500',
        description: 'Multi-page informational website. +₾100 per additional page.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12h6v10" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Catalog Website',
        price: '₾1,500',
        description: 'Product or service catalog without payment integration.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="#c084fc" strokeWidth="1.8"/>
            <path d="M9 12h6M9 16h4" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        title: 'E-Commerce',
        price: '₾2,700',
        description: 'Full online store with payment integration, cart and order management.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },
]

const WHATSAPP = '574065469'

function usePricingBackground(canvasRef, containerRef) {
  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve()
        const s = document.createElement('script')
        s.src = src
        s.onload = resolve
        document.head.appendChild(s)
      })

    let animFrameId
    let renderer, scene, camera, plane
    let light1, light2, light3, light4
    let wWidth, wHeight
    let mounted = true
    const mouse = { x: 0, y: 0 }

    const setup = async () => {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js')
      if (!mounted) return

      const THREE = window.THREE
      const SimplexNoise = window.SimplexNoise
      const simplex = new SimplexNoise()

      const canvas = canvasRef.current
      if (!canvas) return

      const conf = {
        fov: 75,
        cameraZ: 75,
        xyCoef: 50,
        zCoef: 8,
        lightIntensity: 0.9,
        light1Color: 0x7c3aed,
        light2Color: 0xc084fc,
        light3Color: 0xa855f7,
        light4Color: 0x6d28d9,
      }

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setClearColor(0x000000, 0)
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(conf.fov)
      camera.position.z = 60

      const resize = () => {
        const container = containerRef.current
        const w = container?.offsetWidth || window.innerWidth
        const h = container?.offsetHeight || window.innerHeight
        if (!w || !h) return
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        const vFOV = (conf.fov * Math.PI) / 180
        wHeight = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ)
        wWidth = wHeight * camera.aspect
      }

      setTimeout(() => {
        resize()
        const r = 30, y = 10, dist = 500
        light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity, dist)
        light1.position.set(0, y, r); scene.add(light1)
        light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity, dist)
        light2.position.set(0, -y, -r); scene.add(light2)
        light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity, dist)
        light3.position.set(r, y, 0); scene.add(light3)
        light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity, dist)
        light4.position.set(-r, y, 0); scene.add(light4)

        const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide })
        const geo = new THREE.PlaneBufferGeometry(wWidth, wHeight, Math.floor(wWidth / 2), Math.floor(wHeight / 2))
        plane = new THREE.Mesh(geo, mat)
        plane.rotation.x = -Math.PI / 2 - 0.2
        plane.position.y = -25
        scene.add(plane)

        const onMouseMove = (e) => {
          const rect = canvas.getBoundingClientRect()
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        }
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('resize', resize)

        const animate = () => {
          if (!mounted) return
          animFrameId = requestAnimationFrame(animate)
          const gArray = plane.geometry.attributes.position.array
          const time = Date.now() * 0.0002
          for (let i = 0; i < gArray.length; i += 3) {
            gArray[i + 2] = simplex.noise4D(
              gArray[i] / conf.xyCoef,
              gArray[i + 1] / conf.xyCoef,
              time,
              mouse.x + mouse.y
            ) * conf.zCoef
          }
          plane.geometry.attributes.position.needsUpdate = true
          const t = Date.now() * 0.001
          const d = 50
          light1.position.x = Math.sin(t * 0.1) * d
          light1.position.z = Math.cos(t * 0.2) * d
          light2.position.x = Math.cos(t * 0.3) * d
          light2.position.z = Math.sin(t * 0.4) * d
          light3.position.x = Math.sin(t * 0.5) * d
          light3.position.z = Math.sin(t * 0.6) * d
          light4.position.x = Math.sin(t * 0.7) * d
          light4.position.z = Math.cos(t * 0.8) * d
          renderer.render(scene, camera)
        }
        animate()

        canvasRef._cleanup = () => {
          cancelAnimationFrame(animFrameId)
          window.removeEventListener('mousemove', onMouseMove)
          window.removeEventListener('resize', resize)
          renderer.dispose()
        }
      }, 50)
    }

    setup()
    return () => {
      mounted = false
      if (canvasRef._cleanup) canvasRef._cleanup()
    }
  }, [])
}

export default function Pricing() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  usePricingBackground(canvasRef, containerRef)

  return (
    <div className='pricing-wrapper'>
      <div className='pricing-container' ref={containerRef}>
        <canvas ref={canvasRef} className='pricing-canvas' />
        <div className='pricing-canvas-fade' />

        <div className='pricing-content'>
          <div className='pricing-header'>
            <span className='pricing-label'>Pricing</span>
            <h2 className='pricing-title'>Simple pricing</h2>
            <p className='pricing-subtitle'>No hidden fees. Every project starts with a free consultation.</p>
          </div>

          {CONTENT.map((section) => (
            <div key={section.category} className='pricing-section'>
              <div className='pricing-section-label'>
                <span>{section.category}</span>
                <div className='pricing-section-line' />
              </div>

              {/* 2×2 grid — top row + bottom row */}
              <div className='pricing-grid'>
                {section.items.map((item, i) => (
                  <div key={item.title} className='pricing-card' style={{ animationDelay: `${0.04 + i * 0.07}s` }}>
                    <div className='pricing-card-price-block'>
                      <span className='pricing-card-from'>from</span>
                      <div className='pricing-card-price'>{item.price}</div>
                    </div>
                    <div className='pricing-card-body'>
                      <div className='pricing-card-top'>
                        <div className='pricing-icon-wrap'>{item.icon}</div>
                        <h3 className='pricing-card-title'>{item.title}</h3>
                      </div>
                      <p className='pricing-card-desc'>{item.description}</p>
                      <a
                        href={`https://wa.me/${WHATSAPP}`}
                        target='_blank'
                        rel='noreferrer'
                        className='pricing-card-btn'
                      >
                        Get Started ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}