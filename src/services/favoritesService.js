import apiClient from './apiClient'

export const getFavorites = async () => {
  const { data } = await apiClient.get('/favorites')
  return data
}

export const addFavorite = async (medicineId) => {
  const { data } = await apiClient.post(`/favorites/${medicineId}`)
  return data
}

export const removeFavorite = async (medicineId) => {
  const { data } = await apiClient.delete(`/favorites/${medicineId}`)
  return data
}
