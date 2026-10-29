import * as THREE from 'three'
import { subscribeTheme } from './theme'
import { RotationMotion } from './rotation-motion'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

const root = '/assets/materials/'
const profiles = [
  { name: 'GLASS', color: '#ffffff', roughness: .035, metalness: 0, transmission: 1, thickness: .42, ior: 1.46, clearcoat: 0, sheen: 0, anisotropy: 0, normal: .012, surface: 0, environment: 1.25 },
  { name: 'SILICONE', color: '#d1aea1', roughness: .72, metalness: 0, transmission: .0001, thickness: .1, ior: 1.4, clearcoat: 0, sheen: .45, anisotropy: 0, normal: .12, surface: 1, environment: .9 },
  { name: 'GOLD', color: '#e8bf78', roughness: .19, metalness: 1, transmission: .0001, thickness: .1, ior: 1.5, clearcoat: .1, sheen: 0, anisotropy: .28, normal: .045, surface: 0, environment: 1.3 },
  { name: 'PLASTIC', color: '#375781', roughness: .23, metalness: 0, transmission: .0001, thickness: .1, ior: 1.48, clearcoat: .55, sheen: 0, anisotropy: 0, normal: .075, surface: 1, environment: 1.15 },
  { name: 'ANODIZED ALUMINUM', color: '#91a6b0', roughness: .34, metalness: 1, transmission: .0001, thickness: .1, ior: 1.5, clearcoat: 0, sheen: 0, anisotropy: .65, normal: .11, surface: 0, environment: 1.15 },
  { name: 'WOOD', color: '#ffffff', roughness: .58, metalness: 0, transmission: .0001, thickness: .1, ior: 1.45, clearcoat: .04, sheen: 0, anisotropy: 0, normal: .08, surface: 0, wood: 1, environment: .95 },
].map((profile) => ({ ...profile, wood: profile.wood || 0, color: new THREE.Color(profile.color) }))

// A closed ribbon with a rounded rectangular section and three half twists.
// Differential normals keep both parameter seams smooth, including the half-turn seam.
function ribbonGeometry() {
  const segments = 320
  const sides = 64
  const positions = []
  const normals = []
  const uvs = []
  const indices = []
  const point = (u, v) => {
    const c = Math.cos(v), s = Math.sin(v)
    const x = Math.sign(c) * Math.pow(Math.abs(c), .5) * .332
    const y = Math.sign(s) * Math.pow(Math.abs(s), .5) * .11
    const twist = u * 1.5
    const radial = 1.12 + x * Math.cos(twist) - y * Math.sin(twist)
    return new THREE.Vector3(radial * Math.cos(u), x * Math.sin(twist) + y * Math.cos(twist), radial * Math.sin(u))
  }
  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= sides; j++) {
      const u = i / segments * Math.PI * 2
      const v = j / sides * Math.PI * 2
      const p = point(u, v)
      const du = point(u + .0001, v).sub(point(u - .0001, v))
      const dv = point(u, v + .0001).sub(point(u, v - .0001))
      const normal = dv.cross(du).normalize()
      positions.push(p.x, p.y, p.z)
      normals.push(normal.x, normal.y, normal.z)
      // Two texture repeats across one full perimeter make the half-turn seam tile.
      uvs.push(i / segments, j / sides)
      if (i < segments && j < sides) {
        const a = i * (sides + 1) + j
        const b = a + sides + 1
        indices.push(a, a + 1, b, a + 1, b + 1, b)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeTangents()
  return geometry
}

export function mountGeometryScene(canvas, { onReady, onError, onMaterial }) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  } catch {
    onError()
    return () => {}
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 30)
  camera.position.set(0, 0, 5.8)
  const geometry = ribbonGeometry()
  const material = new THREE.MeshPhysicalMaterial({
    transmission: 1, thickness: .42, ior: 1.46, roughness: .035,
    metalness: 0, clearcoat: .0001, clearcoatRoughness: .15,
    anisotropy: .0001, sheen: .0001, sheenRoughness: .8, sheenColor: '#eee0d5',
    attenuationColor: '#c9e7e6', attenuationDistance: 3,
    side: THREE.DoubleSide,
  })
  const sculpture = new THREE.Mesh(geometry, material)
  const interaction = new THREE.Group()
  interaction.add(sculpture)
  scene.add(interaction)
  const key = new THREE.DirectionalLight('#fff4e5', 2.4)
  key.position.set(-3, 5, 4)
  const fill = new THREE.DirectionalLight('#dceaff', 1.2)
  fill.position.set(4, 1, -2)
  scene.add(key, fill)
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const mouseInput = window.matchMedia('(hover: hover) and (pointer: fine)')
  const rotationMotion = new RotationMotion(interaction.quaternion)
  let drag = null
  const pointer = new THREE.Vector2()
  const target = new THREE.Vector2()
  let disposed = false
  let ready = false
  let visible = true
  let frame = 0
  let previous = 0
  let rotation = 0
  let materialStart = performance.now()
  let label = ''
  let environmentTarget
  const textures = new Set()
  const uniforms = {
    surfaceMix: { value: 0 }, woodMix: { value: 0 },
    plasticNormal: { value: null }, plasticRoughness: { value: null },
    woodNormal: { value: null }, woodRoughness: { value: null },
  }

  const updateTheme = () => {
    const background = getComputedStyle(document.documentElement).getPropertyValue('--hero-bg').trim()
    scene.background = new THREE.Color(background)
    renderer.setClearColor(scene.background, 1)
    if (ready && !disposed) draw(performance.now())
  }
  const draw = (now) => {
    if (!ready || disposed) return
    const seconds = motion.matches ? 0 : (now - materialStart) / 1000
    const phase = ((seconds / 5) % profiles.length + profiles.length) % profiles.length
    const index = Math.floor(phase)
    const blend = THREE.MathUtils.smoothstep(phase - index, .72, 1)
    const from = profiles[index]
    const to = profiles[(index + 1) % profiles.length]
    const mix = (key) => THREE.MathUtils.lerp(from[key], to[key], blend)
    material.color.lerpColors(from.color, to.color, blend)
    for (const key of ['roughness', 'metalness', 'transmission', 'thickness', 'ior']) material[key] = mix(key)
    // Keep feature defines stable throughout the cycle to avoid recompiling at each transition.
    for (const key of ['clearcoat', 'sheen', 'anisotropy']) material[key] = Math.max(.0001, mix(key))
    material.normalScale.setScalar(mix('normal'))
    material.envMapIntensity = mix('environment')
    uniforms.surfaceMix.value = mix('surface')
    uniforms.woodMix.value = mix('wood')
    const nextLabel = blend < .5 ? from.name : to.name
    if (label !== nextLabel) { label = nextLabel; onMaterial(label) }
    sculpture.rotation.set(1.0 + Math.sin(rotation * .11) * .12 + pointer.y * .06, rotation * .075 + pointer.x * .1, -.36)
    renderer.render(scene, camera)
  }
  const tick = (now) => {
    frame = 0
    if (disposed || !visible || document.hidden || motion.matches) return
    const interval = rotationMotion.active ? 1000 / 60 : 1000 / 30
    if (now - previous >= interval - .5) {
      const dt = Math.min((now - previous) / 1000, .08)
      const clockNow = performance.now()
      rotationMotion.update(clockNow)
      rotation += dt * rotationMotion.autoWeight(clockNow)
      previous = now
      if (!rotationMotion.active) pointer.lerp(target, 1 - Math.exp(-dt * 4))
      draw(clockNow)
    }
    frame = requestAnimationFrame(tick)
  }
  const resume = () => {
    cancelAnimationFrame(frame)
    frame = 0
    if (!ready || disposed) return
    if (document.hidden || !visible || motion.matches) endDrag()
    previous = performance.now()
    draw(performance.now())
    if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick)
  }
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect()
    renderer.setSize(Math.max(1, width), Math.max(1, height), false)
    camera.aspect = width / Math.max(1, height)
    camera.updateProjectionMatrix()
    if (ready) draw(performance.now())
  }
  const endDrag = (inertia = false) => {
    if (inertia && drag) rotationMotion.release(performance.now(), motion.matches)
    else rotationMotion.cancel(performance.now())
    if (!drag) return
    const { pointerId } = drag
    drag = null
    canvas.classList.remove('is-dragging')
    document.documentElement.classList.remove('geometry-dragging')
    if (canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId)
  }
  const updateMouseInput = () => {
    const enabled = mouseInput.matches && ready && !disposed
    canvas.toggleAttribute('data-draggable', enabled)
    if (!enabled) endDrag()
  }
  const startDrag = (event) => {
    if (!ready || !mouseInput.matches || event.pointerType !== 'mouse' || event.button !== 0 || drag) return
    event.preventDefault()
    drag = { pointerId: event.pointerId }
    rotationMotion.begin(event.clientX, event.clientY, performance.now(), Math.PI * 2 / Math.max(canvas.clientWidth, 400))
    target.copy(pointer)
    canvas.setPointerCapture(event.pointerId)
    canvas.classList.add('is-dragging')
    document.documentElement.classList.add('geometry-dragging')
  }
  const move = (event) => {
    if (event.pointerType !== 'mouse' || !mouseInput.matches) return
    if (!drag) {
      target.set(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1)
      return
    }
    if (event.pointerId !== drag.pointerId) return
    // A missed mouse-up must never leave the model or cursor stuck in drag mode.
    if (!(event.buttons & 1)) { endDrag(); return }
    rotationMotion.move(event.clientX, event.clientY, performance.now(), motion.matches)
    // Manual rotation remains available when automatic animation is reduced.
    if (motion.matches) draw(performance.now())
  }
  const finishDrag = (event) => {
    if (event.pointerId === drag?.pointerId) endDrag(event.type === 'pointerup')
  }
  const lost = (event) => {
    event.preventDefault()
    endDrag()
    cancelAnimationFrame(frame)
    ready = false
    updateMouseInput()
    onError()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume() })
  visibilityObserver.observe(canvas)
  const unsubscribeTheme = subscribeTheme(updateTheme)
  motion.addEventListener('change', resume)
  document.addEventListener('visibilitychange', resume)
  mouseInput.addEventListener('change', updateMouseInput)
  window.addEventListener('pointermove', move, { passive: true })
  const blur = () => endDrag()
  window.addEventListener('blur', blur)
  canvas.addEventListener('pointerdown', startDrag)
  canvas.addEventListener('pointerup', finishDrag)
  canvas.addEventListener('pointercancel', finishDrag)
  canvas.addEventListener('lostpointercapture', finishDrag)
  canvas.addEventListener('webglcontextlost', lost)
  updateTheme()
  resize()

  const loadTexture = async (name, colorSpace = THREE.NoColorSpace) => {
    const texture = await new THREE.TextureLoader().loadAsync(root + name)
    if (disposed) { texture.dispose(); return null }
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    texture.colorSpace = colorSpace
    textures.add(texture)
    return texture
  }
  const loadEnvironment = async () => {
    const hdr = await new HDRLoader().loadAsync(root + 'studio-small-09-1k.hdr')
    if (disposed) { hdr.dispose(); return }
    const pmrem = new THREE.PMREMGenerator(renderer)
    environmentTarget = pmrem.fromEquirectangular(hdr)
    scene.environment = environmentTarget.texture
    hdr.dispose()
    pmrem.dispose()
  }
  Promise.all([
    loadTexture('Metal033_1K-JPG_NormalGL.jpg'),
    loadTexture('Metal033_1K-JPG_Roughness.jpg'),
    loadTexture('Plastic010_1K-JPG_NormalGL.jpg'),
    loadTexture('Plastic010_1K-JPG_Roughness.jpg'),
    loadTexture('Wood049_1K-JPG_Color.jpg', THREE.SRGBColorSpace),
    loadTexture('Wood049_1K-JPG_NormalGL.jpg'),
    loadTexture('Wood049_1K-JPG_Roughness.jpg'),
    loadEnvironment(),
  ]).then(([metalNormal, metalRoughness, plasticNormal, plasticRoughness, woodColor, woodNormal, woodRoughness]) => {
    if (disposed) return
    woodColor.repeat.set(3, 2)
    material.map = woodColor
    material.normalMap = metalNormal
    material.roughnessMap = metalRoughness
    uniforms.plasticNormal.value = plasticNormal
    uniforms.plasticRoughness.value = plasticRoughness
    uniforms.woodNormal.value = woodNormal
    uniforms.woodRoughness.value = woodRoughness
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.fragmentShader = `
        uniform float surfaceMix;
        uniform float woodMix;
        uniform sampler2D plasticNormal;
        uniform sampler2D plasticRoughness;
        uniform sampler2D woodNormal;
        uniform sampler2D woodRoughness;
      ` + shader.fragmentShader
      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', THREE.ShaderChunk.map_fragment.replace(
        'diffuseColor *= sampledDiffuseColor;',
        'diffuseColor *= vec4(mix(vec3(1.0), sampledDiffuseColor.rgb, woodMix), sampledDiffuseColor.a);',
      ))
      shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', THREE.ShaderChunk.normal_fragment_maps.replaceAll(
        'texture2D( normalMap, vNormalMapUv ).xyz',
        'mix(mix(texture2D(normalMap, vNormalMapUv * vec2(6.0, 2.0)), texture2D(plasticNormal, vNormalMapUv * vec2(8.0, 2.0)), surfaceMix), texture2D(woodNormal, vNormalMapUv * vec2(3.0, 2.0)), woodMix).xyz',
      ))
      shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
        float roughnessFactor = roughness;
        float surfaceRoughness = mix(texture2D(roughnessMap, vRoughnessMapUv * vec2(6.0, 2.0)).g, texture2D(plasticRoughness, vRoughnessMapUv * vec2(8.0, 2.0)).g, surfaceMix);
        surfaceRoughness = mix(surfaceRoughness, texture2D(woodRoughness, vRoughnessMapUv * vec2(3.0, 2.0)).g, woodMix);
        roughnessFactor *= mix(.7, 1.3, surfaceRoughness);
      `)
    }
    material.customProgramCacheKey = () => 'crtyss-pbr-surfaces-v2-wood'
    material.needsUpdate = true
    ready = true
    materialStart = performance.now()
    updateMouseInput()
    onReady()
    resume()
  }).catch(() => { if (!disposed) onError() })

  return () => {
    disposed = true
    endDrag()
    canvas.removeAttribute('data-draggable')
    cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    unsubscribeTheme()
    motion.removeEventListener('change', resume)
    document.removeEventListener('visibilitychange', resume)
    mouseInput.removeEventListener('change', updateMouseInput)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('blur', blur)
    canvas.removeEventListener('pointerdown', startDrag)
    canvas.removeEventListener('pointerup', finishDrag)
    canvas.removeEventListener('pointercancel', finishDrag)
    canvas.removeEventListener('lostpointercapture', finishDrag)
    canvas.removeEventListener('webglcontextlost', lost)
    geometry.dispose()
    material.dispose()
    textures.forEach((texture) => texture.dispose())
    environmentTarget?.dispose()
    renderer.dispose()
  }
}
