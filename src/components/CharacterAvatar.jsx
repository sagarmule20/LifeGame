/**
 * Evolving character avatar — changes appearance based on total level.
 * Levels 0-2: Peasant, 3-5: Squire, 6-9: Knight, 10-14: Champion, 15+: Legend
 */
export default function CharacterAvatar({ level = 0, size = 80 }) {
  const stage = getStage(level)

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Aura ring for higher levels */}
      {level >= 5 && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${stage.auraColor}`,
            boxShadow: `0 0 ${level * 2}px ${stage.auraColor}66, inset 0 0 ${level}px ${stage.auraColor}33`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Character body */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size * 0.85,
          height: size * 0.85,
          border: `3px solid ${stage.borderColor}`,
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        {/* Pixel art character using stacked divs */}
        <div className="flex flex-col items-center">
          {/* Head piece / crown */}
          <span className="text-xs" style={{ marginBottom: -2 }}>{stage.headgear}</span>
          {/* Face */}
          <span style={{ fontSize: size * 0.35 }}>{stage.face}</span>
          {/* Weapon */}
          <span className="text-xs" style={{ marginTop: -4 }}>{stage.weapon}</span>
        </div>

        {/* Level badge */}
        <div
          className="absolute -bottom-2 -right-2 font-pixel text-[7px] px-1.5 py-0.5"
          style={{
            backgroundColor: stage.borderColor,
            color: '#0f172a',
          }}
        >
          {level}
        </div>
      </div>

      {/* Title */}
      <div
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-pixel text-[6px] whitespace-nowrap"
        style={{ color: stage.borderColor }}
      >
        {stage.title}
      </div>
    </div>
  )
}

function getStage(level) {
  if (level >= 15) return {
    title: 'LEGEND', face: '🧙', headgear: '👑', weapon: '⚡',
    borderColor: '#f59e0b', auraColor: '#f59e0b',
  }
  if (level >= 10) return {
    title: 'CHAMPION', face: '🦸', headgear: '✨', weapon: '⚔️',
    borderColor: '#a855f7', auraColor: '#a855f7',
  }
  if (level >= 6) return {
    title: 'KNIGHT', face: '🤺', headgear: '🪖', weapon: '🗡️',
    borderColor: '#3b82f6', auraColor: '#3b82f6',
  }
  if (level >= 3) return {
    title: 'SQUIRE', face: '🧑', headgear: '🎩', weapon: '🛡️',
    borderColor: '#22c55e', auraColor: '#22c55e',
  }
  return {
    title: 'PEASANT', face: '🙂', headgear: '', weapon: '🪵',
    borderColor: '#6b7280', auraColor: '#6b7280',
  }
}
