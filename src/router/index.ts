import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
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
      component: () => import('@/views/MyBookingsView.vue')
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
    }
  ]
})

export default router