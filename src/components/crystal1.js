'use client'
import { useEffect, useRef } from 'react'

export default function Crystal1() {
  const viewerRef = useRef(null)

  useEffect(() => {
    // Dynamically load model-viewer web component
    if (!customElements.get('model-viewer')) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js'
      document.head.appendChild(script)
    }
  }, [])

  return (
    <model-viewer
      ref={viewerRef}
      src="/crystal1.glb"
      alt="Crystal"
      auto-rotate
      rotation-per-second="23deg"
      camera-controls={undefined}
      disable-zoom
      disable-pan
      interaction-prompt="none"
      reveal="auto"
      loading="lazy"
      tone-mapping="aces"
      exposure="1.2"
      shadow-intensity="0"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
        '--progress-bar-color': 'transparent',
        '--progress-mask': 'transparent',
      }}
      environment-image="neutral"
    >
      <style>{`
        model-viewer {
          background: transparent !important;
        }
      `}</style>
    </model-viewer>
  )
}