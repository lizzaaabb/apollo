'use client'
import React, { useEffect, useRef, useState } from 'react'

function ThreeBackground() {
  const mountRef  = useRef(null)
  const [showThree, setShowThree] = useState(true)

  useEffect(() => {
    // Skip Three.js entirely on Android
    const isAndroid = /android/i.test(navigator.userAgent)
    if (isAndroid) {
      setShowThree(false)
      return
    }

    const initThree = async () => {
      let THREE
      try {
        THREE = await import('three')
      } catch (e) {
        setShowThree(false)
        return
      }

      const mount = mountRef.current
      if (!mount) return

      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setShowThree(false)
        return
      }

      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.z = 4

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({
          antialias:       false,
          alpha:           true,
          powerPreference: 'default',
          precision:       'mediump',
        })
      } catch (e) {
        setShowThree(false)
        return
      }

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.5
      mount.appendChild(renderer.domElement)

      const geometry = new THREE.SphereGeometry(1, 128, 128)

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime:  { value: 8.0 },
          uScale: { value: 1.0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal     = normalize(normalMatrix * normal);
            vPosition   = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision mediump float;
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float uTime;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }
          float fbm(vec2 p) {
            float v = 0.0; float a = 0.5;
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p  = p * 2.1 + vec2(1.7, 9.2);
              a *= 0.5;
            }
            return v;
          }
          float warpedFbm(vec2 p, float t) {
            vec2 q = vec2(
              fbm(p + vec2(t * 0.08, t * 0.05)),
              fbm(p + vec2(5.2, 1.3) + vec2(t * 0.06, t * 0.09))
            );
            return fbm(p + 3.0 * q + vec2(t * 0.02, t * 0.01));
          }
          void main() {
            vec3 normal  = normalize(vNormal);
            vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
            float NdV          = max(dot(normal, viewDir), 0.0);
            float fresnel      = pow(1.0 - NdV, 2.0);
            float fresnelSharp = pow(1.0 - NdV, 5.0);
            float fresnelInner = pow(NdV, 1.2);
            float t = uTime * 0.10;
            vec2 baseCoord = vec2(vPosition.x + vPosition.z * 0.4, vPosition.y + vPosition.z * 0.3);
            float w = warpedFbm(baseCoord * 1.4, t);
            vec2 detailCoord = vec2(
              vPosition.x * 2.2 + sin(vPosition.y * 1.5 + t * 0.7) * 0.3,
              vPosition.y * 2.2 + cos(vPosition.z * 1.5 + t * 0.5) * 0.3
            ) + vec2(t * 0.12, t * 0.08);
            float n = mix(w, fbm(detailCoord), 0.35);
            vec3 coreGlow     = vec3(0.40, 0.12, 0.70);
            vec3 moltenPurple = vec3(0.32, 0.08, 0.55);
            vec3 deepViolet   = vec3(0.18, 0.03, 0.35);
            vec3 amethyst     = vec3(0.45, 0.20, 0.70);
            vec3 lavenderHot  = vec3(0.60, 0.35, 0.85);
            vec3 roseFlare    = vec3(0.70, 0.30, 0.65);
            vec3 frostEdge    = vec3(0.75, 0.70, 0.90);
            vec3 col = deepViolet;
            col = mix(col, moltenPurple, smoothstep(0.20, 0.45, n));
            col = mix(col, coreGlow,     smoothstep(0.38, 0.60, n));
            col = mix(col, amethyst,     smoothstep(0.50, 0.70, n));
            col = mix(col, lavenderHot,  smoothstep(0.62, 0.80, n));
            col = mix(col, roseFlare,    smoothstep(0.72, 0.90, n * n * 1.4));
            float innerGlow = fresnelInner * fresnelInner;
            col = mix(col, lavenderHot * 1.2, innerGlow * 0.55);
            col = mix(col, coreGlow, innerGlow * 0.30);
            col += coreGlow * (sin(t * 2.2) * 0.5 + 0.5) * 0.08;
            float rimShift = sin(t * 0.4 + vPosition.y * 3.0) * 0.5 + 0.5;
            vec3 rimColor = mix(vec3(0.70, 0.50, 1.00), vec3(0.85, 0.70, 1.00), rimShift);
            rimColor = mix(rimColor, frostEdge, fresnelSharp * 0.7);
            vec3 color = mix(col, rimColor, fresnel * 0.80);
            color += frostEdge   * pow(max(dot(normal, normalize(vec3( 0.4,  0.7, 1.0))), 0.0), 120.0) * 1.00;
            color += lavenderHot * pow(max(dot(normal, normalize(vec3(-0.5,  0.4, 0.8))), 0.0),  30.0) * 0.35;
            color += roseFlare   * pow(max(dot(normal, normalize(vec3( 0.3, -0.8, 0.6))), 0.0),  25.0) * 0.25;
            color = clamp(color, deepViolet * 0.7, vec3(1.0, 0.95, 1.0));
            gl_FragColor = vec4(color, mix(0.98, 0.70, fresnel * 0.45));
          }
        `,
        transparent: true,
        side: THREE.FrontSide,
      })

      const sphere = new THREE.Mesh(geometry, material)
      scene.add(sphere)

      let targetScale  = 1.0
      let currentScale = 1.0
      let animId       = null
      let isContextLost = false
      const clock = new THREE.Clock()

      const animate = () => {
        if (isContextLost) return
        animId = requestAnimationFrame(animate)
        const elapsed = clock.getElapsedTime()
        currentScale += (targetScale - currentScale) * 0.05
        sphere.scale.setScalar(currentScale)
        material.uniforms.uScale.value = currentScale
        sphere.rotation.y = elapsed * 0.05
        sphere.rotation.x = elapsed * 0.02
        material.uniforms.uTime.value = elapsed + 8.0
        renderer.render(scene, camera)
      }

      const handleContextLost = (e) => {
        e.preventDefault()
        isContextLost = true
        cancelAnimationFrame(animId)
        animId = null
      }
      const handleContextRestored = () => {
        isContextLost = false
        clock.start()
        animate()
      }
      renderer.domElement.addEventListener('webglcontextlost',     handleContextLost,    false)
      renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false)

      const handleVisibility = () => {
        if (document.visibilityState === 'visible' && !isContextLost) {
          clock.start()
          if (!animId) animate()
        } else {
          cancelAnimationFrame(animId)
          animId = null
        }
      }
      document.addEventListener('visibilitychange', handleVisibility)

      const handleScroll = () => {
        const progress = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1)
        targetScale = 1.0 + progress * 2.0
      }
      window.addEventListener('scroll', handleScroll, { passive: true })

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', handleResize)

      animate()

      return () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('scroll',   handleScroll)
        window.removeEventListener('resize',   handleResize)
        document.removeEventListener('visibilitychange', handleVisibility)
        renderer.domElement.removeEventListener('webglcontextlost',     handleContextLost)
        renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      }
    }

    let cleanup
    initThree().then((fn) => { cleanup = fn })
    return () => { if (cleanup) cleanup() }
  }, [])

  // Pure CSS fallback for Android — animated orb that looks similar
  const androidFallback = (
    <>
      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.9; }
          50%       { transform: translate(-50%, -50%) scale(1.08); opacity: 1;   }
        }
        @keyframes orbRotate {
          from { transform: translate(-50%, -50%) rotate(0deg);   }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { opacity: 0.6; transform: translate(-50%, -50%) scale(0.95) rotate(0deg);   }
          50%  { opacity: 1.0; transform: translate(-50%, -50%) scale(1.05) rotate(180deg); }
          100% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.95) rotate(360deg); }
        }
      `}</style>

      {/* Base gradient background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 40%, #7c5cbf 0%, #5a3d9a 30%, #3a2570 55%, #1a0f3a 100%)',
      }} />

      {/* Outer glow ring */}
      <div style={{
        position: 'fixed', zIndex: 1, pointerEvents: 'none',
        width: '80vw', height: '80vw',
        maxWidth: '500px', maxHeight: '500px',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(96,53,133,0.0) 40%, rgba(96,53,133,0.35) 70%, rgba(60,20,100,0.0) 100%)',
        animation: 'orbPulse 4s ease-in-out infinite',
      }} />

      {/* Main orb */}
      <div style={{
        position: 'fixed', zIndex: 2, pointerEvents: 'none',
        width: '70vw', height: '70vw',
        maxWidth: '440px', maxHeight: '440px',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 35% 35%,
            rgba(180,140,255,0.55) 0%,
            rgba(140,80,220,0.50) 20%,
            rgba(100,30,180,0.55) 45%,
            rgba(60,10,120,0.70) 70%,
            rgba(25,5,60,0.80)   100%
          )
        `,
        boxShadow: `
          inset -8px -8px 30px rgba(180,120,255,0.25),
          inset  4px  4px 20px rgba(220,180,255,0.20),
          0 0 60px rgba(120,60,200,0.40),
          0 0 120px rgba(80,30,150,0.25)
        `,
        animation: 'orbPulse 4s ease-in-out infinite',
      }} />

      {/* Shimmer layer — rotating highlight */}
      <div style={{
        position: 'fixed', zIndex: 3, pointerEvents: 'none',
        width: '70vw', height: '70vw',
        maxWidth: '440px', maxHeight: '440px',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `
          conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(200,170,255,0.12) 20%,
            rgba(255,230,255,0.18) 30%,
            transparent 40%,
            transparent 60%,
            rgba(180,140,255,0.10) 75%,
            transparent 85%
          )
        `,
        animation: 'shimmer 8s linear infinite',
      }} />

      {/* Top-left specular highlight */}
      <div style={{
        position: 'fixed', zIndex: 4, pointerEvents: 'none',
        width: '28vw', height: '28vw',
        maxWidth: '180px', maxHeight: '180px',
        top: 'calc(50% - 22vw)',
        left: 'calc(50% - 18vw)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(230,210,255,0.35) 0%, transparent 70%)',
        filter: 'blur(6px)',
      }} />
    </>
  )

  if (!showThree) return androidFallback

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 40%, #7c5cbf 0%, #5a3d9a 30%, #3a2570 55%, #1a0f3a 100%)',
      }} />
      <div
        ref={mountRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      />
    </>
  )
}

export default ThreeBackground