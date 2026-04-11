import { useNavigate } from 'react-router-dom'
import useGameStore from '../store/useGameStore'

const zones = [
  {
    missionId: 'mission-health',
    points: '30,100 180,50 240,100 230,200 180,260 50,230',
    labelX: 140,
    labelY: 155,
  },
  {
    missionId: 'mission-mind',
    points: '260,100 390,50 400,120 390,220 260,260 240,100',
    labelX: 320,
    labelY: 155,
  },
  {
    missionId: 'mission-career',
    points: '90,290 340,290 380,400 215,460 50,400',
    labelX: 215,
    labelY: 370,
  },
]

export default function ZoneMap() {
  const navigate = useNavigate()
  const missions = useGameStore((s) => s.missions)

  return (
    <svg viewBox="0 0 430 500" className="w-full" style={{ maxHeight: '55vh' }}>
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M 30 0 L 0 0 0 30"
            fill="none"
            stroke="rgba(148, 163, 184, 0.06)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="430" height="500" fill="url(#grid)" />

      {/* Dotted paths between zones */}
      <path
        d="M 180,220 Q 200,270 215,290"
        fill="none"
        stroke="rgba(148, 163, 184, 0.2)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <path
        d="M 260,220 Q 240,270 215,290"
        fill="none"
        stroke="rgba(148, 163, 184, 0.2)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <path
        d="M 230,160 L 260,160"
        fill="none"
        stroke="rgba(148, 163, 184, 0.2)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />

      {/* Zone polygons */}
      {zones.map((zone) => {
        const mission = missions.find((m) => m.id === zone.missionId)
        if (!mission) return null

        const fillOpacity = 0.2 + Math.min(mission.level * 0.08, 0.6)
        const isHighLevel = mission.level >= 5

        return (
          <g
            key={zone.missionId}
            onClick={() => navigate(`/mission/${zone.missionId}`)}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <polygon
              points={zone.points}
              fill={mission.level === 0 ? '#374151' : mission.color}
              fillOpacity={mission.level === 0 ? 0.3 : fillOpacity}
              stroke={isHighLevel ? '#f59e0b' : mission.level === 0 ? '#4b5563' : mission.color}
              strokeWidth={isHighLevel ? 3 : 2}
            />
            <text
              x={zone.labelX}
              y={zone.labelY - 15}
              textAnchor="middle"
              fill="white"
              fontSize="20"
            >
              {mission.icon}
            </text>
            <text
              x={zone.labelX}
              y={zone.labelY + 8}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontFamily="'Press Start 2P', cursive"
            >
              {mission.name}
            </text>
            <text
              x={zone.labelX}
              y={zone.labelY + 28}
              textAnchor="middle"
              fill={mission.level === 0 ? '#6b7280' : mission.color}
              fontSize="8"
              fontFamily="'Press Start 2P', cursive"
            >
              Lv.{mission.level}
            </text>
          </g>
        )
      })}

      {/* Compass */}
      <g transform="translate(385, 470)">
        <circle r="15" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />
        <text textAnchor="middle" y="-5" fill="rgba(148, 163, 184, 0.3)" fontSize="8" fontFamily="'Press Start 2P', cursive">
          N
        </text>
      </g>
    </svg>
  )
}
