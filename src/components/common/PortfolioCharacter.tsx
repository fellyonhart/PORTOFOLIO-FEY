'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function PortfolioCharacter() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-0.4, 0.4, 0.225, -0.225, 0.01, 30)
    camera.position.set(1.15, 0.44, 2.65)
    camera.lookAt(0, 0.4, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.55))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.setClearColor(0x000000, 0)
    stage.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xf4f4e9, 0x60675f, 1.45))
    const key = new THREE.DirectionalLight(0xfff3e7, 2.4)
    key.position.set(3.5, 5.5, 3.2)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xd9e5e0, 1.05)
    fill.position.set(-2.5, 2.2, -3.5)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xc5c9b9, 1.2)
    rim.position.set(-3, 3.5, 2.5)
    scene.add(rim)

    const materials = {
      skin: new THREE.MeshPhysicalMaterial({
        color: 0xdcb090,
        roughness: 0.76,
        sheen: 0.12,
        sheenColor: 0xe9bda0,
      }),
      hair: new THREE.MeshStandardMaterial({ color: 0x382820, roughness: 0.72 }),
      hairHighlight: new THREE.MeshStandardMaterial({
        color: 0x674537,
        roughness: 0.68,
      }),
      lips: new THREE.MeshStandardMaterial({ color: 0x985e57, roughness: 0.65 }),
      eyes: new THREE.MeshStandardMaterial({ color: 0x302b26, roughness: 0.55 }),
      iris: new THREE.MeshStandardMaterial({ color: 0x755338, roughness: 0.45 }),
      whites: new THREE.MeshStandardMaterial({ color: 0xe7ded0, roughness: 0.48 }),
      jacket: new THREE.MeshStandardMaterial({
        color: 0x778477,
        roughness: 0.86,
      }),
    }

    const sphere = new THREE.SphereGeometry(1, 32, 24)
    const addEllipsoid = (
      parent: THREE.Object3D,
      material: THREE.Material,
      position: THREE.Vector3,
      scale: THREE.Vector3,
    ) => {
      const mesh = new THREE.Mesh(sphere, material)
      mesh.position.copy(position)
      mesh.scale.copy(scale)
      parent.add(mesh)
      return mesh
    }
    const character = new THREE.Group()
    const torso = new THREE.Group()
    torso.position.y = 0.29
    character.add(torso)

    const jacketShape = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.048, -0.15),
        new THREE.Vector2(0.072, -0.13),
        new THREE.Vector2(0.083, -0.09),
        new THREE.Vector2(0.091, -0.04),
        new THREE.Vector2(0.095, 0.005),
        new THREE.Vector2(0.09, 0.045),
        new THREE.Vector2(0.075, 0.08),
        new THREE.Vector2(0.048, 0.11),
        new THREE.Vector2(0.03, 0.145),
        new THREE.Vector2(0.014, 0.175),
        new THREE.Vector2(0, 0.18),
      ],
      32,
    )
    jacketShape.computeVertexNormals()
    const jacket = new THREE.Mesh(jacketShape, materials.jacket)
    jacket.scale.set(0.9, 1, 0.82)
    torso.add(jacket)
    addEllipsoid(
      torso,
      materials.skin,
      new THREE.Vector3(0, 0.143, 0),
      new THREE.Vector3(0.023, 0.042, 0.023),
    )
    const headPivot = new THREE.Group()
    headPivot.position.set(0, 0.2, 0)
    torso.add(headPivot)
    headPivot.scale.set(1.15, 1.12, 1.02)
    const headShape = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.018, -0.035),
        new THREE.Vector2(0.036, -0.023),
        new THREE.Vector2(0.047, 0.005),
        new THREE.Vector2(0.05, 0.036),
        new THREE.Vector2(0.043, 0.065),
        new THREE.Vector2(0.025, 0.083),
        new THREE.Vector2(0, 0.087),
      ],
      32,
    )
    headShape.computeVertexNormals()
    const face = new THREE.Mesh(headShape, materials.skin)
    face.position.y = 0.005
    headPivot.add(face)
    addEllipsoid(
      headPivot,
      materials.hair,
      new THREE.Vector3(0, 0.075, -0.004),
      new THREE.Vector3(0.054, 0.033, 0.054),
    )
    const eyeRigs: { eye: THREE.Group; lid: THREE.Mesh; side: number }[] = []
    for (const side of [-1, 1]) {
      addEllipsoid(
        headPivot,
        materials.hair,
        new THREE.Vector3(side * 0.041, -0.012, 0.002),
        new THREE.Vector3(0.014, 0.081, 0.024),
      )
      addEllipsoid(
        headPivot,
        materials.skin,
        new THREE.Vector3(side * 0.049, 0.014, 0),
        new THREE.Vector3(0.01, 0.019, 0.016),
      )
      const eye = new THREE.Group()
      eye.position.set(side * 0.019, 0.027, 0.044)
      headPivot.add(eye)
      addEllipsoid(
        eye,
        materials.whites,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.009, 0.005, 0.003),
      )
      addEllipsoid(
        eye,
        materials.iris,
        new THREE.Vector3(0, 0, 0.004),
        new THREE.Vector3(0.0045, 0.0042, 0.002),
      )
      addEllipsoid(
        eye,
        materials.eyes,
        new THREE.Vector3(0, 0, 0.006),
        new THREE.Vector3(0.002, 0.0025, 0.0015),
      )
      addEllipsoid(
        eye,
        materials.whites,
        new THREE.Vector3(-0.001, 0.0015, 0.007),
        new THREE.Vector3(0.0012, 0.0012, 0.0008),
      )
      const lid = addEllipsoid(
        headPivot,
        materials.skin,
        new THREE.Vector3(side * 0.019, 0.032, 0.049),
        new THREE.Vector3(0.0095, 0.0025, 0.0035),
      )
      eyeRigs.push({ eye, lid, side })
      addEllipsoid(
        headPivot,
        materials.hairHighlight,
        new THREE.Vector3(side * 0.02, 0.041, 0.045),
        new THREE.Vector3(0.012, 0.0025, 0.003),
      )
    }
    const fringe = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.043, 0.087, 0.02),
      new THREE.Vector3(-0.026, 0.078, 0.037),
      new THREE.Vector3(0.002, 0.065, 0.04),
      new THREE.Vector3(0.031, 0.054, 0.028),
    ])
    headPivot.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(fringe, 20, 0.008, 8, false),
        materials.hair,
      ),
    )
    const fringeHighlight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.039, 0.091, 0.024),
      new THREE.Vector3(-0.022, 0.082, 0.041),
      new THREE.Vector3(0.005, 0.069, 0.044),
      new THREE.Vector3(0.03, 0.058, 0.031),
    ])
    headPivot.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(fringeHighlight, 20, 0.0015, 5, false),
        materials.hairHighlight,
      ),
    )
    addEllipsoid(
      headPivot,
      materials.skin,
      new THREE.Vector3(0, 0.012, 0.048),
      new THREE.Vector3(0.005, 0.012, 0.007),
    )
    addEllipsoid(
      headPivot,
      materials.lips,
      new THREE.Vector3(0, -0.014, 0.044),
      new THREE.Vector3(0.011, 0.003, 0.003),
    )

    character.position.z = -0.035
    scene.add(character)

    const pointer = new THREE.Vector2()
    const pointerTarget = new THREE.Vector2()
    const headAim = new THREE.Object3D()
    const headWorldPosition = new THREE.Vector3()
    const projectedHeadPosition = new THREE.Vector3()
    const targetWorldPosition = new THREE.Vector3()
    const targetLocalPosition = new THREE.Vector3()
    const cameraDirection = new THREE.Vector3()
    const idleMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
      ? 0
      : 1
    const updatePointer = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      pointerTarget.x = THREE.MathUtils.clamp(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -1,
        1,
      )
      pointerTarget.y = THREE.MathUtils.clamp(
        -(((event.clientY - rect.top) / rect.height) * 2 - 1),
        -1,
        1,
      )
    }
    window.addEventListener('pointermove', updatePointer)

    const resize = () => {
      const width = Math.max(1, stage.clientWidth)
      const height = Math.max(1, stage.clientHeight)
      const viewHeight = 0.4
      const aspect = width / height
      camera.left = (-viewHeight * aspect) / 2
      camera.right = (viewHeight * aspect) / 2
      camera.top = viewHeight / 2
      camera.bottom = -viewHeight / 2
      camera.updateProjectionMatrix()
      camera.position.y = 0.44
      camera.lookAt(0, 0.42, 0)
      renderer.setSize(width, height, false)
    }
    window.addEventListener('resize', resize)
    resize()

    let lastTime = performance.now()
    let elapsed = 0
    let blinkStart = -1
    let nextBlink = 2.2
    let frame = 0
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate)
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      elapsed += dt
      const ease = 1 - Math.exp(-dt * 8.5)
      const headEase = 1 - Math.exp(-dt * 24)
      const sway = Math.sin(elapsed * 0.8) * idleMotion
      pointer.lerp(pointerTarget, 1 - Math.exp(-dt * 18))
      if (idleMotion && blinkStart < 0 && elapsed >= nextBlink) {
        blinkStart = elapsed
        nextBlink = elapsed + 3 + Math.random() * 2.4
      }
      let blink = 0
      if (blinkStart >= 0) {
        const blinkProgress = (elapsed - blinkStart) / 0.18
        if (blinkProgress >= 1) {
          blinkStart = -1
        } else {
          blink = Math.sin(blinkProgress * Math.PI)
        }
      }

      character.rotation.y = 0.1
      character.position.y = Math.sin(elapsed * 1.1) * 0.003 * idleMotion
      torso.rotation.z = sway * 0.018
      torso.scale.y = 1 + Math.sin(elapsed * 1.3) * 0.009 * idleMotion
      torso.rotation.x = pointer.y * 0.025
      headPivot.getWorldPosition(headWorldPosition)
      const pointerDepth = projectedHeadPosition
        .copy(headWorldPosition)
        .project(camera).z
      targetWorldPosition
        .set(pointer.x, pointer.y, pointerDepth)
        .unproject(camera)
      camera.getWorldDirection(cameraDirection)
      targetWorldPosition.addScaledVector(cameraDirection, -0.22)
      torso.worldToLocal(targetLocalPosition.copy(targetWorldPosition))
      headAim.position.copy(headPivot.position)
      headAim.up.set(0, 1, 0)
      headAim.lookAt(targetLocalPosition)
      headAim.rotateZ(Math.sin(elapsed * 1.15) * 0.01 * idleMotion)
      headPivot.quaternion.slerp(headAim.quaternion, headEase)
      eyeRigs.forEach(({ eye, lid, side }) => {
        eye.scale.y = 1 - blink * 0.96
        eye.position.x = side * 0.019 + pointer.x * 0.0015
        eye.position.y = 0.027 + pointer.y * 0.001
        lid.position.y = 0.032 - blink * 0.006
        lid.scale.y = 0.0025 + blink * 0.004
      })
      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', updatePointer)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose())
        } else {
          object.material.dispose()
        }
      })
      Object.values(materials).forEach((material) => material.dispose())
      renderer.dispose()
      stage.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={stageRef}
      className="portfolio-character-stage"
      aria-label="Original interactive 3D character"
    />
  )
}
