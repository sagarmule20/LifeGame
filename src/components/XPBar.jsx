export default function XPBar({ current, max, color = '#f59e0b', label }) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
          <span className="font-pixel text-[8px]" style={{ color }}>
            {current} / {max} XP
          </span>
        </div>
      )}
      <div
        className="relative h-6 overflow-hidden pixel-card"
        style={{ borderColor: color }}
      >
        <div
          className="absolute inset-y-0 left-0 xp-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            opacity: 0.8,
          }}
        />
        {!label && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-pixel text-[8px] text-white drop-shadow-md">
              {current} / {max} XP
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
