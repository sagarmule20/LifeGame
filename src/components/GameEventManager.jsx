import { useEffect, useState, useCallback } from 'react'
import useGameStore from '../store/useGameStore'
import LevelUpModal from './LevelUpModal'
import LootDrop from './LootDrop'
import AchievementToast from './AchievementToast'
import XPFlyUp from './XPFlyUp'

/**
 * Centralized manager for all game event animations.
 * Watches store for pending events and queues them for display.
 */
export default function GameEventManager() {
  const pendingLevelUp = useGameStore((s) => s._pendingLevelUp)
  const pendingLoot = useGameStore((s) => s._pendingLoot)
  const pendingAchievements = useGameStore((s) => s._pendingAchievements)
  const clearPendingEvents = useGameStore((s) => s.clearPendingEvents)

  const [levelUp, setLevelUp] = useState(null)
  const [loot, setLoot] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [xpFlyUps, setXpFlyUps] = useState([])

  // Queue events when they arrive
  useEffect(() => {
    if (pendingAchievements?.length > 0) {
      setAchievements((prev) => [...prev, ...pendingAchievements])
    }
    if (pendingLoot) {
      // Delay loot if there's also a level up
      const delay = pendingLevelUp ? 1500 : 0
      setTimeout(() => setLoot(pendingLoot), delay)
    }
    if (pendingLevelUp) {
      setLevelUp(pendingLevelUp)
    }
    if (pendingLevelUp || pendingLoot || pendingAchievements?.length > 0) {
      clearPendingEvents()
    }
  }, [pendingLevelUp, pendingLoot, pendingAchievements, clearPendingEvents])

  const dismissLevelUp = useCallback(() => setLevelUp(null), [])
  const dismissLoot = useCallback(() => setLoot(null), [])
  const dismissAchievement = useCallback(() => {
    setAchievements((prev) => prev.slice(1))
  }, [])

  // Public API for XP fly-ups — exposed via window for simplicity
  useEffect(() => {
    window.__showXPFlyUp = (xp, x, y) => {
      const id = Date.now() + Math.random()
      setXpFlyUps((prev) => [...prev, { id, xp, x, y }])
    }
    return () => { delete window.__showXPFlyUp }
  }, [])

  const removeXPFlyUp = useCallback((id) => {
    setXpFlyUps((prev) => prev.filter((f) => f.id !== id))
  }, [])

  return (
    <>
      {/* XP Fly-ups */}
      {xpFlyUps.map((f) => (
        <XPFlyUp key={f.id} xp={f.xp} x={f.x} y={f.y} onDone={() => removeXPFlyUp(f.id)} />
      ))}

      {/* Achievement toasts — show one at a time */}
      {achievements.length > 0 && (
        <AchievementToast
          key={achievements[0].id}
          achievement={achievements[0]}
          onDone={dismissAchievement}
        />
      )}

      {/* Level up modal */}
      {levelUp && (
        <LevelUpModal
          missionName={levelUp.missionName}
          missionIcon={levelUp.missionIcon}
          newLevel={levelUp.newLevel}
          missionColor={levelUp.missionColor}
          onClose={dismissLevelUp}
        />
      )}

      {/* Loot drop */}
      {loot && !levelUp && (
        <LootDrop loot={loot} onClose={dismissLoot} />
      )}
    </>
  )
}
