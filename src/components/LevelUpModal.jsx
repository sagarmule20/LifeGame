import { useEffect, useState } from 'react'

const CONFETTI_COUNT = 50

function ConfettiPiece({ delay }) {
  const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF9600', '#CE82FF', '#FF86D0']
  const style = {
    position: 'absolute', left: `${Math.random() * 100}%`, top: '-10px',
    width: `${Math.random() * 8 + 4}px`, height: `${Math.random() * 8 + 4}px`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    borderRadius: Math.random() > 0.5 ? '50%' : '4px',
    animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in ${delay}s forwards`,
    transform: `rotate(${Math.random() * 360}deg)`,
  }
  return <div style={style} />
}

export default function LevelUpModal({ missionName, missionIcon, newLevel, missionColor, onClose }) {
  const [show, setShow] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setShow(true)) }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10000, background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: CONFETTI_COUNT }, (_, i) => <ConfettiPiece key={i} delay={Math.random() * 0.5} />)}
      </div>
      <div className="relative card p-8 text-center max-w-[320px] w-full transition-all duration-500 screen-shake"
        style={{
          transform: show ? 'scale(1)' : 'scale(0.3)', opacity: show ? 1 : 0,
          borderColor: missionColor, boxShadow: `0 0 40px ${missionColor}33`,
        }}>
        <div className="text-5xl mb-3" style={{ animation: 'bounce 0.6s ease-in-out infinite' }}>{missionIcon}</div>
        <h2 className="text-sm font-extrabold mb-2" style={{ color: missionColor }}>LEVEL UP!</h2>
        <div className="text-5xl font-black mb-2" style={{ color: 'var(--coin)', animation: 'levelNumber 0.5s ease-out' }}>{newLevel}</div>
        <p className="text-xs font-bold mb-4" style={{ color: 'var(--text-dim)' }}>{missionName} has grown stronger!</p>
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: Math.min(newLevel, 10) }, (_, i) => (
            <span key={i} style={{ animation: `starPop 0.3s ease-out ${i * 0.1}s backwards` }}>⭐</span>
          ))}
        </div>
        <button onClick={onClose} className="btn btn-green py-2.5 px-8 text-sm">AWESOME!</button>
      </div>
    </div>
  )
}
