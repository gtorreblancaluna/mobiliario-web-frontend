<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Panel Casa Gaby</h1>
      <p>Gestión de Mobiliario y Eventos</p>
    </header>

    <div class="dashboard-grid">

      <div v-if="isIos && !isStandalone" class="ios-install-hint">
        <p>Para instalar en tu iPhone:</p>
        <span>Abre la app en el navegador safari, toca el botón de compartir ⎋ y luego "Agregar a inicio" ➕</span>
      </div>

      <button 
        v-if="installEvent" 
        @click="installPWA" 
        class="dash-card install pulse"
      >
        <div class="icon">📲</div>
        <span>Instalar App</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const installEvent = ref(null);

// Detectar si es iOS
const isIos = computed(() => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
});

// Detectar si ya está abierta como App (Standalone)
const isStandalone = computed(() => {
  return (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches);
});

onMounted(() => {
  // Capturar evento de instalación
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent.value = e;
  });

  window.addEventListener('appinstalled', () => {
    installEvent.value = null;
  });
});

const installPWA = async () => {
  if (!installEvent.value) return;
  installEvent.value.prompt();
  const { outcome } = await installEvent.value.userChoice;
  if (outcome === 'accepted') installEvent.value = null;
};
</script>

<style scoped>

.ios-install-hint {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #34495e;
  text-align: center;
}

.dashboard-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  color: var(--color-text);
  margin-bottom: 5px;
}

.dashboard-header p {
  color: var(--color-text-light);
}

/* Grid mejorado para escritorio y móvil */
.dashboard-grid {
  display: grid;
  /* En escritorio hará columnas de al menos 250px, en móvil usará todo el ancho */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
  gap: 25px;
  margin-top: 20px;
}

/* Ajuste para que los botones no sean tan altos en escritorio */
.dash-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px; /* Más aire arriba y abajo */
  border: none;
  border-radius: 20px; /* Bordes más suaves */
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  min-height: 180px; /* Altura mínima consistente */
}

/* Efecto sutil de elevación */
.dash-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.15);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

/* Colores de marca */
.create { background-color: #3498db; } /* Azul */
.view { background-color: #2c3e50; }   /* Oscuro elegante */
.install { background-color: #4ade80; } /* El verde de tu logo */

/* Animación para resaltar el botón de instalar */
.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% { box-shadow: 0 0 0 0px rgba(74, 222, 128, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0px rgba(74, 222, 128, 0); }
}
</style>