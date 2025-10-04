import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

const HeroCanvas = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.z = 2.6

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.classList.add('webgl-canvas')
    container.appendChild(renderer.domElement)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.0)
    scene.add(ambient)

    // Load texture and create a plane with a shader material that supports a reveal mask
    const loader = new THREE.TextureLoader()

    let mesh = null
    let frameId = null
    let shaderMaterial = null

    loader.load('/assets/images/laptop.avif', (texture) => {
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

      const geometry = new THREE.PlaneGeometry(1.8, 1.1, 32, 32)

      // Simple vertex shader that passes UVs
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `

      // Fragment shader: uses uProgress to reveal the texture from top to bottom with a soft edge
      // Also supports a movable specular highlight (uLightPos) and vignette for a premium product look
      const fragmentShader = `
        uniform sampler2D uTexture;
        uniform float uProgress;
        uniform float uEdge;
        uniform vec2 uLightPos;
        varying vec2 vUv;
        void main() {
          // threshold moves from top (vUv.y=1) downward as uProgress goes 0->1
          float threshold = 1.0 - uProgress;
          float mask = smoothstep(threshold - uEdge, threshold + uEdge, vUv.y);

          vec4 color = texture2D(uTexture, vUv);

          // Specular highlight: distance from the light position in UV space
          float d = distance(vUv, uLightPos);
          // soft circular highlight
          float spec = smoothstep(0.25, 0.0, d);
          // make highlight stronger near the revealed edge (so it behaves like a moving light)
          spec *= smoothstep(threshold - uEdge * 4.0, threshold + uEdge, vUv.y);

          vec3 highlight = vec3(1.0, 0.98, 0.92) * spec * 0.8;

          // vignette
          float vig = length(vUv - vec2(0.5));
          float vignette = smoothstep(0.8, 0.4, vig);

          vec3 final = color.rgb * mask;
          final += highlight; // additive specular glow
          final = mix(final, final * vec3(0.94, 0.96, 1.0), 0.06); // tiny color grade
          final *= 1.0 - vignette * 0.35;

          gl_FragColor = vec4(final, color.a * mask);
        }
      `

      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uProgress: { value: 0.0 },
          uEdge: { value: 0.03 },
          uLightPos: { value: new THREE.Vector2(0.5, 0.5) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
      })

      mesh = new THREE.Mesh(geometry, shaderMaterial)
      scene.add(mesh)

      // Fit mesh scale heuristically to viewport
      const aspect = width / height
      const scaleFactor = Math.max(aspect, 1) * 1.8
      mesh.scale.set(scaleFactor, scaleFactor, 1)

      // subtle breathing animation
      gsap.to(mesh.scale, {
        x: mesh.scale.x * 1.03,
        y: mesh.scale.y * 1.03,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Parallax on scroll (mesh position subtle shift)
      const posScrollTween = gsap.to(mesh.position, {
        y: -0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Shader reveal: animate uProgress from 0 -> 1 as the page scrolls (top-to-bottom reveal)
      const revealTween = gsap.to(shaderMaterial.uniforms.uProgress, {
        value: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Mouse move parallax
      const onMove = (e) => {
        const rect = renderer.domElement.getBoundingClientRect()
        const nx = (e.clientX - rect.left) / rect.width // 0..1
        const ny = 1.0 - (e.clientY - rect.top) / rect.height // invert y to match UV

        const x = nx * 2 - 1
        const y = ny * 2 - 1

        // animate rotation/position smoothly
        if (mesh) {
          gsap.to(mesh.rotation, { x: (y) * 0.12, y: (x) * 0.2, duration: 0.9, ease: 'power3.out' })
          gsap.to(mesh.position, { x: x * 0.1, y: (ny - 0.5) * 0.12, duration: 0.9, ease: 'power3.out' })
        }

        // animate the light position uniform for the specular highlight
        if (shaderMaterial && shaderMaterial.uniforms && shaderMaterial.uniforms.uLightPos) {
          gsap.to(shaderMaterial.uniforms.uLightPos.value, { x: nx, y: ny, duration: 0.6, ease: 'power3.out' })
        }
      }

      window.addEventListener('mousemove', onMove)

      // Render loop
      const clock = new THREE.Clock()
      const animate = () => {
        const t = clock.getElapsedTime()
        if (mesh) mesh.rotation.z = Math.sin(t * 0.25) * 0.01
        renderer.render(scene, camera)
        frameId = window.requestAnimationFrame(animate)
      }
      animate()

      // Resize handler
      const onResize = () => {
        const w = container.clientWidth
        const h = container.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }

      window.addEventListener('resize', onResize)

      // Cleanup when texture loaded
      const cleanup = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('resize', onResize)
        if (frameId) cancelAnimationFrame(frameId)
        try {
          // kill ScrollTriggers we created
          ScrollTrigger.getAll().forEach((s) => s.kill())
        } catch (e) {}
        try {
          posScrollTween.kill()
          revealTween.kill()
        } catch (e) {}
        if (mesh) {
          mesh.geometry.dispose()
          if (shaderMaterial) shaderMaterial.dispose()
          if (mesh.parent) mesh.parent.remove(mesh)
        }
        texture.dispose()
        renderer.dispose()
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }

      // store cleanup on container for outer use
      container.__three_cleanup = cleanup
    })

    // If texture failed to load or component unmounts before load
    return () => {
      // kill any ScrollTrigger instances we created inside (safe to call)
      try { ScrollTrigger.getAll().forEach((s) => s.kill()) } catch (e) {}
      if (container.__three_cleanup) container.__three_cleanup()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 -z-20 pointer-events-none" />
}

export default HeroCanvas
