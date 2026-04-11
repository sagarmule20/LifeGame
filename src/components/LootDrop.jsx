import { useEffect, useState } from 'react'
import { RARITY_COLORS } from '../data/achievements'

export default function LootDrop({ loot, onClose }) {
  const [show, setShow] = useState(false)
  const [chestOpen, setChestOpen] = useState(false)
  const color = RARITY_COLORS[loot.rarity]

  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
    const t = setTimeout(() => setChestOpen(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999, background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="card p-6 text-center max-w-[280px] w-full relative overflow-hidden transition-all duration-500"
        style={{
          transform: show ? 'scale(1)' : 'scale(0.5) translateY(50px)', opacity: show ? 1 : 0,
          borderColor: color, boxShadow: `0 0 30px ${color}33`,
        }}>
        {!chestOpen ? (
          <div style={{ animation: 'chestShake 0.15s ease-in-out infinite' }}>
            <span className="text-5xl">🎁</span>
            <p className="text-xs font-bold mt-2" style={{ color: 'var(--text-dim)' }}>Opening...</p>
          </div>
        ) : (
          <>
            <div style={{ animation: 'itemReveal 0.5s ease-out' }}>
              <span className="text-5xl block mb-2">{loot.icon}</span>
            </div>
            <h3 className="text-sm font-extrabold mb-1" style={{ color }}>{loot.name}</h3>
            <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-2 uppercase"
              style={{ background: `${color}22`, color, border: `1px solid ${color}` }}>{loot.rarity}</span>
            <p className="text-xs italic" style={{ color: 'var(--text-dim)' }}>"{loot.flavor}"</p>
            <button onClick={onClose} className="btn text-xs py-2 px-6 mt-4" style={{ background: color, color: '#fff' }}>COLLECT</button>
          </>
        )}
      </div>
    </div>
  )
}
