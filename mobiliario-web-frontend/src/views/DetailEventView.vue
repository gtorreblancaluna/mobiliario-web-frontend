<template>
  <div class="detalle-container">
    <button @click="$router.back()" class="btn-back">
      ⬅ Volver
    </button>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando detalles del evento...</p>
    </div>

    <div v-else-if="event" class="detalle-card">
      <header class="detalle-header">
        <h1>Folio: {{ event.folio }}</h1>
        <span class="status-badge" :class="event.estadoDescription.toLowerCase()">
          {{ event.tipo }} - {{ event.estadoDescription }}
        </span>
      </header>

      <section class="detalle-info">
        <div class="info-group">
          <label>📅 Fecha de registro</label>
          <p>{{ event.fechaPedido }}</p>
        </div>

        <div class="info-group">
          <label>📅 Fecha de entrega</label>
          <p>{{ event.fechaEntrega }} / {{ event.horaEntrega }}</p>
        </div>

        <div class="info-group">
          <label>📅 Fecha de devoluc&oacute;n</label>
          <p>{{ event.fechaDevolucion }} / {{ event.horaDevolucion }}</p>
        </div>

        <div class="info-group">
          <label>👤 Cliente</label>
          <p>{{ event.clienteNombre }}</p>
        </div>

        <div class="info-group">
          <label>📍 Ubicación</label>
          <p>{{ event.descripcion || 'No especificada' }}</p>
        </div>
      </section>

      <section class="detalle-articulos">
        <h3><i class="icon">&#128715;</i> Artículos</h3>

        <div class="table-responsive">
          <table class="articulos-table">
            <thead>
            <tr>
              <th>Cantidad</th>
              <th>Descripción</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in event.detail" :key="item.id">
              <td class="col-cantidad">{{ item.amount }}</td>
              <td class="col-desc">{{ item.itemName }}</td>
              <td>${{ item.unitPrice }}</td>
              <td class="col-subtotal">${{ item.subtotal }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer class="detalle-footer">

        <div class="resumen-container">
          <div class="resumen-row">
            <span class="label">Env&iacute;o y recolecci&oacute;n</span>
            <span class="valor">${{ event.envioRecoleccion }}</span>
          </div>

          <div class="resumen-row">
            <span class="label">Descuento aplicado</span>
            <span class="valor descuento">-${{ event.cantidadDescuento }}</span>
          </div>

          <div class="resumen-row">
            <span class="label">Dep&oacute;sito en garant&iacute;a</span>
            <span class="valor">${{ event.depositoGarantia }}</span>
          </div>

          <hr class="divisor">

          <div class="resumen-row total-row">
            <span class="label-total">Total a pagar</span>
            <span class="valor-total">${{ event.total }}</span>
          </div>
        </div>
      </footer>
    </div>

    <div v-else class="error-state">
      <p>No se encontró el evento solicitado.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RentaService from '@/services/RentaService';

const route = useRoute();
const id = route.params.id; // Obtenemos el ID de la URL

const event = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // Llamada a tu API de Spring Boot
    event.value = await RentaService.fetchEventById(id);
  } catch (error) {
    console.error("Error al cargar el detalle:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>

/* Contenedor principal estilo tarjeta */
.resumen-container {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 400px; /* Tamaño ideal para móvil, ajustable */
  margin: 1rem auto;
  border: 1px solid #f1f5f9;
}

/* Filas de información */
.resumen-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.label {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.valor {
  color: #1e293b;
  font-weight: 600;
  font-family: 'Inter', sans-serif; /* O tu fuente de preferencia */
}

/* Color especial para descuentos */
.descuento {
  color: #10b981; /* Verde esmeralda */
}

.divisor {
  border: 0;
  border-top: 1px dashed #e2e8f0;
  margin: 1rem 0;
}

/* Fila de Total destacada */
.total-row {
  margin-bottom: 0;
}

.label-total {
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 700;
}

.valor-total {
  color: #2563eb; /* Azul brillante para el precio final */
  font-size: 1.4rem;
  font-weight: 800;
}

/* --- SECCIÓN DE ARTÍCULOS --- */
.detalle-articulos {
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.detalle-articulos h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Contenedor con scroll para móvil */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.articulos-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 500px; /* Asegura que no se vea apretado en móvil */
}

.articulos-table th {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
}

.articulos-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
}

.col-cantidad {
  font-weight: 700;
  color: #3b82f6;
  text-align: center;
}

.col-desc {
  font-weight: 500;
}

.col-subtotal {
  font-weight: 700;
  text-align: right;
}

/* Quitar borde a la última fila */
.articulos-table tr:last-child td {
  border-bottom: none;
}


/* --- CONTENEDOR PRINCIPAL --- */
.detalle-container {
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1f2937;
}

/* --- NAVEGACIÓN --- */
.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 600;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-back:hover {
  transform: translateX(-5px);
}

/* --- TARJETA PRINCIPAL --- */
.detalle-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #f3f4f6;
}

/* Cabecera de la Tarjeta */
.detalle-header {
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column; /* Móvil: Uno abajo del otro */
  gap: 0.75rem;
}

.detalle-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

/* --- ESTADOS (BADGES) --- */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  width: fit-content;
}

.status-badge.confirmado { background: #dcfce7; color: #15803d; }
.status-badge.pendiente { background: #fef9c3; color: #a16207; }
.status-badge.cancelado { background: #fee2e2; color: #b91c1c; }

/* --- CUERPO DE INFORMACIÓN --- */
.detalle-info {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr; /* Móvil: 1 columna */
  gap: 1.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-group label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: #9ca3af;
}

.info-group p {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: #374151;
}

/* --- FOOTER (PRECIO) --- */
.detalle-footer {
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.total-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-box span {
  font-size: 0.875rem;
  color: #64748b;
}

.total-box .precio {
  font-size: 2rem;
  font-weight: 900;
  color: #059669;
  margin: 0;
}

/* --- ESTADOS DE CARGA Y ERROR --- */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
  text-align: center;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* --- MEDIA QUERIES (DESKTOP) --- */
@media (min-width: 768px) {
  .resumen-container {
    max-width: 100%; /* Se adapta al ancho de su contenedor padre */
    padding: 1.5rem;
  }
  .detalle-articulos {
    padding: 2rem;
  }

  .detalle-header {
    flex-direction: row; /* Alineación horizontal */
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
  }

  .detalle-info {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en escritorio */
    gap: 2rem;
    padding: 2rem;
  }

  .detalle-header h1 {
    font-size: 2rem;
  }
}
</style>