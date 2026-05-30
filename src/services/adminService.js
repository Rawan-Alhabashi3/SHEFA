import apiClient from './apiClient'

export const getAdminOverview = async () => {
  const { data } = await apiClient.get('/admin/overview')
  return data
}

export const getAdminResourceList = async (resource, params = {}) => {
  const { data } = await apiClient.get(`/admin/resources/${resource}`, { params })
  return data
}

export const createAdminResource = async (resource, payload) => {
  const { data } = await apiClient.post(`/admin/resources/${resource}`, payload)
  return data
}

export const updateAdminResource = async (resource, id, payload) => {
  const { data } = await apiClient.patch(`/admin/resources/${resource}/${id}`, payload)
  return data
}

export const deleteAdminResource = async (resource, id) => {
  const { data } = await apiClient.delete(`/admin/resources/${resource}/${id}`)
  return data
}
