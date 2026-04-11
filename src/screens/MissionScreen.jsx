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
        className="font-pixel text-[10px] mb-4 flex items-center gap-1 active:scale-95 transition-transform"
        style={{ color: 'var(--text-secondary)' }}
      >
        {'⬅️'} WORLD MAP
      </button>

      {/* Mission header */}
      <div className="text-center mb-4">
        <div
          className="text-5xl mb-2"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          {mission.icon}
        </div>
        <h1
          className="font-pixel text-base"
          style={{ color: mission.color, textShadow: `0 0 15px ${mission.color}44` }}
        >
          {mission.name}
        </h1>
        <span
          className="font-pixel text-[10px] inline-block mt-2 px-4 py-1"
          style={{
            backgroundColor: mission.color,
            color: '#0f172a',
            boxShadow: `0 0 12px ${mission.color}44`,
          }}
        >
          {'⭐'} LEVEL {mission.level} {'⭐'}
        </span>
      </div>

      {/* XP Progress */}
      <div className="pixel-card p-3 mb-6" style={{ borderColor: mission.color }}>
        <XPBar current={xpInLevel} max={xpToNext} color={mission.color} label="Next Level" />
        <div className="flex justify-between mt-2">
          <span className="font-pixel text-[7px]" style={{ color: 'var(--text-secondary)' }}>
            {mission.xp} XP total
          </span>
          <span className="font-pixel text-[7px]" style={{ color: mission.color }}>
            {xpToNext - xpInLevel} XP to go
          </span>
        </div>
      </div>

      {/* Quests */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-pixel text-[10px] flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
          {'📜'} ACTIVE QUESTS
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-pixel text-[8px] px-3 py-1 active:scale-95 transition-transform"
          style={{ backgroundColor: 'var(--accent)', color: '#0f172a' }}
        >
          + NEW QUEST
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddQuest}
          className="pixel-card p-3 mb-3 flex flex-col gap-2"
          style={{ borderColor: mission.color }}
        >
          <input
            type="text"
            placeholder="Quest name..."
            value={questName}
            onChange={(e) => setQuestName(e.target.value)}
            className="bg-transparent text-sm px-2 py-1 outline-none"
            style={{ borderBottom: `1px solid ${mission.color}`, color: 'var(--text-primary)' }}
            autoFocus
          />
          <input
            type="text"
            placeholder="Description (the lore)..."
            value={questDesc}
            onChange={(e) => setQuestDesc(e.target.value)}
            className="bg-transparent text-xs px-2 py-1 outline-none"
            style={{ borderBottom: '1px solid var(--text-secondary)', color: 'var(--text-secondary)' }}
          />
          <button
            type="submit"
            className="font-pixel text-[8px] px-3 py-2 self-end active:scale-95 transition-transform"
            style={{ backgroundColor: 'var(--success)', color: '#0f172a' }}
          >
            {'⚔️'} CREATE QUEST
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {quests.map((quest, i) => (
          <div key={quest.id} className="quest-appear" style={{ animationDelay: `${i * 0.08}s` }}>
            <QuestCard
              quest={quest}
              tasks={tasks.filter((t) => t.questId === quest.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
