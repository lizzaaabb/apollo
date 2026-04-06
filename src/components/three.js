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
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.5
      mount.appendChild(renderer.domElement)

      const geometry = new THREE.SphereGeometry(1, 128, 128)

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 8.0 },
          uScale: { value: 1.0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;
          uniform float uTime;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1,0)), u.x),
              mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
              u.y
            );
          }

          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 7; i++) {
              v += a * noise(p);
              p = p * 2.1 + vec2(1.7, 9.2);
              a *= 0.5;
            }
            return v;
          }

          // Smooth warp for organic molten flow
          float warpedFbm(vec2 p, float t) {
            vec2 q = vec2(
              fbm(p + vec2(0.0, 0.0) + vec2(t * 0.08, t * 0.05)),
              fbm(p + vec2(5.2, 1.3) + vec2(t * 0.06, t * 0.09))
            );
            vec2 r = vec2(
              fbm(p + 3.0 * q + vec2(1.7, 9.2) + vec2(t * 0.05, t * 0.03)),
              fbm(p + 3.0 * q + vec2(8.3, 2.8) + vec2(t * 0.04, t * 0.07))
            );
            return fbm(p + 3.5 * r + vec2(t * 0.02, t * 0.01));
          }

          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));

            float NdV = max(dot(normal, viewDir), 0.0);

            // Fresnel layers
            float fresnel      = pow(1.0 - NdV, 2.0);
            float fresnelSharp = pow(1.0 - NdV, 5.0);
            float fresnelInner = pow(NdV, 1.2);

            float t = uTime * 0.10;

            // Slow organic warp coordinates
            vec2 baseCoord = vec2(
              vPosition.x * 1.0 + vPosition.z * 0.4,
              vPosition.y * 1.0 + vPosition.z * 0.3
            );

            float w = warpedFbm(baseCoord * 1.4, t);

            // Secondary fast detail layer
            vec2 detailCoord = vec2(
              vPosition.x * 2.2 + sin(vPosition.y * 1.5 + t * 0.7) * 0.3,
              vPosition.y * 2.2 + cos(vPosition.z * 1.5 + t * 0.5) * 0.3
            ) + vec2(t * 0.12, t * 0.08);
            float d = fbm(detailCoord);

            // Combine for final noise value
            float n = mix(w, d, 0.35);

            // — Molten purple glass palette —
            // The key: use luminous mid-tones, not darks or lights
            // so it glows from within like lit glass
           vec3 coreGlow     = vec3(0.40, 0.12, 0.70);
vec3 moltenPurple = vec3(0.32, 0.08, 0.55);
vec3 deepViolet   = vec3(0.18, 0.03, 0.35);
vec3 amethyst     = vec3(0.45, 0.20, 0.70);
vec3 lavenderHot  = vec3(0.60, 0.35, 0.85);
vec3 roseFlare    = vec3(0.70, 0.30, 0.65);
vec3 frostEdge    = vec3(0.75, 0.70, 0.90); // almost-white frost for rim

            // Build color: starts at deep violet, heats up toward lavender/rose
            vec3 col = deepViolet;
            col = mix(col, moltenPurple, smoothstep(0.20, 0.45, n));
            col = mix(col, coreGlow,     smoothstep(0.38, 0.60, n));
            col = mix(col, amethyst,     smoothstep(0.50, 0.70, n));
            col = mix(col, lavenderHot,  smoothstep(0.62, 0.80, n));
            col = mix(col, roseFlare,    smoothstep(0.72, 0.90, n * n * 1.4));

            // Internal glow — center is bright and luminous like light inside glass
            float innerGlow = fresnelInner * fresnelInner;
            col = mix(col, lavenderHot * 1.2, innerGlow * 0.55);
            col = mix(col, coreGlow,           innerGlow * 0.30);

            // Pulsing internal heat — slow gentle throb
            float pulse = sin(t * 2.2) * 0.5 + 0.5;
            col += coreGlow * pulse * 0.08;

            // Iridescent rim — glassy edge that shifts color
            float rimShift = sin(t * 0.4 + vPosition.y * 3.0) * 0.5 + 0.5;
            vec3 rimA = vec3(0.70, 0.50, 1.00); // soft violet
            vec3 rimB = vec3(0.85, 0.70, 1.00); // pale lilac
            vec3 rimC = frostEdge;
            vec3 rimColor = mix(rimA, rimB, rimShift);
            rimColor = mix(rimColor, rimC, fresnelSharp * 0.7);

            // Blend interior and rim
            vec3 color = mix(col, rimColor, fresnel * 0.80);

            // Specular highlights — glassy sharp reflections
            // Main highlight: bright white-violet
            vec3 lightDir1 = normalize(vec3(0.4, 0.7, 1.0));
            float spec1 = pow(max(dot(normal, lightDir1), 0.0), 120.0);
            color += frostEdge * spec1 * 1.0;

            // Secondary: soft violet fill
            vec3 lightDir2 = normalize(vec3(-0.5, 0.4, 0.8));
            float spec2 = pow(max(dot(normal, lightDir2), 0.0), 30.0);
            color += lavenderHot * spec2 * 0.35;

            // Warm pink backlight from bottom
            vec3 lightDir3 = normalize(vec3(0.3, -0.8, 0.6));
            float spec3 = pow(max(dot(normal, lightDir3), 0.0), 25.0);
            color += roseFlare * spec3 * 0.25;

            // Subtle global lift so nothing goes fully black
            color = max(color, deepViolet * 0.7);

            // Clamp — glass doesn't oversaturate
            color = min(color, vec3(1.0, 0.95, 1.0));

            // Alpha: mostly opaque, slightly transparent at rim for glass feel
            float alpha = mix(0.98, 0.70, fresnel * 0.45);
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.FrontSide,
      })

      const sphere = new THREE.Mesh(geometry, material)
      scene.add(sphere)

      let targetScale = 1.0
      let currentScale = 1.0

      const handleScroll = () => {
        const scrollY = window.scrollY
        const docHeight = document.body.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? scrollY / docHeight : 0
        targetScale = 1.0 + progress * 2
      }
      window.addEventListener('scroll', handleScroll)

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
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement)
        }
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
    background: 'radial-gradient(ellipse at 60% 40%, #7c5cbf 0%, #5a3d9a 30%, #3a2570 55%, #1a0f3a 100%)',
    pointerEvents: 'none',
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