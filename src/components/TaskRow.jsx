import { useRef, useCallback } from 'react'

export default function TaskRow({ task, onToggle }) {
  const rowRef = useRef(null)

  const handleToggle = useCallback(() => {
    onToggle(task.id)
    if (!task.completedToday && rowRef.current) {
      rowRef.current.classList.add('task-flash')
      setTimeout(() => {
        rowRef.current?.classList.remove('task-flash')
      }, 400)
    }
  }, [task.id, task.completedToday, onToggle])

  return (
    <div
      ref={rowRef}
      className="flex items-center gap-3 px-3 py-3 transition-colors"
      style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}
    >
      <button
        onClick={handleToggle}
        className="w-6 h-6 flex-shrink-0 flex items-center justify-center transition-colors"
        style={{
          border: '2px solid var(--accent)',
          borderRadius: 0,
          backgroundColor: task.completedToday ? 'var(--accent)' : 'transparent',
        }}
      >
        {task.completedToday && (
          <span className="text-black text-sm font-bold">{'✓'}</span>
        )}
      </button>

      <span
        className="flex-1 text-sm"
        style={{
          color: task.completedToday ? 'var(--text-secondary)' : 'var(--text-primary)',
          textDecoration: task.completedToday ? 'line-through' : 'none',
        }}
      >
        {task.name}
      </span>

      <span
        className="font-pixel text-[8px] px-2 py-1 flex-shrink-0"
        style={{
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: 'var(--accent)',
        }}
      >
        +{task.xpReward}
      </span>

      {task.streak > 0 && (
        <span
          className="text-xs flex-shrink-0"
          style={{ color: 'var(--accent)' }}
        >
          {'🔥'}{task.streak}
        </span>
      )}
    </div>
  )
}
