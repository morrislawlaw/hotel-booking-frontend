import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Find Your Perfect Stay' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Sign In' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { title: 'Create an Account' }
    },
    {
      path: '/hotels',
      name: 'hotels',
      component: () => import('@/views/HotelsView.vue'),
      meta: { title: 'Available Properties' }
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
      meta: { title: 'My Bookings', requiresAuth: true }
      
    },
    {
      path: '/booking-confirmation',
      name: 'booking-confirmation',
      component: () => import('@/views/BookingConfirmationView.vue'),
      meta: { title: 'Booking Confirmation' }
    },
    {
      path: '/booking-detail/:id',
      name: 'booking-detail',
      component: () => import('@/views/BookingDetailView.vue'), // we'll create later if needed
      meta: { title: 'Booking Details' }
    },
    {
      path: '/auth/google-callback',
      name: 'google-callback',
      component: () => import('@/views/GoogleCallbackView.vue'),
      meta: { title: 'Google Callback' }
    }
  ]
})

// Navigation Guard: Intercept routing attempts before they render
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const baseTitle = 'HotelBook'
  const pageTitle = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Update the actual DOM title property
  document.title = pageTitle
    // Redirect unauthenticated users back to the sign-in form
    next('/login')
  } else {
    // Update the actual DOM title property
  document.title = pageTitle
    next()
  }
})

export default router