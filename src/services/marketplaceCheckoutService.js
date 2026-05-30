import apiClient from './apiClient'

export const marketplaceCheckout = async (payload) => {
  const { data } = await apiClient.post('/marketplace/checkout', payload)
  return data
}

