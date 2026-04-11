import useGameStore from '../store/useGameStore'
import ZoneMap from '../components/ZoneMap'

export default function MapScreen() {
  const missions = useGameStore((s) => s.missions)
  const tasks = useGameStore((s) => s.tasks)

  const totalXp = missions.reduce((sum, m) => sum + m.xp, 0)
  const totalLevel = Math.floor(totalXp / 100)
  const completedToday = tasks.filter((t) => t.completedToday).length

  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center mb-2">
        <h1
          className="font-pixel text-lg mb-1"
          style={{ color: 'var(--accent)', textShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}
        >
          LIFE GAME
        </h1>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Welcome, Adventurer
        </p>
      </div>

      {/* Stats bar */}
      <div
        className="flex justify-around py-2 px-3 mb-4 pixel-card"
      >
        <div className="text-center">
          <div className="font-pixel text-[8px]" style={{ color: 'var(--text-secondary)' }}>LVL</div>
          <div className="font-pixel text-sm" style={{ color: 'var(--accent)' }}>{totalLevel}</div>
        </div>
        <div className="text-center">
          <div className="font-pixel text-[8px]" style={{ color: 'var(--text-secondary)' }}>XP</div>
          <div className="font-pixel text-sm" style={{ color: 'var(--accent)' }}>{totalXp}</div>
        </div>
        <div className="text-center">
          <div className="font-pixel text-[8px]" style={{ color: 'var(--text-secondary)' }}>TODAY</div>
          <div className="font-pixel text-sm" style={{ color: 'var(--success)' }}>
            {completedToday}/{tasks.length}
          </div>
        </div>
      </div>

      {/* World Map */}
      <ZoneMap />

      <p className="text-center text-[10px] mt-3 font-pixel" style={{ color: 'var(--text-secondary)' }}>
        TAP A ZONE TO BEGIN
      </p>
    </div>
  )
}
