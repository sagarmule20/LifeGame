import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useGameStore from '../store/useGameStore'
import { supabase } from '../lib/supabase'
import { isSupabaseConfigured } from '../lib/supabase'
import { syncToCloud } from '../lib/sync'
import { getRank, getNextRank, RANKS } from '../data/ranks'
import { MISSION_TEMPLATES } from '../data/ranks'
import { MANDATORY_MISSION_IDS } from '../data/seed'
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
  const dailyLog = useGameStore((s) => s.dailyLog)
  const addMissionFromTemplate = useGameStore((s) => s.addMissionFromTemplate)
  const removeMission = useGameStore((s) => s.removeMission)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('missions')
  const [syncing, setSyncing] = useState(false)

  const allQuests = useGameStore((s) => s.quests)
  const today = new Date().toLocaleDateString('en-CA')
  const todayEarned = dailyLog?.[today] || 0
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

      {/* Daily earnings card — tap to see history */}
      <button onClick={() => navigate('/earnings')} className="card w-full p-4 mb-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform">
        <div className="text-3xl">📊</div>
        <div className="flex-1">
          <p className="text-sm font-extrabold">Today's earnings</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            {totalTasksCompleted} tasks completed all time
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black" style={{ color: '#FFC800' }}>€{todayEarned}</p>
          <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>today</p>
        </div>
      </button>

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

      {/* Missions tab — manage missions, quests, tasks */}
      {activeTab === 'missions' && (
        <MissionsManager
          missions={missions}
          quests={allQuests}
          tasks={tasks}
          euros={euros}
          onAddTemplate={handleAddTemplate}
          onRemoveMission={removeMission}
        />
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

      {/* Account section — always at bottom */}
      <div className="mt-8 space-y-2 pb-4" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        {user && isSupabaseConfigured && (
          <button onClick={handleSync} className="btn btn-blue w-full py-3 text-sm" disabled={syncing}>
            {syncing ? 'Syncing...' : '☁️ SYNC TO CLOUD'}
          </button>
        )}
        {user ? (
          <button onClick={handleLogout} className="btn w-full py-3 text-sm" style={{ background: 'var(--bg)', color: 'var(--red)', border: '2px solid var(--red)' }}>
            LOG OUT
          </button>
        ) : (
          <button onClick={() => window.location.reload()} className="btn btn-green w-full py-3 text-sm">
            SIGN IN TO SAVE PROGRESS
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * MissionsManager — expandable mission tree with inline task adding.
 * Lives inside Profile → Missions tab.
 */
function MissionsManager({ missions, quests, tasks, euros, onAddTemplate, onRemoveMission }) {
  const [expanded, setExpanded] = useState(null) // missionId or null
  const [newTaskName, setNewTaskName] = useState('')
  const [addingToQuest, setAddingToQuest] = useState(null) // questId
  const [editingTask, setEditingTask] = useState(null) // taskId
  const [editName, setEditName] = useState('')
  const addTask = useGameStore((s) => s.addTask)
  const deleteTask = useGameStore((s) => s.deleteTask)
  const renameTask = useGameStore((s) => s.renameTask)
  const inputRef = useRef(null)

  const toggle = (id) => setExpanded(expanded === id ? null : id)

  const handleAddTask = (questId) => {
    if (!newTaskName.trim()) return
    addTask(questId, newTaskName.trim())
    setNewTaskName('')
    setAddingToQuest(null)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>
        Tap a mission to manage its tasks
      </p>

      {/* Active missions — expandable */}
      {missions.map((m) => {
        const isMandatory = MANDATORY_MISSION_IDS.includes(m.id)
        const missionQuests = quests.filter((q) => q.missionId === m.id)
        const missionTasks = tasks.filter((t) => missionQuests.some((q) => q.id === t.questId))
        const isExpanded = expanded === m.id

        return (
          <div key={m.id} className="card overflow-hidden" style={{ borderColor: isExpanded ? m.color : undefined }}>
            {/* Mission header — tap to expand */}
            <button
              onClick={() => toggle(m.id)}
              className="w-full flex items-center gap-3 p-3 text-left active:scale-[0.99] transition-transform"
            >
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold" style={{ color: m.color }}>{m.name}</p>
                  {isMandatory && (
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded" style={{ background: `${m.color}22`, color: m.color }}>
                      CORE
                    </span>
                  )}
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {missionTasks.length} tasks
                </p>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                ▶
              </span>
            </button>

            {/* Expanded — flat task list + add */}
            {isExpanded && (() => {
              const firstQuestId = missionQuests[0]?.id
              return (
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {/* All tasks flat — with rename/delete */}
                {missionTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 py-2 px-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    {editingTask === t.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && editName.trim()) { renameTask(t.id, editName.trim()); setEditingTask(null) }
                            if (e.key === 'Escape') setEditingTask(null)
                          }}
                          className="flex-1 bg-transparent text-xs font-bold outline-none"
                          style={{ color: 'var(--text)', borderBottom: '1px solid var(--green)', paddingBottom: 2 }}
                          autoFocus
                        />
                        <button onClick={() => { if (editName.trim()) { renameTask(t.id, editName.trim()); setEditingTask(null) } }}
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded" style={{ background: 'var(--green)', color: '#fff' }}>OK</button>
                        <button onClick={() => setEditingTask(null)} className="text-[10px]" style={{ color: 'var(--text-muted)' }}>✕</button>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px]">{t.completedToday ? '✅' : '⬜'}</span>
                        <span className="text-xs flex-1 truncate" style={{ color: 'var(--text)' }}>{t.name}</span>
                        <button onClick={() => { setEditingTask(t.id); setEditName(t.name) }}
                          className="text-[10px] px-1" style={{ color: 'var(--text-muted)' }}>✏️</button>
                        <button onClick={() => { if (confirm(`Delete "${t.name}"?`)) deleteTask(t.id) }}
                          className="text-[10px] px-1" style={{ color: 'var(--red)' }}>🗑️</button>
                      </>
                    )}
                  </div>
                ))}

                {/* Add task */}
                {addingToQuest === firstQuestId ? (
                  <div className="flex items-center gap-2 px-4 py-2.5">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="New task name..."
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(firstQuestId); if (e.key === 'Escape') { setAddingToQuest(null); setNewTaskName('') } }}
                      className="flex-1 bg-transparent text-xs font-bold outline-none"
                      style={{ color: 'var(--text)', borderBottom: '1px solid var(--green)', paddingBottom: 2 }}
                      autoFocus
                    />
                    <button onClick={() => handleAddTask(firstQuestId)}
                      className="text-[10px] font-extrabold px-2 py-1 rounded-lg"
                      style={{ background: 'var(--green)', color: '#fff' }}>
                      ADD
                    </button>
                    <button onClick={() => { setAddingToQuest(null); setNewTaskName('') }}
                      className="text-[10px]" style={{ color: 'var(--text-muted)' }}>✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAddingToQuest(firstQuestId); setNewTaskName('') }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold w-full text-left active:scale-[0.98]"
                    style={{ color: 'var(--green)' }}
                  >
                    <span>＋</span> Add task
                  </button>
                )}

                {/* Remove mission (non-mandatory only) */}
                {!isMandatory && (
                  <div className="p-3 text-center" style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={() => { if (confirm(`Remove ${m.name} and all its tasks?`)) onRemoveMission(m.id) }}
                      className="text-xs font-bold" style={{ color: 'var(--red)' }}>
                      Remove this mission
                    </button>
                  </div>
                )}
              </div>
              )
            })()}
          </div>
        )
      })}

      {/* Template gallery */}
      <p className="text-xs font-bold mt-4" style={{ color: 'var(--text-dim)' }}>
        📋 Add extra missions <span style={{ color: '#FFC800' }}>(€50 each)</span>
      </p>
      {MISSION_TEMPLATES.map((tmpl) => {
        const alreadyAdded = missions.some((m) => m.name === tmpl.name)
        return (
          <div key={tmpl.name} className="card p-3 flex items-center gap-3" style={{ opacity: alreadyAdded ? 0.4 : 1 }}>
            <span className="text-2xl">{tmpl.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-bold">{tmpl.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {tmpl.tasks.length} tasks
              </p>
            </div>
            <button onClick={() => onAddTemplate(tmpl)} disabled={alreadyAdded}
              className="btn text-[10px] py-1.5 px-3"
              style={{
                background: alreadyAdded ? 'var(--bg)' : euros >= 50 ? 'var(--orange)' : 'var(--bg)',
                color: alreadyAdded ? 'var(--text-muted)' : euros >= 50 ? '#fff' : 'var(--text-muted)',
                border: alreadyAdded || euros >= 50 ? 'none' : '1px solid var(--border)',
                opacity: alreadyAdded ? 0.5 : 1,
              }}>
              {alreadyAdded ? 'Added' : '💶 €50'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
