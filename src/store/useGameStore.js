import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedMissions, seedQuests, seedTasks } from '../data/seed'

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

      initializeStore: () => {
        if (get().initialized) return
        set({
          missions: seedMissions,
          quests: seedQuests,
          tasks: seedTasks,
          initialized: true,
        })
      },

      completeTask: (taskId) => {
        const { tasks, quests, missions } = get()
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
        const updatedMissions = missions.map((m) =>
          m.id === quest.missionId
            ? {
                ...m,
                xp: m.xp + task.xpReward,
                level: Math.floor((m.xp + task.xpReward) / 100),
              }
            : m
        )

        set({ tasks: updatedTasks, missions: updatedMissions })
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
    { name: 'life-game-storage' }
  )
)

export default useGameStore
