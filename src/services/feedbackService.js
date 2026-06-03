import apiClient from './apiClient'

export const getPublicFeedback = async () => {
  const { data } = await apiClient.get('/feedback/public')
  return data
}

export const getAboutOverview = async () => {
  const { data } = await apiClient.get('/about/overview')
  return data
}

export const submitFeedback = async (payload) => {
  const { data } = await apiClient.post('/feedback', payload)
  return data
}

export const getAdminFeedback = async (params = {}) => {
  const { data } = await apiClient.get('/admin/feedback', { params })
  return data
}

export const getFeedbackDetails = async (id) => {
  const { data } = await apiClient.get(`/admin/feedback/${id}`)
  return data
}

export const updateFeedback = async (id, payload) => {
  const { data } = await apiClient.patch(`/admin/feedback/${id}`, payload)
  return data
}

export const deleteFeedback = async (id) => {
  const { data } = await apiClient.delete(`/admin/feedback/${id}`)
  return data
}
