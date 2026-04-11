import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedMissions, seedQuests, seedTasks } from '../data/seed'
import { ACHIEVEMENTS, rollLoot } from '../data/achievements'

const EURO_PER_TASK = 5
const FREE_MISSION_LIMIT = 4
const MISSION_COST = 50

const getTodayString = () => new Date().toLocaleDateString('en-CA')
const getYesterdayString = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('en-CA')
}

const useGameStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      missions: [],
      quests: [],
      tasks: [],
      initialized: false,

      // Euro balance
      euros: 0,
      totalEurosEarned: 0,
      totalTasksCompleted: 0,

      // Rewards shop
      rewards: [],

      // Achievements & inventory
      unlockedAchievements: [],
      inventory: [],

      // Transient UI events
      _pendingLevelUp: null,
      _pendingLoot: null,
      _pendingAchievements: [],
      _pendingEarning: null, // { amount, taskName, missionName }

      initializeStore: () => {
        if (get().initialized) return
        set({
          missions: seedMissions,
          quests: seedQuests,
          tasks: seedTasks,
          initialized: true,
          euros: 0,
          totalEurosEarned: 0,
          totalTasksCompleted: 0,
          unlockedAchievements: [],
          inventory: [],
          rewards: [],
        })
      },

      completeTask: (taskId) => {
        const state = get()
        const { tasks, quests, missions, euros, totalEurosEarned } = state
        const task = tasks.find((t) => t.id === taskId)
        if (!task || task.completedToday) return

        const yesterday = getYesterdayString()
        const today = getTodayString()
        const newStreak = task.lastCompletedDate === yesterday ? task.streak + 1 : 1

        const updatedTasks = tasks.map((t) =>
          t.id === taskId
            ? { ...t, completedToday: true, lastCompletedDate: today, streak: newStreak }
            : t
        )

        const quest = quests.find((q) => q.id === task.questId)
        const mission = missions.find((m) => m.id === quest.missionId)

        const newEuros = euros + EURO_PER_TASK
        const newTotalEarned = totalEurosEarned + EURO_PER_TASK

        // Simple rank-up check: compare floor-based slab thresholds
        const slabs = [0, 50, 100, 250, 500, 1000, 2000, 5000, 10000, 25000, 50000]
        const getSlabIndex = (v) => { let i = 0; for (const s of slabs) { if (v >= s) i = slabs.indexOf(s); } return i }
        const rankedUp = getSlabIndex(newTotalEarned) > getSlabIndex(totalEurosEarned)

        // Loot: 20% chance, 100% on rank up
        const loot = (rankedUp || Math.random() < 0.20) ? rollLoot() : null

        // Achievements
        const newState = { ...state, tasks: updatedTasks, missions, euros: newEuros }
        const newAchievements = ACHIEVEMENTS.filter(
          (a) => !state.unlockedAchievements.includes(a.id) && a.check(newState)
        )

        set({
          tasks: updatedTasks,
          euros: newEuros,
          totalEurosEarned: newTotalEarned,
          totalTasksCompleted: state.totalTasksCompleted + 1,
          unlockedAchievements: [...state.unlockedAchievements, ...newAchievements.map((a) => a.id)],
          inventory: loot ? [...state.inventory, { ...loot, obtainedAt: Date.now() }] : state.inventory,
          _pendingEarning: { amount: EURO_PER_TASK, taskName: task.name, missionIcon: mission.icon },
          _pendingLevelUp: rankedUp ? { missionName: newRank.name, missionIcon: newRank.icon, newLevel: newRank.name, missionColor: newRank.color } : null,
          _pendingLoot: loot,
          _pendingAchievements: newAchievements,
        })
      },

      clearPendingEvents: () => set({ _pendingLevelUp: null, _pendingLoot: null, _pendingAchievements: [], _pendingEarning: null }),

      uncompleteTask: (taskId) => {
        const { tasks, euros } = get()
        const task = tasks.find((t) => t.id === taskId)
        if (!task || !task.completedToday) return
        set({
          tasks: tasks.map((t) => t.id === taskId ? { ...t, completedToday: false } : t),
          euros: Math.max(0, euros - EURO_PER_TASK),
        })
      },

      resetDailyTasks: () => {
        const today = getTodayString()
        set({
          tasks: get().tasks.map((t) =>
            t.completedToday && t.lastCompletedDate !== today ? { ...t, completedToday: false } : t
          ),
        })
      },

      // Mission management
      canAddFreeMission: () => get().missions.length < FREE_MISSION_LIMIT,
      getMissionCost: () => MISSION_COST,

      addMissionFromTemplate: (template) => {
        const state = get()
        const isFree = state.missions.length < FREE_MISSION_LIMIT
        if (!isFree && state.euros < MISSION_COST) return false

        const missionId = 'mission-' + Date.now()
        const newQuests = template.quests.map((q, qi) => ({
          id: `quest-${Date.now()}-${qi}`,
          missionId,
          name: q.name,
          description: q.description,
        }))
        const newTasks = template.quests.flatMap((q, qi) =>
          q.tasks.map((taskName, ti) => ({
            id: `task-${Date.now()}-${qi}-${ti}`,
            questId: newQuests[qi].id,
            name: taskName,
            coinReward: EURO_PER_TASK,
            streak: 0,
            lastCompletedDate: null,
            completedToday: false,
            scheduledTime: null,
          }))
        )

        set({
          missions: [...state.missions, { id: missionId, name: template.name, icon: template.icon, color: template.color, coinsEarned: 0, level: 0 }],
          quests: [...state.quests, ...newQuests],
          tasks: [...state.tasks, ...newTasks],
          euros: isFree ? state.euros : state.euros - MISSION_COST,
        })
        return true
      },

      removeMission: (missionId) => {
        const state = get()
        const questIds = state.quests.filter((q) => q.missionId === missionId).map((q) => q.id)
        set({
          missions: state.missions.filter((m) => m.id !== missionId),
          quests: state.quests.filter((q) => q.missionId !== missionId),
          tasks: state.tasks.filter((t) => !questIds.includes(t.questId)),
        })
      },

      addQuest: (missionId, name, description) => {
        const id = 'quest-' + Date.now()
        set((s) => ({ quests: [...s.quests, { id, missionId, name, description }] }))
        return id
      },

      addTask: (questId, name, scheduledTime = null) => {
        const id = 'task-' + Date.now()
        set((s) => ({
          tasks: [...s.tasks, {
            id, questId, name, coinReward: EURO_PER_TASK,
            streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime,
          }],
        }))
      },

      updateTaskTime: (taskId, scheduledTime) => {
        set((s) => ({ tasks: s.tasks.map((t) => t.id === taskId ? { ...t, scheduledTime } : t) }))
      },

      // Rewards
      addReward: (name, cost, icon = '🎁') => {
        const id = 'reward-' + Date.now()
        set((s) => ({ rewards: [...s.rewards, { id, name, cost, icon, purchased: false }] }))
      },
      purchaseReward: (rewardId) => {
        const { rewards, euros } = get()
        const reward = rewards.find((r) => r.id === rewardId)
        if (!reward || reward.purchased || euros < reward.cost) return false
        set({
          euros: euros - reward.cost,
          rewards: rewards.map((r) => r.id === rewardId ? { ...r, purchased: true, purchasedAt: Date.now() } : r),
        })
        return true
      },
      deleteReward: (rewardId) => set((s) => ({ rewards: s.rewards.filter((r) => r.id !== rewardId) })),
    }),
    {
      name: 'life-game-storage',
      partialize: (state) => {
        const { _pendingLevelUp, _pendingLoot, _pendingAchievements, _pendingEarning, ...rest } = state
        return rest
      },
    }
  )
)

export default useGameStore
