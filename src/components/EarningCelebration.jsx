import { useEffect, useState } from 'react'

export default function EarningCelebration({ amount, taskName, missionIcon, onDone }) {
  const [phase, setPhase] = useState(0) // 0=enter, 1=show, 2=exit

  useEffect(() => {
    requestAnimationFrame(() => setPhase(1))
    const t = setTimeout(() => {
      setPhase(2)
      setTimeout(onDone, 400)
    }, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9998,
        background: phase >= 1 ? 'rgba(0,0,0,0.75)' : 'transparent',
        transition: 'background 0.3s',
        pointerEvents: phase === 2 ? 'none' : 'auto',
      }}
      onClick={onDone}
    >
      <div
        className="text-center transition-all duration-500"
        style={{
          transform: phase === 1 ? 'scale(1)' : phase === 2 ? 'scale(0.8) translateY(-30px)' : 'scale(0.5)',
          opacity: phase === 1 ? 1 : phase === 2 ? 0 : 0,
        }}
      >
        {/* Icon burst */}
        <div className="text-6xl mb-4" style={{ animation: 'bounce 0.6s ease-in-out infinite' }}>
          {missionIcon || '💶'}
        </div>

        {/* Euro amount */}
        <div
          className="text-6xl font-black mb-2"
          style={{
            color: '#FFC800',
            textShadow: '0 0 30px rgba(255,200,0,0.5), 0 0 60px rgba(255,200,0,0.3)',
            animation: phase === 1 ? 'coinPop 0.5s ease-out' : undefined,
          }}
        >
          +€{amount}
        </div>

        {/* Task name */}
        <p className="text-lg font-extrabold mb-1" style={{ color: '#fff' }}>
          Earned!
        </p>
        <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {taskName}
        </p>

        {/* Floating euro signs */}
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${30 + Math.random() * 40}%`,
              animation: `flyUp ${1 + Math.random()}s ease-out ${i * 0.1}s forwards`,
              opacity: 0.7,
            }}
          >
            💶
          </span>
        ))}
      </div>
    </div>
  )
}
