import useGameStore from '../store/useGameStore'
import ZoneMap from '../components/ZoneMap'
import XPBar from '../components/XPBar'

export default function MapScreen() {
  const missions = useGameStore((s) => s.missions)
  const tasks = useGameStore((s) => s.tasks)
  const coins = useGameStore((s) => s.coins)
  const totalEarned = useGameStore((s) => s.totalCoinsEarned)

  const totalLevel = missions.reduce((sum, m) => sum + m.level, 0)
  const completedToday = tasks.filter((t) => t.completedToday).length

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-black">World Map</h1>
        <p className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>
          Tap a realm to explore
        </p>
      </div>

      {/* Stats */}
      <div className="card p-3 mb-4">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>LEVEL</p>
            <p className="text-xl font-black" style={{ color: 'var(--green)' }}>{totalLevel}</p>
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>EARNED</p>
            <p className="text-xl font-black coin-badge">🪙 {totalEarned}</p>
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>TODAY</p>
            <p className="text-xl font-black" style={{ color: 'var(--blue)' }}>{completedToday}/{tasks.length}</p>
          </div>
        </div>
      </div>

      <ZoneMap />
    </div>
  )
}
