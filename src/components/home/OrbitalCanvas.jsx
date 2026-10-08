import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function createStudioEnvironment() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  const base = context.createLinearGradient(0, 0, 0, canvas.height);
  base.addColorStop(0, '#dbe4f1');
  base.addColorStop(0.45, '#f8fafc');
  base.addColorStop(1, '#aabbd3');
  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const studioStrips = [
    { x: 62, width: 74, color: 'rgba(255,255,255,.92)' },
    { x: 280, width: 28, color: 'rgba(94,137,202,.36)' },
    { x: 462, width: 120, color: 'rgba(255,255,255,.9)' },
    { x: 748, width: 48, color: 'rgba(154,126,217,.25)' },
    { x: 912, width: 74, color: 'rgba(255,255,255,.82)' },
  ];
  studioStrips.forEach(({ x, width, color }) => {
    const reflection = context.createLinearGradient(x, 0, x + width, 0);
    reflection.addColorStop(0, 'rgba(255,255,255,0)');
    reflection.addColorStop(0.5, color);
    reflection.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = reflection;
    context.fillRect(x, 0, width, canvas.height);
  });

  const environment = new THREE.CanvasTexture(canvas);
  environment.mapping = THREE.EquirectangularReflectionMapping;
  environment.colorSpace = THREE.SRGBColorSpace;
  return environment;
}

function createFlowingMaterial(color, strength = 0.36) {
  const material = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.58,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.09,
    iridescence: 0.88,
    iridescenceIOR: 1.32,
    iridescenceThicknessRange: [140, 780],
    envMapIntensity: 1.25,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      '#include <common>\nuniform float uTime;\nvarying float vFlow;\nvarying float vWave;',
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      float waveA = sin(position.x * 1.7 + position.y * 1.1 - uTime * 0.56);
      float waveB = cos(position.y * 1.9 - position.z * 1.3 + uTime * 0.37);
      float wave = waveA * 0.025 + waveB * 0.016;
      transformed += objectNormal * wave;
      vFlow = position.x * 1.3 + position.y * 1.7 + position.z * 0.8;
      vWave = wave;`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      '#include <common>\nuniform float uTime;\nvarying float vFlow;\nvarying float vWave;',
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
      float spectral = 0.5 + 0.5 * sin(vFlow * 1.45 + uTime * 0.31 + vWave * 34.0);
      vec3 pearlBlue = vec3(0.52, 0.69, 0.91);
      vec3 softLilac = vec3(0.77, 0.66, 0.91);
      vec3 ice = vec3(0.70, 0.87, 0.88);
      vec3 spectralColor = mix(pearlBlue, softLilac, smoothstep(0.18, 0.82, spectral));
      spectralColor = mix(spectralColor, ice, 0.24 + 0.18 * sin(vFlow * 0.68 - uTime * 0.22));
      diffuseColor.rgb = mix(diffuseColor.rgb, spectralColor, ${strength.toFixed(2)});`,
    );
    material.userData.shader = shader;
  };
  material.customProgramCacheKey = () => `flowing-metal-${strength}`;
  return material;
}

export default function OrbitalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const scene = new THREE.Scene();
    scene.environment = createStudioEnvironment();
    scene.environmentIntensity = 0.78;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;

    const sculpture = new THREE.Group();
    sculpture.rotation.set(-0.28, -0.16, 0.12);
    scene.add(sculpture);

    const primary = new THREE.Group();
    sculpture.add(primary);
    const primaryMaterial = createFlowingMaterial('#6689bd', 0.3);
    const mainKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.02, 0.205, 360, 48, 2, 3),
      primaryMaterial,
    );
    primary.add(mainKnot);

    const secondary = new THREE.Group();
    secondary.position.set(0.07, -0.015, -0.26);
    secondary.rotation.set(0.08, 0.17, 0.08);
    sculpture.add(secondary);
    const secondaryMaterial = createFlowingMaterial('#929fbd', 0.22);
    const companionKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.99, 0.068, 320, 20, 3, 2),
      secondaryMaterial,
    );
    secondary.add(companionKnot);

    const glintGeometry = new THREE.SphereGeometry(0.036, 20, 20);
    const glintMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const glints = Array.from({ length: 9 }, (_, index) => {
      const glint = new THREE.Mesh(glintGeometry, glintMaterial);
      const angle = (index / 9) * Math.PI * 2;
      const radius = 1.74 + (index % 3) * 0.1;
      glint.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.35) * 1.24, Math.sin(angle) * 0.8);
      glint.scale.setScalar(index % 3 === 0 ? 1.2 : 0.72);
      sculpture.add(glint);
      return { mesh: glint, baseY: glint.position.y };
    });

    scene.add(new THREE.HemisphereLight('#ffffff', '#d9e1ee', 1.65));
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.55);
    keyLight.position.set(-3.5, 4, 5);
    scene.add(keyLight);
    const blueLight = new THREE.PointLight('#91bcff', 9, 10);
    blueLight.position.set(3.2, 1.5, 2.5);
    scene.add(blueLight);
    const lilacLight = new THREE.PointLight('#c4adff', 5, 8);
    lilacLight.position.set(-2.7, -2.3, 1.5);
    scene.add(lilacLight);

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      renderer.setSize(bounds.width, bounds.height, false);
      camera.aspect = bounds.width / bounds.height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.12;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.08;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const render = (time) => {
      const seconds = time * 0.001;
      if (!reducedMotion) {
        sculpture.rotation.y = -0.16 + pointerX + Math.sin(seconds * 0.24) * 0.04;
        sculpture.rotation.x = -0.28 - pointerY + Math.sin(seconds * 0.18) * 0.025;
        sculpture.rotation.z = 0.12 + Math.cos(seconds * 0.16) * 0.025;
        primary.rotation.y = seconds * 0.075;
        secondary.rotation.y = -seconds * 0.055;
        secondary.rotation.x = 0.08 + Math.sin(seconds * 0.2) * 0.08;
        glints.forEach(({ mesh, baseY }, index) => {
          mesh.position.y = baseY + Math.sin(seconds * 0.75 + index * 1.7) * 0.035;
        });
      }
      [primaryMaterial, secondaryMaterial].forEach((material) => {
        if (material.userData.shader) material.userData.shader.uniforms.uTime.value = reducedMotion ? 0 : seconds;
      });
      renderer.render(scene, camera);
      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      scene.environment?.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="product-canvas" aria-hidden="true" />;
}
