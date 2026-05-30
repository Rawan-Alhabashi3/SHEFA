import apiClient from './apiClient'

export const getHomeOverview = async (params = {}) => {
  const { data } = await apiClient.get('/home/overview', { params })
  return data
}
