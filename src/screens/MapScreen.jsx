import useGameStore from '../store/useGameStore'
import ZoneMap from '../components/ZoneMap'
import XPBar from '../components/XPBar'

function getTimeGreeting() {
  const h = new Date().getHours()
  if (h < 6) return { text: 'The night is dark...', emoji: '🌙' }
  if (h < 12) return { text: 'A new dawn rises!', emoji: '🌅' }
  if (h < 17) return { text: 'The sun blazes on!', emoji: '☀️' }
  if (h < 21) return { text: 'Evening approaches...', emoji: '🌆' }
  return { text: 'Stars light your path', emoji: '✨' }
}

export default function MapScreen() {
  const missions = useGameStore((s) => s.missions)
  const tasks = useGameStore((s) => s.tasks)

  const totalXp = missions.reduce((sum, m) => sum + m.xp, 0)
  const totalLevel = Math.floor(totalXp / 100)
  const completedToday = tasks.filter((t) => t.completedToday).length
  const greeting = getTimeGreeting()

  return (
    <div className="p-4">
      {/* Header with time-of-day greeting */}
      <div className="text-center mb-3">
        <h1
          className="font-pixel text-lg mb-1"
          style={{
            color: 'var(--accent)',
            textShadow: '0 0 20px rgba(245,158,11,0.4), 0 0 40px rgba(245,158,11,0.2)',
          }}
        >
          LIFE GAME
        </h1>
        <p className="text-xs flex items-center justify-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <span>{greeting.emoji}</span>
          <span>{greeting.text}</span>
          <span>{greeting.emoji}</span>
        </p>
      </div>

      {/* Hero stats bar */}
      <div className="pixel-card p-3 mb-3">
        <div className="flex justify-around text-center mb-2">
          <div>
            <div className="font-pixel text-[7px]" style={{ color: 'var(--text-secondary)' }}>HERO LVL</div>
            <div
              className="font-pixel text-lg"
              style={{
                color: 'var(--accent)',
                textShadow: '0 0 10px rgba(245,158,11,0.4)',
              }}
            >
              {totalLevel}
            </div>
          </div>
          <div>
            <div className="font-pixel text-[7px]" style={{ color: 'var(--text-secondary)' }}>TOTAL XP</div>
            <div className="font-pixel text-lg" style={{ color: 'var(--accent)' }}>{totalXp}</div>
          </div>
          <div>
            <div className="font-pixel text-[7px]" style={{ color: 'var(--text-secondary)' }}>QUESTS</div>
            <div className="font-pixel text-lg" style={{ color: completedToday === tasks.length && tasks.length > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
              {completedToday}/{tasks.length}
            </div>
          </div>
        </div>
        <XPBar current={totalXp % 100} max={100} label="Next Hero Level" />
      </div>

      {/* World Map */}
      <ZoneMap />

      <p
        className="text-center text-[8px] mt-2 font-pixel"
        style={{
          color: 'var(--text-secondary)',
          animation: 'pulse 3s ease-in-out infinite',
        }}
      >
        {'⚔️'} TAP A REALM TO BEGIN YOUR QUEST {'⚔️'}
      </p>
    </div>
  )
}
