import useGameStore from '../store/useGameStore'
import TaskRow from '../components/TaskRow'
import XPBar from '../components/XPBar'

export default function DailyScreen() {
  const missions = useGameStore((s) => s.missions)
  const quests = useGameStore((s) => s.quests)
  const tasks = useGameStore((s) => s.tasks)
  const coins = useGameStore((s) => s.coins)
  const completeTask = useGameStore((s) => s.completeTask)
  const uncompleteTask = useGameStore((s) => s.uncompleteTask)

  const completedCount = tasks.filter((t) => t.completedToday).length
  const ratio = tasks.length > 0 ? completedCount / tasks.length : 0
  const allDone = completedCount === tasks.length && tasks.length > 0
  const todayCoins = tasks.filter((t) => t.completedToday).reduce((s, t) => s + t.coinReward, 0)

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  const handleToggle = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    task?.completedToday ? uncompleteTask(taskId) : completeTask(taskId)
  }

  return (
    <div className="px-4 pt-5 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black">Today</h1>
          <p className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>{today}</p>
        </div>
        <div className="coin-badge text-lg font-black px-4 py-2 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
          🪙 {coins}
        </div>
      </div>

      {/* Progress card */}
      <div className="card p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{allDone ? '🎉' : ratio >= 0.5 ? '💪' : '⚡'}</span>
            <div>
              <p className="text-sm font-extrabold">
                {allDone ? 'All done! Incredible!' : ratio >= 0.5 ? 'Keep going!' : 'Ready to earn?'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                {completedCount} of {tasks.length} tasks • 🪙 {todayCoins} earned today
              </p>
            </div>
          </div>
        </div>
        <XPBar current={completedCount} max={tasks.length} color={allDone ? 'var(--green)' : 'var(--blue)'} showText={false} />
      </div>

      {/* Victory */}
      {allDone && (
        <div className="card p-5 mb-5 text-center slide-up" style={{ borderColor: 'var(--green)', background: 'rgba(88,204,2,0.08)' }}>
          <div className="text-4xl mb-2" style={{ animation: 'bounce 1s ease-in-out infinite' }}>🏆</div>
          <p className="text-base font-black" style={{ color: 'var(--green)' }}>PERFECT DAY!</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
            You earned 🪙 {todayCoins} today. Go treat yourself!
          </p>
        </div>
      )}

      {/* Task groups by mission */}
      {missions.map((mission, i) => {
        const missionQuests = quests.filter((q) => q.missionId === mission.id)
        const missionTasks = tasks.filter((t) => missionQuests.some((q) => q.id === t.questId))
        if (missionTasks.length === 0) return null
        const done = missionTasks.filter((t) => t.completedToday).length

        return (
          <div key={mission.id} className="mb-5 slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-lg">{mission.icon}</span>
              <span className="text-sm font-extrabold" style={{ color: mission.color }}>
                {mission.name}
              </span>
              <span className="text-xs font-bold ml-auto" style={{ color: 'var(--text-muted)' }}>
                {done}/{missionTasks.length}
              </span>
            </div>
            <div className="card overflow-hidden" style={{
              borderColor: done === missionTasks.length ? 'var(--green)' : undefined,
            }}>
              {missionTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={handleToggle} showTime />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
