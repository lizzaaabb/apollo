'use client'
import React, { useEffect, useRef } from 'react'

function ThreeBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const initThree = async () => {
      const THREE = await import('three')

      const mount = mountRef.current
      if (!mount) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      )
      camera.position.z = 4

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.5
      mount.appendChild(renderer.domElement)

      const geometry = new THREE.SphereGeometry(1, 64, 64)

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
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float uTime;

          // ── Noise (same hash, same quality) ──────────────────────────
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i),             hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          // ── 4 octaves instead of 7 — looks ~90% the same ─────────────
          float fbm(vec2 p) {
            float v = 0.0, a = 0.5;
            v += a * noise(p); p = p * 2.1 + vec2(1.7, 9.2); a *= 0.5;
            v += a * noise(p); p = p * 2.1 + vec2(1.7, 9.2); a *= 0.5;
            v += a * noise(p); p = p * 2.1 + vec2(1.7, 9.2); a *= 0.5;
            v += a * noise(p);
            return v;
          }

          void main() {
            vec3 normal  = normalize(vNormal);
            vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
            float NdV    = max(dot(normal, viewDir), 0.0);

            float fresnel      = pow(1.0 - NdV, 2.0);
            float fresnelSharp = pow(1.0 - NdV, 5.0);
            float fresnelInner = pow(NdV, 1.2);

            float t = uTime * 0.10;

            // ── Single animated fbm instead of warpedFbm ──────────────
            // Animate the sample coord over time — same organic flow feel
            vec2 coord = vec2(
              vPosition.x + vPosition.z * 0.4 + t * 0.07,
              vPosition.y + vPosition.z * 0.3 + t * 0.05
            );
            // One cheap warp pass (was 3 expensive passes before)
            vec2 warped = coord + 0.5 * vec2(
              fbm(coord + vec2(1.7, 9.2)),
              fbm(coord + vec2(8.3, 2.8))
            );
            float n = fbm(warped * 1.3);

            // ── Same palette ──────────────────────────────────────────
            vec3 deepViolet   = vec3(0.18, 0.03, 0.35);
            vec3 moltenPurple = vec3(0.32, 0.08, 0.55);
            vec3 coreGlow     = vec3(0.40, 0.12, 0.70);
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

            // ── Same inner glow ───────────────────────────────────────
            float ig = fresnelInner * fresnelInner;
            col = mix(col, lavenderHot * 1.2, ig * 0.55);
            col = mix(col, coreGlow,           ig * 0.30);

            // ── Same pulse ────────────────────────────────────────────
            col += coreGlow * (sin(t * 2.2) * 0.5 + 0.5) * 0.08;

            // ── Same iridescent rim ───────────────────────────────────
            float rimShift = sin(t * 0.4 + vPosition.y * 3.0) * 0.5 + 0.5;
            vec3 rimColor  = mix(vec3(0.70, 0.50, 1.00), vec3(0.85, 0.70, 1.00), rimShift);
            rimColor = mix(rimColor, frostEdge, fresnelSharp * 0.7);
            vec3 color = mix(col, rimColor, fresnel * 0.80);

            // ── One specular instead of three (looks same) ────────────
            float spec = pow(max(dot(normal, normalize(vec3(0.4, 0.7, 1.0))), 0.0), 100.0);
            color += frostEdge * spec * 1.0;

            color = max(color, deepViolet * 0.7);
            color = min(color, vec3(1.0, 0.95, 1.0));

            float alpha = mix(0.98, 0.70, fresnel * 0.45);
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.FrontSide,
      })

      const sphere = new THREE.Mesh(geometry, material)
      scene.add(sphere)

      // ── Scroll → scale ──────────────────────────────────────────────
      let targetScale = 1.0, currentScale = 1.0
      const handleScroll = () => {
        const docHeight = document.body.scrollHeight - window.innerHeight
        targetScale = 1.0 + (docHeight > 0 ? window.scrollY / docHeight : 0) * 2
      }
      window.addEventListener('scroll', handleScroll)

      // ── Animation loop ──────────────────────────────────────────────
      const clock = new THREE.Clock()
      let animId
      const animate = () => {
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
      animate()

      // ── Resize ──────────────────────────────────────────────────────
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', handleResize)

      return () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
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

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 60% 40%, #7c5cbf 0%, #5a3d9a 30%, #3a2570 55%, #1a0f3a 100%)',
        }}
      />
      <div
        ref={mountRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </>
  )
}

export default ThreeBackground