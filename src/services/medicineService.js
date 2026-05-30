import apiClient from './apiClient'

export const getAllMedicines = async ({
  name,
  category,
  governorate,
  pharmacy_id,
  stock,
  sort,
  page,
} = {}) => {
  const { data } = await apiClient.post('/get-all-medicines', {
    name: name || undefined,
    category: category || undefined,
    governorate: governorate || undefined,
    pharmacy_id: pharmacy_id || undefined,
    stock: stock || undefined,
    sort: sort || undefined,
    page: page || undefined,
  })

  return data
}

