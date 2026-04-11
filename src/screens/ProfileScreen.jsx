import useGameStore from '../store/useGameStore'
import XPBar from '../components/XPBar'

export default function ProfileScreen() {
  const missions = useGameStore((s) => s.missions)
  const tasks = useGameStore((s) => s.tasks)

  const totalXp = missions.reduce((sum, m) => sum + m.xp, 0)
  const overallLevel = Math.floor(totalXp / 100)
  const completedToday = tasks.filter((t) => t.completedToday).length

  const topStreaks = [...tasks]
    .filter((t) => t.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5)

  return (
    <div className="p-4">
      {/* Avatar section */}
      <div className="text-center mb-6">
        <div
          className="w-20 h-20 mx-auto flex items-center justify-center text-3xl mb-3"
          style={{ border: '3px solid var(--accent)', backgroundColor: 'var(--bg-surface)' }}
        >
          &#128737;&#65039;
        </div>
        <h1 className="font-pixel text-sm" style={{ color: 'var(--accent)' }}>
          ADVENTURER
        </h1>
        <p className="font-pixel text-[8px] mt-1" style={{ color: 'var(--text-secondary)' }}>
          Level {overallLevel}
        </p>
      </div>

      {/* Overall stats */}
      <div className="pixel-card p-4 mb-4">
        <div className="flex justify-around text-center mb-3">
          <div>
            <div className="font-pixel text-[8px]" style={{ color: 'var(--text-secondary)' }}>TOTAL XP</div>
            <div className="font-pixel text-base" style={{ color: 'var(--accent)' }}>{totalXp}</div>
          </div>
          <div>
            <div className="font-pixel text-[8px]" style={{ color: 'var(--text-secondary)' }}>LEVEL</div>
            <div className="font-pixel text-base" style={{ color: 'var(--accent)' }}>{overallLevel}</div>
          </div>
          <div>
            <div className="font-pixel text-[8px]" style={{ color: 'var(--text-secondary)' }}>TODAY</div>
            <div className="font-pixel text-base" style={{ color: 'var(--success)' }}>
              {completedToday}/{tasks.length}
            </div>
          </div>
        </div>
        <XPBar current={totalXp % 100} max={100} label="Next Level" />
      </div>

      {/* Mission breakdown */}
      <h2 className="font-pixel text-[10px] mb-3" style={{ color: 'var(--text-secondary)' }}>
        MISSIONS
      </h2>
      <div className="flex flex-col gap-3 mb-6">
        {missions.map((mission) => (
          <div key={mission.id} className="pixel-card p-3" style={{ borderColor: mission.color }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{mission.icon}</span>
              <span className="font-pixel text-[10px]" style={{ color: mission.color }}>
                {mission.name}
              </span>
              <span className="font-pixel text-[8px] ml-auto" style={{ color: 'var(--text-secondary)' }}>
                Lv.{mission.level}
              </span>
            </div>
            <XPBar current={mission.xp % 100} max={100} color={mission.color} />
            <p className="font-pixel text-[7px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              {mission.xp} XP total
            </p>
          </div>
        ))}
      </div>

      {/* Streak records */}
      <h2 className="font-pixel text-[10px] mb-3" style={{ color: 'var(--text-secondary)' }}>
        STREAK RECORDS
      </h2>
      <div className="pixel-card">
        {topStreaks.length === 0 ? (
          <p className="text-center py-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Complete tasks on consecutive days to build streaks!
          </p>
        ) : (
          topStreaks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between px-3 py-2"
              style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}
            >
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {task.name}
              </span>
              <span className="font-pixel text-[10px]" style={{ color: 'var(--accent)' }}>
                &#128293;{task.streak}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
