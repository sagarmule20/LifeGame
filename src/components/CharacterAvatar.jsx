export default function CharacterAvatar({ level = 0, size = 80 }) {
  const stage = getStage(level)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {level >= 5 && (
        <div className="absolute inset-0 rounded-2xl" style={{
          border: `2px solid ${stage.borderColor}`,
          boxShadow: `0 0 ${level * 2}px ${stage.borderColor}44`,
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      )}
      <div className="relative flex items-center justify-center rounded-2xl" style={{
        width: size * 0.85, height: size * 0.85,
        border: `3px solid ${stage.borderColor}`,
        background: 'var(--bg-card)',
      }}>
        <div className="flex flex-col items-center">
          <span className="text-xs" style={{ marginBottom: -2 }}>{stage.headgear}</span>
          <span style={{ fontSize: size * 0.35 }}>{stage.face}</span>
          <span className="text-xs" style={{ marginTop: -4 }}>{stage.weapon}</span>
        </div>
        <div className="absolute -bottom-2 -right-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
          style={{ background: stage.borderColor, color: '#fff' }}>{level}</div>
      </div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold whitespace-nowrap"
        style={{ color: stage.borderColor }}>{stage.title}</div>
    </div>
  )
}

function getStage(level) {
  if (level >= 15) return { title: 'LEGEND', face: '🧙', headgear: '👑', weapon: '⚡', borderColor: '#FFC800' }
  if (level >= 10) return { title: 'CHAMPION', face: '🦸', headgear: '✨', weapon: '⚔️', borderColor: '#CE82FF' }
  if (level >= 6) return { title: 'KNIGHT', face: '🤺', headgear: '🪖', weapon: '🗡️', borderColor: '#1CB0F6' }
  if (level >= 3) return { title: 'SQUIRE', face: '🧑', headgear: '🎩', weapon: '🛡️', borderColor: '#58CC02' }
  return { title: 'PEASANT', face: '🙂', headgear: '', weapon: '🪵', borderColor: '#56717A' }
}
