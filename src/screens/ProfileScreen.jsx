import { useState } from 'react'
import useGameStore from '../store/useGameStore'
import { supabase } from '../lib/supabase'
import { syncToCloud } from '../lib/sync'
import { getRank, getNextRank, RANKS } from '../data/ranks'
import { MISSION_TEMPLATES } from '../data/ranks'
import { ACHIEVEMENTS, RARITY_COLORS } from '../data/achievements'
import XPBar from '../components/XPBar'

export default function ProfileScreen() {
  const missions = useGameStore((s) => s.missions)
  const tasks = useGameStore((s) => s.tasks)
  const euros = useGameStore((s) => s.euros)
  const totalEurosEarned = useGameStore((s) => s.totalEurosEarned)
  const totalTasksCompleted = useGameStore((s) => s.totalTasksCompleted)
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements)
  const inventory = useGameStore((s) => s.inventory)
  const user = useGameStore((s) => s.user)
  const setUser = useGameStore((s) => s.setUser)
  const addMissionFromTemplate = useGameStore((s) => s.addMissionFromTemplate)
  const removeMission = useGameStore((s) => s.removeMission)

  const [activeTab, setActiveTab] = useState('missions')
  const [syncing, setSyncing] = useState(false)

  const allQuests = useGameStore((s) => s.quests)
  const rank = getRank(totalEurosEarned)
  const nextRank = getNextRank(totalEurosEarned)
  const freeSlotsLeft = Math.max(0, 4 - missions.length)

  const tabs = [
    { id: 'missions', label: 'Missions' },
    { id: 'stats', label: 'Stats' },
    { id: 'badges', label: 'Badges' },
  ]

  const handleAddTemplate = (template) => {
    const existing = missions.find((m) => m.name === template.name)
    if (existing) return
    const success = addMissionFromTemplate(template)
    if (!success) alert(`You need €50 to add a new mission!`)
  }

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
      {/* Rank card */}
      <div className="card p-4 mb-4" style={{ borderColor: rank.color }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{rank.icon}</span>
          <div className="flex-1">
            <p className="text-lg font-black" style={{ color: rank.color }}>{rank.name}</p>
            <p className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>{rank.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black" style={{ color: '#FFC800' }}>€{euros}</p>
            <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>balance</p>
          </div>
        </div>
        {nextRank && (
          <>
            <XPBar current={totalEurosEarned - rank.threshold} max={nextRank.threshold - rank.threshold} color={nextRank.color} showText={false} />
            <p className="text-[10px] font-bold mt-1 text-center" style={{ color: 'var(--text-muted)' }}>
              €{nextRank.threshold - totalEurosEarned} to {nextRank.icon} {nextRank.name}
            </p>
          </>
        )}
      </div>

      {/* Quick stats */}
      <div className="flex gap-2 mb-4">
        <div className="card flex-1 p-3 text-center">
          <p className="text-lg font-black" style={{ color: '#FFC800' }}>€{totalEurosEarned}</p>
          <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>lifetime</p>
        </div>
        <div className="card flex-1 p-3 text-center">
          <p className="text-lg font-black" style={{ color: 'var(--green)' }}>{totalTasksCompleted}</p>
          <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>tasks done</p>
        </div>
        <div className="card flex-1 p-3 text-center">
          <p className="text-lg font-black" style={{ color: 'var(--blue)' }}>{missions.length}</p>
          <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>missions</p>
        </div>
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

      {/* Missions tab — template picker */}
      {activeTab === 'missions' && (
        <div className="space-y-3">
          <p className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>
            Your active missions ({missions.length}) • {freeSlotsLeft > 0 ? `${freeSlotsLeft} free slots left` : 'New missions cost €50 each'}
          </p>

          {/* Active missions */}
          {missions.map((m) => (
            <div key={m.id} className="card p-3 flex items-center gap-3" style={{ borderColor: m.color }}>
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-extrabold" style={{ color: m.color }}>{m.name}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {tasks.filter((t) => allQuests.filter((q) => q.missionId === m.id).some((q) => q.id === t.questId)).length} tasks
                </p>
              </div>
              <button onClick={() => { if (confirm(`Remove ${m.name}?`)) removeMission(m.id) }}
                className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--red)', border: '1px solid var(--red)' }}>
                Remove
              </button>
            </div>
          ))}

          {/* Template gallery */}
          <p className="text-xs font-bold mt-4" style={{ color: 'var(--text-dim)' }}>
            📋 Add from templates {missions.length >= 4 && <span style={{ color: '#FFC800' }}>(€50 each)</span>}
          </p>
          {MISSION_TEMPLATES.map((tmpl) => {
            const alreadyAdded = missions.some((m) => m.name === tmpl.name)
            const isFree = missions.length < 4
            return (
              <div key={tmpl.name} className="card p-3 flex items-center gap-3"
                style={{ opacity: alreadyAdded ? 0.4 : 1 }}>
                <span className="text-2xl">{tmpl.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold">{tmpl.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {tmpl.quests.length} quests • {tmpl.quests.reduce((s, q) => s + q.tasks.length, 0)} tasks
                  </p>
                </div>
                <button
                  onClick={() => handleAddTemplate(tmpl)}
                  disabled={alreadyAdded}
                  className="btn text-[10px] py-1.5 px-3"
                  style={{
                    background: alreadyAdded ? 'var(--bg)' : isFree ? 'var(--green)' : euros >= 50 ? 'var(--orange)' : 'var(--bg)',
                    color: alreadyAdded ? 'var(--text-muted)' : '#fff',
                    boxShadow: alreadyAdded ? 'none' : undefined,
                    border: alreadyAdded ? '1px solid var(--border)' : 'none',
                  }}>
                  {alreadyAdded ? 'Added' : isFree ? 'FREE' : '€50'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <div className="space-y-3">
          <p className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>📊 Rank Ladder</p>
          {RANKS.map((r) => {
            const isCurrentOrPast = totalEurosEarned >= r.threshold
            const isCurrent = r.name === rank.name
            return (
              <div key={r.name} className="card p-2.5 flex items-center gap-2.5"
                style={{ borderColor: isCurrent ? r.color : undefined, opacity: isCurrentOrPast ? 1 : 0.35 }}>
                <span className="text-xl">{r.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-extrabold" style={{ color: isCurrentOrPast ? r.color : 'var(--text-muted)' }}>{r.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>€{r.threshold}+</p>
                </div>
                {isCurrent && <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: r.color, color: '#fff' }}>YOU</span>}
                {isCurrentOrPast && !isCurrent && <span>✅</span>}
              </div>
            )
          })}

          {/* Account */}
          <div className="space-y-2 mt-4">
            {user && <button onClick={handleSync} className="btn btn-blue w-full py-3 text-sm" disabled={syncing}>{syncing ? 'Syncing...' : '☁️ SYNC TO CLOUD'}</button>}
            {user ? <button onClick={handleLogout} className="btn btn-ghost w-full py-3 text-sm">LOG OUT</button>
              : <button onClick={() => window.location.reload()} className="btn btn-green w-full py-3 text-sm">SIGN IN TO SAVE PROGRESS</button>}
          </div>
        </div>
      )}

      {/* Badges tab */}
      {activeTab === 'badges' && (
        <div className="space-y-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedAchievements.includes(a.id)
            return (
              <div key={a.id} className="card p-3 flex items-center gap-3"
                style={{ borderColor: unlocked ? 'var(--green)' : 'var(--border)', opacity: unlocked ? 1 : 0.4 }}>
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
    </div>
  )
}
