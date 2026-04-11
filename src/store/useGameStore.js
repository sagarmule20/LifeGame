import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedMissions, seedQuests, seedTasks } from '../data/seed'
import { ACHIEVEMENTS, rollLoot } from '../data/achievements'

const getTodayString = () => new Date().toLocaleDateString('en-CA')
const getYesterdayString = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('en-CA')
}

const useGameStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),

      // Core data
      missions: [],
      quests: [],
      tasks: [],
      initialized: false,

      // Coins instead of XP
      coins: 0,
      totalCoinsEarned: 0,
      totalTasksCompleted: 0,

      // Rewards shop
      rewards: [],

      // Achievements & inventory
      unlockedAchievements: [],
      inventory: [],

      // Transient UI events (not persisted)
      _pendingLevelUp: null,
      _pendingLoot: null,
      _pendingAchievements: [],

      initializeStore: () => {
        if (get().initialized) return
        set({
          missions: seedMissions,
          quests: seedQuests,
          tasks: seedTasks,
          initialized: true,
          coins: 0,
          totalCoinsEarned: 0,
          totalTasksCompleted: 0,
          unlockedAchievements: [],
          inventory: [],
          rewards: [],
        })
      },

      completeTask: (taskId) => {
        const state = get()
        const { tasks, quests, missions, coins, totalCoinsEarned } = state
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
        const oldMission = missions.find((m) => m.id === quest.missionId)
        const newMissionCoins = oldMission.coinsEarned + task.coinReward
        const newLevel = Math.floor(newMissionCoins / 100)
        const leveledUp = newLevel > oldMission.level

        const updatedMissions = missions.map((m) =>
          m.id === quest.missionId
            ? { ...m, coinsEarned: newMissionCoins, level: newLevel }
            : m
        )

        const newCoins = coins + task.coinReward
        const newTotalEarned = totalCoinsEarned + task.coinReward

        // Loot: 25% chance, 100% on level-up
        const loot = (leveledUp || Math.random() < 0.25) ? rollLoot() : null

        // Achievements
        const newState = { ...state, tasks: updatedTasks, missions: updatedMissions, coins: newCoins }
        const newAchievements = ACHIEVEMENTS.filter(
          (a) => !state.unlockedAchievements.includes(a.id) && a.check(newState)
        )

        set({
          tasks: updatedTasks,
          missions: updatedMissions,
          coins: newCoins,
          totalCoinsEarned: newTotalEarned,
          totalTasksCompleted: state.totalTasksCompleted + 1,
          unlockedAchievements: [...state.unlockedAchievements, ...newAchievements.map((a) => a.id)],
          inventory: loot ? [...state.inventory, { ...loot, obtainedAt: Date.now() }] : state.inventory,
          _pendingLevelUp: leveledUp
            ? { missionName: oldMission.name, missionIcon: oldMission.icon, newLevel, missionColor: oldMission.color }
            : null,
          _pendingLoot: loot,
          _pendingAchievements: newAchievements,
        })
      },

      clearPendingEvents: () => set({ _pendingLevelUp: null, _pendingLoot: null, _pendingAchievements: [] }),

      uncompleteTask: (taskId) => {
        const { tasks, quests, missions, coins } = get()
        const task = tasks.find((t) => t.id === taskId)
        if (!task || !task.completedToday) return

        const updatedTasks = tasks.map((t) =>
          t.id === taskId ? { ...t, completedToday: false } : t
        )
        const quest = quests.find((q) => q.id === task.questId)
        const mission = missions.find((m) => m.id === quest.missionId)
        const newCoinsEarned = Math.max(0, mission.coinsEarned - task.coinReward)
        const updatedMissions = missions.map((m) =>
          m.id === quest.missionId
            ? { ...m, coinsEarned: newCoinsEarned, level: Math.floor(newCoinsEarned / 100) }
            : m
        )
        set({
          tasks: updatedTasks,
          missions: updatedMissions,
          coins: Math.max(0, coins - task.coinReward),
        })
      },

      resetDailyTasks: () => {
        const today = getTodayString()
        const updatedTasks = get().tasks.map((t) =>
          t.completedToday && t.lastCompletedDate !== today
            ? { ...t, completedToday: false }
            : t
        )
        set({ tasks: updatedTasks })
      },

      addQuest: (missionId, name, description) => {
        const id = 'quest-' + Date.now()
        set((s) => ({ quests: [...s.quests, { id, missionId, name, description }] }))
        return id
      },

      addTask: (questId, name, coinReward = 10, scheduledTime = null) => {
        const id = 'task-' + Date.now()
        set((s) => ({
          tasks: [...s.tasks, {
            id, questId, name, coinReward,
            streak: 0, lastCompletedDate: null, completedToday: false,
            scheduledTime,
          }],
        }))
      },

      updateTaskTime: (taskId, scheduledTime) => {
        set((s) => ({
          tasks: s.tasks.map((t) => t.id === taskId ? { ...t, scheduledTime } : t),
        }))
      },

      // Rewards shop
      addReward: (name, cost, icon = '🎁') => {
        const id = 'reward-' + Date.now()
        set((s) => ({
          rewards: [...s.rewards, { id, name, cost, icon, purchased: false }],
        }))
      },

      purchaseReward: (rewardId) => {
        const { rewards, coins } = get()
        const reward = rewards.find((r) => r.id === rewardId)
        if (!reward || reward.purchased || coins < reward.cost) return false
        set({
          coins: coins - reward.cost,
          rewards: rewards.map((r) =>
            r.id === rewardId ? { ...r, purchased: true, purchasedAt: Date.now() } : r
          ),
        })
        return true
      },

      deleteReward: (rewardId) => {
        set((s) => ({ rewards: s.rewards.filter((r) => r.id !== rewardId) }))
      },
    }),
    {
      name: 'life-game-storage',
      partialize: (state) => {
        const { _pendingLevelUp, _pendingLoot, _pendingAchievements, ...rest } = state
        return rest
      },
    }
  )
)

export default useGameStore
