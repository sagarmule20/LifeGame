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
      missions: [],
      quests: [],
      tasks: [],
      initialized: false,

      // Achievement & loot tracking
      unlockedAchievements: [], // array of achievement ids
      inventory: [],            // collected loot items
      totalTasksCompleted: 0,

      // Event queue for UI animations (not persisted — set transiently)
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
          unlockedAchievements: [],
          inventory: [],
          totalTasksCompleted: 0,
        })
      },

      completeTask: (taskId) => {
        const state = get()
        const { tasks, quests, missions } = state
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
        const newXp = oldMission.xp + task.xpReward
        const newLevel = Math.floor(newXp / 100)
        const leveledUp = newLevel > oldMission.level

        const updatedMissions = missions.map((m) =>
          m.id === quest.missionId
            ? { ...m, xp: newXp, level: newLevel }
            : m
        )

        // Roll for loot (30% chance, 100% on level up)
        const loot = (leveledUp || Math.random() < 0.30) ? rollLoot() : null

        // Check achievements
        const newState = { ...state, tasks: updatedTasks, missions: updatedMissions }
        const newAchievements = ACHIEVEMENTS.filter(
          (a) => !state.unlockedAchievements.includes(a.id) && a.check(newState)
        )

        set({
          tasks: updatedTasks,
          missions: updatedMissions,
          totalTasksCompleted: state.totalTasksCompleted + 1,
          unlockedAchievements: [
            ...state.unlockedAchievements,
            ...newAchievements.map((a) => a.id),
          ],
          inventory: loot ? [...state.inventory, { ...loot, obtainedAt: Date.now() }] : state.inventory,
          _pendingLevelUp: leveledUp
            ? { missionName: oldMission.name, missionIcon: oldMission.icon, newLevel, missionColor: oldMission.color }
            : null,
          _pendingLoot: loot,
          _pendingAchievements: newAchievements,
        })
      },

      clearPendingEvents: () => {
        set({ _pendingLevelUp: null, _pendingLoot: null, _pendingAchievements: [] })
      },

      uncompleteTask: (taskId) => {
        const { tasks, quests, missions } = get()
        const task = tasks.find((t) => t.id === taskId)
        if (!task || !task.completedToday) return

        const updatedTasks = tasks.map((t) =>
          t.id === taskId ? { ...t, completedToday: false } : t
        )

        const quest = quests.find((q) => q.id === task.questId)
        const newXp = Math.max(0, missions.find((m) => m.id === quest.missionId).xp - task.xpReward)
        const updatedMissions = missions.map((m) =>
          m.id === quest.missionId
            ? { ...m, xp: newXp, level: Math.floor(newXp / 100) }
            : m
        )

        set({ tasks: updatedTasks, missions: updatedMissions })
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
        set((state) => ({
          quests: [...state.quests, { id, missionId, name, description }],
        }))
        return id
      },

      addTask: (questId, name, xpReward = 15) => {
        const id = 'task-' + Date.now()
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id, questId, name, xpReward, streak: 0, lastCompletedDate: null, completedToday: false },
          ],
        }))
      },
    }),
    {
      name: 'life-game-storage',
      partialize: (state) => {
        // Don't persist transient UI events
        const { _pendingLevelUp, _pendingLoot, _pendingAchievements, ...rest } = state
        return rest
      },
    }
  )
)

export default useGameStore
