import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import useGameStore from '../store/useGameStore'
import XPBar from '../components/XPBar'
import QuestCard from '../components/QuestCard'

export default function MissionScreen() {
  const { missionId } = useParams()
  const navigate = useNavigate()
  const missions = useGameStore((s) => s.missions)
  const allQuests = useGameStore((s) => s.quests)
  const tasks = useGameStore((s) => s.tasks)
  const addQuest = useGameStore((s) => s.addQuest)

  const mission = useMemo(() => missions.find((m) => m.id === missionId), [missions, missionId])
  const quests = useMemo(() => allQuests.filter((q) => q.missionId === missionId), [allQuests, missionId])

  const [showForm, setShowForm] = useState(false)
  const [questName, setQuestName] = useState('')
  const [questDesc, setQuestDesc] = useState('')

  if (!mission) return null

  const coinsInLevel = mission.coinsEarned % 100

  const handleAddQuest = (e) => {
    e.preventDefault()
    if (!questName.trim()) return
    addQuest(missionId, questName.trim(), questDesc.trim())
    setQuestName('')
    setQuestDesc('')
    setShowForm(false)
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <button onClick={() => navigate('/map')}
        className="text-sm font-bold mb-4 active:scale-95 transition-transform"
        style={{ color: 'var(--text-dim)' }}>
        ← Back
      </button>

      {/* Mission header */}
      <div className="text-center mb-5">
        <div className="text-5xl mb-2" style={{ animation: 'float 3s ease-in-out infinite' }}>
          {mission.icon}
        </div>
        <h1 className="text-2xl font-black" style={{ color: mission.color }}>
          {mission.name}
        </h1>
        <span className="inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-extrabold"
          style={{ background: `${mission.color}22`, color: mission.color }}>
          ⭐ Level {mission.level}
        </span>
      </div>

      {/* Progress */}
      <div className="card p-4 mb-5" style={{ borderColor: mission.color }}>
        <XPBar current={coinsInLevel} max={100} color={mission.color} label="Next Level" />
        <p className="text-xs mt-2 text-center font-bold" style={{ color: 'var(--text-dim)' }}>
          🪙 {mission.coinsEarned} earned total • {100 - coinsInLevel} to next level
        </p>
      </div>

      {/* Quests */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-extrabold" style={{ color: 'var(--text-dim)' }}>Quests</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-green text-xs py-2 px-3">
          + New Quest
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddQuest} className="card p-4 mb-3 space-y-3">
          <input type="text" placeholder="Quest name..." value={questName}
            onChange={(e) => setQuestName(e.target.value)} className="input" autoFocus />
          <input type="text" placeholder="Description..." value={questDesc}
            onChange={(e) => setQuestDesc(e.target.value)} className="input" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost flex-1 py-2 text-xs">Cancel</button>
            <button type="submit" className="btn btn-green flex-1 py-2 text-xs">Create</button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {quests.map((quest, i) => (
          <div key={quest.id} className="slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <QuestCard quest={quest} tasks={tasks.filter((t) => t.questId === quest.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}
