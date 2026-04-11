import { useNavigate } from 'react-router-dom'

export default function QuestCard({ quest, tasks }) {
  const navigate = useNavigate()
  const completedCount = tasks.filter((t) => t.completedToday).length
  const totalCount = tasks.length
  const earnedCoins = tasks.filter((t) => t.completedToday).reduce((sum, t) => sum + t.coinReward, 0)
  const allDone = completedCount === totalCount && totalCount > 0

  return (
    <button
      onClick={() => navigate(`/quest/${quest.id}`)}
      className="card w-full text-left p-4 transition-all active:scale-[0.98]"
      style={{
        borderColor: allDone ? 'var(--green)' : undefined,
        boxShadow: allDone ? '0 0 12px rgba(88,204,2,0.1)' : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-sm font-extrabold flex items-center gap-1.5">
          {allDone ? '✅' : '📋'} {quest.name}
        </h3>
        <span className="text-xs font-bold" style={{ color: allDone ? 'var(--green)' : 'var(--text-dim)' }}>
          {completedCount}/{totalCount}
        </span>
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
        {quest.description}
      </p>

      <div className="flex items-center gap-2">
        <div className="flex-1 progress-track" style={{ height: 8 }}>
          <div
            className="progress-fill"
            style={{
              width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%',
              background: allDone ? 'var(--green)' : 'var(--blue)',
              height: 8,
            }}
          />
        </div>
        {earnedCoins > 0 && (
          <span className="coin-badge text-xs font-extrabold">🪙 +{earnedCoins}</span>
        )}
      </div>
    </button>
  )
}
