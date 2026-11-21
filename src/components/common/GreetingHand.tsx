'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function GreetingHand() {
  const stageRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(stage.clientWidth, stage.clientHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    stage.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1.8))
    const keyLight = new THREE.DirectionalLight(0xffefdc, 2.2)
    keyLight.position.set(-2, 3, 4)
    scene.add(keyLight)

    const skin = new THREE.MeshStandardMaterial({
      color: 0xe7b99b,
      roughness: 0.52,
      metalness: 0.02,
      transparent: true,
    })
    const cursorMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0c46c,
      roughness: 0.36,
      metalness: 0.12,
      transparent: true,
    })
    const outlineMaterial = new THREE.LineBasicMaterial({
      color: 0x40382e,
      transparent: true,
    })

    const hand = new THREE.Group()
    const palm = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), skin)
    palm.position.set(0, 0.04, 0)
    palm.scale.set(0.29, 0.34, 0.12)
    hand.add(palm)

    const wrist = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.13, 0.24, 5, 12),
      skin,
    )
    wrist.position.set(0, -0.32, 0)
    hand.add(wrist)

    const fingerLengths = [0.35, 0.47, 0.43, 0.32]
    const fingerAngles = [-0.12, -0.035, 0.06, 0.17]
    fingerLengths.forEach((length, index) => {
      const finger = new THREE.Group()
      finger.position.set(-0.21 + index * 0.14, 0.29, 0)
      finger.rotation.z = fingerAngles[index]
      const segment = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.047, length, 5, 10),
        skin,
      )
      segment.position.y = length * 0.48
      finger.add(segment)
      hand.add(finger)
    })

    const thumb = new THREE.Group()
    thumb.position.set(-0.23, -0.02, 0)
    thumb.rotation.z = -0.82
    const thumbSegment = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.058, 0.23, 5, 10),
      skin,
    )
    thumbSegment.position.y = 0.12
    thumb.add(thumbSegment)
    hand.add(thumb)
    hand.visible = false
    scene.add(hand)

    const cursorShape = new THREE.Shape()
    cursorShape.moveTo(-0.24, 0.46)
    cursorShape.lineTo(-0.24, -0.34)
    cursorShape.lineTo(-0.04, -0.15)
    cursorShape.lineTo(0.04, -0.39)
    cursorShape.lineTo(0.16, -0.34)
    cursorShape.lineTo(0.07, -0.1)
    cursorShape.lineTo(0.3, -0.1)
    cursorShape.closePath()
    const cursorGeometry = new THREE.ExtrudeGeometry(cursorShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.018,
      bevelThickness: 0.018,
      steps: 1,
    })
    const cursor = new THREE.Group()
    const cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial)
    cursorMesh.position.z = 0.05
    cursor.add(cursorMesh)
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(cursorGeometry),
      outlineMaterial,
    )
    outline.position.copy(cursorMesh.position)
    cursor.add(outline)
    cursor.scale.setScalar(0)
    scene.add(cursor)

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const resize = () => {
      renderer.setSize(
        Math.max(1, stage.clientWidth),
        Math.max(1, stage.clientHeight),
      )
      renderer.render(scene, camera)
    }
    window.addEventListener('resize', resize)

    const waveDuration = 2.25
    const morphDuration = 0.65
    let startTime = 0
    let frame = 0
    let started = false
    const animate = (now: number) => {
      if (startTime === 0) startTime = now
      const elapsed = (now - startTime) / 1000
      hand.visible = elapsed < waveDuration + morphDuration

      if (elapsed < waveDuration) {
        hand.rotation.z = Math.sin(elapsed * 8) * 0.24
        hand.rotation.x = Math.sin(elapsed * 5) * 0.04
      } else {
        const progress = THREE.MathUtils.clamp(
          (elapsed - waveDuration) / morphDuration,
          0,
          1,
        )
        const eased = 1 - (1 - progress) ** 3
        hand.scale.setScalar(1 - eased)
        skin.opacity = 1 - eased
        cursor.scale.setScalar(eased)
        cursor.rotation.z = (1 - eased) * -0.25
        cursorMaterial.opacity = eased
        outlineMaterial.opacity = eased
      }

      renderer.render(scene, camera)
      if (elapsed < waveDuration + morphDuration) {
        frame = requestAnimationFrame(animate)
      }
    }

    const startAnimation = () => {
      if (started) return
      started = true
      if (reducedMotion) {
        cursor.scale.setScalar(1)
        cursorMaterial.opacity = 1
        outlineMaterial.opacity = 1
        renderer.render(scene, camera)
        return
      }

      startTime = 0
      frame = requestAnimationFrame(animate)
    }

    window.addEventListener('portfolio:intro-complete', startAnimation, {
      once: true,
    })
    if (window.sessionStorage.getItem('portfolio_intro_seen') === '1') {
      startAnimation()
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('portfolio:intro-complete', startAnimation)
      scene.traverse((object) => {
        if (!(
          object instanceof THREE.Mesh || object instanceof THREE.LineSegments
        )) {
          return
        }
        object.geometry.dispose()
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material]
        materials.forEach((material) => material.dispose())
      })
      renderer.dispose()
      stage.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <span
      ref={stageRef}
      role="img"
      aria-label="A 3D hand waves hello, then turns into a cursor"
      className="inline-flex h-10 w-10 translate-y-1 align-middle sm:h-12 sm:w-12 md:h-16 md:w-16"
    />
  )
}
