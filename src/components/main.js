'use client'
import React, { useEffect, useRef } from 'react'
import '../styles/main.css'

function Main() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const ripplesRef = useRef([])
  const heroRef = useRef(null)

  // Scroll fade effect
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const isMobile = window.innerWidth <= 768

    const handleScroll = () => {
      const scrollY = window.scrollY
      const fadeStart = 80
      const fadeEnd = 420
      const progress = Math.min(Math.max((scrollY - fadeStart) / (fadeEnd - fadeStart), 0), 1)

      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      hero.style.opacity = 1 - eased
      hero.style.transform = `translateY(${eased * -40}px) scale(${1 - eased * 0.04})`

      if (!isMobile) {
        hero.style.filter = `blur(${eased * 8}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ripple effect
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawnRipple = (x, y) => {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: 60 + Math.random() * 40,
        life: 1.0,
        speed: 1.2 + Math.random() * 1.0,
        hue: 270 + Math.random() * 60,
      })
    }

    let lastX = 0, lastY = 0
    const handleMouseMove = (e) => {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 12) {
        spawnRipple(e.clientX, e.clientY)
        lastX = e.clientX
        lastY = e.clientY
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ripplesRef.current.forEach((r) => {
        r.radius += r.speed
        r.life = 1 - r.radius / r.maxRadius
        if (r.life <= 0) return

        const alpha = r.life * 0.4
        const lineWidth = r.life * 1.8

        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${r.hue}, 80%, 80%, ${alpha})`
        ctx.lineWidth = lineWidth
        ctx.stroke()

        if (r.radius > 8) {
          ctx.beginPath()
          ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(${r.hue + 20}, 70%, 85%, ${alpha * 0.5})`
          ctx.lineWidth = lineWidth * 0.5
          ctx.stroke()
        }

        if (r.radius < 12) {
          ctx.beginPath()
          ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${r.hue}, 90%, 90%, ${r.life * 0.8})`
          ctx.fill()
        }
      })
      ripplesRef.current = ripplesRef.current.filter(r => r.life > 0)
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="ripple-canvas" />

      <div
        ref={heroRef}
        style={{
          willChange: 'opacity, transform',
          transform: 'translateZ(0)',
          transition: 'none',
        }}
      >
        <div className='main-container'>
          <div className="left-container">
            <h1 className='header'>We are</h1>
            <h1 className='header header--accent'>Full-stack</h1>
            <h1 className='header'>web development</h1>
            <h1 className='header'>agency</h1>
            <span className='spano'>Some text about project description</span>
          </div>
          <div className="right-container">
            <div className="right-desc-container">
              <span className='right-description'>
                Some kind of description about my websites, services, anything where we specialize
              </span>
            </div>
            <div className="right-btn-container">
              <button className='right-btn-1'>
                Get Started <span className='sp-ar'></span>
              </button>
              <button className='right-btn-2'>Discover More</button>
            </div>
          </div>
        </div>
      </div>

      <section id="next-section">
        {/* your next section content here */}
      </section>
    </>
  )
}

export default Main