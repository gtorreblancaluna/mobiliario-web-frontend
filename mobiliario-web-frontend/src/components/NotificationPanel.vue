<template>
  <div class="log-container">
    <h3>Mensajes del Sistema</h3>
    <ul class="log-list">
      <li style="white-space: pre-wrap;" v-for="(msg, index) in messages" :key="index" class="log-item">
        {{ msg }}
      </li>
    </ul>
    <p v-if="messages.length === 0" class="empty-msg">Esperando mensajes...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MessageStorageService from '@/services/MessageStorageService.ts';

const messages = ref([]);
let intervalId = null;

const fetchLogs = async () => {
  try {
    const response = await MessageStorageService.getLogs();
    messages.value = response.reverse(); // Últimos mensajes arriba
  } catch (error) {
    console.error("Error obteniendo logs:", error);
  }
};

onMounted(() => {
  fetchLogs();
  // Refrescar cada 3 segundos
  intervalId = setInterval(fetchLogs, 3000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
/* Celular (Estilo base) */
.log-container {
  padding: 12px;
  background: #1e1e1e;
  color: #00ff00;
  font-family: 'Consolas', 'Monaco', monospace;
  border-radius: 8px;
  /* Usamos vh (viewport height) para que en móvil no tape toda la pantalla */
  max-height: 60vh; 
  overflow-y: auto;
  margin: 10px;
  border: 1px solid #333;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #adbac7;
  border-bottom: 1px solid #444;
  padding-bottom: 5px;
}

.log-list {
  padding: 0;
  margin: 0;
}

.log-item {
  list-style: none;
  border-bottom: 1px solid #2d2d2d;
  padding: 8px 0;
  font-size: 13px; /* Tamaño legible en móvil */
  line-height: 1.4;
  /* Crucial para respetar saltos de línea sin romper el diseño */
  white-space: pre-wrap; 
  word-wrap: break-word; 
  overflow-wrap: break-word;
}

.empty-msg {
  font-style: italic;
  font-size: 0.9rem;
  color: #666;
}

/* Escritorio (Pantallas mayores a 768px) */
@media (min-width: 768px) {
  .log-container {
    max-height: 800px;
    padding: 20px;
    margin: 20px auto;
    max-width: 90%; /* Para que no pegue a los bordes en monitores grandes */
  }

  .log-item {
    font-size: 14px;
    padding: 5px 0;
  }
}
</style>