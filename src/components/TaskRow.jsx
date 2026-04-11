import { useRef, useCallback, useState } from 'react'

export default function TaskRow({ task, onToggle }) {
  const rowRef = useRef(null)
  const [slashing, setSlashing] = useState(false)

  const handleToggle = useCallback((e) => {
    if (!task.completedToday) {
      // Show XP fly-up at click position
      const rect = e.currentTarget.getBoundingClientRect()
      window.__showXPFlyUp?.(task.xpReward, rect.right - 40, rect.top)

      // Trigger slash effect
      setSlashing(true)
      setTimeout(() => setSlashing(false), 500)
    }

    onToggle(task.id)

    if (!task.completedToday && rowRef.current) {
      rowRef.current.classList.add('task-flash')
      setTimeout(() => rowRef.current?.classList.remove('task-flash'), 500)
    }
  }, [task.id, task.completedToday, task.xpReward, onToggle])

  return (
    <div
      ref={rowRef}
      className="relative flex items-center gap-3 px-3 py-3 transition-all overflow-hidden"
      style={{
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        opacity: task.completedToday ? 0.65 : 1,
      }}
    >
      {/* Slash effect overlay */}
      {slashing && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="slash-effect"
            style={{
              width: '120%',
              height: '3px',
              backgroundColor: '#f59e0b',
              boxShadow: '0 0 10px #f59e0b, 0 0 20px rgba(245,158,11,0.5)',
            }}
          />
        </div>
      )}

      {/* Defeat button */}
      <button
        onClick={handleToggle}
        className="w-8 h-8 flex-shrink-0 flex items-center justify-center transition-all active:scale-90"
        style={{
          border: `2px solid ${task.completedToday ? 'var(--success)' : 'var(--accent)'}`,
          borderRadius: 0,
          backgroundColor: task.completedToday ? 'var(--success)' : 'transparent',
        }}
      >
        {task.completedToday ? (
          <span className="text-sm">{'⚔️'}</span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--accent)' }}>{'👊'}</span>
        )}
      </button>

      {/* Task name */}
      <span
        className="flex-1 text-sm transition-all"
        style={{
          color: task.completedToday ? 'var(--text-secondary)' : 'var(--text-primary)',
          textDecoration: task.completedToday ? 'line-through' : 'none',
        }}
      >
        {task.name}
        {task.completedToday && (
          <span className="ml-2 text-[10px]" style={{ color: 'var(--success)' }}>DEFEATED</span>
        )}
      </span>

      {/* XP badge */}
      <span
        className="font-pixel text-[8px] px-2 py-1 flex-shrink-0"
        style={{
          backgroundColor: task.completedToday
            ? 'rgba(20,184,166,0.15)'
            : 'rgba(245,158,11,0.15)',
          color: task.completedToday ? 'var(--success)' : 'var(--accent)',
          textShadow: task.completedToday ? undefined : '0 0 6px rgba(245,158,11,0.3)',
        }}
      >
        +{task.xpReward}
      </span>

      {/* Streak flame */}
      {task.streak > 0 && (
        <span
          className="text-sm flex-shrink-0 flex items-center gap-0.5"
          style={{
            color: 'var(--accent)',
            animation: task.streak >= 7 ? 'pulse 1s ease-in-out infinite' : undefined,
          }}
        >
          {'🔥'}
          <span className="font-pixel text-[8px]">{task.streak}</span>
        </span>
      )}
    </div>
  )
}
