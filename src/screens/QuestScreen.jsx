import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
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

  const [showForm, setShowForm] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskCoins, setTaskCoins] = useState('10')
  const [taskTime, setTaskTime] = useState('')

  if (!quest || !mission) return null

  const done = tasks.filter((t) => t.completedToday).length
  const earned = tasks.filter((t) => t.completedToday).reduce((s, t) => s + t.coinReward, 0)
  const allDone = done === tasks.length && tasks.length > 0

  const handleToggle = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    task?.completedToday ? uncompleteTask(taskId) : completeTask(taskId)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!taskName.trim()) return
    addTask(questId, taskName.trim(), parseInt(taskCoins) || 10, taskTime || null)
    setTaskName('')
    setTaskCoins('10')
    setTaskTime('')
    setShowForm(false)
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
          <p className="text-lg font-black coin-badge">🪙 {earned}</p>
        </div>
      </div>

      {/* Add task */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-extrabold" style={{ color: 'var(--text-dim)' }}>Tasks</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-green text-xs py-2 px-3">
          + Add Task
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card p-4 mb-3 space-y-3">
          <input type="text" placeholder="Task name..." value={taskName}
            onChange={(e) => setTaskName(e.target.value)} className="input" autoFocus />
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2">
              <span>🪙</span>
              <input type="number" placeholder="Coins" value={taskCoins}
                onChange={(e) => setTaskCoins(e.target.value)} className="input" min="1" max="100" />
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span>🕐</span>
              <input type="time" value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)} className="input" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost flex-1 py-2 text-xs">Cancel</button>
            <button type="submit" className="btn btn-green flex-1 py-2 text-xs">Add</button>
          </div>
        </form>
      )}

      {/* Task list */}
      <div className="card overflow-hidden" style={{ borderColor: allDone ? 'var(--green)' : mission.color }}>
        {tasks.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            No tasks yet. Add your first one!
          </p>
        ) : tasks.map((task, i) => (
          <div key={task.id} className="slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
            <TaskRow task={task} onToggle={handleToggle} showTime />
          </div>
        ))}
      </div>
    </div>
  )
}
