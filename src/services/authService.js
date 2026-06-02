import apiClient from './apiClient'

export const loginRequest = async (payload) => {
  const { data } = await apiClient.post('/login', payload)
  return data
}

export const registerRequest = async (payload) => {
  const { data } = await apiClient.post('/register', payload, {
    headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  })
  return data
}

export const logoutRequest = async (token) => {
  const { data } = await apiClient.post(
    '/logout',
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return data
}

export const getMyProfileRequest = async (token) => {
  const { data } = await apiClient.get('/get-my-profile', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}
