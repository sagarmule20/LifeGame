import { useNavigate } from 'react-router-dom'
import useGameStore from '../store/useGameStore'
import { useEffect, useState } from 'react'

const zones = [
  {
    missionId: 'mission-health',
    // Floating island - top left
    cx: 120, cy: 160,
    path: 'M60,130 Q70,80 120,70 Q170,60 185,110 Q200,150 180,190 Q160,220 120,230 Q80,225 55,195 Q40,165 60,130Z',
    trees: [[85,140], [150,120], [100,180], [155,170]],
    landmark: { x: 120, y: 150, emoji: '🏔️' },
  },
  {
    missionId: 'mission-mind',
    // Floating island - top right
    cx: 310, cy: 150,
    path: 'M260,120 Q275,75 315,65 Q355,58 370,105 Q385,145 365,185 Q345,215 310,220 Q275,218 255,190 Q240,160 260,120Z',
    trees: [[275,130], [340,115], [285,175], [345,165]],
    landmark: { x: 310, y: 140, emoji: '🏛️' },
  },
  {
    missionId: 'mission-career',
    // Large island - bottom center
    cx: 215, cy: 370,
    path: 'M120,330 Q140,280 215,270 Q290,278 310,325 Q330,370 305,410 Q275,445 215,450 Q155,445 130,410 Q105,375 120,330Z',
    trees: [[145,345], [280,340], [160,400], [270,395], [215,315]],
    landmark: { x: 215, y: 365, emoji: '🏰' },
  },
]

function Cloud({ x, y, delay = 0, size = 1 }) {
  return (
    <g style={{ animation: `cloudDrift ${8 + delay * 2}s ease-in-out infinite`, animationDelay: `${delay}s` }}>
      <ellipse cx={x} cy={y} rx={20 * size} ry={8 * size} fill="rgba(148,163,184,0.08)" />
      <ellipse cx={x + 12 * size} cy={y - 4 * size} rx={14 * size} ry={6 * size} fill="rgba(148,163,184,0.06)" />
      <ellipse cx={x - 8 * size} cy={y - 3 * size} rx={12 * size} ry={5 * size} fill="rgba(148,163,184,0.07)" />
    </g>
  )
}

function FloatingParticle({ cx, cy, delay }) {
  return (
    <circle r="1.5" fill="#f59e0b" opacity="0">
      <animateMotion
        path={`M${cx},${cy} Q${cx + 15},${cy - 30} ${cx - 10},${cy - 50}`}
        dur="4s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <animate attributeName="opacity" values="0;0.6;0" dur="4s" begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  )
}

export default function ZoneMap() {
  const navigate = useNavigate()
  const missions = useGameStore((s) => s.missions)
  const [hoveredZone, setHoveredZone] = useState(null)

  return (
    <svg viewBox="0 0 430 500" className="w-full" style={{ maxHeight: '58vh' }}>
      <defs>
        {/* Glow filters for each mission color */}
        <filter id="glow-red">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-purple">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-blue">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Subtle grid */}
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148,163,184,0.04)" strokeWidth="0.5" />
        </pattern>

        {/* Water ripple */}
        <radialGradient id="water">
          <stop offset="0%" stopColor="rgba(59,130,246,0.05)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect width="430" height="500" fill="url(#grid)" />

      {/* Decorative water */}
      <ellipse cx="215" cy="250" rx="180" ry="30" fill="url(#water)" />

      {/* Clouds */}
      <Cloud x={40} y={50} delay={0} size={1.2} />
      <Cloud x={350} y={40} delay={2} size={0.8} />
      <Cloud x={200} y={250} delay={1.5} size={1} />
      <Cloud x={380} y={280} delay={3} size={0.7} />
      <Cloud x={60} y={300} delay={2.5} size={0.9} />

      {/* Connecting bridges */}
      <path
        d="M180,200 Q200,250 195,270"
        fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="2" strokeDasharray="4 6"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
      </path>
      <path
        d="M260,200 Q240,250 235,270"
        fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="2" strokeDasharray="4 6"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
      </path>
      <path
        d="M185,165 L260,155"
        fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="1.5" strokeDasharray="3 5"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* Zone islands */}
      {zones.map((zone) => {
        const mission = missions.find((m) => m.id === zone.missionId)
        if (!mission) return null

        const isHovered = hoveredZone === zone.missionId
        const fillOpacity = mission.level === 0 ? 0.15 : 0.2 + Math.min(mission.level * 0.06, 0.5)
        const isHighLevel = mission.level >= 5
        const zoneColor = mission.level === 0 ? '#475569' : mission.color

        return (
          <g
            key={zone.missionId}
            onClick={() => navigate(`/mission/${zone.missionId}`)}
            onMouseEnter={() => setHoveredZone(zone.missionId)}
            onMouseLeave={() => setHoveredZone(null)}
            className="cursor-pointer"
            style={{
              transition: 'transform 0.2s ease',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              transformOrigin: `${zone.cx}px ${zone.cy}px`,
            }}
          >
            {/* Island shadow */}
            <ellipse
              cx={zone.cx}
              cy={zone.cy + (zone.missionId === 'mission-career' ? 85 : 75)}
              rx={60}
              ry={10}
              fill="rgba(0,0,0,0.2)"
            />

            {/* Island base */}
            <path
              d={zone.path}
              fill={zoneColor}
              fillOpacity={fillOpacity}
              stroke={isHighLevel ? '#f59e0b' : zoneColor}
              strokeWidth={isHighLevel ? 3 : 2}
              style={{
                filter: isHovered ? `drop-shadow(0 0 8px ${zoneColor})` : undefined,
                transition: 'filter 0.3s ease',
              }}
            />

            {/* Terrain: trees */}
            {zone.trees.map(([tx, ty], i) => (
              <text
                key={i}
                x={tx} y={ty}
                fontSize="10"
                style={{ animation: `float ${3 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
              >
                {'🌲'}
              </text>
            ))}

            {/* Landmark */}
            <text
              x={zone.landmark.x}
              y={zone.landmark.y}
              textAnchor="middle"
              fontSize="22"
              style={{ animation: 'float 4s ease-in-out infinite' }}
            >
              {zone.landmark.emoji}
            </text>

            {/* Mission icon */}
            <text
              x={zone.cx}
              y={zone.cy - 30}
              textAnchor="middle"
              fontSize="24"
              style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }}
            >
              {mission.icon}
            </text>

            {/* Mission name */}
            <text
              x={zone.cx}
              y={zone.cy + 45}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontFamily="'Press Start 2P', cursive"
              style={{ textShadow: `0 0 8px ${zoneColor}` }}
            >
              {mission.name}
            </text>

            {/* Level badge */}
            <g>
              <rect
                x={zone.cx - 20} y={zone.cy + 50}
                width="40" height="16"
                fill={zoneColor}
                fillOpacity={0.9}
                rx="0"
              />
              <text
                x={zone.cx}
                y={zone.cy + 62}
                textAnchor="middle"
                fill={mission.level === 0 ? '#94a3b8' : '#0f172a'}
                fontSize="7"
                fontFamily="'Press Start 2P', cursive"
              >
                Lv.{mission.level}
              </text>
            </g>

            {/* Floating XP particles for active zones */}
            {mission.level > 0 && (
              <>
                <FloatingParticle cx={zone.cx - 20} cy={zone.cy} delay={0} />
                <FloatingParticle cx={zone.cx + 15} cy={zone.cy - 10} delay={1.5} />
                <FloatingParticle cx={zone.cx + 5} cy={zone.cy + 20} delay={3} />
              </>
            )}
          </g>
        )
      })}

      {/* Compass rose */}
      <g transform="translate(395, 475)">
        <circle r="18" fill="var(--bg-surface)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
        <text textAnchor="middle" y="-6" fill="rgba(245,158,11,0.5)" fontSize="7" fontFamily="'Press Start 2P', cursive">N</text>
        <text textAnchor="middle" y="10" fill="rgba(245,158,11,0.3)" fontSize="5" fontFamily="'Press Start 2P', cursive">S</text>
        <line x1="0" y1="-14" x2="0" y2="-10" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      </g>
    </svg>
  )
}
