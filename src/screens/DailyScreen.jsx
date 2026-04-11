import useGameStore from '../store/useGameStore'
import TaskRow from '../components/TaskRow'
import XPBar from '../components/XPBar'

export default function DailyScreen() {
  const missions = useGameStore((s) => s.missions)
  const quests = useGameStore((s) => s.quests)
  const tasks = useGameStore((s) => s.tasks)
  const completeTask = useGameStore((s) => s.completeTask)
  const uncompleteTask = useGameStore((s) => s.uncompleteTask)

  const completedCount = tasks.filter((t) => t.completedToday).length
  const allDone = completedCount === tasks.length && tasks.length > 0

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const handleToggle = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task?.completedToday) {
      uncompleteTask(taskId)
    } else {
      completeTask(taskId)
    }
  }

  return (
    <div className="p-4">
      {/* Header */}
      <h1
        className="font-pixel text-base mb-1"
        style={{ color: 'var(--accent)' }}
      >
        TODAY
      </h1>
      <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
        {today}
      </p>

      {/* Overall progress */}
      <div className="mb-6">
        <XPBar
          current={completedCount}
          max={tasks.length}
          color="var(--success)"
          label={`${completedCount} of ${tasks.length} tasks completed`}
        />
      </div>

      {allDone && (
        <div className="pixel-card p-4 mb-4 text-center" style={{ borderColor: 'var(--success)' }}>
          <span className="text-2xl">&#127941;</span>
          <p className="font-pixel text-[10px] mt-2" style={{ color: 'var(--success)' }}>
            ALL QUESTS COMPLETE!
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Rest well, Adventurer.
          </p>
        </div>
      )}

      {/* Tasks grouped by mission */}
      {missions.map((mission) => {
        const missionQuests = quests.filter((q) => q.missionId === mission.id)
        const missionTasks = tasks.filter((t) =>
          missionQuests.some((q) => q.id === t.questId)
        )
        if (missionTasks.length === 0) return null

        const missionCompleted = missionTasks.filter((t) => t.completedToday).length

        return (
          <div key={mission.id} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6" style={{ backgroundColor: mission.color }} />
              <span className="text-lg">{mission.icon}</span>
              <span className="font-pixel text-[10px]" style={{ color: mission.color }}>
                {mission.name}
              </span>
              <span className="font-pixel text-[8px] ml-auto" style={{ color: 'var(--text-secondary)' }}>
                {missionCompleted}/{missionTasks.length}
              </span>
            </div>
            <div className="pixel-card" style={{ borderColor: mission.color }}>
              {missionTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={handleToggle} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
