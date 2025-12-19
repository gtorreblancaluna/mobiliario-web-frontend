<template>
  <Transition name="modal-fade">
    <div v-if="errorStore.isVisible" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-header">
          <span class="error-icon" :class="{ 'error-500': isServerError, 'error-400': isClientError }">
            {{ isServerError ? '🚨' : '⚠️' }}
          </span>
          <h3 class="modal-title">{{ errorStore.title }}</h3>
        </div>

        <div class="modal-body">
          <p>{{ errorStore.message }}</p>
          <small v-if="isServerError">Código: {{ errorStore.statusCode }}. Estamos trabajando para resolverlo.</small>
        </div>

        <div class="modal-footer">
          <button class="btn-primary" @click="closeModal">Aceptar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { useErrorStore } from '@/stores/ErrorStore';

const errorStore = useErrorStore();

// Propiedades computadas para la lógica visual
const isServerError = computed(() => errorStore.statusCode >= 500);
const isClientError = computed(() => errorStore.statusCode >= 400 && errorStore.statusCode < 500);

function closeModal() {
  errorStore.clearError();
}
</script>

<style scoped>
/* ---------------------------------------------------- */
/* Base del Modal */
/* ---------------------------------------------------- */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-dialog {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
}

/* ---------------------------------------------------- */
/* Contenido y Estilos */
/* ---------------------------------------------------- */
.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.error-icon {
  font-size: 1.8em;
  margin-right: 15px;
}

.modal-title {
  margin: 0;
  color: #c0392b; /* Rojo para el título de error */
}

.modal-body {
  padding: 10px 0;
  line-height: 1.5;
}

.modal-body p {
  margin-bottom: 10px;
}

small {
  display: block;
  color: #888;
  font-size: 0.8em;
}

.modal-footer {
  padding-top: 15px;
  text-align: right;
}

.btn-primary {
  background-color: #c0392b;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* ---------------------------------------------------- */
/* Animaciones (Opcional) */
/* ---------------------------------------------------- */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
</style>