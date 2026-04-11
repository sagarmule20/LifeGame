import { useEffect, useState } from 'react'

export default function XPFlyUp({ xp, x, y, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); onDone?.() }, 1200)
    return () => clearTimeout(timer)
  }, [onDone])

  if (!visible) return null

  return (
    <div className="fixed pointer-events-none" style={{ left: x, top: y, zIndex: 9999, animation: 'flyUp 1.2s ease-out forwards' }}>
      <span className="text-lg font-black" style={{ color: 'var(--coin)', textShadow: '0 0 10px rgba(255,200,0,0.6)' }}>
        🪙 +{xp}
      </span>
    </div>
  )
}
