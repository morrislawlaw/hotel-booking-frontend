import axios from 'axios'
import { useUserStore } from '@/stores/user'

// const api = axios.create({
//   baseURL: 'https://www.488865.xyz/api',   // ← Cloudflare tunnel of local IIS port 
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

const api = axios.create({
  baseURL: 'https://hotelapi-f5bdebbke6eceyfg.southeastasia-01.azurewebsites.net/api',   // ← Azure App Service as API 
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


// // Automatically add Authorization header
// api.interceptors.request.use((config) => {
//   const userStore = useUserStore()
//   if (userStore.token) {
//     config.headers.Authorization = `Bearer ${userStore.token}`
//   }
//   return config
// })

export default api