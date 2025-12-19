<template>
  <div class="login-page-container">

    <form @submit.prevent="handleLogin" class="login-form">

      <h2 class="form-title">👋  Iniciar Sesión</h2>

      <div class="input-group">
        <label for="username">Nombre de Usuario</label>
        <input
            id="username"
            type="text"
            v-model="username"
            placeholder="Tu nombre de usuario o email"
            required
            autocomplete="username"
        />
      </div>

      <div class="input-group">
        <label for="password">Contraseña</label>
        <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Contraseña"
            required
            autocomplete="current-password"
        />
      </div>

      <button
          type="submit"
          :disabled="isLoading"
          class="btn-form"
      >
        {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
      </button>

      <p v-if="error" class="error-message">{{ error }}</p>

      <div class="form-footer">
        <router-link to="/forgot-password" class="forgot-link">¿Olvidaste tu contraseña?</router-link>
      </div>
    </form>

  </div>
</template>

<script setup>
// ... (Tu lógica de script setup permanece igual)
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.ts';

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const credentials = { username: username.value, password: password.value };
    await authStore.login(credentials);

    // Sugerencia: Normalmente, con Vue Router no necesitas forzar la recarga
    // completa del navegador. La redirección es suficiente.
    await router.push('/');

  } catch (err) {
    console.error(err);
    // Mejora de UX: Si err.response.data.message existe, úsalo
    error.value = err.response?.data?.message || 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* ---------------------------------------------------- */
/* 1. MOBILE-FIRST (Menos de 768px) */
/* ---------------------------------------------------- */
.login-page-container {
  min-height: 100vh; /* Ocupa toda la altura de la vista */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Alinea arriba en móvil para no ocultarse con el teclado */
  padding: 40px 20px;
  background-color: #f4f7f6; /* Fondo ligero */
}

.login-form {
  width: 100%;
  max-width: 400px; /* Ancho máximo para el formulario en sí */
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

/* --- Grupos de Input --- */
.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
  font-size: 0.9em;
}


/* --- Mensaje de Error --- */
.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
}

/* --- Footer --- */
.form-footer {
  text-align: center;
  margin-top: 20px;
}

.forgot-link {
  color: #007bff;
  text-decoration: none;
  font-size: 0.9em;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* ---------------------------------------------------- */
/* 2. DESKTOP/TABLET GRANDE (Más de 768px) */
/* ---------------------------------------------------- */
@media (min-width: 768px) {
  .login-page-container {
    /* En escritorio, centramos el formulario verticalmente */
    align-items: center;
    padding: 20px;
  }

  .login-form {
    /* Añadir un poco más de sombra o elevación para una apariencia de tarjeta */
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    padding: 40px;
  }
}
</style>