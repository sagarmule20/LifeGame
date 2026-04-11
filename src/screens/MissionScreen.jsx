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

  const xpInLevel = mission.xp % 100
  const xpToNext = 100

  const handleAddQuest = (e) => {
    e.preventDefault()
    if (!questName.trim()) return
    addQuest(missionId, questName.trim(), questDesc.trim())
    setQuestName('')
    setQuestDesc('')
    setShowForm(false)
  }

  return (
    <div className="p-4">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="font-pixel text-[10px] mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        {'\u2190'} BACK
      </button>

      {/* Mission header */}
      <div className="text-center mb-4">
        <span className="text-4xl">{mission.icon}</span>
        <h1 className="font-pixel text-base mt-2" style={{ color: mission.color }}>
          {mission.name}
        </h1>
        <span
          className="font-pixel text-[10px] inline-block mt-1 px-3 py-1"
          style={{ backgroundColor: mission.color, color: '#0f172a' }}
        >
          LEVEL {mission.level}
        </span>
      </div>

      {/* XP Progress */}
      <div className="mb-6">
        <XPBar current={xpInLevel} max={xpToNext} color={mission.color} label="Next Level" />
        <p className="text-[10px] mt-1 text-center" style={{ color: 'var(--text-secondary)' }}>
          Total XP: {mission.xp} {'\u2022'} {xpToNext - xpInLevel} XP to next level
        </p>
      </div>

      {/* Quests */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-pixel text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          QUESTS
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-pixel text-[8px] px-2 py-1"
          style={{ backgroundColor: 'var(--accent)', color: '#0f172a' }}
        >
          + NEW
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddQuest} className="pixel-card p-3 mb-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Quest name..."
            value={questName}
            onChange={(e) => setQuestName(e.target.value)}
            className="bg-transparent text-sm px-2 py-1 outline-none"
            style={{ borderBottom: '1px solid var(--accent)', color: 'var(--text-primary)' }}
            autoFocus
          />
          <input
            type="text"
            placeholder="Description..."
            value={questDesc}
            onChange={(e) => setQuestDesc(e.target.value)}
            className="bg-transparent text-xs px-2 py-1 outline-none"
            style={{ borderBottom: '1px solid var(--text-secondary)', color: 'var(--text-secondary)' }}
          />
          <button
            type="submit"
            className="font-pixel text-[8px] px-3 py-2 self-end"
            style={{ backgroundColor: 'var(--success)', color: '#0f172a' }}
          >
            CREATE
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            tasks={tasks.filter((t) => t.questId === quest.id)}
          />
        ))}
      </div>
    </div>
  )
}
