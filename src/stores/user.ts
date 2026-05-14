import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({
    customerId: 1,
    name: "John Smith",
    email: "john.smith@email.com"
  })

  const isLoggedIn = ref(true)   // Set to false when you implement real auth

  const switchUser = (customerId: number, name: string, email: string) => {
    currentUser.value = { customerId, name, email }
    console.log(`🔄 Switched to user: ${name} (ID: ${customerId})`)
  }

  return { currentUser, isLoggedIn, switchUser }
})