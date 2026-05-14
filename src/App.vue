<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>