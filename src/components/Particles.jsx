import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 35

export default function Particles({ color = 'rgba(245,158,11,0.4)', speed = 0.3 }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * speed,
      speedY: -Math.random() * speed - 0.1,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      type: Math.random() > 0.7 ? 'star' : 'dot',
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += 0.02
        const currentOpacity = p.opacity * (0.5 + Math.sin(p.pulse) * 0.5)

        if (p.y < -10) p.y = canvas.height + 10
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        ctx.save()
        ctx.globalAlpha = currentOpacity

        if (p.type === 'star') {
          // Draw tiny 4-point star
          ctx.fillStyle = '#f59e0b'
          ctx.translate(p.x, p.y)
          ctx.rotate(p.pulse)
          for (let i = 0; i < 4; i++) {
            ctx.beginPath()
            ctx.moveTo(0, -p.size * 2)
            ctx.lineTo(p.size * 0.5, 0)
            ctx.lineTo(0, p.size * 0.3)
            ctx.lineTo(-p.size * 0.5, 0)
            ctx.fill()
            ctx.rotate(Math.PI / 2)
          }
        } else {
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [color, speed])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
