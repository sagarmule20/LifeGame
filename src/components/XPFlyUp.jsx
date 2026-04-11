import { useEffect, useState } from 'react'

export default function XPFlyUp({ xp, x, y, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, 1200)
    return () => clearTimeout(timer)
  }, [onDone])

  if (!visible) return null

  return (
    <div
      className="fixed pointer-events-none font-pixel"
      style={{
        left: x,
        top: y,
        zIndex: 9999,
        animation: 'flyUp 1.2s ease-out forwards',
      }}
    >
      <span className="text-lg" style={{
        color: '#f59e0b',
        textShadow: '0 0 10px rgba(245,158,11,0.8), 0 0 20px rgba(245,158,11,0.4)',
      }}>
        +{xp} XP
      </span>
    </div>
  )
}
