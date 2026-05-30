import apiClient from './apiClient'

export const getMyNotifications = async (params = {}) => {
  const { data } = await apiClient.get('/citizen/notifications', { params })
  return data
}

export const getMyUnreadNotificationsCount = async () => {
  const { data } = await apiClient.get('/citizen/notifications/unread-count')
  return data
}

export const markMyNotificationRead = async (notification_id) => {
  const { data } = await apiClient.post('/citizen/notifications/read', { notification_id })
  return data
}

export const markAllMyNotificationsRead = async () => {
  const { data } = await apiClient.post('/citizen/notifications/read-all')
  return data
}

export const deleteMyNotification = async (notification_id) => {
  const { data } = await apiClient.delete('/citizen/notifications', { data: { notification_id } })
  return data
}
