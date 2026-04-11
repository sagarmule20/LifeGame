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
  const allDone = completedCount === tasks.length && tasks.length > 0

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
        className="font-pixel text-[10px] mb-4 flex items-center gap-1 active:scale-95 transition-transform"
        style={{ color: 'var(--text-secondary)' }}
      >
        {'⬅️'} {mission.name.toUpperCase()}
      </button>

      {/* Quest header */}
      <div className="mb-4">
        <div className="h-1.5 w-16 mb-3" style={{ backgroundColor: mission.color, boxShadow: `0 0 8px ${mission.color}44` }} />
        <h1 className="font-pixel text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
          {'📜'} {quest.name}
        </h1>
        <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
          "{quest.description}"
        </p>
      </div>

      {/* Battle summary */}
      <div
        className="pixel-card p-3 mb-4 flex justify-around text-center"
        style={{ borderColor: allDone ? 'var(--success)' : mission.color }}
      >
        <div>
          <div className="font-pixel text-[7px]" style={{ color: 'var(--text-secondary)' }}>DEFEATED</div>
          <div className="font-pixel text-lg" style={{ color: allDone ? 'var(--success)' : 'var(--text-primary)' }}>
            {completedCount}/{tasks.length}
          </div>
        </div>
        <div>
          <div className="font-pixel text-[7px]" style={{ color: 'var(--text-secondary)' }}>XP EARNED</div>
          <div
            className="font-pixel text-lg"
            style={{ color: 'var(--accent)', textShadow: '0 0 8px rgba(245,158,11,0.3)' }}
          >
            {totalXpEarned}
          </div>
        </div>
      </div>

      {/* Tasks header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-pixel text-[10px] flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
          {'⚔️'} ENEMIES
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-pixel text-[8px] px-3 py-1 active:scale-95 transition-transform"
          style={{ backgroundColor: 'var(--accent)', color: '#0f172a' }}
        >
          + SUMMON
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddTask} className="pixel-card p-3 mb-3 flex flex-col gap-2" style={{ borderColor: mission.color }}>
          <input
            type="text"
            placeholder="Enemy name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="bg-transparent text-sm px-2 py-1 outline-none"
            style={{ borderBottom: `1px solid ${mission.color}`, color: 'var(--text-primary)' }}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Bounty XP:</span>
            <input
              type="number"
              value={taskXp}
              onChange={(e) => setTaskXp(e.target.value)}
              className="bg-transparent text-sm px-2 py-1 w-20 outline-none"
              style={{ borderBottom: '1px solid var(--text-secondary)', color: 'var(--text-primary)' }}
              min="1" max="100"
            />
          </div>
          <button
            type="submit"
            className="font-pixel text-[8px] px-3 py-2 self-end active:scale-95 transition-transform"
            style={{ backgroundColor: 'var(--success)', color: '#0f172a' }}
          >
            {'🗡️'} ADD ENEMY
          </button>
        </form>
      )}

      {/* Task list */}
      <div
        className="pixel-card overflow-hidden"
        style={{ borderColor: allDone ? 'var(--success)' : mission.color }}
      >
        {tasks.length === 0 ? (
          <p className="text-center py-8 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {'🏜️'} No enemies here yet. Summon your first foe!
          </p>
        ) : (
          tasks.map((task, i) => (
            <div key={task.id} className="quest-appear" style={{ animationDelay: `${i * 0.05}s` }}>
              <TaskRow task={task} onToggle={handleToggle} />
            </div>
          ))
        )}
      </div>

      {allDone && (
        <div className="text-center mt-4" style={{ animation: 'questAppear 0.5s ease-out' }}>
          <span className="text-3xl" style={{ animation: 'bounce 1s ease-in-out infinite' }}>{'🏆'}</span>
          <p className="font-pixel text-[9px] mt-2" style={{ color: 'var(--success)' }}>
            QUEST COMPLETE!
          </p>
        </div>
      )}
    </div>
  )
}
