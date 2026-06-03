import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// export const useUserStore = defineStore('user', () => {
//   const currentUser = ref({
//     customerId: 1,
//     name: "John Smith",
//     email: "john.smith@email.com"
//   })
// const isLoggedIn = ref(true)   // Set to false when you implement real auth

//   const token = ref(localStorage.getItem('authToken') || '')

//   const setToken = (newToken: string) => {
//     token.value = newToken
//     localStorage.setItem('authToken', newToken)
//   }

//   const switchUser = (customerId: number, name: string, email: string) => {
//     currentUser.value = { customerId, name, email }
//     console.log(`🔄 Switched to user: ${name} (ID: ${customerId})`)
//   }

//   return { currentUser, token, setToken, isLoggedIn, switchUser }
// })

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
  