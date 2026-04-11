import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import useGameStore from '../store/useGameStore'

export default function QuestCard({ quest, tasks }) {
  const navigate = useNavigate()
  const addTask = useGameStore((s) => s.addTask)
  const [newTaskName, setNewTaskName] = useState('')
  const inputRef = useRef(null)

  const completedCount = tasks.filter((t) => t.completedToday).length
  const totalCount = tasks.length
  const allDone = completedCount === totalCount && totalCount > 0

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!newTaskName.trim()) return
    addTask(quest.id, newTaskName.trim())
    setNewTaskName('')
    inputRef.current?.focus()
  }

  return (
    <div
      className="card overflow-hidden transition-all"
      style={{
        borderColor: allDone ? 'var(--green)' : undefined,
        boxShadow: allDone ? '0 0 12px rgba(88,204,2,0.1)' : undefined,
      }}
    >
      {/* Clickable header — navigates to quest detail */}
      <button
        onClick={() => navigate(`/quest/${quest.id}`)}
        className="w-full text-left p-4 pb-2 active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-extrabold flex items-center gap-1.5">
            {allDone ? '✅' : '📋'} {quest.name}
          </h3>
          <span className="text-xs font-bold" style={{ color: allDone ? 'var(--green)' : 'var(--text-dim)' }}>
            {completedCount}/{totalCount}
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {quest.description}
        </p>
      </button>

      {/* Task list preview */}
      {tasks.length > 0 && (
        <div className="px-4 pb-1">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2 py-1" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-[10px]">{t.completedToday ? '✅' : '⬜'}</span>
              <span className="text-xs flex-1 truncate" style={{
                color: t.completedToday ? 'var(--text-muted)' : 'var(--text)',
                textDecoration: t.completedToday ? 'line-through' : 'none',
              }}>
                {t.name}
              </span>
              <span className="text-[10px] font-bold" style={{ color: '#FFC800' }}>€5</span>
            </div>
          ))}
        </div>
      )}

      {/* Inline add task */}
      <form
        onSubmit={handleAdd}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}
      >
        <span className="text-sm">➕</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a task..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          className="flex-1 bg-transparent text-xs font-bold outline-none"
          style={{ color: 'var(--text)', caretColor: 'var(--green)' }}
        />
        {newTaskName.trim() && (
          <button type="submit" className="text-[10px] font-extrabold px-2 py-1 rounded-lg"
            style={{ background: 'var(--green)', color: '#fff' }}>
            ADD
          </button>
        )}
      </form>
    </div>
  )
}
