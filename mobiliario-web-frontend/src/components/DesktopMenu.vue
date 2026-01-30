<template>
  <nav class="desktop-menu">
    <div class="menu-container">
      <router-link to="/" class="brand-logo">
        <span class="app-name">Casa Gaby Mobiliario</span>
      </router-link>

      <div class="main-links">
        <router-link 
          v-show="authStore.isAuthenticated"
          to="/eventos" class="nav-item">Eventos</router-link>
        <router-link 
          v-show="authStore.isAuthenticated"
          to="/logs" class="nav-item">Logs</router-link>
        <router-link to="/cotizar" class="nav-item">Cotizaci&oacute;n</router-link>
      </div>


      <div class="user-actions">
        <template v-if="authStore.isAuthenticated">
          <div class="info-user">
            <div>{{ authStore.user.name }}</div>
            <div>{{ authStore.user.position }}</div>
          </div>
          <button @click="authStore.logout" class="btn-cancel-form">Cerrar Sesión</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
// Importa RouterLink si no usas un setup global para el router
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
</script>

<style scoped>
/* ---------------------------------------------------- */
/* 1. MOBILE-FIRST: Ocultar el menú de escritorio por defecto */
/* ---------------------------------------------------- */
.desktop-menu {
  display: none;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

/* ---------------------------------------------------- */
/* 2. DESKTOP: Mostrar y estilizar a partir de 768px */
/* ---------------------------------------------------- */
@media (min-width: 768px) {
  .desktop-menu {
    display: block; /* Muestra el menú en escritorio */
    height: 60px;
  }

  /* Contenedor principal para centrar y distribuir */
  .menu-container {
    max-width: 1200px; /* Limita el ancho en monitores grandes */
    margin: 0 auto; /* Centra el menú horizontalmente */
    height: 100%;

    display: flex;
    justify-content: space-between; /* Distribuye el espacio entre bloques */
    align-items: center; /* Centra verticalmente todos los elementos */
    padding: 0 20px;
  }

  /* --- Logo / Marca --- */
  .brand-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #3f51b5;
    font-size: 1.5em;
    font-weight: bold;
  }

  .logo-img {
    height: 30px;
    margin-right: 10px;
  }

  /* --- Enlaces Centrales --- */
  .main-links {
    display: flex;
    gap: 30px; /* Espacio entre los enlaces */
    flex-grow: 1; /* Permite que tome el espacio central */
    justify-content: center; /* Centra los enlaces dentro del espacio central */
  }

  .nav-item {
    text-decoration: none;
    color: #333;
    padding: 5px 10px;
    transition: color 0.2s;
  }

  .nav-item:hover, .router-link-active {
    color: #3f51b5;
    border-bottom: 2px solid #3f51b5;
  }

  /* --- Acciones de Usuario --- */
  .user-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }


}
</style>