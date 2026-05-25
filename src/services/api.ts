import axios from 'axios'

const api = axios.create({
  baseURL: 'https://www.488865.xyz/api',   // ← Change to your actual port
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api