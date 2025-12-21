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

        <div class="articulos-wrapper">
          <table class="articulos-table">
            <thead>
            <tr>
              <th>Cant.</th>
              <th>Descripción</th>
              <th class="right">Importe</th>
              <th class="right">Descuento %</th>
              <th class="right">Subtotal</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in event.detail" :key="item.id">
              <td data-label="Cant." >{{ item.amount }}</td>
              <td data-label="Descripción">{{ item.itemName }}</td>
              <td data-label="Importe" class="col-price">{{ formatCurrency(item.unitPrice) }}</td>
              <td data-label="Descuento porcentaje" class="col-price">{{ item.discountPercentage }}</td>
              <td data-label="Subtotal" class="col-price">{{ formatCurrency(item.subtotal) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer class="detalle-footer">

        <div class="resumen-container">
          <div class="resumen-row">
            <span class="label">Subtotal</span>
            <span class="valor">{{ formatCurrency(event.totals.totalItems) }}</span>
          </div>

          <div class="resumen-row">
            <span class="label">Descuento aplicado</span>
            <span class="valor descuento">{{ formatCurrency(event.totals.totalDiscount) }}</span>
          </div>

          <div class="resumen-row">
            <span class="label">Env&iacute;o y recolecci&oacute;n</span>
            <span class="valor">{{ formatCurrency(event.envioRecoleccion) }}</span>
          </div>

          <div class="resumen-row">
            <span class="label">Dep&oacute;sito en garant&iacute;a</span>
            <span class="valor">{{ formatCurrency(event.depositoGarantia) }}</span>
          </div>

          <div class="resumen-row">
            <span class="label">IVA</span>
            <span class="valor">{{ formatCurrency(event.totals.totalIva) }}</span>
          </div>

          <div class="resumen-row">
            <span class="label">Pagos</span>
            <span class="valor">{{ formatCurrency(event.totals.totalPayments) }}</span>
          </div>

          <hr class="divisor">

          <div class="resumen-row total-row">
            <span class="label-total">Total:</span>
            <span class="valor-total">{{ formatCurrency(event.totals.total) }}</span>
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
import { formatCurrency, formatDate } from '@/utils/formatters';

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
.btn-back:hover { transform: translateX(-5px); }

/* --- TARJETA PRINCIPAL --- */
.detalle-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #f3f4f6;
}

.detalle-header {
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detalle-header h1 { font-size: 1.5rem; font-weight: 800; margin: 0; }

/* --- ESTADOS (BADGES) --- */
.status-badge {
  display: inline-flex;    /* Cambiado de inline-block para habilitar alineación */
  align-items: center;     /* Centrado vertical */
  justify-content: center; /* Centrado horizontal */

  padding: 5px 12px;       /* Aumentamos un poco el padding lateral para que luzca mejor */
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  width: fit-content;      /* Se ajusta al contenido */
  text-align: center;      /* Refuerzo para navegadores antiguos */
}
.status-badge.confirmado { background: #dcfce7; color: #15803d; }
.status-badge.pendiente { background: #fef9c3; color: #a16207; }
.status-badge.cancelado { background: #fee2e2; color: #b91c1c; }

/* --- INFORMACIÓN GENERAL --- */
.detalle-info {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.info-group {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.info-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
  display: block;
}

.info-group p { font-size: 1rem; font-weight: 500; margin: 0; color: #374151; }

/* --- SECCIÓN ARTÍCULOS (RESPONSIVE) --- */
.detalle-articulos { padding: 1.5rem; }


.articulos-table { width: 100%; border-collapse: collapse; }

.col-price {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* Vista Mobile: Tabla -> Tarjetas */
@media (max-width: 767px) {
  .articulos-table thead { display: none; }
  .articulos-table tr {
    display: block;
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    margin-bottom: 1rem;
    padding: 0.75rem;
  }
  .articulos-table td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f8fafc;
  }
  .articulos-table td:last-child { border-bottom: none; }
  .articulos-table td::before {
    content: attr(data-label);
    font-weight: 700;
    color: #94a3b8;
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  .col-price { color: #3b82f6; font-weight: 700; }
}

/* Vista Desktop: Tabla Normal */
@media (min-width: 768px) {
  .detalle-header { flex-direction: row; justify-content: space-between; padding: 2rem; }
  .detalle-header h1 { font-size: 2rem; }
  .detalle-info { grid-template-columns: repeat(2, 1fr); padding: 2rem; }
  .articulos-table th {
    background: #f8fafc;
    padding: 0.75rem;
    font-size: 0.75rem;
    color: #64748b;
    text-align: left;
    border-bottom: 2px solid #f1f5f9;
  }
  .articulos-table td { padding: 1rem 0.75rem; border-bottom: 1px solid #f1f5f9; }
}

/* --- RESUMEN DE TOTALES (ESTILO TICKET) --- */
.detalle-footer { padding: 1.5rem; background: #f8fafc; }

.resumen-container {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  max-width: 100%;
}

.resumen-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.label { color: #64748b; }
.valor { font-weight: 600; color: #1e293b; }
.descuento { color: #ef4444; }

.divisor { border: 0; border-top: 1px dashed #e2e8f0; margin: 1rem 0; }

.total-row { margin-top: 0.5rem; }
.label-total { font-weight: 800; font-size: 1.1rem; }
.valor-total { font-weight: 900; font-size: 1.5rem; color: #2563eb; }

/* --- ESTADOS DE CARGA --- */
.loading-state { padding: 5rem; text-align: center; }
.spinner {
  width: 40px; height: 40px;
  border: 4px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>