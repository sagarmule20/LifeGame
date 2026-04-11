export const seedMissions = [
  { id: 'mission-health', name: 'Health', icon: '\uD83D\uDCAA', xp: 0, level: 0, color: '#ef4444' },
  { id: 'mission-mind', name: 'Mind', icon: '\uD83E\uDDE0', xp: 0, level: 0, color: '#8b5cf6' },
  { id: 'mission-career', name: 'Career', icon: '\uD83D\uDE80', xp: 0, level: 0, color: '#3b82f6' },
]

export const seedQuests = [
  { id: 'quest-gym', missionId: 'mission-health', name: 'Gym Warrior', description: 'Build strength through consistent workouts' },
  { id: 'quest-water', missionId: 'mission-health', name: 'Hydration Quest', description: 'Stay hydrated throughout the day' },
  { id: 'quest-sleep', missionId: 'mission-health', name: 'Sleep Mastery', description: 'Optimize your rest and recovery' },
  { id: 'quest-walk', missionId: 'mission-health', name: 'Daily Steps', description: 'Keep moving with daily walks' },
  { id: 'quest-read', missionId: 'mission-mind', name: 'Bookworm', description: 'Expand your mind through reading' },
  { id: 'quest-meditate', missionId: 'mission-mind', name: 'Inner Peace', description: 'Find calm through meditation' },
  { id: 'quest-journal', missionId: 'mission-mind', name: 'Chronicle', description: 'Reflect and grow through journaling' },
  { id: 'quest-deepwork', missionId: 'mission-career', name: 'Deep Focus', description: 'Achieve flow state with deep work sessions' },
  { id: 'quest-learn', missionId: 'mission-career', name: 'Skill Up', description: 'Level up your professional skills' },
  { id: 'quest-ship', missionId: 'mission-career', name: 'Ship It', description: 'Deliver real results and ship features' },
]

export const seedTasks = [
  { id: 'task-gym-workout', questId: 'quest-gym', name: 'Complete workout', xpReward: 25, streak: 0, lastCompletedDate: null, completedToday: false },
  { id: 'task-water-8cups', questId: 'quest-water', name: 'Drink 8 cups of water', xpReward: 10, streak: 0, lastCompletedDate: null, completedToday: false },
  { id: 'task-sleep-8hrs', questId: 'quest-sleep', name: 'Sleep 8 hours', xpReward: 20, streak: 0, lastCompletedDate: null, completedToday: false },
  { id: 'task-walk-30min', questId: 'quest-walk', name: 'Walk 30 minutes', xpReward: 15, streak: 0, lastCompletedDate: null, completedToday: false },
  { id: 'task-read-30min', questId: 'quest-read', name: 'Read for 30 minutes', xpReward: 20, streak: 0, lastCompletedDate: null, completedToday: false },
  { id: 'task-meditate-10', questId: 'quest-meditate', name: 'Meditate 10 minutes', xpReward: 15, streak: 0, lastCompletedDate: null, completedToday: false },
  { id: 'task-journal-entry', questId: 'quest-journal', name: 'Write journal entry', xpReward: 15, streak: 0, lastCompletedDate: null, completedToday: false },
  { id: 'task-deepwork-2hr', questId: 'quest-deepwork', name: '2-hour deep work', xpReward: 30, streak: 0, lastCompletedDate: null, completedToday: false },
  { id: 'task-learn-1hr', questId: 'quest-learn', name: 'Learn for 1 hour', xpReward: 20, streak: 0, lastCompletedDate: null, completedToday: false },
  { id: 'task-ship-feature', questId: 'quest-ship', name: 'Ship a feature/PR', xpReward: 35, streak: 0, lastCompletedDate: null, completedToday: false },
]
