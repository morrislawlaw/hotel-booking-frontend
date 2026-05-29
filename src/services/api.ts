import axios from 'axios'

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
})

export default api