import useGameStore from '../store/useGameStore'
import TaskRow from '../components/TaskRow'
import XPBar from '../components/XPBar'

const FLAVOR_TEXT = [
  "The guild board awaits, adventurer...",
  "Today's challenges have been posted.",
  "Brave souls are needed for these tasks.",
  "The realm depends on your strength today.",
  "Your quests for the day lie before you.",
]

const COMPLETION_MESSAGES = [
  { threshold: 0, text: "Your quest log awaits...", emoji: "📜" },
  { threshold: 0.25, text: "The journey has begun!", emoji: "🗡️" },
  { threshold: 0.5, text: "Halfway there, warrior!", emoji: "⚡" },
  { threshold: 0.75, text: "Almost victorious!", emoji: "🔥" },
  { threshold: 1, text: "ALL QUESTS COMPLETE! REST WELL, LEGEND.", emoji: "👑" },
]

function getMotivation(ratio) {
  let msg = COMPLETION_MESSAGES[0]
  for (const m of COMPLETION_MESSAGES) {
    if (ratio >= m.threshold) msg = m
  }
  return msg
}

export default function DailyScreen() {
  const missions = useGameStore((s) => s.missions)
  const quests = useGameStore((s) => s.quests)
  const tasks = useGameStore((s) => s.tasks)
  const completeTask = useGameStore((s) => s.completeTask)
  const uncompleteTask = useGameStore((s) => s.uncompleteTask)

  const completedCount = tasks.filter((t) => t.completedToday).length
  const ratio = tasks.length > 0 ? completedCount / tasks.length : 0
  const allDone = completedCount === tasks.length && tasks.length > 0
  const motivation = getMotivation(ratio)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const flavor = FLAVOR_TEXT[Math.floor(new Date().getDate() % FLAVOR_TEXT.length)]

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
      {/* Quest board header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-lg">{'📋'}</span>
          <h1 className="font-pixel text-sm" style={{ color: 'var(--accent)', textShadow: '0 0 10px rgba(245,158,11,0.3)' }}>
            QUEST BOARD
          </h1>
          <span className="text-lg">{'📋'}</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {today}
        </p>
        <p className="text-[10px] italic mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
          "{flavor}"
        </p>
      </div>

      {/* Battle progress */}
      <div className="pixel-card p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{motivation.emoji}</span>
          <span className="font-pixel text-[8px] flex-1" style={{ color: ratio >= 1 ? 'var(--success)' : 'var(--text-primary)' }}>
            {motivation.text}
          </span>
          <span className="font-pixel text-[10px]" style={{ color: 'var(--accent)' }}>
            {completedCount}/{tasks.length}
          </span>
        </div>
        <XPBar
          current={completedCount}
          max={tasks.length}
          color={allDone ? 'var(--success)' : 'var(--accent)'}
        />
      </div>

      {/* Victory banner */}
      {allDone && (
        <div
          className="pixel-card p-4 mb-4 text-center"
          style={{
            borderColor: 'var(--success)',
            boxShadow: '0 0 20px rgba(20,184,166,0.2)',
            animation: 'questAppear 0.5s ease-out',
          }}
        >
          <div className="text-3xl mb-2" style={{ animation: 'bounce 1s ease-in-out infinite' }}>{'🏆'}</div>
          <p className="font-pixel text-[10px]" style={{ color: 'var(--success)' }}>
            VICTORY! ALL QUESTS DEFEATED!
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            You've proven yourself worthy today, hero.
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {['⭐', '⭐', '⭐'].map((s, i) => (
              <span key={i} style={{ animation: `starPop 0.3s ease-out ${i * 0.15}s backwards` }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Mission groups */}
      {missions.map((mission, mIdx) => {
        const missionQuests = quests.filter((q) => q.missionId === mission.id)
        const missionTasks = tasks.filter((t) =>
          missionQuests.some((q) => q.id === t.questId)
        )
        if (missionTasks.length === 0) return null

        const missionCompleted = missionTasks.filter((t) => t.completedToday).length
        const allMissionDone = missionCompleted === missionTasks.length

        return (
          <div
            key={mission.id}
            className="mb-5 quest-appear"
            style={{ animationDelay: `${mIdx * 0.1}s` }}
          >
            {/* Mission header */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1.5 h-8"
                style={{
                  backgroundColor: mission.color,
                  boxShadow: `0 0 8px ${mission.color}44`,
                }}
              />
              <span className="text-xl">{mission.icon}</span>
              <span className="font-pixel text-[10px]" style={{ color: mission.color }}>
                {mission.name}
              </span>
              {allMissionDone && <span className="text-xs">{'✅'}</span>}
              <span className="font-pixel text-[8px] ml-auto" style={{ color: 'var(--text-secondary)' }}>
                {missionCompleted}/{missionTasks.length}
              </span>
            </div>

            {/* Task list */}
            <div
              className="pixel-card overflow-hidden"
              style={{
                borderColor: allMissionDone ? 'var(--success)' : mission.color,
                transition: 'border-color 0.3s ease',
              }}
            >
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
