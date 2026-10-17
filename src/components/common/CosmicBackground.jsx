import React, { useEffect, useRef } from 'react'

/**
 * CosmicBackground Component (3D Gentle Forward Starfield & Optical Lens Texture)
 * 
 * Sensation of Forward Flight ("đang đi tới"):
 * - Gentle, hypnotic forward drift from center vanishing point towards 4 borders.
 * - Slower, calmer velocities so particles feel tranquil and aesthetic.
 * - Continuous seamless rebirth at center vanishing point.
 * - Mobile Optimization: Dramatically reduced particle count on small viewports (<768px).
 * - Cleaned-up Lens Cards: Constellation linkage lines are strictly suppressed inside
 *   lens cards to avoid visual clutter behind typography, keeping text razor-sharp.
 * 
 * 3 Distinct Cosmic Layers:
 * 1. Foreground Layer (Near):
 *    - Closest flyby bokeh dust (radius 2.0px - 3.2px)
 *    - Faint ambient opacity (~0.045), moving outward past the camera
 * 
 * 2. Midground Layer (Mid):
 *    - Medium stars (radius 0.9px - 1.5px)
 *    - Crisp optical opacity (0.12 - 0.22) with delicate open-space constellation ties
 * 
 * 3. Background Layer (Deep Space):
 *    - Microscopic star dust (radius 0.4px - 0.7px)
 *    - Faint atmospheric opacity (~0.018 - 0.028)
 * 
 * Optical Glassmorphism Lens Interaction:
 * - When particles pass behind any card marked with [data-lens-card="true"]:
 *   - Particles magnify by 2x - 2.6x.
 *   - Forward travel slows down, simulating a dense optical medium.
 *   - Constellation lines are eliminated inside lens cards for zero clutter.
 *   - Faint dust leaps to ~0.45 opacity; midground stars glow at ~0.80.
 */
export default function CosmicBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId = null
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let isMobile = width < 768

    // Dynamic Tracking of Glassmorphism Lens Cards in Viewport
    let lensRects = []
    const updateLensRects = () => {
      const elements = document.querySelectorAll('[data-lens-card="true"]')
      const rects = []
      const winW = window.innerWidth
      const winH = window.innerHeight

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]
        if (el.offsetParent === null && window.getComputedStyle(el).position !== 'fixed') {
          continue
        }
        const r = el.getBoundingClientRect()
        if (
          r.bottom >= -50 &&
          r.top <= winH + 50 &&
          r.right >= -50 &&
          r.left <= winW + 50 &&
          r.width > 0 &&
          r.height > 0
        ) {
          rects.push({
            left: r.left,
            top: r.top,
            right: r.right,
            bottom: r.bottom,
            w: r.width,
            h: r.height,
            cx: r.left + r.width / 2,
            cy: r.top + r.height / 2,
          })
        }
      }
      lensRects = rects
    }

    // ─── 3D Space Projection Setup ───────────────────────────────────────────
    const FOCAL_LENGTH = 340
    const Z_MAX = 1100

    // Particle arrays
    let foregroundStars = []
    let midgroundStars = []
    let backgroundStars = []

    // Helper: spawn/respawn particle with wide side distribution & center clearance
    const spawnParticle = (star, initialSpread = false) => {
      // 65% of particles spawn along the left & right wings to frame the screen beautifully
      // 35% spawn in the central area with a guaranteed clearance zone to prevent crowding
      const isFlank = Math.random() < 0.65

      if (isFlank) {
        // Left or right lateral corridor
        const side = Math.random() < 0.5 ? -1 : 1
        const flankMin = isMobile ? width * 0.16 : width * 0.22
        const flankSpread = isMobile ? width * 0.65 : width * 0.85
        const flankDistance = flankMin + Math.random() * flankSpread

        star.worldX = side * flankDistance
        star.worldY = (Math.random() - 0.5) * (isMobile ? height * 1.2 : height * 1.35)
      } else {
        // Central area: guaranteed minimum clearance (40px on mobile, 70px on desktop)
        const angle = Math.random() * Math.PI * 2
        const minClearance = isMobile ? 40 : 70
        const maxDist = isMobile ? width * 0.35 : width * 0.4
        const dist = minClearance + Math.random() * maxDist

        star.worldX = Math.cos(angle) * dist
        star.worldY = Math.sin(angle) * dist * (isMobile ? 1.3 : 1.0)
      }

      star.z = initialSpread ? 20 + Math.random() * (Z_MAX - 20) : Z_MAX - Math.random() * 80
    }

    // Helper: Assign authentic astrophysical stellar spectral colors (< 4.5% of total stars)
    // - Gold / Amber-Yellow (G-type stars, Sun-like)
    // - Warm Orange (K/M-type giant stars)
    // - Deep Space Blue / Cyan (O/B-type hot supergiants)
    const assignStellarColor = (star, chance = 0.045) => {
      if (Math.random() < chance) {
        const roll = Math.random()
        if (roll < 0.34) {
          // Luminous Gold / Warm Yellow
          star.color = '#ffd166'
          star.glowColor = 'rgba(255, 209, 102, 0.55)'
          star.rgb = '255, 209, 102'
          star.type = 'gold'
        } else if (roll < 0.67) {
          // Warm Radiant Orange
          star.color = '#ff9f43'
          star.glowColor = 'rgba(255, 159, 67, 0.55)'
          star.rgb = '255, 159, 67'
          star.type = 'orange'
        } else {
          // Electric Cosmic Blue / Cyan
          star.color = '#54a0ff'
          star.glowColor = 'rgba(84, 160, 255, 0.6)'
          star.rgb = '84, 160, 255'
          star.type = 'blue'
        }
        star.isColored = true
        star.brightnessBoost = 1.45 // Sáng hơn
        star.baseRadius *= 1.18
      } else {
        star.color = '#ffffff'
        star.glowColor = 'rgba(255, 255, 255, 0)'
        star.rgb = '255, 255, 255'
        star.isColored = false
        star.brightnessBoost = 1.0
        star.type = 'white'
      }
    }

    // Initialize or re-initialize particle counts based on viewport size
    const initParticles = () => {
      isMobile = width < 768

      // Mobile optimization: significantly reduced particle counts
      const foregroundCount = isMobile ? 8 : Math.max(16, Math.floor(width / 75))
      const midgroundCount = isMobile ? 24 : Math.max(55, Math.floor(width / 24))
      const backgroundCount = isMobile ? 65 : Math.max(150, Math.floor(width / 8))

      // ── Layer 1: Foreground (Slower, gentle forward speed) ──
      foregroundStars = Array.from({ length: foregroundCount }, () => {
        const star = {
          baseRadius: 2.0 + Math.random() * 1.2,
          baseAlpha: 0.04 + Math.random() * 0.02,
          baseSpeed: 1.4 + Math.random() * 0.6, // Calmer, slower flight
          speedFactor: 1.2,
        }
        assignStellarColor(star, 0.045)
        spawnParticle(star, true)
        return star
      })

      // ── Layer 2: Midground (Calm moderate speed) ──
      midgroundStars = Array.from({ length: midgroundCount }, () => {
        const star = {
          baseRadius: 0.9 + Math.random() * 0.5,
          baseAlpha: 0.12 + Math.random() * 0.08,
          baseSpeed: 0.75 + Math.random() * 0.35, // Slower gentle pace
          speedFactor: 0.8,
          twinkleSpeed: 0.02 + Math.random() * 0.03,
          twinkleOffset: Math.random() * Math.PI * 2,
        }
        assignStellarColor(star, 0.048)
        spawnParticle(star, true)
        return star
      })

      // ── Layer 3: Background (Deep dust, very slow drift) ──
      backgroundStars = Array.from({ length: backgroundCount }, () => {
        const star = {
          baseRadius: 0.4 + Math.random() * 0.35,
          baseAlpha: 0.016 + Math.random() * 0.012,
          baseSpeed: 0.32 + Math.random() * 0.18, // Very slow peaceful drift
          speedFactor: 0.5,
        }
        assignStellarColor(star, 0.038)
        spawnParticle(star, true)
        return star
      })
    }

    // Retina / High-DPI & Resize handling
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      initParticles()
      updateLensRects()
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const lensCheckInterval = setInterval(updateLensRects, 200)

    // Parallax tracking states with LERP easing
    let targetMouseX = 0
    let targetMouseY = 0
    let mouseX = 0
    let mouseY = 0

    let lastScrollY = window.scrollY || 0
    let scrollBoost = 0

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX - width / 2
      targetMouseY = e.clientY - height / 2
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0
      const delta = Math.abs(currentScrollY - lastScrollY)
      lastScrollY = currentScrollY
      // Gentle, non-aggressive scroll boost
      scrollBoost = Math.min(scrollBoost + delta * 0.035, 3.5)
      updateLensRects()
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Helper: Check if screen coordinate falls behind a lens card
    const checkLensInfluence = (px, py) => {
      for (let i = 0; i < lensRects.length; i++) {
        const r = lensRects[i]
        if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) {
          const edgeDist = Math.min(px - r.left, r.right - px, py - r.top, r.bottom - py)
          const factor = Math.min(1, Math.max(0, edgeDist / 24))

          // Subtle convex lens refraction displacement
          const normX = (px - r.cx) / (r.w * 0.5)
          const normY = (py - r.cy) / (r.h * 0.5)
          const refractX = normX * 6 * factor
          const refractY = normY * 6 * factor

          return {
            factor,
            refractX,
            refractY,
          }
        }
      }
      return null
    }

    let time = 0

    // Render loop
    const render = () => {
      // Smooth LERP steering of the vanishing point by mouse
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      scrollBoost *= 0.91
      time += 0.016

      // Center vanishing point (subtle steering for 3D banking)
      const vanishingX = width / 2 + mouseX * 0.06
      const vanishingY = height / 2 + mouseY * 0.06

      ctx.clearRect(0, 0, width, height)

      // ─── 1. RENDER BACKGROUND LAYER (Microscopic Dust) ───
      for (let i = 0; i < backgroundStars.length; i++) {
        const star = backgroundStars[i]

        const currentSpeed = star.baseSpeed + scrollBoost * star.speedFactor
        star.z -= currentSpeed

        const scale = FOCAL_LENGTH / Math.max(12, star.z)
        let px = vanishingX + star.worldX * scale
        let py = vanishingY + star.worldY * scale

        if (star.z <= 15 || px < -30 || px > width + 30 || py < -30 || py > height + 30) {
          spawnParticle(star, false)
          continue
        }

        const lens = checkLensInfluence(px, py)
        if (lens) {
          // Slow down forward movement while passing through dense optical glass
          star.z += currentSpeed * 0.6 * lens.factor
          px += lens.refractX
          py += lens.refractY
        }

        // Corner & Proximity metric: particles closer to camera & spreading out to 4 corners become significantly clearer
        const depthRatio = Math.max(0, Math.min(1, 1 - star.z / Z_MAX))
        const cornerDistX = Math.abs(px - vanishingX) / (width * 0.5)
        const cornerDistY = Math.abs(py - vanishingY) / (height * 0.5)
        const cornerRatio = Math.min(1.2, Math.hypot(cornerDistX, cornerDistY) / 1.414)
        const cornerClarity = Math.min(1.3, Math.pow(Math.max(depthRatio * 0.45, cornerRatio * 0.85), 1.25))

        // Center remains soft & faint; corners become crisp, distinct and sparkling
        let finalRadius = star.baseRadius * (0.6 + cornerClarity * 1.5)
        let finalAlpha = star.baseAlpha * (0.5 + cornerClarity * 5.2)

        const birthFade = Math.min(1, (Z_MAX - star.z) / 120)
        finalAlpha *= birthFade

        if (lens) {
          finalRadius *= 1 + 1.6 * lens.factor
          finalAlpha = finalAlpha + (0.42 - finalAlpha) * lens.factor
        }

        ctx.globalAlpha = Math.min(1, finalAlpha * (star.brightnessBoost || 1.0))
        ctx.fillStyle = star.color || '#ffffff'
        ctx.beginPath()
        ctx.arc(px, py, finalRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // ─── 2. RENDER MIDGROUND LAYER (Medium Stars) ──────────
      const midPositions = []
      for (let i = 0; i < midgroundStars.length; i++) {
        const star = midgroundStars[i]

        const currentSpeed = star.baseSpeed + scrollBoost * star.speedFactor
        star.z -= currentSpeed

        const scale = FOCAL_LENGTH / Math.max(12, star.z)
        let px = vanishingX + star.worldX * scale
        let py = vanishingY + star.worldY * scale

        if (star.z <= 15 || px < -35 || px > width + 35 || py < -35 || py > height + 35) {
          spawnParticle(star, false)
          continue
        }

        const lens = checkLensInfluence(px, py)
        if (lens) {
          star.z += currentSpeed * 0.6 * lens.factor
          px += lens.refractX
          py += lens.refractY
        }

        const depthRatio = Math.max(0, Math.min(1, 1 - star.z / Z_MAX))
        const cornerDistX = Math.abs(px - vanishingX) / (width * 0.5)
        const cornerDistY = Math.abs(py - vanishingY) / (height * 0.5)
        const cornerRatio = Math.min(1.2, Math.hypot(cornerDistX, cornerDistY) / 1.414)
        const cornerClarity = Math.min(1.3, Math.pow(Math.max(depthRatio * 0.45, cornerRatio * 0.85), 1.25))

        let finalRadius = star.baseRadius * (0.7 + cornerClarity * 1.6)

        const twinkle = Math.sin(time * 2.5 + star.twinkleOffset) * 0.04
        let baseA = Math.max(0.05, Math.min(0.28, star.baseAlpha + twinkle))
        // High-contrast clarity boost as it travels towards outer corners
        let finalAlpha = baseA * (0.6 + cornerClarity * 3.6)

        const birthFade = Math.min(1, (Z_MAX - star.z) / 100)
        finalAlpha *= birthFade

        if (lens) {
          finalRadius *= 1 + 1.5 * lens.factor
          finalAlpha = baseA + (0.78 - baseA) * lens.factor
        }

        const midAlpha = Math.min(1, finalAlpha * (star.brightnessBoost || 1.0))
        midPositions.push({ x: px, y: py, alpha: midAlpha, inLens: !!lens, factor: lens?.factor || 0 })

        ctx.globalAlpha = midAlpha
        ctx.fillStyle = star.color || '#ffffff'

        // Spectral glow for rare colored stars (<5%)
        if (star.isColored) {
          ctx.shadowBlur = 4 * cornerClarity + 3
          ctx.shadowColor = star.glowColor
        }

        ctx.beginPath()
        ctx.arc(px, py, finalRadius, 0, Math.PI * 2)
        ctx.fill()
        if (star.isColored) {
          ctx.shadowBlur = 0
        }

        // Subtle optical diffraction flare when star is magnified inside the lens or bright colored star
        if ((lens && lens.factor > 0.5) || (star.isColored && cornerClarity > 0.55)) {
          const flareLen = finalRadius * (star.isColored ? 2.0 : 1.8)
          ctx.strokeStyle = star.color || '#ffffff'
          ctx.lineWidth = 0.5
          ctx.globalAlpha = midAlpha * (star.isColored ? 0.35 : 0.25)

          ctx.beginPath()
          ctx.moveTo(px - flareLen, py)
          ctx.lineTo(px + flareLen, py)
          ctx.moveTo(px, py - flareLen)
          ctx.lineTo(px, py + flareLen)
          ctx.stroke()
        }
      }

      // ─── Minimal Constellation Linkages (STRICTLY SUPPRESSED INSIDE LENS) ───
      // On mobile or inside lens cards, zero line clutter to keep content clean
      if (!isMobile) {
        ctx.strokeStyle = '#ffffff'
        for (let i = 0; i < midPositions.length; i++) {
          for (let j = i + 1; j < midPositions.length; j++) {
            // Strictly DO NOT draw lines if either star is inside or entering a lens card
            if (midPositions[i].inLens || midPositions[j].inLens) {
              continue
            }

            const dx = midPositions[i].x - midPositions[j].x
            const dy = midPositions[i].y - midPositions[j].y
            const distSq = dx * dx + dy * dy

            // Tighter connection threshold (46px) and ultra-faint alpha
            if (distSq < 2100) {
              const dist = Math.sqrt(distSq)
              const lineAlpha = (1 - dist / 46) * 0.02
              ctx.lineWidth = 0.5
              ctx.globalAlpha = lineAlpha
              ctx.beginPath()
              ctx.moveTo(midPositions[i].x, midPositions[i].y)
              ctx.lineTo(midPositions[j].x, midPositions[j].y)
              ctx.stroke()
            }
          }
        }
      }

      // ─── 3. RENDER FOREGROUND LAYER (Flyby Near Bokeh Discs) ────────────────
      for (let i = 0; i < foregroundStars.length; i++) {
        const star = foregroundStars[i]

        const currentSpeed = star.baseSpeed + scrollBoost * star.speedFactor
        star.z -= currentSpeed

        const scale = FOCAL_LENGTH / Math.max(12, star.z)
        let px = vanishingX + star.worldX * scale
        let py = vanishingY + star.worldY * scale

        if (star.z <= 15 || px < -50 || px > width + 50 || py < -50 || py > height + 50) {
          spawnParticle(star, false)
          continue
        }

        const lens = checkLensInfluence(px, py)
        if (lens) {
          star.z += currentSpeed * 0.6 * lens.factor
          px += lens.refractX
          py += lens.refractY
        }

        const depthRatio = Math.max(0, Math.min(1, 1 - star.z / Z_MAX))
        const cornerDistX = Math.abs(px - vanishingX) / (width * 0.5)
        const cornerDistY = Math.abs(py - vanishingY) / (height * 0.5)
        const cornerRatio = Math.min(1.2, Math.hypot(cornerDistX, cornerDistY) / 1.414)
        const cornerClarity = Math.min(1.3, Math.pow(Math.max(depthRatio * 0.45, cornerRatio * 0.85), 1.25))

        // Large luminous bokeh towards the 4 corners
        let finalRadius = star.baseRadius * (0.8 + cornerClarity * 1.8)
        let finalAlpha = star.baseAlpha * (0.6 + cornerClarity * 4.2)

        const birthFade = Math.min(1, (Z_MAX - star.z) / 90)
        finalAlpha *= birthFade

        if (lens) {
          finalRadius *= 1 + 1.35 * lens.factor
          finalAlpha = star.baseAlpha + (0.24 - star.baseAlpha) * lens.factor
        }

        const fgAlpha = Math.min(1, finalAlpha * (star.brightnessBoost || 1.0))
        const rgb = star.rgb || '255, 255, 255'

        // Soft radial gradient for near-field optical bokeh with spectral tint
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, finalRadius * 1.8)
        gradient.addColorStop(0, `rgba(${rgb}, ${fgAlpha * 1.6})`)
        gradient.addColorStop(0.5, `rgba(${rgb}, ${fgAlpha})`)
        gradient.addColorStop(1, `rgba(${rgb}, 0)`)

        ctx.globalAlpha = 1
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(px, py, finalRadius * 1.8, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(lensCheckInterval)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
