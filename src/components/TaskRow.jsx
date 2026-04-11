import { useRef, useCallback, useState } from 'react'
import { formatTime } from '../lib/notifications'

export default function TaskRow({ task, onToggle, showTime = false }) {
  const rowRef = useRef(null)
  const [slashing, setSlashing] = useState(false)

  const handleToggle = useCallback((e) => {
    if (!task.completedToday) {
      const rect = e.currentTarget.getBoundingClientRect()
      window.__showXPFlyUp?.(task.coinReward, rect.right - 40, rect.top)
      setSlashing(true)
      setTimeout(() => setSlashing(false), 500)
    }
    onToggle(task.id)
    if (!task.completedToday && rowRef.current) {
      rowRef.current.classList.add('task-flash')
      setTimeout(() => rowRef.current?.classList.remove('task-flash'), 400)
    }
  }, [task.id, task.completedToday, task.coinReward, onToggle])

  return (
    <div
      ref={rowRef}
      className="relative flex items-center gap-3 px-4 py-3.5 transition-all"
      style={{
        borderBottom: '1px solid var(--border)',
        opacity: task.completedToday ? 0.55 : 1,
      }}
    >
      {slashing && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="slash-effect" style={{
            width: '120%', height: '3px',
            background: 'var(--green)',
            boxShadow: '0 0 10px var(--green)',
          }} />
        </div>
      )}

      {/* Check button */}
      <button
        onClick={handleToggle}
        className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full transition-all active:scale-90"
        style={{
          border: `3px solid ${task.completedToday ? 'var(--green)' : 'var(--border)'}`,
          background: task.completedToday ? 'var(--green)' : 'transparent',
        }}
      >
        {task.completedToday && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <span
          className="text-sm font-bold block truncate"
          style={{
            color: task.completedToday ? 'var(--text-muted)' : 'var(--text)',
            textDecoration: task.completedToday ? 'line-through' : 'none',
          }}
        >
          {task.name}
        </span>
        {showTime && task.scheduledTime && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            🕐 {formatTime(task.scheduledTime)}
          </span>
        )}
      </div>

      {/* Coin reward */}
      <span className="coin-badge text-xs font-extrabold flex-shrink-0">
        🪙 +{task.coinReward}
      </span>

      {/* Streak */}
      {task.streak > 0 && (
        <span className="text-xs font-extrabold flex-shrink-0" style={{ color: 'var(--orange)' }}>
          🔥{task.streak}
        </span>
      )}
    </div>
  )
}
