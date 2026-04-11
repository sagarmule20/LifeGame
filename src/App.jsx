import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useGameStore from './store/useGameStore'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { syncToCloud, loadFromCloud } from './lib/sync'
import { seedMissions, seedQuests, seedTasks, MANDATORY_MISSION_IDS } from './data/seed'
import { requestNotificationPermission, scheduleTaskNotifications } from './lib/notifications'
import BottomNav from './components/BottomNav'
import GameEventManager from './components/GameEventManager'
import AuthScreen from './screens/AuthScreen'
import MapScreen from './screens/MapScreen'
import MissionScreen from './screens/MissionScreen'
import QuestScreen from './screens/QuestScreen'
import DailyScreen from './screens/DailyScreen'
import ProfileScreen from './screens/ProfileScreen'
import RewardsScreen from './screens/RewardsScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import EarningsScreen from './screens/EarningsScreen'
import PWAInstallPrompt from './components/PWAInstallPrompt'

// Ensure mandatory missions are always present after cloud load
function mergeMandatoryMissions(cloudData) {
  const missions = [...cloudData.missions]
  const quests = [...cloudData.quests]
  const tasks = [...cloudData.tasks]

  MANDATORY_MISSION_IDS.forEach((missionId) => {
    if (!missions.find((m) => m.id === missionId)) {
      const seedM = seedMissions.find((m) => m.id === missionId)
      const seedQ = seedQuests.filter((q) => q.missionId === missionId)
      const seedQIds = seedQ.map((q) => q.id)
      const seedT = seedTasks.filter((t) => seedQIds.includes(t.questId))
      if (seedM) missions.push(seedM)
      quests.push(...seedQ)
      tasks.push(...seedT)
    }
  })

  return { ...cloudData, missions, quests, tasks }
}

export default function App() {
  const [authReady, setAuthReady] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const user = useGameStore((s) => s.user)
  const setUser = useGameStore((s) => s.setUser)
  const initializeStore = useGameStore((s) => s.initializeStore)
  const resetDailyTasks = useGameStore((s) => s.resetDailyTasks)
  const tasks = useGameStore((s) => s.tasks)

  // Check auth state on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadFromCloud(session.user.id).then((cloudData) => {
          if (cloudData) {
            useGameStore.setState({ ...mergeMandatoryMissions(cloudData), initialized: true })
          } else {
            initializeStore()
          }
          resetDailyTasks()
        })
      } else {
        const state = useGameStore.getState()
        if (state.initialized) {
          resetDailyTasks()
        } else if (isSupabaseConfigured) {
          setShowAuth(true)
        } else {
          // Supabase not configured — skip auth, go straight to app
          initializeStore()
          resetDailyTasks()
        }
      }
      setAuthReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Schedule notifications when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      requestNotificationPermission().then(() => {
        scheduleTaskNotifications(tasks)
      })
    }
  }, [tasks])

  // Auto-sync to cloud periodically
  useEffect(() => {
    if (!user?.id) return
    const interval = setInterval(() => {
      const state = useGameStore.getState()
      syncToCloud(user.id, state)
    }, 30000) // sync every 30s
    return () => clearInterval(interval)
  }, [user?.id])

  const handleAuth = (authUser) => {
    setShowAuth(false)
    if (authUser) {
      setUser(authUser)
      loadFromCloud(authUser.id).then((cloudData) => {
        if (cloudData) {
          useGameStore.setState({ ...mergeMandatoryMissions(cloudData), initialized: true })
        } else {
          initializeStore()
        }
        resetDailyTasks()
      })
    } else {
      initializeStore()
      resetDailyTasks()
    }
  }

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4" style={{ animation: 'bounce 1s ease-in-out infinite' }}>🏆</div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-dim)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (showAuth) {
    return <AuthScreen onAuth={handleAuth} />
  }

  return (
    <BrowserRouter>
      <div
        className="max-w-[430px] mx-auto min-h-screen relative pb-20"
        style={{ background: 'var(--bg)' }}
      >
        <GameEventManager />
        <PWAInstallPrompt />
        <Routes>
          <Route path="/" element={<DailyScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/mission/:missionId" element={<MissionScreen />} />
          <Route path="/quest/:questId" element={<QuestScreen />} />
          <Route path="/rewards" element={<RewardsScreen />} />
          <Route path="/leaderboard" element={<LeaderboardScreen />} />
          <Route path="/earnings" element={<EarningsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
