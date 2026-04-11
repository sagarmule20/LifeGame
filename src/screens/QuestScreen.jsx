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
  const [taskXp, setTaskXp] = useState('15')

  if (!quest || !mission) return null

  const completedCount = tasks.filter((t) => t.completedToday).length
  const totalXpEarned = tasks.filter((t) => t.completedToday).reduce((sum, t) => sum + t.xpReward, 0)

  const handleToggle = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task?.completedToday) {
      uncompleteTask(taskId)
    } else {
      completeTask(taskId)
    }
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!taskName.trim()) return
    addTask(questId, taskName.trim(), parseInt(taskXp) || 15)
    setTaskName('')
    setTaskXp('15')
    setShowForm(false)
  }

  return (
    <div className="p-4">
      {/* Back button */}
      <button
        onClick={() => navigate(`/mission/${quest.missionId}`)}
        className="font-pixel text-[10px] mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        {'\u2190'} BACK
      </button>

      {/* Quest header */}
      <div className="mb-4">
        <div
          className="h-1 w-16 mb-3"
          style={{ backgroundColor: mission.color }}
        />
        <h1 className="font-pixel text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
          {quest.name}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {quest.description}
        </p>
      </div>

      {/* Progress summary */}
      <div className="pixel-card p-3 mb-4 flex justify-around text-center">
        <div>
          <div className="font-pixel text-[8px]" style={{ color: 'var(--text-secondary)' }}>DONE</div>
          <div className="font-pixel text-sm" style={{ color: 'var(--success)' }}>
            {completedCount}/{tasks.length}
          </div>
        </div>
        <div>
          <div className="font-pixel text-[8px]" style={{ color: 'var(--text-secondary)' }}>XP EARNED</div>
          <div className="font-pixel text-sm" style={{ color: 'var(--accent)' }}>
            {totalXpEarned}
          </div>
        </div>
      </div>

      {/* Tasks header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-pixel text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          TASKS
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-pixel text-[8px] px-2 py-1"
          style={{ backgroundColor: 'var(--accent)', color: '#0f172a' }}
        >
          + NEW
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddTask} className="pixel-card p-3 mb-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="bg-transparent text-sm px-2 py-1 outline-none"
            style={{ borderBottom: '1px solid var(--accent)', color: 'var(--text-primary)' }}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>XP:</span>
            <input
              type="number"
              value={taskXp}
              onChange={(e) => setTaskXp(e.target.value)}
              className="bg-transparent text-sm px-2 py-1 w-20 outline-none"
              style={{ borderBottom: '1px solid var(--text-secondary)', color: 'var(--text-primary)' }}
              min="1"
              max="100"
            />
          </div>
          <button
            type="submit"
            className="font-pixel text-[8px] px-3 py-2 self-end"
            style={{ backgroundColor: 'var(--success)', color: '#0f172a' }}
          >
            ADD TASK
          </button>
        </form>
      )}

      {/* Task list */}
      <div className="pixel-card">
        {tasks.length === 0 ? (
          <p className="text-center py-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
            No tasks yet. Add your first task!
          </p>
        ) : (
          tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={handleToggle} />
          ))
        )}
      </div>
    </div>
  )
}
