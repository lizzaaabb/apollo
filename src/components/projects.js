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

  const sectionRef    = useRef(null)
  const activeRef     = useRef(0)
  const fadingRef     = useRef(false)

  // Wheel state
  const wheelAccum    = useRef(0)
  const lastWheelTs   = useRef(0)
  const cooldownRef   = useRef(false)   // true while transition is playing
  // Edge-exit: track whether we've "armed" the boundary so one extra scroll exits
  const edgeArmedRef  = useRef(null)    // 'start' | 'end' | null

  // Touch state
  const touchStartY   = useRef(0)
  const touchStartX   = useRef(0)
  const touchConsumed = useRef(false)
  const touchExiting  = useRef(false)

  const progress = active / (PROJECTS.length - 1)

  const isStuck = () => {
    const el = sectionRef.current
    if (!el) return false
    const rect = el.getBoundingClientRect()
    // Use 60px tolerance — mobile browsers shift innerHeight as toolbars show/hide
    return rect.top <= 60 && rect.bottom >= window.innerHeight - 60
  }

  const snapEdge = (edge) => {
    const el = sectionRef.current
    if (!el) return
    if (edge === 'bottom') {
      window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight, behavior: 'instant' })
    } else {
      window.scrollTo({ top: el.offsetTop, behavior: 'instant' })
    }
  }

  const goTo = (next) => {
    if (fadingRef.current || next === activeRef.current) return
    fadingRef.current = true
    cooldownRef.current = true
    setFading(true)
    setTimeout(() => {
      activeRef.current = next
      setActive(next)
      setVisible(next)
      fadingRef.current = false
      setFading(false)
      // release wheel cooldown slightly after transition ends
      setTimeout(() => { cooldownRef.current = false }, 100)
    }, 650)
  }

  const goNext = () => { if (activeRef.current + 1 < PROJECTS.length) goTo(activeRef.current + 1) }
  const goPrev = () => { if (activeRef.current - 1 >= 0)              goTo(activeRef.current - 1) }

  useEffect(() => {
    // ── Wheel ────────────────────────────────────────────────────────────
    const handleWheel = (e) => {
      if (!isStuck()) return

      const atEnd   = activeRef.current === PROJECTS.length - 1
      const atStart = activeRef.current === 0
      const down    = e.deltaY > 0

      // --- Edge-exit logic ---
      // If we're at a boundary and the user scrolls toward the outside,
      // arm the edge on first scroll, then let the second scroll exit.
      if (down && atEnd) {
        if (edgeArmedRef.current === 'end') {
          // Second scroll: snap to bottom and release
          snapEdge('bottom')
          edgeArmedRef.current = null
          return  // allow browser scroll through
        }
        // First scroll: arm it, stay put
        edgeArmedRef.current = 'end'
        e.preventDefault()
        return
      }
      if (!down && atStart) {
        if (edgeArmedRef.current === 'start') {
          snapEdge('top')
          edgeArmedRef.current = null
          return
        }
        edgeArmedRef.current = 'start'
        e.preventDefault()
        return
      }

      // Reset arm when scrolling inward
      edgeArmedRef.current = null

      e.preventDefault()

      if (cooldownRef.current) return

      const now = Date.now()
      // Reset accumulator if the user paused scrolling
      if (now - lastWheelTs.current > 400) wheelAccum.current = 0
      lastWheelTs.current = now

      // Clamp per-tick delta to avoid trackpad bursts
      const clamped = Math.max(-60, Math.min(60, e.deltaY))
      wheelAccum.current += clamped

      const THRESHOLD = 100
      if (wheelAccum.current >  THRESHOLD) { wheelAccum.current = 0; goNext() }
      if (wheelAccum.current < -THRESHOLD) { wheelAccum.current = 0; goPrev() }
    }

    // ── Touch ─────────────────────────────────────────────────────────────
    const onTouchStart = (e) => {
      touchStartY.current   = e.touches[0].clientY
      touchStartX.current   = e.touches[0].clientX
      touchConsumed.current = false
      touchExiting.current  = false
    }

    const onTouchMove = (e) => {
      if (!isStuck()) return
      if (touchExiting.current) return

      const dy = touchStartY.current - e.touches[0].clientY
      const dx = touchStartX.current - e.touches[0].clientX

      // Horizontal swipe — don't hijack
      if (Math.abs(dx) > Math.abs(dy) + 5) return

      const atEnd   = activeRef.current === PROJECTS.length - 1
      const atStart = activeRef.current === 0

      if (dy > 0 && atEnd) {
        // swiping down on last — let page scroll through
        if (dy > 30) {
          snapEdge('bottom')
          touchExiting.current = true
        }
        return
      }
      if (dy < 0 && atStart) {
        if (dy < -30) {
          snapEdge('top')
          touchExiting.current = true
        }
        return
      }

      e.preventDefault()
      if (touchConsumed.current || cooldownRef.current) return

      const THRESHOLD = 45
      if (dy >  THRESHOLD) { touchConsumed.current = true; goNext() }
      if (dy < -THRESHOLD) { touchConsumed.current = true; goPrev() }
    }

    const el = sectionRef.current

    window.addEventListener('wheel',      handleWheel,  { passive: false })
    // Attach touch listeners to the full tall wrapper so the entire
    // section area (not just the sticky child) receives the gestures
    el?.addEventListener('touchstart', onTouchStart, { passive: true  })
    el?.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      window.removeEventListener('wheel',     handleWheel)
      el?.removeEventListener('touchstart',  onTouchStart)
      el?.removeEventListener('touchmove',   onTouchMove)
    }
  }, [])

  const proj = PROJECTS[visible]

  return (
    <div
      ref={sectionRef}
      className='proj-scroll-wrapper'
      style={{ height: `${PROJECTS.length * 100}vh` }}
    >
      <div className='proj-sticky'>
        <div className='proj-outer'>

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
                  <button className='proj-nav-btn' onClick={goPrev} disabled={active === 0}>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                      <path d='M19 12H5M11 6l-6 6 6 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                    </svg>
                  </button>
                  <button className='proj-nav-btn' onClick={goNext} disabled={active === PROJECTS.length - 1}>
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

          {active < PROJECTS.length - 1 && (
            <div className='proj-hint'>
              <span>scroll for next</span>
              <svg width='12' height='12' viewBox='0 0 24 24' fill='none'>
                <path d='M12 5v14M6 15l6 6 6-6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
              </svg>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}