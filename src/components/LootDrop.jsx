import { useEffect, useState } from 'react'
import { RARITY_COLORS } from '../data/achievements'

export default function LootDrop({ loot, onClose }) {
  const [show, setShow] = useState(false)
  const [chestOpen, setChestOpen] = useState(false)

  const rarityColor = RARITY_COLORS[loot.rarity]

  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
    const openTimer = setTimeout(() => setChestOpen(true), 600)
    return () => clearTimeout(openTimer)
  }, [])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="pixel-card p-6 text-center max-w-[280px] w-full relative overflow-hidden transition-all duration-500"
        style={{
          transform: show ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(50px)',
          opacity: show ? 1 : 0,
          borderColor: rarityColor,
          boxShadow: `0 0 30px ${rarityColor}44, inset 0 0 30px ${rarityColor}11`,
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${rarityColor}22, transparent 70%)`,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />

        <div className="relative">
          {!chestOpen ? (
            <div style={{ animation: 'chestShake 0.15s ease-in-out infinite' }}>
              <span className="text-5xl">{'🎁'}</span>
              <p className="font-pixel text-[8px] mt-2" style={{ color: 'var(--text-secondary)' }}>
                Opening...
              </p>
            </div>
          ) : (
            <>
              <div style={{ animation: 'itemReveal 0.5s ease-out' }}>
                <span className="text-5xl block mb-2">{loot.icon}</span>
              </div>

              <h3 className="font-pixel text-[10px] mb-1" style={{ color: rarityColor }}>
                {loot.name}
              </h3>

              <span
                className="font-pixel text-[7px] inline-block px-2 py-0.5 mb-2 uppercase"
                style={{
                  backgroundColor: `${rarityColor}22`,
                  color: rarityColor,
                  border: `1px solid ${rarityColor}`,
                }}
              >
                {loot.rarity}
              </span>

              <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                "{loot.flavor}"
              </p>

              <button
                onClick={onClose}
                className="font-pixel text-[8px] px-4 py-2 mt-4"
                style={{ backgroundColor: rarityColor, color: '#0f172a' }}
              >
                COLLECT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
