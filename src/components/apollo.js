'use client'
import { useEffect } from 'react'
import { loadModelViewer } from './modelViewerLoader'

export default function Apollo() {
  useEffect(() => {
    loadModelViewer()
  }, [])

  return (
    <model-viewer
      src="/afrodite.glb"
      alt="Afrodite"
      auto-rotate
      rotation-per-second="23deg"
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
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
        '--progress-bar-color': 'transparent',
        '--progress-mask': 'transparent',
      }}
    />
  )
}