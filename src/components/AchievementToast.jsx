import { useEffect, useState } from 'react'

export default function AchievementToast({ achievement, onDone }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
    const t = setTimeout(() => { setShow(false); setTimeout(onDone, 400) }, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 max-w-[400px] w-[90%] card p-3 flex items-center gap-3 transition-all duration-400"
      style={{
        zIndex: 10001, borderColor: 'var(--green)',
        transform: `translate(-50%, ${show ? '0' : '-120%'})`,
        boxShadow: '0 4px 20px rgba(88,204,2,0.2)',
      }}>
      <div className="w-10 h-10 flex items-center justify-center text-2xl flex-shrink-0" style={{ animation: 'bounce 0.5s ease-in-out 3' }}>
        {achievement.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-extrabold" style={{ color: 'var(--green)' }}>ACHIEVEMENT UNLOCKED</p>
        <p className="text-xs font-extrabold truncate">{achievement.name}</p>
        <p className="text-[10px] truncate" style={{ color: 'var(--text-dim)' }}>{achievement.desc}</p>
      </div>
      <span className="text-xl flex-shrink-0">🏆</span>
    </div>
  )
}
