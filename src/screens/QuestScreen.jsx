import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo, useRef } from 'react'
import useGameStore from '../store/useGameStore'
import TaskRow from '../components/TaskRow'

export default function QuestScreen() {
  const { questId } = useParams()
  const navigate = useNavigate()
  const allQuests = useGameStore((s) => s.quests)
  const allMissions = useGameStore((s) => s.missions)
  const allTasks = useGameStore((s) => s.tasks)
  const completeTask = useGameStore((s) => s.completeTask)
  const uncompleteTask = useGameStore((s) => s.uncompleteTask)
  const addTask = useGameStore((s) => s.addTask)

  const quest = useMemo(() => allQuests.find((q) => q.id === questId), [allQuests, questId])
  const mission = useMemo(() => allMissions.find((m) => m.id === quest?.missionId), [allMissions, quest?.missionId])
  const tasks = useMemo(() => allTasks.filter((t) => t.questId === questId), [allTasks, questId])

  const [quickTaskName, setQuickTaskName] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskTime, setTaskTime] = useState('')
  const quickInputRef = useRef(null)

  if (!quest || !mission) return null

  const done = tasks.filter((t) => t.completedToday).length
  const earned = done * 5
  const allDone = done === tasks.length && tasks.length > 0

  const handleToggle = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    task?.completedToday ? uncompleteTask(taskId) : completeTask(taskId)
  }

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (!quickTaskName.trim()) return
    addTask(questId, quickTaskName.trim())
    setQuickTaskName('')
    quickInputRef.current?.focus()
  }

  const handleAdvancedAdd = (e) => {
    e.preventDefault()
    if (!taskName.trim()) return
    addTask(questId, taskName.trim(), taskTime || null)
    setTaskName('')
    setTaskTime('')
    setShowAdvanced(false)
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <button onClick={() => navigate(`/mission/${quest.missionId}`)}
        className="text-sm font-bold mb-4 active:scale-95 transition-transform"
        style={{ color: 'var(--text-dim)' }}>
        ← {mission.name}
      </button>

      {/* Quest header */}
      <div className="mb-4">
        <div className="h-1.5 w-12 rounded-full mb-3" style={{ background: mission.color }} />
        <h1 className="text-xl font-black mb-1">{quest.name}</h1>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{quest.description}</p>
      </div>

      {/* Stats */}
      <div className="card p-3 mb-5 flex justify-around text-center"
        style={{ borderColor: allDone ? 'var(--green)' : mission.color }}>
        <div>
          <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>DONE</p>
          <p className="text-lg font-black" style={{ color: allDone ? 'var(--green)' : 'var(--text)' }}>{done}/{tasks.length}</p>
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>EARNED</p>
          <p className="text-lg font-black" style={{ color: '#FFC800' }}>💶 €{earned}</p>
        </div>
      </div>

      {/* Task list header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-extrabold" style={{ color: 'var(--text-dim)' }}>
          Tasks <span className="font-bold" style={{ color: 'var(--text-muted)' }}>• €5 each</span>
        </h2>
        <button onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-bold py-1 px-2 rounded-lg"
          style={{ color: 'var(--text-dim)', border: '1px solid var(--border)' }}>
          🕐 With time
        </button>
      </div>

      {/* Advanced add form (with scheduled time) */}
      {showAdvanced && (
        <form onSubmit={handleAdvancedAdd} className="card p-4 mb-3 space-y-3">
          <input type="text" placeholder="Task name..." value={taskName}
            onChange={(e) => setTaskName(e.target.value)} className="input" autoFocus />
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <input type="time" value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)} className="input" />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>notification time</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAdvanced(false)} className="btn btn-ghost flex-1 py-2 text-xs">Cancel</button>
            <button type="submit" className="btn btn-green flex-1 py-2 text-xs">Add Task</button>
          </div>
        </form>
      )}

      {/* Task list */}
      <div className="card overflow-hidden" style={{ borderColor: allDone ? 'var(--green)' : mission.color }}>
        {tasks.length === 0 ? (
          <p className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            No tasks yet — add your first one below!
          </p>
        ) : tasks.map((task, i) => (
          <div key={task.id} className="slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
            <TaskRow task={task} onToggle={handleToggle} showTime />
          </div>
        ))}

        {/* Quick inline add — always visible at bottom */}
        <form onSubmit={handleQuickAdd} className="flex items-center gap-2 px-4 py-3"
          style={{ borderTop: tasks.length > 0 ? '1px solid var(--border)' : 'none', background: 'var(--bg)' }}>
          <span className="text-lg">➕</span>
          <input
            ref={quickInputRef}
            type="text"
            placeholder="Add a task..."
            value={quickTaskName}
            onChange={(e) => setQuickTaskName(e.target.value)}
            className="flex-1 bg-transparent text-sm font-bold outline-none"
            style={{ color: 'var(--text)', caretColor: 'var(--green)' }}
          />
          {quickTaskName.trim() && (
            <button type="submit" className="text-xs font-extrabold px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--green)', color: '#fff' }}>
              ADD
            </button>
          )}
        </form>
      </div>

      {allDone && tasks.length > 0 && (
        <div className="text-center mt-4 slide-up">
          <span className="text-3xl" style={{ animation: 'bounce 1s ease-in-out infinite' }}>🏆</span>
          <p className="text-sm font-extrabold mt-2" style={{ color: 'var(--green)' }}>
            Quest complete! €{earned} earned!
          </p>
        </div>
      )}
    </div>
  )
}
