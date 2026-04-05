'use client'
import React, { useState, useEffect, useRef } from 'react'
import '../styles/projects.css'

const PROJECTS = [
  {
    id: 0,
    index: '01',
    step: 'FEATURED PROJECT',
    title: 'Apollo Creations',
    description: 'A modern web experience built with Next.js, featuring smooth animations and a clean design system.',
    tag: 'Web Development',
    url: '#',
    colors: ['#7c3aed', '#4f46e5', '#c084fc', '#818cf8'],
  },
  {
    id: 1,
    index: '02',
    step: 'E-COMMERCE',
    title: 'Nova Store',
    description: 'Full-stack e-commerce platform with real-time inventory, custom checkout flow, and admin dashboard.',
    tag: 'E-Commerce',
    url: '#',
    colors: ['#be185d', '#7c3aed', '#f472b6', '#c084fc'],
  },
  {
    id: 2,
    index: '03',
    step: 'WEB APP',
    title: 'Orbit Dashboard',
    description: 'SaaS analytics dashboard with live data visualizations, user management, and role-based access.',
    tag: 'SaaS / Dashboard',
    url: '#',
    colors: ['#0e7490', '#4f46e5', '#22d3ee', '#818cf8'],
  },
]

function GradientCanvas({ colors }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const timeRef   = useRef(Math.random() * 100)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const hexToRgb = (hex) => [
      parseInt(hex.slice(1,3),16),
      parseInt(hex.slice(3,5),16),
      parseInt(hex.slice(5,7),16),
    ]

    const blobs = colors.map((color, i) => ({
      x:  0.25 + (i % 2) * 0.5,
      y:  0.25 + Math.floor(i / 2) * 0.5,
      vx: (Math.random() - 0.5) * 0.0015,
      vy: (Math.random() - 0.5) * 0.0015,
      radius: 0.4 + Math.random() * 0.15,
      rgb: hexToRgb(color),
    }))

    const draw = () => {
      timeRef.current += 0.006
      const t = timeRef.current
      ctx.clearRect(0, 0, W, H)
      blobs.forEach((b, i) => {
        b.x += b.vx + Math.sin(t * 0.6 + i * 1.4) * 0.0008
        b.y += b.vy + Math.cos(t * 0.4 + i * 1.1) * 0.0008
        if (b.x < 0.1 || b.x > 0.9) b.vx *= -1
        if (b.y < 0.1 || b.y > 0.9) b.vy *= -1
        const grd = ctx.createRadialGradient(
          b.x * W, b.y * H, 0,
          b.x * W, b.y * H, b.radius * Math.max(W, H)
        )
        const [r,g,bl] = b.rgb
        grd.addColorStop(0,   `rgba(${r},${g},${bl},0.6)`)
        grd.addColorStop(0.5, `rgba(${r},${g},${bl},0.2)`)
        grd.addColorStop(1,   `rgba(${r},${g},${bl},0)`)
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, W, H)
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [colors])

  return <canvas ref={canvasRef} className='proj-canvas' />
}

export default function Projects() {
  const [active,  setActive]  = useState(0)
  const [visible, setVisible] = useState(0)
  const [fading,  setFading]  = useState(false)
  const fadingRef = useRef(false)
  const activeRef = useRef(0)

  const progress = active / (PROJECTS.length - 1)

  const goTo = (next) => {
    if (fadingRef.current || next === activeRef.current) return
    fadingRef.current = true
    setFading(true)
    setTimeout(() => {
      activeRef.current = next
      setActive(next)
      setVisible(next)
      fadingRef.current = false
      setFading(false)
    }, 380)
  }

  const goNext = () => { if (activeRef.current + 1 < PROJECTS.length) goTo(activeRef.current + 1) }
  const goPrev = () => { if (activeRef.current - 1 >= 0)              goTo(activeRef.current - 1) }

  const proj = PROJECTS[visible]

  return (
    <div className='proj-outer'>
      <div className='proj-card-wrap'>

        <div className={`proj-number ${fading ? 'proj-fade-out' : 'proj-fade-in'}`}>
          {proj.index}
        </div>

        <div className='proj-card'>
          <div className='proj-progress-track'>
            <div
              className='proj-progress-fill'
              style={{ height: `${progress * 100}%` }}
            />
            {PROJECTS.map((_, i) => (
              <div
                key={i}
                className='proj-progress-marker'
                style={{ top: `${(i / (PROJECTS.length - 1)) * 100}%` }}
              >
                <div className={`proj-progress-marker-dot ${i <= active ? 'proj-progress-marker-dot--active' : ''}`} />
              </div>
            ))}
          </div>

          <div className='proj-left'>
            <div className={`proj-meta ${fading ? 'proj-fade-out' : 'proj-fade-in'}`}>
              <span className='proj-step'>{proj.step}</span>
              <span className='proj-tag'>{proj.tag}</span>
            </div>

            <h2 className={`proj-title ${fading ? 'proj-fade-out' : 'proj-fade-in'}`}>
              {proj.title}
            </h2>

            <p className={`proj-desc ${fading ? 'proj-fade-out' : 'proj-fade-in'}`}>
              {proj.description}
            </p>

            <div className='proj-bottom'>
              <a href={proj.url} className='proj-cta' target='_blank' rel='noreferrer'>
                View Project
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                  <path d='M7 17L17 7M17 7H7M17 7v10' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
              </a>

              <div className='proj-nav'>
                <button
                  className={`proj-nav-btn${active === 0 ? ' proj-nav-btn--disabled' : ' proj-nav-btn--pulse'}`}
                  onClick={goPrev}
                  disabled={active === 0}
                >
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path d='M19 12H5M11 6l-6 6 6 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </button>
                <button
                  className={`proj-nav-btn${active === PROJECTS.length - 1 ? ' proj-nav-btn--disabled' : ' proj-nav-btn--pulse'}`}
                  onClick={goNext}
                  disabled={active === PROJECTS.length - 1}
                >
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path d='M5 12h14M13 6l6 6-6 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </button>
              </div>
            </div>

            <div className='proj-dots'>
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  className={`proj-dot ${i === active ? 'proj-dot--active' : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>

          <div className='proj-divider' />

          <div className='proj-right'>
            <div className={`proj-preview ${fading ? 'proj-fade-out' : 'proj-fade-in'}`}>
              <GradientCanvas colors={proj.colors} />
              <div className='proj-mock'>
                <div className='proj-mock-bar'>
                  <span className='proj-mock-dot proj-mock-dot--red'   />
                  <span className='proj-mock-dot proj-mock-dot--yellow'/>
                  <span className='proj-mock-dot proj-mock-dot--green' />
                  <span className='proj-mock-url'>{proj.title.toLowerCase().replace(' ', '') + '.io'}</span>
                </div>
                <div className='proj-mock-body'>
                  <div className='proj-mock-hero' />
                  <div className='proj-mock-lines'>
                    <div className='proj-mock-line proj-mock-line--70' />
                    <div className='proj-mock-line proj-mock-line--45' />
                  </div>
                  <div className='proj-mock-cards'>
                    <div className='proj-mock-card' />
                    <div className='proj-mock-card' />
                    <div className='proj-mock-card' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}