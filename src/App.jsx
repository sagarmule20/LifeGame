import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import useGameStore from './store/useGameStore'
import BottomNav from './components/BottomNav'
import GameEventManager from './components/GameEventManager'
import Particles from './components/Particles'
import MapScreen from './screens/MapScreen'
import MissionScreen from './screens/MissionScreen'
import QuestScreen from './screens/QuestScreen'
import DailyScreen from './screens/DailyScreen'
import ProfileScreen from './screens/ProfileScreen'

export default function App() {
  const initializeStore = useGameStore((s) => s.initializeStore)
  const resetDailyTasks = useGameStore((s) => s.resetDailyTasks)

  useEffect(() => {
    initializeStore()
    resetDailyTasks()
  }, [initializeStore, resetDailyTasks])

  return (
    <BrowserRouter>
      <div
        className="max-w-[430px] mx-auto min-h-screen relative pb-20 overflow-hidden"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Ambient particles */}
        <Particles />

        {/* Game event overlays (level-up, loot, achievements, XP fly-ups) */}
        <GameEventManager />

        <div className="relative" style={{ zIndex: 2 }}>
          <Routes>
            <Route path="/" element={<MapScreen />} />
            <Route path="/mission/:missionId" element={<MissionScreen />} />
            <Route path="/quest/:questId" element={<QuestScreen />} />
            <Route path="/daily" element={<DailyScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        </div>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
