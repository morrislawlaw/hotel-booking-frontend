import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // Read existing session state from browser storage on load
  const token = ref<string | null>(localStorage.getItem('authToken'))
  const userEmail = ref<string | null>(localStorage.getItem('userEmail'))

  // Computed state getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions to manage state mutations
  function setToken(newToken: string, email: string) {
    token.value = newToken
    userEmail.value = email
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('userEmail', email)
  }

  function logout() {
    token.value = null
    userEmail.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
  }

  return {
    token,
    userEmail,
    isAuthenticated,
    setToken,
    logout
  }
})
  