/**
 * Push notification system for scheduled tasks.
 * Uses the Notification API + setTimeout for in-app scheduling.
 * For true background push, a service worker is required.
 */

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function scheduleTaskNotifications(tasks) {
  // Clear existing timers
  if (window.__notificationTimers) {
    window.__notificationTimers.forEach(clearTimeout)
  }
  window.__notificationTimers = []

  const now = new Date()
  const todayStr = now.toLocaleDateString('en-CA')

  tasks.forEach((task) => {
    if (!task.scheduledTime || task.completedToday) return

    const [hours, minutes] = task.scheduledTime.split(':').map(Number)
    const scheduled = new Date()
    scheduled.setHours(hours, minutes, 0, 0)

    const diff = scheduled.getTime() - now.getTime()
    if (diff <= 0) return // Already passed today

    const timer = setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('🏆 Life Game', {
          body: `Time for: ${task.name}`,
          icon: '/icons/icon-192.png',
          tag: task.id,
          data: { taskId: task.id, questId: task.questId },
        })
      }
    }, diff)

    window.__notificationTimers.push(timer)
  })
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}
