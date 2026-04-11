import { useState } from 'react'
import useGameStore from '../store/useGameStore'
import { supabase } from '../lib/supabase'
import { syncToCloud } from '../lib/sync'
import XPBar from '../components/XPBar'
import CharacterAvatar from '../components/CharacterAvatar'
import { ACHIEVEMENTS, RARITY_COLORS } from '../data/achievements'

export default function ProfileScreen() {
  const missions = useGameStore((s) => s.missions)
  const tasks = useGameStore((s) => s.tasks)
  const coins = useGameStore((s) => s.coins)
  const totalCoinsEarned = useGameStore((s) => s.totalCoinsEarned)
  const totalTasksCompleted = useGameStore((s) => s.totalTasksCompleted)
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements)
  const inventory = useGameStore((s) => s.inventory)
  const user = useGameStore((s) => s.user)
  const setUser = useGameStore((s) => s.setUser)

  const [activeTab, setActiveTab] = useState('stats')
  const [syncing, setSyncing] = useState(false)

  const totalLevel = missions.reduce((sum, m) => sum + m.level, 0)

  const topStreaks = [...tasks].filter((t) => t.streak > 0).sort((a, b) => b.streak - a.streak).slice(0, 5)

  const tabs = [
    { id: 'stats', label: 'Stats' },
    { id: 'badges', label: 'Badges' },
    { id: 'loot', label: 'Loot' },
  ]

  const handleSync = async () => {
    if (!user?.id) return
    setSyncing(true)
    await syncToCloud(user.id, useGameStore.getState())
    setSyncing(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  return (
    <div className="px-4 pt-5 pb-4">
      {/* Character */}
      <div className="text-center mb-5">
        <div className="flex justify-center mb-5">
          <CharacterAvatar level={totalLevel} size={90} />
        </div>
        <h1 className="text-xl font-black mt-2">
          {user?.user_metadata?.display_name || 'Adventurer'}
        </h1>
        <p className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>
          Level {totalLevel} • 🪙 {totalCoinsEarned} earned all-time
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-colors"
            style={{
              background: activeTab === tab.id ? 'var(--green)' : 'var(--bg-card)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-dim)',
              border: `2px solid ${activeTab === tab.id ? 'var(--green)' : 'var(--border)'}`,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>BALANCE</p>
                <p className="text-lg font-black coin-badge">🪙 {coins}</p>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>WON</p>
                <p className="text-lg font-black" style={{ color: 'var(--green)' }}>{totalTasksCompleted}</p>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>LEVEL</p>
                <p className="text-lg font-black" style={{ color: 'var(--blue)' }}>{totalLevel}</p>
              </div>
            </div>
          </div>

          {/* Missions */}
          <p className="text-sm font-extrabold" style={{ color: 'var(--text-dim)' }}>Realms</p>
          {missions.map((m) => (
            <div key={m.id} className="card p-3" style={{ borderColor: m.color }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{m.icon}</span>
                <span className="text-sm font-extrabold" style={{ color: m.color }}>{m.name}</span>
                <span className="text-xs font-bold ml-auto px-2 py-0.5 rounded-full"
                  style={{ background: `${m.color}22`, color: m.color }}>Lv.{m.level}</span>
              </div>
              <XPBar current={m.coinsEarned % 100} max={100} color={m.color} showText={false} />
            </div>
          ))}

          {/* Streaks */}
          {topStreaks.length > 0 && (
            <>
              <p className="text-sm font-extrabold" style={{ color: 'var(--text-dim)' }}>🔥 Streaks</p>
              <div className="card overflow-hidden">
                {topStreaks.map((t, i) => (
                  <div key={t.id} className="flex items-center justify-between px-4 py-2.5"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-sm font-bold">{t.name}</span>
                    <span className="text-sm font-extrabold" style={{ color: 'var(--orange)' }}>🔥 {t.streak}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Account actions */}
          <div className="space-y-2 mt-4">
            {user && (
              <button onClick={handleSync} className="btn btn-blue w-full py-3 text-sm" disabled={syncing}>
                {syncing ? 'Syncing...' : '☁️ SYNC TO CLOUD'}
              </button>
            )}
            {user ? (
              <button onClick={handleLogout} className="btn btn-ghost w-full py-3 text-sm">
                LOG OUT
              </button>
            ) : (
              <button onClick={() => window.location.reload()} className="btn btn-green w-full py-3 text-sm">
                SIGN IN TO SAVE PROGRESS
              </button>
            )}
          </div>
        </div>
      )}

      {/* Badges */}
      {activeTab === 'badges' && (
        <div className="space-y-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedAchievements.includes(a.id)
            return (
              <div key={a.id} className="card p-3 flex items-center gap-3" style={{
                borderColor: unlocked ? 'var(--green)' : 'var(--border)',
                opacity: unlocked ? 1 : 0.4,
              }}>
                <span className="text-2xl" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-extrabold" style={{ color: unlocked ? 'var(--green)' : 'var(--text-dim)' }}>{a.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
                </div>
                {unlocked && <span>✅</span>}
              </div>
            )
          })}
        </div>
      )}

      {/* Loot */}
      {activeTab === 'loot' && (
        <div>
          {inventory.length === 0 ? (
            <div className="card p-8 text-center">
              <span className="text-4xl block mb-3">🎒</span>
              <p className="text-sm font-bold">Empty bag</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Complete tasks to find loot!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {inventory.map((item, i) => (
                <div key={i} className="card p-2 text-center" style={{ borderColor: RARITY_COLORS[item.rarity] }}>
                  <span className="text-2xl block">{item.icon}</span>
                  <p className="text-[9px] font-bold mt-1 truncate" style={{ color: RARITY_COLORS[item.rarity] }}>{item.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
