export default function XPBar({ current, max, color = 'var(--green)', label, showText = true }) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>{label}</span>
          {showText && (
            <span className="text-xs font-extrabold" style={{ color }}>
              {current} / {max}
            </span>
          )}
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
    </div>
  )
}
