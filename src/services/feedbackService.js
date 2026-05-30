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
