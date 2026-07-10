import axios from 'axios'
import { useUserStore } from '@/stores/user'


const api = axios.create({
  baseURL: 'https://hotel-api-linux-bdf7g6f3bjf0dwhz.eastasia-01.azurewebsites.net/api',   // ← Azure App Service as API 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Automatically inject JWT Bearer Tokens into all outgoing traffic
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


export default api