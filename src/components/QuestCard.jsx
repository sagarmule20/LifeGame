import { useNavigate } from 'react-router-dom'

export default function QuestCard({ quest, tasks }) {
  const navigate = useNavigate()
  const completedCount = tasks.filter((t) => t.completedToday).length
  const totalCount = tasks.length
  const earnedXp = tasks.filter((t) => t.completedToday).reduce((sum, t) => sum + t.xpReward, 0)
  const allDone = completedCount === totalCount && totalCount > 0

  return (
    <button
      onClick={() => navigate(`/quest/${quest.id}`)}
      className="pixel-card w-full text-left p-4 transition-all active:scale-[0.98]"
      style={{
        borderColor: allDone ? 'var(--success)' : undefined,
        boxShadow: allDone ? '0 0 10px rgba(20,184,166,0.15)' : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-pixel text-[10px] flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
          {allDone ? '✅' : '📜'} {quest.name}
        </h3>
        <span
          className="font-pixel text-[8px]"
          style={{ color: allDone ? 'var(--success)' : 'var(--accent)' }}
        >
          {completedCount}/{totalCount}
        </span>
      </div>

      <p className="text-xs mb-3 italic" style={{ color: 'var(--text-secondary)' }}>
        {quest.description}
      </p>

      <div className="flex items-center gap-2">
        {/* Progress bar */}
        <div className="flex-1 h-2.5 overflow-hidden" style={{ backgroundColor: 'rgba(148,163,184,0.15)' }}>
          <div
            className="h-full xp-bar-fill"
            style={{
              width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%',
              backgroundColor: allDone ? 'var(--success)' : 'var(--accent)',
              boxShadow: allDone ? '0 0 6px rgba(20,184,166,0.4)' : undefined,
            }}
          />
        </div>

        {/* XP earned */}
        {earnedXp > 0 && (
          <span
            className="font-pixel text-[7px] flex-shrink-0"
            style={{
              color: 'var(--accent)',
              textShadow: '0 0 4px rgba(245,158,11,0.3)',
            }}
          >
            +{earnedXp} XP
          </span>
        )}
      </div>
    </button>
  )
}
