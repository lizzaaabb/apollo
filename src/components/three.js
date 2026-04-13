'use client'
import { useEffect, useRef } from 'react'
import '../styles/three.css'

export default function ThreeBackground() {
  const bgRef = useRef(null)
  const modelRef = useRef(null)

  useEffect(() => {
    if (!customElements.get('model-viewer')) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js'
      document.head.appendChild(script)
    }

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const ratio = docHeight > 0 ? window.scrollY / docHeight : 0
      const scale = 1 + ratio * 1.1
      if (bgRef.current) {
        bgRef.current.style.transform = `scale(${scale})`
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={bgRef} className="cosmic-bg">
      <div className="threeBgGradient" />
      <div className="cosmic-nebula" />
      <div className="cosmic-stars" />
      <div className="cosmic-stars2" />
      <div className="cosmic-stars3" />
      <div className="cosmic-sparkle" />
      <div className="minecraft-wrapper">
        <model-viewer
          ref={modelRef}
          src="/minecraft.glb"
          alt="Minecraft"
          autoplay
          auto-rotate
          rotation-per-second="5deg"
          disable-zoom
          disable-pan
          interaction-prompt="none"
          reveal="auto"
          loading="lazy"
          tone-mapping="aces"
          exposure="1.2"
          shadow-intensity="0"
          environment-image="neutral"
          style={{
            width: '400px',
            height: '400px',
            background: 'transparent',
            '--progress-bar-color': 'transparent',
            '--progress-mask': 'transparent',
          }}
        >
          <style>{`model-viewer { background: transparent !important; }`}</style>
        </model-viewer>
      </div>
    </div>
  )
}