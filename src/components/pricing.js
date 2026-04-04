'use client'
import React, { useEffect, useRef } from 'react'

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Afacad:wght@400;500&display=swap');

.pricing-wrapper {
  align-self: stretch;
  width: 97%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 20px;
  overflow: hidden;
  box-sizing: border-box;
}

.pricing-container {
  position: relative;
  background: #ffffff;
  padding: 48px 40px 0;
  min-height: 100vh;
  box-sizing: border-box;
}

.pricing-canvas {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 0 !important;
  pointer-events: none !important;
}

.pricing-canvas-fade {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 55%;
  background: linear-gradient(to bottom, #ffffff 60%, transparent 100%);
  z-index: 1;
  pointer-events: none;
}

.pricing-content {
  position: relative;
  z-index: 2;
}

.pricing-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  margin-bottom: 28px;
}

.pricing-label {
  font-family: 'Unbounded', sans-serif;
  font-size: 0.55rem;
  font-weight: 400;
  letter-spacing: 0.30em;
  color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
}

.pricing-title {
  font-family: 'Unbounded', sans-serif;
  font-size: clamp(1.6rem, 4vw, 3rem);
  font-weight: 900;
  color: #0d0820;
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.0;
  text-transform: uppercase;
}

.pricing-subtitle {
  font-family: 'Afacad', sans-serif;
  font-size: 1rem;
  color: rgba(13, 8, 32, 0.45);
  margin: 0;
  font-weight: 400;
}

.pricing-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.pricing-section-label {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pricing-section-label span {
  font-family: 'Unbounded', sans-serif;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  white-space: nowrap;
}

.pricing-section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.12), transparent);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition:
    transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
    border-color 0.35s ease,
    box-shadow 0.35s ease,
    background 0.35s ease;
  animation: fadeUp 0.55s cubic-bezier(0.23, 1, 0.32, 1) both;
}

.pricing-card::after {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.60);
  border-color: rgba(0, 0, 0, 0.22);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.pricing-card:hover::after { opacity: 1; }

.pricing-card:nth-child(1) { animation-delay: 0.04s; }
.pricing-card:nth-child(2) { animation-delay: 0.10s; }
.pricing-card:nth-child(3) { animation-delay: 0.16s; }
.pricing-card:nth-child(4) { animation-delay: 0.22s; }
.pricing-card:nth-child(5) { animation-delay: 0.28s; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pricing-card-price-block {
  position: relative;
  z-index: 2;
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.pricing-card-from {
  font-family: 'Afacad', sans-serif;
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.35);
  display: block;
  margin-bottom: 2px;
}

.pricing-card-price {
  font-family: 'Unbounded', sans-serif;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
  font-weight: 900;
  color: #0d0820;
  letter-spacing: -0.03em;
  line-height: 1;
  transition: color 0.3s ease;
}

.pricing-card:hover .pricing-card-price { color: #000000; }

.pricing-card-body {
  position: relative;
  z-index: 2;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.pricing-card-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pricing-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

.pricing-card:hover .pricing-icon-wrap {
  background: rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.20);
  transform: rotate(-8deg) scale(1.08);
}

.pricing-card-title {
  font-family: 'Unbounded', sans-serif;
  font-size: 0.55rem;
  font-weight: 700;
  color: #111111;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

.pricing-card-desc {
  font-family: 'Afacad', sans-serif;
  font-size: 0.88rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.50);
  line-height: 1.55;
  margin: 0;
  flex: 1;
}

.pricing-card-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 0;
  width: 100%;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  background: transparent;
  color: rgba(0, 0, 0, 0.65);
  font-family: 'Unbounded', sans-serif;
  font-size: 0.48rem;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  margin-top: auto;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.2s ease;
}

.pricing-card-btn:hover {
  background: #000000;
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  transform: translateY(-1px);
}

@media (max-width: 1100px) {
  .pricing-grid { grid-template-columns: repeat(3, 1fr); }
  .pricing-container { padding: 36px 24px 0; }
}
@media (max-width: 700px) {
  .pricing-grid { grid-template-columns: repeat(2, 1fr); }
  .pricing-title { font-size: 1.5rem; }
  .pricing-container { padding: 28px 16px 0; }
}
@media (max-width: 440px) {
  .pricing-grid { grid-template-columns: 1fr; }
}
`

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
      {
        title: 'Ad Templates',
        price: '₾150',
        description: 'Social media and advertising templates ready for any platform.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="#c084fc" strokeWidth="1.8"/>
            <path d="M8 12h8M12 9v6" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round"/>
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
        description: 'Informational multi-page website. +₾100 per additional page.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12h6v10" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Tourism Website',
        price: '₾1,100',
        description: 'Stunning travel and hospitality websites built to attract and convert.',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#c084fc" strokeWidth="1.8"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round"/>
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
        // reads .pricing-container directly via ref, not canvas.parentElement
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
    <>
      <style>{styles}</style>
      {/* pricing-wrapper: width 97%, border-radius, overflow:hidden — clips canvas to rounded shape */}
      <div className='pricing-wrapper'>
        {/* pricing-container: position:relative so canvas is absolutely positioned inside it */}
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
                <div className='pricing-grid'>
                  {section.items.map((item) => (
                    <div key={item.title} className='pricing-card'>
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
    </>
  )
}