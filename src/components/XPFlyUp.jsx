import { useEffect, useState } from 'react'

export default function XPFlyUp({ xp, x, y, onDone }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDone?.() }, 1200)
    return () => clearTimeout(t)
  }, [onDone])
  if (!visible) return null
  return (
    <div className="fixed pointer-events-none" style={{ left: x, top: y, zIndex: 9999, animation: 'flyUp 1.2s ease-out forwards' }}>
      <span className="text-lg font-black" style={{ color: '#FFC800', textShadow: '0 0 10px rgba(255,200,0,0.6)' }}>
        +€{xp}
      </span>
    </div>
  )
}
