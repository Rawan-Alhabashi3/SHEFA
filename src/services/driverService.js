import apiClient from './apiClient'

export const getDriverOverview = async () => {
  const { data } = await apiClient.get('/driver/overview')
  return data
}

export const getAssignedOrders = async () => {
  const { data } = await apiClient.get('/get-my-assigned-orders')
  return data
}

export const getDriverMissions = async (status = 'active') => {
  const { data } = await apiClient.get('/driver/missions', { params: { status } })
  return data
}

export const getAvailableMissions = async () => {
  const { data } = await apiClient.get('/driver/missions/available')
  return data
}

export const getActiveDeliveries = async () => {
  const { data } = await apiClient.get('/driver/active-deliveries')
  return data
}

export const getDriverHistory = async (params = {}) => {
  const { data } = await apiClient.get('/driver/history', { params })
  return data
}

export const getDriverEarnings = async () => {
  const { data } = await apiClient.get('/driver/earnings')
  return data
}

export const getDriverNotifications = async () => {
  const { data } = await apiClient.get('/driver/notifications')
  return data
}

export const markDriverNotificationRead = async (notification_id) => {
  const { data } = await apiClient.post('/driver/notifications/read', { notification_id })
  return data
}

export const acceptDelivery = async (order_id) => {
  const { data } = await apiClient.post('/accept-delivery', { order_id })
  return data
}

export const acceptMission = async (mission_id) => {
  const { data } = await apiClient.post('/driver/missions/accept', { mission_id })
  return data
}

export const rejectDelivery = async (order_id) => {
  const { data } = await apiClient.post('/reject-delivery', { order_id })
  return data
}

export const rejectMission = async (mission_id, reason = '') => {
  const { data } = await apiClient.post('/driver/missions/reject', { mission_id, reason })
  return data
}

export const startMissionPickingUp = async (mission_id) => {
  const { data } = await apiClient.post('/driver/missions/picking-up', { mission_id })
  return data
}

export const pickUpOrder = async (order_id) => {
  const { data } = await apiClient.post('/pick-up-order', { order_id })
  return data
}

export const startMissionDelivering = async (mission_id) => {
  const { data } = await apiClient.post('/driver/missions/delivering', { mission_id })
  return data
}

export const deliverOrder = async (order_id) => {
  const { data } = await apiClient.post('/deliver-order', { order_id })
  return data
}

export const completeMission = async (mission_id) => {
  const { data } = await apiClient.post('/driver/missions/delivered', { mission_id })
  return data
}

export const updateDriverAvailability = async (payload) => {
  const { data } = await apiClient.post('/update-availability-status', payload)
  return data
}

export const getDeliveryOrderDetails = async (order_id) => {
  const { data } = await apiClient.post('/get-order-details', { order_id })
  return data
}

export const updateMyProfile = async (payload) => {
  const { data } = await apiClient.post('/update-my-profile', payload)
  return data
}
