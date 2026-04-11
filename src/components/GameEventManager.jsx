import { useEffect, useState, useCallback } from 'react'
import useGameStore from '../store/useGameStore'
import EarningCelebration from './EarningCelebration'
import LevelUpModal from './LevelUpModal'
import LootDrop from './LootDrop'
import AchievementToast from './AchievementToast'
import XPFlyUp from './XPFlyUp'

export default function GameEventManager() {
  const pendingEarning = useGameStore((s) => s._pendingEarning)
  const pendingLevelUp = useGameStore((s) => s._pendingLevelUp)
  const pendingLoot = useGameStore((s) => s._pendingLoot)
  const pendingAchievements = useGameStore((s) => s._pendingAchievements)
  const clearPendingEvents = useGameStore((s) => s.clearPendingEvents)

  const [earning, setEarning] = useState(null)
  const [levelUp, setLevelUp] = useState(null)
  const [loot, setLoot] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [xpFlyUps, setXpFlyUps] = useState([])

  useEffect(() => {
    if (pendingAchievements?.length > 0) {
      setAchievements((prev) => [...prev, ...pendingAchievements])
    }
    if (pendingEarning) {
      setEarning(pendingEarning)
    }
    if (pendingLoot) {
      const delay = pendingEarning ? 2500 : pendingLevelUp ? 1500 : 0
      setTimeout(() => setLoot(pendingLoot), delay)
    }
    if (pendingLevelUp) {
      const delay = pendingEarning ? 2500 : 0
      setTimeout(() => setLevelUp(pendingLevelUp), delay)
    }
    if (pendingEarning || pendingLevelUp || pendingLoot || pendingAchievements?.length > 0) {
      clearPendingEvents()
    }
  }, [pendingEarning, pendingLevelUp, pendingLoot, pendingAchievements, clearPendingEvents])

  const dismissEarning = useCallback(() => setEarning(null), [])
  const dismissLevelUp = useCallback(() => setLevelUp(null), [])
  const dismissLoot = useCallback(() => setLoot(null), [])
  const dismissAchievement = useCallback(() => setAchievements((prev) => prev.slice(1)), [])

  useEffect(() => {
    window.__showXPFlyUp = (xp, x, y) => {
      const id = Date.now() + Math.random()
      setXpFlyUps((prev) => [...prev, { id, xp, x, y }])
    }
    return () => { delete window.__showXPFlyUp }
  }, [])

  const removeXPFlyUp = useCallback((id) => setXpFlyUps((prev) => prev.filter((f) => f.id !== id)), [])

  return (
    <>
      {xpFlyUps.map((f) => (
        <XPFlyUp key={f.id} xp={f.xp} x={f.x} y={f.y} onDone={() => removeXPFlyUp(f.id)} />
      ))}
      {achievements.length > 0 && (
        <AchievementToast key={achievements[0].id} achievement={achievements[0]} onDone={dismissAchievement} />
      )}
      {earning && !levelUp && (
        <EarningCelebration amount={earning.amount} taskName={earning.taskName} missionIcon={earning.missionIcon} onDone={dismissEarning} />
      )}
      {levelUp && <LevelUpModal missionName={levelUp.missionName} missionIcon={levelUp.missionIcon} newLevel={levelUp.newLevel} missionColor={levelUp.missionColor} onClose={dismissLevelUp} />}
      {loot && !levelUp && !earning && <LootDrop loot={loot} onClose={dismissLoot} />}
    </>
  )
}
