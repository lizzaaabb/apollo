'use client'
import { useEffect } from 'react'
import { loadModelViewer } from './modelViewerLoader'

export default function Ball() {
  useEffect(() => {
    loadModelViewer()
  }, [])

  return (
    <model-viewer
      src="/sadas.glb"
      alt="Ball"
      auto-rotate
      rotation-per-second="23deg"
      disable-zoom
      disable-pan
      interaction-prompt="none"
      reveal="auto"
      loading="lazy"
      tone-mapping="aces"
      exposure="1.5"
      shadow-intensity="0"
      environment-image="neutral"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
        '--progress-bar-color': 'transparent',
        '--progress-mask': 'transparent',
        filter: 'hue-rotate(260deg) saturate(2) brightness(0.85)',
      }}
    >
      <style>{`model-viewer { background: transparent !important; }`}</style>
    </model-viewer>
  )
}