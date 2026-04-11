import { useState } from 'react'
import useGameStore from '../store/useGameStore'
import XPBar from '../components/XPBar'
import CharacterAvatar from '../components/CharacterAvatar'
import { ACHIEVEMENTS, RARITY_COLORS } from '../data/achievements'

export default function ProfileScreen() {
  const missions = useGameStore((s) => s.missions)
  const tasks = useGameStore((s) => s.tasks)
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements)
  const inventory = useGameStore((s) => s.inventory)
  const totalTasksCompleted = useGameStore((s) => s.totalTasksCompleted)

  const [activeTab, setActiveTab] = useState('stats')

  const totalXp = missions.reduce((sum, m) => sum + m.xp, 0)
  const overallLevel = Math.floor(totalXp / 100)
  const completedToday = tasks.filter((t) => t.completedToday).length

  const topStreaks = [...tasks]
    .filter((t) => t.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5)

  const tabs = [
    { id: 'stats', label: 'STATS', icon: '📊' },
    { id: 'achievements', label: 'BADGES', icon: '🏆' },
    { id: 'inventory', label: 'LOOT', icon: '🎒' },
  ]

  return (
    <div className="p-4">
      {/* Character display */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-6">
          <CharacterAvatar level={overallLevel} size={90} />
        </div>
        <h1
          className="font-pixel text-sm mt-2"
          style={{ color: 'var(--accent)', textShadow: '0 0 10px rgba(245,158,11,0.3)' }}
        >
          ADVENTURER
        </h1>
        <p className="font-pixel text-[8px] mt-1" style={{ color: 'var(--text-secondary)' }}>
          Level {overallLevel} {'•'} {totalXp} XP
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 font-pixel text-[7px] py-2 px-1 transition-colors"
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'var(--bg-surface)',
              color: activeTab === tab.id ? '#0f172a' : 'var(--text-secondary)',
              border: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'rgba(148,163,184,0.2)'}`,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          {/* Overall stats */}
          <div className="pixel-card p-4">
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div>
                <div className="font-pixel text-[7px]" style={{ color: 'var(--text-secondary)' }}>TOTAL XP</div>
                <div className="font-pixel text-base" style={{ color: 'var(--accent)' }}>{totalXp}</div>
              </div>
              <div>
                <div className="font-pixel text-[7px]" style={{ color: 'var(--text-secondary)' }}>QUESTS WON</div>
                <div className="font-pixel text-base" style={{ color: 'var(--success)' }}>{totalTasksCompleted}</div>
              </div>
              <div>
                <div className="font-pixel text-[7px]" style={{ color: 'var(--text-secondary)' }}>TODAY</div>
                <div className="font-pixel text-base" style={{ color: 'var(--text-primary)' }}>
                  {completedToday}/{tasks.length}
                </div>
              </div>
            </div>
            <XPBar current={totalXp % 100} max={100} label="Next Hero Level" />
          </div>

          {/* Mission breakdown */}
          <h2 className="font-pixel text-[9px]" style={{ color: 'var(--text-secondary)' }}>
            {'⚔️'} REALM PROGRESS
          </h2>
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="pixel-card p-3"
              style={{
                borderColor: mission.color,
                boxShadow: mission.level > 0 ? `0 0 8px ${mission.color}22` : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{mission.icon}</span>
                <span className="font-pixel text-[10px]" style={{ color: mission.color }}>
                  {mission.name}
                </span>
                <span
                  className="font-pixel text-[8px] ml-auto px-2 py-0.5"
                  style={{ backgroundColor: `${mission.color}22`, color: mission.color }}
                >
                  Lv.{mission.level}
                </span>
              </div>
              <XPBar current={mission.xp % 100} max={100} color={mission.color} />
              <p className="font-pixel text-[7px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                {mission.xp} XP total
              </p>
            </div>
          ))}

          {/* Streak leaderboard */}
          {topStreaks.length > 0 && (
            <>
              <h2 className="font-pixel text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                {'🔥'} STREAK RECORDS
              </h2>
              <div className="pixel-card">
                {topStreaks.map((task, i) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between px-3 py-2"
                    style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-[8px]" style={{ color: 'var(--text-secondary)' }}>
                        #{i + 1}
                      </span>
                      <span className="text-sm">{task.name}</span>
                    </div>
                    <span
                      className="font-pixel text-[10px]"
                      style={{ color: 'var(--accent)', textShadow: '0 0 6px rgba(245,158,11,0.3)' }}
                    >
                      {'🔥'}{task.streak}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Achievements tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedAchievements.includes(a.id)
            return (
              <div
                key={a.id}
                className="pixel-card p-3 flex items-center gap-3 transition-all"
                style={{
                  borderColor: unlocked ? 'var(--accent)' : 'rgba(148,163,184,0.15)',
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <span className="text-2xl" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>
                  {a.icon}
                </span>
                <div className="flex-1">
                  <p className="font-pixel text-[8px]" style={{ color: unlocked ? 'var(--accent)' : 'var(--text-secondary)' }}>
                    {a.name}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {a.desc}
                  </p>
                </div>
                {unlocked && <span className="text-xs">{'✅'}</span>}
              </div>
            )
          })}
        </div>
      )}

      {/* Inventory tab */}
      {activeTab === 'inventory' && (
        <div>
          {inventory.length === 0 ? (
            <div className="pixel-card p-8 text-center">
              <span className="text-4xl block mb-3">{'🎒'}</span>
              <p className="font-pixel text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                EMPTY BAG
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                Complete tasks to find loot!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {inventory.map((item, i) => (
                <div
                  key={i}
                  className="pixel-card p-2 text-center"
                  style={{
                    borderColor: RARITY_COLORS[item.rarity],
                    boxShadow: item.rarity === 'legendary'
                      ? `0 0 10px ${RARITY_COLORS[item.rarity]}44`
                      : undefined,
                  }}
                >
                  <span className="text-2xl block">{item.icon}</span>
                  <p className="font-pixel text-[6px] mt-1 truncate" style={{ color: RARITY_COLORS[item.rarity] }}>
                    {item.name}
                  </p>
                  <p className="font-pixel text-[5px] uppercase" style={{ color: 'var(--text-secondary)' }}>
                    {item.rarity}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
