
<template>
  <nav class="mobile-nav">
    <router-link to="/" class="nav-item">
      <i class="icon">🏠</i>
      <span class="label">Inicio</span>
    </router-link>

    <router-link 
        v-show="authStore.isAuthenticated" 
        to="/eventos" class="nav-item">
      <i class="icon">📅</i>
      <span class="label">Eventos</span>
    </router-link>

    <router-link 
        v-show="authStore.isAuthenticated" 
        to="/logs" class="nav-item">
      <i class="icon">📄</i>
      <span class="label">Logs</span>
    </router-link>

    <template v-if="authStore.isAuthenticated">
      <div @click="authStore.logout" class="nav-item">
        <i class="icon">🚪</i>
        <span>Salir</span>
      </div>
    </template>
    <template v-else>
      <router-link to="/login" class="nav-item">
        <i class="icon">🔑</i>
        <span class="label">Iniciar sesiòn</span>
      </router-link>
    </template>
  </nav>
</template>

<script setup>
// Importa RouterLink si no usas un setup global para el router
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
const authStore = useAuthStore();
// Opcional: Puedes usar lógica de Pinia o props para mostrar contadores de notificaciones
</script>

<style scoped>
/* ---------------------------------------------------- */
/* 1. MOBILE-FIRST: Estilos base para la barra inferior */
/* ---------------------------------------------------- */
.mobile-nav {
  /* Fija la barra en la parte inferior de la ventana */

  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 55px; /* Altura estándar para barra de navegación inferior */
  background-color: var(--color-background);
  color: var(--color-text);
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  display: flex;
  justify-content: space-around; /* Distribuye uniformemente los enlaces */
  align-items: center;
}

.nav-item {
  flex: 1; /* Permite que cada ítem ocupe el mismo espacio */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  padding: 5px 0;
  color: var(--color-text);
  transition: color 0.2s;
}

.icon {
  font-size: 1.2em; /* Tamaño del icono (emojis o iconos) */
  line-height: 1; /* Asegura que el icono no añada espacio extra */
  margin-bottom: 2px;
}

.label {
  font-size: 0.65em; /* Letra pequeña para el label */
  font-weight: 500;
  text-transform: uppercase;
}

/* Estilo para el ítem activo */
.router-link-active,
.nav-item:hover {
  color: var(--color-text);
  font-weight: bold; /* Aquí sí lo dejamos fijo */
  border-bottom: 2px solid var(--color-text); /* Refuerzo visual */
}

/* --- Estilo Específico para un Botón de Acción Central (Opcional) --- */
.nav-center-action {
  position: relative;
  /* Ajuste para levantar el icono central si es necesario */
  transform: translateY(-5px);
}

.nav-center-action .icon {
  font-size: 1.5em;
  color: white;
  background-color: #3f51b5;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* El label debe ir abajo del botón flotante */
  transform: translateY(5px);
}

/* ---------------------------------------------------- */
/* 2. DESKTOP: Ocultar la barra móvil en pantallas grandes */
/* ---------------------------------------------------- */
@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}
</style>