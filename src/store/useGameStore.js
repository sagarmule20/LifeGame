import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedMissions, seedQuests, seedTasks, MANDATORY_MISSION_IDS } from '../data/seed'
import { ACHIEVEMENTS, rollLoot } from '../data/achievements'
import { getRank, RANKS } from '../data/ranks'

const EURO_PER_TASK = 5
const FREE_MISSION_COUNT = 3 // Health, Career, Finance — always free
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

      euros: 0,
      totalEurosEarned: 0,
      totalTasksCompleted: 0,

      rewards: [],
      unlockedAchievements: [],
      inventory: [],
      dailyLog: {}, // { 'YYYY-MM-DD': amountEarned }

      // Transient UI events
      _pendingLevelUp: null,
      _pendingLoot: null,
      _pendingAchievements: [],
      _pendingEarning: null,

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
          dailyLog: {},
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

        // Rank-up check
        const oldRank = getRank(totalEurosEarned)
        const newRank = getRank(newTotalEarned)
        const rankedUp = newRank.name !== oldRank.name

        // Loot: 20% chance, 100% on rank up
        const loot = (rankedUp || Math.random() < 0.20) ? rollLoot() : null

        // Achievements
        const newState = { ...state, tasks: updatedTasks, missions, euros: newEuros }
        const newAchievements = ACHIEVEMENTS.filter(
          (a) => !state.unlockedAchievements.includes(a.id) && a.check(newState)
        )

        const today = getTodayString()
        const updatedLog = { ...state.dailyLog, [today]: (state.dailyLog[today] || 0) + EURO_PER_TASK }

        set({
          tasks: updatedTasks,
          euros: newEuros,
          totalEurosEarned: newTotalEarned,
          totalTasksCompleted: state.totalTasksCompleted + 1,
          dailyLog: updatedLog,
          unlockedAchievements: [...state.unlockedAchievements, ...newAchievements.map((a) => a.id)],
          inventory: loot ? [...state.inventory, { ...loot, obtainedAt: Date.now() }] : state.inventory,
          _pendingEarning: { amount: EURO_PER_TASK, taskName: task.name, missionIcon: mission.icon },
          _pendingLevelUp: rankedUp
            ? { missionName: newRank.name, missionIcon: newRank.icon, newLevel: newRank.name, missionColor: newRank.color }
            : null,
          _pendingLoot: loot,
          _pendingAchievements: newAchievements,
        })
      },

      clearPendingEvents: () => set({ _pendingLevelUp: null, _pendingLoot: null, _pendingAchievements: [], _pendingEarning: null }),

      uncompleteTask: (taskId) => {
        const state = get()
        const task = state.tasks.find((t) => t.id === taskId)
        if (!task || !task.completedToday) return
        const today = getTodayString()
        const updatedLog = { ...state.dailyLog, [today]: Math.max(0, (state.dailyLog[today] || 0) - EURO_PER_TASK) }
        set({
          tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completedToday: false } : t),
          euros: Math.max(0, state.euros - EURO_PER_TASK),
          totalEurosEarned: Math.max(0, state.totalEurosEarned - EURO_PER_TASK),
          totalTasksCompleted: Math.max(0, state.totalTasksCompleted - 1),
          dailyLog: updatedLog,
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
      isMandatory: (missionId) => MANDATORY_MISSION_IDS.includes(missionId),

      addMissionFromTemplate: (template) => {
        const state = get()
        const needsPayment = state.missions.length >= FREE_MISSION_COUNT
        if (needsPayment && state.euros < MISSION_COST) return false

        const missionId = 'mission-' + Date.now()
        // Flat structure: one quest per mission, all tasks go under it
        const questId = `quest-${Date.now()}`
        const newQuest = { id: questId, missionId, name: template.name, description: template.description || '' }
        const newTasks = template.tasks.map((taskName, ti) => ({
            id: `task-${Date.now()}-${ti}`,
            questId,
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
          quests: [...state.quests, newQuest],
          tasks: [...state.tasks, ...newTasks],
          euros: needsPayment ? state.euros - MISSION_COST : state.euros,
        })
        return true
      },

      removeMission: (missionId) => {
        // Cannot remove mandatory missions
        if (MANDATORY_MISSION_IDS.includes(missionId)) return false
        const state = get()
        const questIds = state.quests.filter((q) => q.missionId === missionId).map((q) => q.id)
        set({
          missions: state.missions.filter((m) => m.id !== missionId),
          quests: state.quests.filter((q) => q.missionId !== missionId),
          tasks: state.tasks.filter((t) => !questIds.includes(t.questId)),
        })
        return true
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
