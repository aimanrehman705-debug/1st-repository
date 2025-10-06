import axios from 'axios'
import { getIdToken, onIdTokenChanged } from 'firebase/auth'
import { auth } from './firebase'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

let currentToken: string | null = null

onIdTokenChanged(auth, async (user) => {
  currentToken = user ? await getIdToken(user, true) : null
})

api.interceptors.request.use(async (config) => {
  if (currentToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${currentToken}`
  }
  return config
})

export default api
