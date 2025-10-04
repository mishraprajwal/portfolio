import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

// Import model via Vite's asset handling

const HeroCanvas = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    let width = container.clientWidth
    let height = container.clientHeight

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0.2, 2.6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.classList.add('webgl-canvas')
    container.appendChild(renderer.domElement)

    // Lights: key, fill, rim
    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(1, 1, 0.5)
    scene.add(key)

    const fill = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0xffffff, 0.5)
    rim.position.set(-1, -0.5, 1)
    scene.add(rim)

    // Ground/ambient subtle color
    scene.background = null

    const loader = new GLTFLoader()
    let model = null
    let frameId = null

  // load model from public folder
  loader.load('/models/scene.glb', (gltf) => {
      model = gltf.scene
      model.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true
          c.receiveShadow = true
          // ensure standard material for nicer shading
          if (c.material) {
            c.material.metalness = c.material.metalness ?? 0
            c.material.roughness = c.material.roughness ?? 0.6
          }
        }
      })

      // Center and scale model to fit nicely in view
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const desired = 1.6
      const scale = desired / maxDim
      model.scale.setScalar(scale)

      // Recompute centered box and reposition to center
      box.setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      model.position.sub(center)
      model.position.y -= 0.05 // small vertical offset

      // Add model to scene
      scene.add(model)

      // Initial animation: pop in
      gsap.fromTo(
        model.scale,
        { x: scale * 0.7, y: scale * 0.7, z: scale * 0.7 },
        { x: scale, y: scale, z: scale, duration: 1.2, ease: 'expo.out' }
      )

      // Idle subtle rotation / breathe
      gsap.to(model.rotation, { y: '+=0.4', duration: 24, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to(model.position, { y: '+=0.02', duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' })

      // Parallax on scroll: subtle shift as page scrolls
      gsap.to(model.position, {
        y: '-=0.25',
        ease: 'none',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Mouse move parallax to rotate the model and shift light focus
      const onMove = (e) => {
        const rect = renderer.domElement.getBoundingClientRect()
        const nx = (e.clientX - rect.left) / rect.width // 0..1
        const ny = 1.0 - (e.clientY - rect.top) / rect.height // invert y

        const rx = (ny - 0.5) * 0.25
        const ry = (nx - 0.5) * 0.45

        if (model) {
          gsap.to(model.rotation, { x: rx, y: ry, duration: 0.9, ease: 'power3.out' })
          gsap.to(model.position, { x: (nx - 0.5) * 0.15, y: (ny - 0.5) * 0.08, duration: 0.9, ease: 'power3.out' })
        }
      }

      window.addEventListener('mousemove', onMove)

      // Render loop
      const clock = new THREE.Clock()
      const animate = () => {
        const t = clock.getElapsedTime()
        // tiny ambient motion
        if (model) model.rotation.z = Math.sin(t * 0.25) * 0.005
        renderer.render(scene, camera)
        frameId = window.requestAnimationFrame(animate)
      }
      animate()

      // Resize handler
      const onResize = () => {
        width = container.clientWidth
        height = container.clientHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }

      window.addEventListener('resize', onResize)

      // Cleanup
      const cleanup = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('resize', onResize)
        if (frameId) cancelAnimationFrame(frameId)
        try { ScrollTrigger.getAll().forEach((s) => s.kill()) } catch (e) {}
        if (model) {
          model.traverse((c) => {
            if (c.isMesh) {
              c.geometry && c.geometry.dispose()
              if (c.material) {
                if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose())
                else c.material.dispose()
              }
            }
          })
          if (model.parent) model.parent.remove(model)
        }
        renderer.dispose()
        if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
      }

      container.__three_cleanup = cleanup
    })

    // If load fails or unmount
    return () => {
      try { ScrollTrigger.getAll().forEach((s) => s.kill()) } catch (e) {}
      if (container.__three_cleanup) container.__three_cleanup()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 -z-20 pointer-events-none" />
}

export default HeroCanvas
