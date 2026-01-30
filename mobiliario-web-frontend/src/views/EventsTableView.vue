<template>
  <div class="events-page-container">
    <h1 class="page-title">📅 Eventos</h1>


    <div class="filter-wrapper">
      <button @click="showFilters = !showFilters" class="btn-toggle">
        {{ showFilters ? '❌ Cerrar filtros' : '🔍 Mostrar filtros' }}
      </button>
      <transition name="fade-slide">
        <div v-if="showFilters" class="filter-container">

          <div class="filter-card">
            <div class="filter-field">
              <label>Desde
                <input type="date" v-model="filter.initDate" />
              </label>
            </div>

            <div class="filter-field">
              <label>Hasta
                <input type="date" v-model="filter.endDate" />
              </label>
            </div>

            <button @click="fetchEvents" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading">Filtrar</span>
              <span v-else class="spinner"></span>
            </button>
          </div>
        </div>
      </transition>
    </div>

    <div v-if="events.length" class="filter-container">
      <div class="filter-field">
        <input
            v-model="textToSearch"
            @input="applyFilter"
            type="text"
            placeholder="🔍 Buscar ..." class="native-input">
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">Cargando eventos...</div>
    <div v-else-if="error" class="error-state">Error: {{ error }}</div>

    <div v-else-if="events.length" class="events-wrapper">

      <div class="event-list-mobile">
        <div v-for="event in eventsFiltrados" :key="event.id" class="mobile-card">
          <div class="card-header">
            <h2 class="event-title">{{ event.clienteNombre }}</h2>
            <span class="event-tag">{{ event.tipo }} - {{ event.estadoDescription }}</span>
          </div>
          <p class="event-detail"><strong>Folio:</strong>{{ event.folio }}</p>
          <p class="event-detail"><strong>Fecha entrega:</strong> {{ event.fechaEntrega }} hora: {{ event.horaEntrega }}</p>
          <p class="event-detail"><strong>Direcci&oacute;n:</strong> {{ event.descripcion }}</p>
          <router-link
              :to="{ name: 'DetailEventView', params: { id: event.id } }"
              class="details-link">Ver detalles</router-link>
        </div>
      </div>

      <table class="event-table-desktop">
        <thead>
        <tr>
          <th>Folio</th>
          <th>Cliente</th>
          <th>Fecha entrega</th>
          <th>Hora</th>
          <th>Direcci&oacute;n</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="event in eventsFiltrados" :key="event.id">
          <td data-label="Folio">{{ event.folio }}</td>
          <td data-label="Cliente">{{ event.clienteNombre }}</td>
          <td data-label="Fecha entrega">{{ event.fechaEntrega }}</td>
          <td data-label="Hora entrega">{{ event.horaEntrega }}</td>
          <td data-label="Direcci&oacute;n">{{ event.descripcion }}</td>
          <td data-label="Tipo">{{ event.tipo }}</td>
          <td data-label="Estado">{{ event.estadoDescription }}</td>
          <td data-label="Acciones">
            <router-link :to="{ name: 'DetailEventView', params: { id: event.id } }" class="table-link">Detalles</router-link>
          </td>
        </tr>
        </tbody>
      </table>

    </div>

    <div v-else class="empty-state">No hay eventos programados.</div>
  </div>
</template>

<script setup>
import {onMounted, ref,reactive} from 'vue';
import RentaService from '@/services/RentaService';

// Definición de tipos de datos (simulada)
const textToSearch = ref('');
const events = ref([]);
const eventsFiltrados = ref([]);
const isLoading = ref(false);
const error = ref(null);
const showFilters = ref(false);

const formatToBackend = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

// Estado para los filtros de fecha
const filter = reactive({
  initDate: null,
  endDate: null
});

const applyFilter = () => {

  const search = String(textToSearch.value || "").toLowerCase();

// 2. Aplicamos el filtro (Stream)
  eventsFiltrados.value = events.value.filter(evento => {
    // Convertimos cada campo a String por seguridad (evita errores con IDs o nulos)
    const nombre = String(evento.clienteNombre || "").toLowerCase();
    const folio = String(evento.folio || "").toLowerCase();
    const descripcion = String(evento.descripcion || "").toLowerCase();

    // Retorna true si el texto está en cualquiera de los campos
    return nombre.includes(search) ||
        folio.includes(search) ||
        descripcion.includes(search);
  });
};


const fetchEvents = async () => {
  isLoading.value = true;
  error.value = null;
  events.value = [];
  try {
    const result = await RentaService.getRentas({
      initFechaEntrega: formatToBackend(filter.initDate),
      endFechaEntrega: formatToBackend(filter.endDate)
    });

    eventsFiltrados.value = result;
    events.value = result;

  } catch (err) {
    error.value = 'Error al cargar los eventos.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
/* ---------------------------------------------------- */
/* 1. MOBILE-FIRST (Estilos para la vista de bloques/tarjetas) */
/* ---------------------------------------------------- */





/* Estilos base del contenedor */
.filter-container {
  overflow: hidden; /* Evita saltos visuales durante la animación */
}

.filter-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.filter-container {
  padding: 1rem;
  width: 100%;
}

.filter-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  /* En móvil, los elementos van uno debajo del otro */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}



.btn-submit {
  width: 100%; /* Botón grande y fácil de tocar en móvil */
  padding: 0.9rem;
  background-color: var(--primary-color);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

/* Animación de carga (opcional) */
.loader {
  width: 18px;
  height: 18px;
  border: 2px solid #ffffff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.events-page-container {
  padding: 20px 15px;
  background-color: #f8f8f8;
}

.page-title {
  font-size: 1.8em;
  text-align: center;
  margin-bottom: 25px;
}

/* --- Estilos de la Tarjeta Móvil --- */
.event-list-mobile {
  display: block; /* Visible por defecto en móvil */
}

.mobile-card {
  background: white;
  border: 1px solid #ddd;
  border-left: 5px solid var(--color-button); /* Tira de color para destacar */
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.event-title {
  font-size: 1.1em;
  color: #333;
  margin: 0;
}

.event-tag {
  background-color: var(--primary-color);
  color: white;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 0.7em;
  font-weight: bold;
}

.event-detail {
  font-size: 0.9em;
  color: #555;
  margin: 5px 0;
}

.event-detail strong {
  font-weight: bold;
}

.details-link {
  display: block;
  text-align: right;
  margin-top: 10px;
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
}

/* --- Ocultar la tabla tradicional en móvil --- */
.event-table-desktop {
  display: none;
}


/* ---------------------------------------------------- */
/* 2. DESKTOP (Aplicar diseño de tabla) */
/* ---------------------------------------------------- */
@media (min-width: 768px) {

  .filter-card {
    flex-direction: row; /* Alineación horizontal */
    align-items: flex-end;
    padding: 1.5rem;
  }



  .btn-submit {
    width: auto; /* El botón solo ocupa lo necesario */
    padding: 0.75rem 2rem;
    margin-top: 0;
  }

  /* --- Mostrar la tabla y ocultar los bloques móviles --- */
  .event-list-mobile {
    display: none;
  }

  .event-table-desktop {
    display: table;
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: var(--primary-color);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85em;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  /* Asegurar que las etiquetas de datos móviles no se muestren en desktop */
  td[data-label]::before {
    content: none;
  }

  .table-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
  }
}

/* ---------------------------------------------------- */
/* Estilos Comunes (Carga/Error) */
/* ---------------------------------------------------- */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #555;
}
</style>