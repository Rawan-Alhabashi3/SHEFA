import apiClient from './apiClient'

export const searchMarketplace = async ({ query, city, signal }) => {
  const { data } = await apiClient.get('/search', {
    params: { q: query, city: city || undefined },
    signal,
  })

  return data
}
