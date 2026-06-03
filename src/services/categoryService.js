import apiClient from './apiClient'

export const listCategories = async ({ activeOnly = true, withCounts = false } = {}) => {
  const { data } = await apiClient.get('/categories', {
    params: {
      active_only: activeOnly ? 1 : 0,
      with_counts: withCounts ? 1 : 0,
    },
  })

  return data?.data ?? data ?? []
}

export const listCategoryFilters = async (params = {}) => {
  const { data } = await apiClient.get('/categories/filters', { params })

  return data?.data ?? data ?? []
}

export const listMedicineExchangeCategories = async () => {
  const { data } = await apiClient.get('/categories/medicine-exchange')

  return data?.data ?? data ?? []
}
