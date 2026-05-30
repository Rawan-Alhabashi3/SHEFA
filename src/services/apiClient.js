import axios from 'axios'
import { getLanguage, LANGUAGE_STORAGE_KEY } from '../i18n'

const AUTH_STORAGE_KEY = 'shifa_auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  const language = getLanguage() || localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'ar'
  config.headers['Accept-Language'] = language
  config.headers['X-Locale'] = language
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    const auth = raw ? JSON.parse(raw) : null
    const token = auth?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // ignore parsing errors
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
