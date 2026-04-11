import { useEffect, useState, useRef } from 'react'

const CONFETTI_COUNT = 60

function ConfettiPiece({ delay }) {
  const style = {
    position: 'absolute',
    left: `${Math.random() * 100}%`,
    top: '-10px',
    width: `${Math.random() * 8 + 4}px`,
    height: `${Math.random() * 8 + 4}px`,
    backgroundColor: ['#f59e0b', '#14b8a6', '#ef4444', '#8b5cf6', '#3b82f6', '#f472b6'][
      Math.floor(Math.random() * 6)
    ],
    borderRadius: Math.random() > 0.5 ? '50%' : '0',
    animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in ${delay}s forwards`,
    transform: `rotate(${Math.random() * 360}deg)`,
  }
  return <div style={style} />
}

export default function LevelUpModal({ missionName, missionIcon, newLevel, missionColor, onClose }) {
  const [show, setShow] = useState(false)
  const [shake, setShake] = useState(true)

  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
    const shakeTimer = setTimeout(() => setShake(false), 500)
    return () => clearTimeout(shakeTimer)
  }, [])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
          <ConfettiPiece key={i} delay={Math.random() * 0.5} />
        ))}
      </div>

      {/* Modal */}
      <div
        className={`relative pixel-card p-8 text-center max-w-[320px] w-full transition-all duration-500 ${
          shake ? 'screen-shake' : ''
        }`}
        style={{
          transform: show ? 'scale(1)' : 'scale(0.3)',
          opacity: show ? 1 : 0,
          borderColor: missionColor,
          boxShadow: `0 0 40px ${missionColor}44, 0 0 80px ${missionColor}22`,
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute -inset-1 opacity-30"
          style={{
            background: `radial-gradient(circle, ${missionColor}44, transparent 70%)`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />

        <div className="relative">
          <div className="text-5xl mb-3" style={{ animation: 'bounce 0.6s ease-in-out infinite' }}>
            {missionIcon}
          </div>

          <h2
            className="font-pixel text-xs mb-2"
            style={{ color: missionColor }}
          >
            LEVEL UP!
          </h2>

          <div
            className="font-pixel text-4xl mb-2"
            style={{
              color: '#f59e0b',
              textShadow: '0 0 20px rgba(245,158,11,0.6)',
              animation: 'levelNumber 0.5s ease-out',
            }}
          >
            {newLevel}
          </div>

          <p className="font-pixel text-[8px] mb-4" style={{ color: 'var(--text-secondary)' }}>
            {missionName} has grown stronger!
          </p>

          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: Math.min(newLevel, 10) }, (_, i) => (
              <span
                key={i}
                className="text-sm"
                style={{ animationDelay: `${i * 0.1}s`, animation: 'starPop 0.3s ease-out backwards' }}
              >
                {'⭐'}
              </span>
            ))}
          </div>

          <button
            onClick={onClose}
            className="font-pixel text-[10px] px-6 py-2"
            style={{ backgroundColor: missionColor, color: '#0f172a' }}
          >
            ONWARD!
          </button>
        </div>
      </div>
    </div>
  )
}
