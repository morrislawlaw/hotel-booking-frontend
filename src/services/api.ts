import axios from 'axios'

const api = axios.create({
  baseURL: 'http://124.244.80.213:8001/api',   // ← Change to your actual port
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api