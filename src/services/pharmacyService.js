import apiClient from './apiClient'

export const listMarketplacePharmacies = async ({ governorate, area, search, sort, page, per_page } = {}) => {
  const { data } = await apiClient.get('/marketplace/pharmacies', {
    params: {
      governorate: governorate || undefined,
      area: area || undefined,
      search: search || undefined,
      sort: sort || undefined,
      page: page || undefined,
      per_page: per_page || undefined,
    },
  })
  return data
}

export const listMarketplaceRewardCampaigns = async ({ governorate, area, search, sort, page, per_page } = {}) => {
  const { data } = await apiClient.get('/marketplace/reward-campaigns', {
    params: {
      governorate: governorate || undefined,
      area: area || undefined,
      search: search || undefined,
      sort: sort || undefined,
      page: page || undefined,
      per_page: per_page || undefined,
    },
  })
  return data
}

export const getMarketplacePharmacy = async (pharmacyId, { search, category, stock, sort, page, per_page } = {}) => {
  const { data } = await apiClient.get(`/marketplace/pharmacies/${pharmacyId}`, {
    params: {
      search: search || undefined,
      category: category || undefined,
      stock: stock || undefined,
      sort: sort || undefined,
      page: page || undefined,
      per_page: per_page || undefined,
    },
  })
  return data
}

export const getPharmacyAnalytics = async () => {
  const { data } = await apiClient.get('/pharmacy/dashboard-analytics')
  return data
}

export const getMyInventory = async ({ search, category } = {}) => {
  const { data } = await apiClient.get('/get-my-inventory', {
    params: { search: search || undefined, category: category || undefined },
  })
  return data
}

export const addMedicine = async (payload) => {
  const { data } = await apiClient.post('/add-medicine', payload)
  return data
}

export const updateMedicine = async (payload) => {
  const { data } = await apiClient.post('/update-medicine', payload)
  return data
}

export const deleteMedicine = async (payload) => {
  const { data } = await apiClient.post('/delete-medicine', payload)
  return data
}

export const getMyOrders = async () => {
  const { data } = await apiClient.get('/get-my-orders')
  return data
}

export const acceptOrder = async ({ order_id }) => {
  const { data } = await apiClient.post('/accept-order', { order_id })
  return data
}

export const markOrderReadyForPickup = async ({ order_id }) => {
  const { data } = await apiClient.post('/ready-for-pickup', { order_id })
  return data
}

export const rejectOrder = async ({ order_id }) => {
  const { data } = await apiClient.post('/reject-order', { order_id })
  return data
}

export const getPharmacyReviews = async () => {
  const { data } = await apiClient.get('/get-pharmacy-reviews')
  return data
}

export const listPharmacyCouponCampaigns = async (params = {}) => {
  const { data } = await apiClient.get('/pharmacy/coupon-campaigns', { params })
  return data
}

export const getPharmacyCouponCampaignAnalytics = async () => {
  const { data } = await apiClient.get('/pharmacy/coupon-campaigns/analytics')
  return data
}

export const listPharmacyIssuedCoupons = async (params = {}) => {
  const { data } = await apiClient.get('/pharmacy/coupon-campaigns/issued-coupons', { params })
  return data
}

export const createPharmacyCouponCampaign = async (payload) => {
  const { data } = await apiClient.post('/pharmacy/coupon-campaigns', payload)
  return data
}

export const updatePharmacyCouponCampaign = async (campaignId, payload) => {
  const { data } = await apiClient.post(`/pharmacy/coupon-campaigns/${campaignId}`, payload)
  return data
}

export const deletePharmacyCouponCampaign = async (campaignId) => {
  const { data } = await apiClient.delete(`/pharmacy/coupon-campaigns/${campaignId}`)
  return data
}

export const togglePharmacyCouponCampaign = async (campaignId) => {
  const { data } = await apiClient.post(`/pharmacy/coupon-campaigns/${campaignId}/toggle`)
  return data
}

export const listPharmacyCouponCampaignCategories = async () => {
  const { data } = await apiClient.get('/pharmacy/coupon-campaigns/categories')
  return data
}

export const downloadMedicineImportTemplate = async () => {
  const response = await apiClient.get('/medicines/bulk-import/template', {
    responseType: 'blob'
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'medicines_import_template.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const previewMedicineImport = async (zipFile) => {
  const formData = new FormData()
  formData.append('zip_file', zipFile)
  formData.append('preview_only', '1')
  const { data } = await apiClient.post('/medicines/bulk-import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export const executeMedicineImport = async (zipFile) => {
  const formData = new FormData()
  formData.append('zip_file', zipFile)
  const { data } = await apiClient.post('/medicines/bulk-import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}
