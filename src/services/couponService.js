import apiClient from './apiClient'

export const getMyCoupons = async () => {
  const { data } = await apiClient.get('/citizen/coupons')
  return data
}

export const getCouponHistory = async () => {
  const { data } = await apiClient.get('/citizen/coupons/history')
  return data
}
