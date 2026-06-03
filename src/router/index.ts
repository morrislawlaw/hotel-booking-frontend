import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/hotels',
      name: 'hotels',
      component: () => import('@/views/HotelsView.vue')
    },
    {
      path: '/hotel/:id',
      name: 'hotel-detail',
      component: () => import('@/views/HotelDetailView.vue')
    },
    {
      path: '/my-bookings',
      name: 'my-bookings',
      component: () => import('@/views/MyBookingsView.vue'),
      // 🔒 This metadata tag flags the route as private
      meta: { requiresAuth: true }
    },
    {
      path: '/booking-confirmation',
      name: 'booking-confirmation',
      component: () => import('@/views/BookingConfirmationView.vue')
    },
    {
      path: '/booking-detail/:id',
      name: 'booking-detail',
      component: () => import('@/views/BookingDetailView.vue')  // we'll create later if needed
    },
    {
      path: '/auth/google-callback',
      name: 'google-callback',
      component: () => import('@/views/GoogleCallbackView.vue')
    }
  ]
})

// Navigation Guard: Intercept routing attempts before they render
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Redirect unauthenticated users back to the sign-in form
    next('/login')
  } else {
    next()
  }
})

export default router