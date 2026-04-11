import { useNavigate } from 'react-router-dom'

export default function QuestCard({ quest, tasks }) {
  const navigate = useNavigate()
  const completedCount = tasks.filter((t) => t.completedToday).length
  const totalCount = tasks.length
  const earnedXp = tasks.filter((t) => t.completedToday).reduce((sum, t) => sum + t.xpReward, 0)

  return (
    <button
      onClick={() => navigate(`/quest/${quest.id}`)}
      className="pixel-card w-full text-left p-4 transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-pixel text-[10px]" style={{ color: 'var(--text-primary)' }}>
          {quest.name}
        </h3>
        <span className="font-pixel text-[8px]" style={{ color: 'var(--accent)' }}>
          {completedCount}/{totalCount}
        </span>
      </div>
      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
        {quest.description}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 overflow-hidden" style={{ backgroundColor: 'rgba(148, 163, 184, 0.2)' }}>
          <div
            className="h-full xp-bar-fill"
            style={{
              width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%',
              backgroundColor: 'var(--success)',
            }}
          />
        </div>
        {earnedXp > 0 && (
          <span className="font-pixel text-[7px]" style={{ color: 'var(--success)' }}>
            +{earnedXp} XP
          </span>
        )}
      </div>
    </button>
  )
}
