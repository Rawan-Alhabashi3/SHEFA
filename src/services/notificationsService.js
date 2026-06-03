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

export const getPharmacyNotifications = async (params = {}) => {
  const { data } = await apiClient.get('/pharmacy/notifications', { params })
  return data
}

export const getPharmacyUnreadNotificationsCount = async () => {
  const { data } = await apiClient.get('/pharmacy/notifications/unread-count')
  return data
}

export const markPharmacyNotificationRead = async (notification_id) => {
  const { data } = await apiClient.post('/pharmacy/notifications/read', { notification_id })
  return data
}

export const markAllPharmacyNotificationsRead = async () => {
  const { data } = await apiClient.post('/pharmacy/notifications/read-all')
  return data
}

export const deletePharmacyNotification = async (notification_id) => {
  const { data } = await apiClient.delete('/pharmacy/notifications', { data: { notification_id } })
  return data
}

export const getDriverNotifications = async (params = {}) => {
  const { data } = await apiClient.get('/driver/notifications', { params })
  return data
}

export const getDriverUnreadNotificationsCount = async () => {
  const { data } = await apiClient.get('/driver/notifications/unread-count')
  return data
}

export const markDriverNotificationRead = async (notification_id) => {
  const { data } = await apiClient.post('/driver/notifications/read', { notification_id })
  return data
}

export const markAllDriverNotificationsRead = async () => {
  const { data } = await apiClient.post('/driver/notifications/read-all')
  return data
}

export const deleteDriverNotification = async (notification_id) => {
  const { data } = await apiClient.delete('/driver/notifications', { data: { notification_id } })
  return data
}

export const getAdminNotifications = async (params = {}) => {
  const { data } = await apiClient.get('/admin/notifications', { params })
  return data
}

export const getAdminUnreadNotificationsCount = async () => {
  const { data } = await apiClient.get('/admin/notifications/unread-count')
  return data
}

export const markAdminNotificationRead = async (notification_id) => {
  const { data } = await apiClient.post('/admin/notifications/read', { notification_id })
  return data
}

export const markAllAdminNotificationsRead = async () => {
  const { data } = await apiClient.post('/admin/notifications/read-all')
  return data
}

export const deleteAdminNotification = async (notification_id) => {
  const { data } = await apiClient.delete('/admin/notifications', { data: { notification_id } })
  return data
}
