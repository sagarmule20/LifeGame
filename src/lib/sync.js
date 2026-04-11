import { supabase } from './supabase'

/**
 * Sync local store data to Supabase.
 * Called after significant state changes when user is logged in.
 */

export async function syncToCloud(userId, state) {
  if (!userId) return

  try {
    // Upsert profile
    await supabase.from('profiles').upsert({
      id: userId,
      coins: state.euros,
      total_coins_earned: state.totalEurosEarned,
      total_tasks_completed: state.totalTasksCompleted,
      updated_at: new Date().toISOString(),
    })

    // Upsert missions
    const missionsData = state.missions.map((m) => ({
      id: m.id,
      user_id: userId,
      name: m.name,
      icon: m.icon,
      color: m.color,
      coins_earned: m.coinsEarned,
      level: m.level,
    }))
    if (missionsData.length > 0) {
      await supabase.from('missions').upsert(missionsData)
    }

    // Upsert quests
    const questsData = state.quests.map((q) => ({
      id: q.id,
      user_id: userId,
      mission_id: q.missionId,
      name: q.name,
      description: q.description || '',
    }))
    if (questsData.length > 0) {
      await supabase.from('quests').upsert(questsData)
    }

    // Upsert tasks
    const tasksData = state.tasks.map((t) => ({
      id: t.id,
      user_id: userId,
      quest_id: t.questId,
      name: t.name,
      coin_reward: t.coinReward,
      streak: t.streak,
      last_completed_date: t.lastCompletedDate,
      completed_today: t.completedToday,
      scheduled_time: t.scheduledTime,
    }))
    if (tasksData.length > 0) {
      await supabase.from('tasks').upsert(tasksData)
    }

    // Upsert rewards
    const rewardsData = state.rewards.map((r) => ({
      id: r.id,
      user_id: userId,
      name: r.name,
      icon: r.icon,
      cost: r.cost,
      purchased: r.purchased,
      purchased_at: r.purchasedAt ? new Date(r.purchasedAt).toISOString() : null,
    }))
    if (rewardsData.length > 0) {
      await supabase.from('rewards').upsert(rewardsData)
    }

    // Sync achievements
    const achievementsData = state.unlockedAchievements.map((aid) => ({
      user_id: userId,
      achievement_id: aid,
    }))
    if (achievementsData.length > 0) {
      await supabase.from('achievements').upsert(achievementsData, { onConflict: 'user_id,achievement_id' })
    }

  } catch (err) {
    console.warn('Cloud sync failed:', err)
  }
}

export async function loadFromCloud(userId) {
  if (!userId) return null

  try {
    const [profileRes, missionsRes, questsRes, tasksRes, rewardsRes, achievementsRes, inventoryRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('missions').select('*').eq('user_id', userId),
      supabase.from('quests').select('*').eq('user_id', userId),
      supabase.from('tasks').select('*').eq('user_id', userId),
      supabase.from('rewards').select('*').eq('user_id', userId),
      supabase.from('achievements').select('achievement_id').eq('user_id', userId),
      supabase.from('inventory').select('*').eq('user_id', userId),
    ])

    // If no cloud data, return null (first time)
    if (!missionsRes.data?.length) return null

    return {
      euros: profileRes.data?.coins || 0,
      totalEurosEarned: profileRes.data?.total_coins_earned || 0,
      totalTasksCompleted: profileRes.data?.total_tasks_completed || 0,
      missions: missionsRes.data.map((m) => ({
        id: m.id, name: m.name, icon: m.icon, color: m.color,
        coinsEarned: m.coins_earned, level: m.level,
      })),
      quests: questsRes.data.map((q) => ({
        id: q.id, missionId: q.mission_id, name: q.name, description: q.description,
      })),
      tasks: tasksRes.data.map((t) => ({
        id: t.id, questId: t.quest_id, name: t.name, coinReward: t.coin_reward,
        streak: t.streak, lastCompletedDate: t.last_completed_date,
        completedToday: t.completed_today, scheduledTime: t.scheduled_time,
      })),
      rewards: rewardsRes.data.map((r) => ({
        id: r.id, name: r.name, icon: r.icon, cost: r.cost,
        purchased: r.purchased, purchasedAt: r.purchased_at,
      })),
      unlockedAchievements: achievementsRes.data.map((a) => a.achievement_id),
      inventory: inventoryRes.data.map((i) => ({
        name: i.name, icon: i.icon, rarity: i.rarity, flavor: i.flavor,
        obtainedAt: new Date(i.obtained_at).getTime(),
      })),
    }
  } catch (err) {
    console.warn('Cloud load failed:', err)
    return null
  }
}
