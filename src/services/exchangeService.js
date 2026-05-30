import apiClient from './apiClient'

export const getCommunityMedicines = async (params = {}) => {
  const { data } = await apiClient.get('/community-medicines', { params })
  return data
}

export const createExchangeListing = async (payload) => {
  const { data } = await apiClient.post('/create-ad', payload, {
    headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  })
  return data
}

export const contactExchangePharmacy = async (ad_id) => {
  const { data } = await apiClient.post('/community-medicines/contact-pharmacy', { ad_id })
  return data
}

export const getMyExchangeListings = async () => {
  const { data } = await apiClient.get('/get-all-my-ads')
  return data
}

export const deletePendingExchangeListing = async (ad_id) => {
  const { data } = await apiClient.post('/delete-pending-ad', { ad_id })
  return data
}

export const getPharmacyExchangeRequests = async () => {
  const { data } = await apiClient.get('/pharmacy/exchange-requests')
  return data
}

export const approvePharmacyExchangeRequest = async ({ request_id, notes }) => {
  const { data } = await apiClient.post('/pharmacy/exchange-requests/approve', { request_id, notes })
  return data
}

export const rejectPharmacyExchangeRequest = async ({ request_id, notes }) => {
  const { data } = await apiClient.post('/pharmacy/exchange-requests/reject', { request_id, notes })
  return data
}

export const markExchangeReceived = async (ad_id) => {
  const { data } = await apiClient.post('/pharmacy/exchange-requests/received', { ad_id })
  return data
}

export const completeExchangeListing = async (ad_id) => {
  const { data } = await apiClient.post('/pharmacy/exchange-requests/complete', { ad_id })
  return data
}
