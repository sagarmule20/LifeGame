import { useEffect, useState } from 'react'

export default function AchievementToast({ achievement, onDone }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onDone, 400)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 max-w-[400px] w-[90%] pixel-card p-3 flex items-center gap-3 transition-all duration-400"
      style={{
        zIndex: 10001,
        borderColor: '#f59e0b',
        transform: `translate(-50%, ${show ? '0' : '-120%'})`,
        boxShadow: '0 0 30px rgba(245,158,11,0.3)',
      }}
    >
      <div
        className="w-10 h-10 flex items-center justify-center text-2xl flex-shrink-0"
        style={{ animation: 'bounce 0.5s ease-in-out 3' }}
      >
        {achievement.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-pixel text-[7px] mb-0.5" style={{ color: '#f59e0b' }}>
          ACHIEVEMENT UNLOCKED
        </p>
        <p className="font-pixel text-[9px] truncate" style={{ color: 'var(--text-primary)' }}>
          {achievement.name}
        </p>
        <p className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
          {achievement.desc}
        </p>
      </div>
      <span className="text-xl flex-shrink-0">{'🏆'}</span>
    </div>
  )
}
