import apiClient from './apiClient'

export const createOrderForPharmacist = async (payload) => {
  const { data } = await apiClient.post('/create-order-for-pharmacist', payload)
  return data
}

export const getMyOrderHistory = async (payload = {}) => {
  const { data } = await apiClient.post('/get-my-order-history', payload)
  return data
}
