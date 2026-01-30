<script setup lang="ts">

import DesktopMenu from './components/DesktopMenu.vue';
import MobileNav  from "./components/MobileNav.vue";
import ErrorModal from './components/ErrorModal.vue';
import { RouterView } from 'vue-router'
import { ref } from 'vue';

import { useAuthStore } from '@/stores/auth.js';
const authStore = useAuthStore();


const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <div id="app-container">
    <header class="app-header">

      <nav class="nav-bar">
        <DesktopMenu class="hidden-mobile" />
        <MobileNav class="visible-mobile" />
        <template v-if="authStore.isAuthenticated && authStore.user">
          <div class="info-user-mobile hidden-desktop">
            <div>{{ authStore.user.name }}</div>
            <div>{{ authStore.user.position }}</div>
          </div>
        </template>
      </nav>


    </header>

    <main class="app-content">
      <RouterView />
      <ErrorModal />
      <hr />
    </main>

  </div>
</template>

<style lang="css" src="./assets/main.css"></style>