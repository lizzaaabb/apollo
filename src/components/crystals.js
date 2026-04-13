'use client'
import { useEffect } from 'react'
import { loadModelViewer } from '../components/modelViewerLoader'

export default function Crystal({ src, exposure = '1.2', environment = 'neutral', rotationSpeed = '23deg' }) {
  useEffect(() => {
    loadModelViewer()
  }, [])

  return (
    <model-viewer
      src={src}
      alt="Crystal"
      auto-rotate
      rotation-per-second={rotationSpeed}
      disable-zoom
      disable-pan
      interaction-prompt="none"
      reveal="auto"
      loading="lazy"
      tone-mapping="aces"
      exposure={exposure}
      shadow-intensity="0"
      environment-image={environment}
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