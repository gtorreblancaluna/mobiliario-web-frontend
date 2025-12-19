<template>
  <button @click="handleLogout" class="logout-btn">
    Cerrar Sesión
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js'; // Ajusta la ruta a tu store

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  // 1. Opcional: Mostrar un mensaje de confirmación al usuario
  if (!confirm('¿Estás seguro que quieres cerrar sesión?')) {
    return;
  }

  try {
    // 2. Ejecutar la lógica de logout (limpieza local y notificación al backend)
    await authStore.logout();

    // 3. Redirigir al usuario a la página de login
    router.push({ name: 'Login' });

  } catch (error) {
    // Manejar errores de revocación de token en el backend (si aplica)
    console.error("Error al cerrar sesión o al revocar el token:", error);
    // Si la revocación falla, aún debemos redirigir al usuario
    router.push({ name: 'Login' });
  }
};
</script>

<style scoped>
.logout-btn {
  padding: 8px 15px;
  background-color: #dc3545; /* Color rojo para destacar la acción */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>