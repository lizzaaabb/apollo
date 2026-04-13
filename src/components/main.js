'use client'
import React, { useEffect, useRef } from 'react'
import '../styles/main.css'

function Main() {
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const ripplesRef = useRef([])
  const rafRef = useRef(null)

  // Scroll fade
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const isMobile = window.innerWidth <= 768

    const onScroll = () => {
      const p = Math.min(Math.max((window.scrollY - 80) / 340, 0), 1)
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      hero.style.opacity = 1 - e
      hero.style.transform = `translateY(${e * -40}px) scale(${1 - e * 0.04})`
      if (!isMobile) hero.style.filter = `blur(${e * 8}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ripple canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const isMobile = window.innerWidth <= 768
    let lastX = 0, lastY = 0

    const onMouseMove = (e) => {
      if (isMobile) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      if (dx * dx + dy * dy > 144) {
        ripplesRef.current.push({
          x: e.clientX, y: e.clientY,
          radius: 0,
          maxRadius: 60 + Math.random() * 40,
          life: 1,
          speed: 1.2 + Math.random(),
          hue: 270 + Math.random() * 60,
        })
        lastX = e.clientX
        lastY = e.clientY
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ripplesRef.current = ripplesRef.current.filter(r => {
        r.radius += r.speed
        r.life = 1 - r.radius / r.maxRadius
        if (r.life <= 0) return false

        const a = r.life * 0.4
        const lw = r.life * 1.8

        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${r.hue},80%,80%,${a})`
        ctx.lineWidth = lw
        ctx.stroke()

        if (r.radius > 8) {
          ctx.beginPath()
          ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(${r.hue + 20},70%,85%,${a * 0.5})`
          ctx.lineWidth = lw * 0.5
          ctx.stroke()
        }

        if (r.radius < 12) {
          ctx.beginPath()
          ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${r.hue},90%,90%,${r.life * 0.8})`
          ctx.fill()
        }
        return true
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="ripple-canvas" />
      <div
        ref={heroRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 2,
          willChange: 'opacity, transform',
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
                Get Started <span className='sp-ar' />
              </button>
              <button className='right-btn-2'>Discover More</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Main