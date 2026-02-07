<template>
  <div class="detalle-container">
    <button @click="$router.back()" class="btn-back">
      ⬅ Volver
    </button>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando detalles del evento...</p>
    </div>

    <div v-else-if="eventDetailResponse.event" class="detalle-card">
      <header class="detalle-header">
        <h1 v-if="!isNewEvent">Folio: {{ eventDetailResponse.event.folio }}</h1>
        <h1 v-else>Nuevo evento</h1>
        <span class="status-badge" :class="eventDetailResponse.event.estadoDescription.toLowerCase()">
          {{ eventDetailResponse.event.tipo }} - {{ eventDetailResponse.event.estadoDescription }}
        </span>
      </header>

      <div class="filter-wrapper">
        <button @click="handleEditClick" class="btn-toggle" :disabled="isLoading">
          <span v-if="isLoading">⌛ Cargando...</span>
          <span v-else>
            {{ isEditing ? '💾 Guardar' : '✏️ Editar' }}
          </span>
        </button>
        <button @click="cancelEdit" v-if="isEditing" class="btn-toggle">
          {{ '❌ Cancelar' }}
        </button>
      </div>

      <section class="detalle-info">
        <div class="setting-row" v-show="isEditing">
          <div class="text-info">
            <span class="title">Mostrar precios en PDF</span>
            <p class="description">Incluye el desglose de costos en el archivo.</p>
          </div>

          <label class="switch">
            <input type="checkbox" v-model="eventDetailResponse.event.mostrarPreciosPdf">
            <span class="slider"></span>
          </label>
        </div>

        <div 
          v-show="isEditing"
          class="info-group">
          <label>⏳ Estado del evento:</label>
          <div class="field-container">
            <select 
                  id="rent-status"
                  v-model.number="eventDetailResponse.event.estadoId" 
                  @change="onStatusChange" 
                  class="custom-select"
                >
                  <option disabled value="0">Seleccione una opción</option>
                  <option value="1">⏳ Apartado</option>
                  <option value="2">⚙️ En Renta</option>
                  <option value="3">🔔 Pendiente</option>
                  <option value="4">❌ Cancelado</option>
                  <option value="5">✅ Finalizado</option>
                </select>
          </div>
        </div>

        <div 
          v-show="isEditing"
          class="info-group">
          <label>🔔 Tipo de evento:</label>
          <div class="field-container">
          <select 
                id="rent-status"
                v-model.number="eventDetailResponse.event.tipoId" 
                @change="onStatusChange" 
                class="custom-select"
              >
                <option disabled value="0">Seleccione una opción</option>
                <option value="1">⏳ Renta</option>
                <option value="2">📄 Cotización</option> <option value="3">💰 Venta</option>
              </select>
          </div>
        </div>

        <div v-if="!isNewEvent" class="info-group">
          <label>👤 Atendi&oacute;</label>
          <p>{{ eventDetailResponse.event.userName }}</p>
        </div>

        <div class="info-group">
          <label>👤 Chofer</label>
          <p v-if="!isEditing">
            {{ eventDetailResponse.event.choferName }}
          </p>
          <div v-else class="filter-field">
            <select v-model="eventDetailResponse.event.choferId" >
              <option value="" disabled>Seleccionar chofer:</option>
              <option 
                v-for="chofer in catalogChoferes" 
                :key="chofer.id"
                :value="chofer.id"
              >
                {{ chofer.name }} {{ chofer.lastName }}
              </option>
            </select>
          </div>
        </div>

        <div class="info-group">
          <label>👤 Cliente</label>
          <p>{{ eventDetailResponse.event.clienteNombre }}</p>
        </div>
        <div v-if="!isNewEvent" class="info-group">
          <label>📅 Fecha de registro</label>
          <p>
            {{ formatDate(eventDetailResponse.event.fechaPedido) }}
          </p>

        </div>

        <div class="info-group">
          <label>📅 Fecha de entrega</label>
          <p v-if="!isEditing">
            {{ formatDate(eventDetailResponse.event.fechaEntrega) }} / {{ eventDetailResponse.event.horaEntrega }}
          </p>
          <div v-else class="filter-field">
            <input 
              type="date" 
              v-model="fechaEntregaModel">
            <input 
              type="time" 
              v-model="initHourFechaEntrega">
            <input 
              type="time" 
              v-model="endHourFechaEntrega">
          </div>
        </div>

        <div class="info-group">
          <label>📅 Fecha de devoluc&oacute;n</label>
          <p v-if="!isEditing">
            {{ formatDate(eventDetailResponse.event.fechaDevolucion) }} / {{ eventDetailResponse.event.horaDevolucion }}
          </p>
          <div v-else class="filter-field">
            <input 
              type="date" 
              v-model="fechaDevolucionModel">
            <label for="">
              hora de inicio: 
              <input 
                type="time" 
                v-model="initHourFechaDevolucion">
            </label>
            <label for="">
              hora de fin:
            <input 
              type="time" 
              v-model="endHourFechaDevolucion">
            </label>
          </div>
        </div>

        <div class="info-group">
          <label>📍 Ubicación</label>
          <p v-if="!isEditing">
            {{ eventDetailResponse.event.descripcion || 'No especificada' }}
          </p>
          <textarea v-else v-model="eventDetailResponse.event.descripcion"></textarea>
        </div>

        <div class="info-group">
          <label>Comentario:</label>
          <p v-if="!isEditing">
            {{ eventDetailResponse.event.comentario || 'No especificada' }}
          </p>
          <textarea v-else v-model="eventDetailResponse.event.comentario"></textarea>
        </div>
      </section>

      <section class="detalle-section">
        <div class="header-with-action" style="display: flex; justify-content: space-between; align-items: center;">
          <h3>
            <i class="icon">&#128230;</i> 
            Artículos ({{ eventDetailResponse.detail.length }})
          </h3>

          <button 
            v-show="isEditing"
            @click="openModalNewItem()" 
            class="btn-outline-sm">
            + Agregar Artículo
          </button>
          <div class=""></div>
          <button @click="toggleItemSection" class="btn-outline-sm">
            {{ isSectionItemsVisible ? 'Ocultar ▲' : 'Mostrar ▼' }}
          </button>
        </div>

        <transition name="fade-slide">
          <div v-show="isSectionItemsVisible" class="section-wrapper">
            <table class="table-section">
              <thead>
                <tr>
                  <th>Cantidad</th>
                  <th>Descripción</th>
                  <th class="right">Importe</th>
                  <th class="right">Descuento %</th>
                  <th class="right">Subtotal</th>
                  <th v-if="isEditing"></th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in eventDetailResponse.detail" :key="item.id">
                <td data-label="Cantidad">
                  <div v-if="!isEditing">{{ item.amount }}</div>
                  <div v-else class="filter-field">
                    <input
                      min="1"
                      max="1000"
                      @input="calculateTotals"
                      type="number"
                      v-model.number="item.amount"
                  </div>
                </td>
                <td data-label="Descripción">{{ item.itemName }}</td>
                <td data-label="Importe" class="col-price">{{ formatCurrency(item.unitPrice) }}</td> 

                <td data-label="Descuento porcentaje">
                  <div v-if="!isEditing" class="col-price">{{ item.discountPercentage }}</div>
                  <div v-else class="filter-field">
                    <input
                      min="0"
                      max="100"
                      type="number"
                      @input="calculateTotals"
                      v-model.number="item.discountPercentage"
                  </div>
                </td>
                <td data-label="Subtotal" class="col-price">{{ formatCurrency( (item.amount * item.unitPrice) - (item.amount * item.unitPrice * item.discountPercentage / 100) ) }}</td>
                <td v-if="isEditing">
                    <button 
                      @click="removeItem(index, item.itemName)" 
                      class="btn-toggle" 
                      type="button" 
                      title="Eliminar artículo">
                      🗑️ Eliminar
                    </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </transition>
      </section>
      
      <section class="detalle-section">

        <div v-if="!eventDetailResponse.payments 
          || eventDetailResponse.payments.length === 0">
          <p>No hay pagos registrados para este evento.</p>
          <div>
            <button 
              v-show="isEditing"
              @click="openModalNewPayment()" 
              class="btn-outline-sm">
              + Agregar Pago
            </button>
          </div>
        </div>

        <div v-else >
          <div class="header-with-action" style="display: flex; justify-content: space-between; align-items: center;">
            <h3>
              <i class="icon">&#128181;</i> 
              Pagos ({{ eventDetailResponse.payments?.length || 0 }})
            </h3>

            <button 
              v-show="isEditing"
              @click="openModalNewPayment()" 
              class="btn-outline-sm">
              + Agregar Pago
            </button>

            <button @click="togglePaymentSection" class="btn-outline-sm">
              {{ isSectionPaymentsVisible ? 'Ocultar ▲' : 'Mostrar ▼' }}
            </button>
          </div>
          <transition name="fade-slide">
            <div v-show="isSectionPaymentsVisible" class="section-wrapper">
              <table class="table-section">
                <thead>
                <tr>
                  <th class="center">Cantidad</th>
                  <th class="center">Fecha pago</th>
                  <th class="center">Comentario</th>
                  <th class="center">Tipo de pago</th>
                  <th class="center">Usuario</th>
                  <th class="center">Actualizado</th>
                  <th v-if="isEditing"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(payment,index) in eventDetailResponse.payments" :key="payment.id">
                  <td data-label="Cant." style="text-align: right;" >{{ formatCurrency(payment.amount) }}</td>
                  <td data-label="Fecha pago">{{ formatDate(payment.paymentDate) }}</td>
                  <td data-label="Comentario">{{ payment.comment }}</td>
                  <td data-label="Tipo de pago" >{{ payment.typeDescription }}</td>
                  <td data-label="Usuario">{{ payment.userName }}</td>
                  <td data-label="Actualizado">{{ formatDate(payment.updatedAt) }}</td>
                  <td v-if="isEditing">
                    <button 
                      @click="removePayment(index, payment.amount)" 
                      class="btn-toggle" 
                      type="button" 
                      title="Eliminar pago">
                      🗑️ Eliminar
                    </button>
                  </td>
                
                </tr>
                </tbody>
              </table>
            </div>
          </transition>
        </div>
      </section>


      <footer class="detalle-footer">

        <div class="resumen-container">
          <div class="resumen-row">
            <span class="label">Subtotal</span>
            <span class="valor">{{ formatCurrency(eventDetailResponse.totals.totalItems) }}</span>
          </div>

          <div class="resumen-row">
            <span class="label">Porcentaje descuento</span>
            <span v-if="!isEditing" 
              class="porcentaje descuento">
                {{ eventDetailResponse.event.porcentajeDescuento }} %
            </span>
            <span v-else class="valor-input">
              <input
                type="number"
                v-model.number="eventDetailResponse.event.porcentajeDescuento"
                @input="calculateTotals"
                min="0"
                max="100"
                class="edit-input"
              >
            </span>
          </div>

          <div class="resumen-row">
            <span class="label">Descuento aplicado</span>
            <span 
              class="valor descuento">
                {{ formatCurrency(eventDetailResponse.totals.totalDiscount) }}
            </span>
            
          </div>

          <div class="resumen-row">
            <span 
              class="label">Env&iacute;o y recolecci&oacute;n
            </span>
            <span v-if="!isEditing"
              class="valor">
              {{ formatCurrency(eventDetailResponse.event.envioRecoleccion) }}
            </span>
            <span v-else class="valor-input">
              <input
                type="number"
                v-model.number="eventDetailResponse.event.envioRecoleccion"
                @input="calculateTotals"
                min="0"
                max="100000"
                class="edit-input"
              >
            </span>
          </div>

          <div class="resumen-row">
            <span 
              class="label">
              Dep&oacute;sito en garant&iacute;a
            </span>
            <span v-if="!isEditing"
              class="valor">
              {{ formatCurrency(eventDetailResponse.event.depositoGarantia) }}
            </span>
            <span v-else class="valor-input">
              <input
                type="number"
                v-model.number="eventDetailResponse.event.depositoGarantia"
                @input="calculateTotals"
                min="0"
                max="100000"
                class="edit-input"
              >
            </span>
          </div>

          <div    
            class="resumen-row">
            <span class="label">IVA %</span>
            <span v-if="!isEditing" 
              class="valor">
                {{ eventDetailResponse.event.iva }} %
            </span>
            <span v-else class="valor-input">
              <input
                type="number"
                v-model.number="eventDetailResponse.event.iva"
                @input="calculateTotals"
                min="0"
                max="100"
                class="edit-input"
              >
            </span>
          </div>

          <div class="resumen-row">
            <span class="label">Total IVA</span>
            <span class="valor">{{ formatCurrency(eventDetailResponse.totals.totalIva) }}</span>
          </div>

          <div class="resumen-row">
            <span class="label">Pagos</span>
            <span class="valor">{{ formatCurrency(eventDetailResponse.totals.totalPayments) }}</span>
          </div>

          <hr class="divisor">

          <div class="resumen-row total-row">
            <span class="label-total">Total:</span>
            <span
              class="valor-total">
                {{ formatCurrency(eventDetailResponse.totals.total) }}
            </span>
          </div>
        </div>
      </footer>
    </div>

    <div v-else class="error-state">
      <p>No se encontró el evento solicitado.</p>
    </div>
  </div>

  <! -- Modal nuevo pago. -->
<div v-if="showModalNewPayment" class="modal-overlay" @click.self="closeModalNewPayment"> 
  <div class="modal-card">
    <div class="modal-header">
      <h3>Nuevo pago</h3>
      <button @click="closeModalNewPayment" class="btn-close">&times;</button>
    </div>

    <div class="modal-body">
      <div class="filter-field">
        <label>Cantidad:</label>
        <input 
          type="number" 
          v-model.number="newPayment.amount"           
          placeholder="0.00"
        >
      </div>

      <div class="filter-field">
        <label>Comentario:</label>
        <input 
          type="text" 
          v-model="newPayment.comment" 
          placeholder="Ej: Pago inicial"
        >
      </div>

      <div class="filter-field">
        <label>Fecha de Pago:</label>
        <input 
          type="date" 
          v-model="newPayment.paymentDate" 
        >
      </div>

      <div class="field-container">
        <label>Tipo de Pago:</label>
        <select v-model="newPayment.typeId" >
          <option value="" disabled>Seleccionar tipo de pago:</option>
          <option 
            v-for="typePayment in catalogTypePayments" 
            :key="typePayment.id"
            :value="typePayment.id"
          >
            {{ typePayment.description }}
          </option>
        </select>
      </div>
    </div>

    <div class="modal-footer">
      <button @click="closeModalNewPayment" class="btn-secondary">Cancelar</button>
      <button 
        @click="addPaymentToEvent()"
        class="btn-primary"
        :disabled="newPayment.amount <= 0 || !newPayment.typeId"
      >
        Agregar pago
      </button>
    </div>
  </div>
</div>

  <! -- Modal crear o elegir artículo. -->  

  <div v-if="showModalNewItem" class="modal-overlay" @click.self="closeModalNewItem">
  <div class="modal-card">
    <div class="modal-header">
      <h3>Selecciona un artículo</h3>
      <button @click="closeModalNewItem" class="btn-close">&times;</button>
    </div>

    <div class="modal-body">
      <div class="search-section">
        <label class="label-primary">Buscar articulo: </label>
        <div class="search-input-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="showDropdown = true"
            placeholder="Escribe para buscar..." 
            class="filter-field"
          >
        
          <ul v-if="showDropdown && filteredCatalog.length" class="autocomplete-results">
            <li 
              v-for="product in filteredCatalog" 
              :key="product.id" 
              @click="selectProduct(product)"
            >
              <span class="prod-name">{{ product.itemName }}</span>
              <small>{{ product.code }}</small>
              <small>{{ product.color }}</small>
            </li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="closeModalNewItem" class="btn-secondary">Cancelar</button>
      </div>
      </div>      
    </div>
  </div>


  <! -- Modal crear o elegir cliente. -->

<div v-if="showModalClients" class="modal-overlay" @click.self="closeModalClients">
  <div class="modal-card">
    <div class="modal-header">
      <h3>Información del Cliente</h3>
      <button @click="closeModalClients" class="btn-close">&times;</button>
    </div>

    <div class="modal-body">
      <div class="search-section">
        <label class="label-primary">¿Ya es cliente? Búscalo aquí:</label>
        <div class="search-input-container">
          <input 
            type="text" 
            v-model="searchClientQuery" 
            @input="showClientDropdown = true"
            placeholder="Nombre, teléfono o email..." 
            class="input-main"
          >
          <ul v-if="showClientDropdown && filteredClients.length" class="autocomplete-results">
            <li v-for="client in filteredClients" :key="client.id" @click="selectClient(client)">
              <span class="client-fullname">{{ client.fullName }}</span>
              <small>{{ client.mobilePhone }}</small>
              <small>{{ client.email }}</small>
            </li>
          </ul>
        </div>
      </div>

      <div class="divider"><span>O crea uno nuevo</span></div>

      <div class="client-form-grid">
        <div class="form-field">
          <label>Nombre *</label>
          <input type="text" v-model="newClient.firstName" placeholder="Ej. Juan">
        </div>
        <div class="form-field">
          <label>Apellidos</label>
          <input type="text" v-model="newClient.lastName" placeholder="Ej. Pérez">
        </div>
        <div class="form-field">
          <label>Fecha de cumpleaños</label>
          <input type="date" v-model="newClient.birthday">
        </div>
        <div class="form-field">
          <label>RFC</label>
          <input type="text" 
            v-model="newClient.rfc" 
            @blur="newClient.rfc = newClient.rfc?.trim().toUpperCase()"
            placeholder="Ej. ABC123456789">
        </div>
        <div class="form-field">
          <label>Móvil</label>
          <input type="tel" v-model="newClient.mobilePhone" placeholder="10 dígitos">
        </div>
        <div class="form-field">
          <label>Email</label>
          <input type="email" v-model="newClient.email" placeholder="correo@ejemplo.com">
        </div>
        <div class="form-field">
          <label>Medio de contacto</label>
          <select v-model="newClient.socialMediaContactId">
            <option value="" disabled>Seleccionar...</option>
            <option v-for="sm in catalogSocialMediaContacts" :key="sm.id" :value="sm.id">
              {{ sm.description }}
            </option>
          </select>
        </div>
        <div class="form-field full-width">
          <label>Dirección</label>
          <input type="text" v-model="newClient.address">
        </div>
        
        <div class="form-field flex-row">

          <div class="setting-row">
            <div class="text-info">
              <span class="title">Cliente VIP</span>
              <p class="description">Marca el cliente como VIP.</p>
            </div>

            <label class="switch">
              <input type="checkbox" v-model="newClient.isVip">
              <span class="slider"></span>
            </label>
          </div>

        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button @click="closeModalClients" class="btn-secondary">Cancelar</button>
      <button @click="addClient" class="btn-primary">Guardar Cliente</button>
    </div>
  </div>
</div>

  <div>
    <BaseModal 
      :show="isModalVisible" 
      title="Evento Guardado con Éxito"
      :message="modalMessage"
      @close="isModalVisible = false"
    />
  </div>


</template>

<script setup >
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventService from '@/services/EventService';
import ItemService from '@/services/ItemService';
import UserService from '@/services/UserService';
import ClientService from '@/services/ClientService';
import SocialMediaContactService from '@/services/SocialMediaContactService';
import TypePaymentService from '@/services/TypePaymentService';
import BaseModal from '@/components/BaseModal.vue';
import { formatCurrency, formatDate } from '@/utils/formatters';

const route = useRoute();
const router = useRouter();

const eventId = ref(0);
// Función para limpiar y asignar el valor
const updateEventId = (val) => {
    const num = Number(val);
    eventId.value = isNaN(num) ? 0 : num;
};

const isSectionItemsVisible = ref(true);
const isSectionPaymentsVisible = ref(true);

const eventDetailResponse = ref(null);
const isLoading = ref(true);
const isEditing = ref(false);
const isNewEvent = ref(true);
const showModalNewItem = ref(false);
const showModalNewPayment = ref(false);
const showModalClients = ref(false);

const isModalVisible = ref(false);
const modalMessage = ref('');

const catalogTypePayments = ref([]); 
const catalogChoferes = ref([]); 
const catalogClients = ref([]); 
const catalogSocialMediaContacts = ref([]);
// 1. Catálogo que viene del Backend (Java API)
const catalogItems = ref([]); 
const searchQuery = ref('');
const searchClientQuery = ref('');
const showDropdown = ref(false);
const showClientDropdown = ref(false);

const newClient = ref({
  fullName: '',
  firstName: '',
  lastName: '',
  nickname: '',
  mobilePhone: '',
  landlinePhone: '',
  email: '',
  address: '',
  rfc: '',
  birthday: '',
  socialMediaContactId: null,
  isVip: false
});

const addClient = async () => {
  try {
    const createdClient = await ClientService.createClient(newClient.value);
    eventDetailResponse.value.event.clienteId = createdClient.id;
    eventDetailResponse.value.event.clienteNombre = createdClient.fullName;
    isModalVisible.value = true;
    modalMessage.value = "Cliente creado y asignado al evento exitosamente";
    showModalClients.value = false;
    getChoferes();
  } catch (error) {
    console.error("Error al crear el cliente:", error);
  }
};

const handleEditClick = async () => {
  if (isEditing.value || isNewEvent.value) {
    try {

      const savedEventId = await EventService.save(eventDetailResponse.value);
      eventId.value = savedEventId;
      isModalVisible.value = true;
      modalMessage.value = "Guardado exitosamente";
      await fetchEventDetail();
      isEditing.value = false;
      isNewEvent.value = false;
    } catch (error) {
      console.error("Error al guardar el evento:", error);
    }
  } else {
    isEditing.value = true;
    getChoferes();
  }
};

const newPayment = ref({
  amount: 0,
  comment: '',
  date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
  id: 0,
  paymentDate: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
  rentaId: null,
  typeDescription: '',
  typeId: 1, // Tipo de pago por defecto (puedes ajustarlo)
  userId: null
});

const calculateTotals = () => {

  const MAX_AMOUNT_LIMIT = 50000;
  const MAX_PERCENTAGE_LIMIT = 100;


  // Validaciones para evitar valores negativos o excesivos

  eventDetailResponse.value.payments.forEach(payment => {
    if (payment.amount < 0) payment.amount = 0;
    if (payment.amount > MAX_AMOUNT_LIMIT) payment.amount = MAX_AMOUNT_LIMIT;
  });

  eventDetailResponse.value.detail.forEach(item => {
    if (item.amount < 0) item.amount = 0;
    if (item.amount > MAX_AMOUNT_LIMIT) item.amount = MAX_AMOUNT_LIMIT;
    if (item.discountPercentage < 0) item.discountPercentage = 0;
    if (item.discountPercentage > MAX_PERCENTAGE_LIMIT) item.discountPercentage = MAX_PERCENTAGE_LIMIT;
  });

  if (eventDetailResponse.value.event.porcentajeDescuento < 0) {
    eventDetailResponse.value.event.porcentajeDescuento = 0;
  }
  if (eventDetailResponse.value.event.porcentajeDescuento > MAX_PERCENTAGE_LIMIT) {
    eventDetailResponse.value.event.porcentajeDescuento = MAX_PERCENTAGE_LIMIT;
  }

  if (eventDetailResponse.value.event.envioRecoleccion < 0) {
    eventDetailResponse.value.event.envioRecoleccion = 0;
  }
  if (eventDetailResponse.value.event.envioRecoleccion > MAX_AMOUNT_LIMIT) {
    eventDetailResponse.value.event.envioRecoleccion = MAX_AMOUNT_LIMIT;
  }

  if (eventDetailResponse.value.event.depositoGarantia < 0) {
    eventDetailResponse.value.event.depositoGarantia = 0;
  }

  if (eventDetailResponse.value.event.depositoGarantia > MAX_AMOUNT_LIMIT) {
    eventDetailResponse.value.event.depositoGarantia = MAX_AMOUNT_LIMIT;
  }

  if (eventDetailResponse.value.event.iva < 0) {
    eventDetailResponse.value.event.iva = 0;
  }
  if (eventDetailResponse.value.event.iva > MAX_PERCENTAGE_LIMIT) {
    eventDetailResponse.value.event.iva = MAX_PERCENTAGE_LIMIT;
  }

  // End validations
  
  const totals = eventDetailResponse.value.totals;
  const details = eventDetailResponse.value.detail;
  const payments = eventDetailResponse.value.payments.reduce((acc, payment) => acc + payment.amount, 0);
  const iva = eventDetailResponse.value.event.iva || 0;
  const discountPercentage = eventDetailResponse.value.event.porcentajeDescuento || 0;

  const envioRecoleccion = eventDetailResponse.value.event.envioRecoleccion || 0;
  const depositoGarantia = eventDetailResponse.value.event.depositoGarantia || 0;

  // 1. Calcular Subtotal de Items (Suma de precio * cantidad - descuento individual)
  totals.totalItems = details.reduce((acc, item) => {
    const itemSubtotal = (item.unitPrice * item.amount) * (1 - (item.discountPercentage / 100));
    return acc + itemSubtotal;
  }, 0);

  // 2. Calcular Descuento total por porcentaje
  if (discountPercentage <= 0) {
    totals.totalDiscount = 0;
  } else{
    totals.totalDiscount = totals.totalItems * (discountPercentage / 100);
  }

  // 3. Calcular total sin iva.
  const calculateWithoutIVA = (totals.totalItems + envioRecoleccion + depositoGarantia) - totals.totalDiscount;
  totals.totalIva = 0;

  if (iva > 0) {
    totals.totalIva = calculateWithoutIVA * (iva / 100);
  } 

  const totalWithIVA = (totals.totalItems + envioRecoleccion + depositoGarantia + totals.totalIva) - totals.totalDiscount;

  totals.total = totalWithIVA - payments;

  eventDetailResponse.value.totals.totalPayments = payments;

};

const getChoferes = async () => {
  if (catalogChoferes.value.length > 0) return; // Ya cargado
  catalogChoferes.value = await UserService.getChoferes();
};

const openModalNewPayment = async () => {
  showModalNewPayment.value = true;
  // Cargar el catálogo de tipos de pago si no está cargado
  if (catalogTypePayments.value.length === 0) {
    catalogTypePayments.value = await TypePaymentService.getAll();
  }
};

const openModalNewItem = async () => {
  showModalNewItem.value = true;
  // Cargar el catálogo de artículos si no está cargado
  if (catalogItems.value.length === 0) {
    catalogItems.value = await ItemService.getAllItems();
  }
};

const closeModalClients = () => {
  showModalClients.value = false;
  router.back();
};

const closeModalNewPayment = () => {
  showModalNewPayment.value = false;
  newPayment.value = { id: 0, amount: 0, date: '', comment: '', typeId: 1 };
};

const closeModalNewItem = () => {
  showModalNewItem.value = false;
};

// 2. Filtrar artículos según lo que el usuario escribe
const filteredCatalog = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  
  if (!query) return [];

  return catalogItems.value.filter((item) => {
    // 1. Verificar Nombre
    const matchName = item.itemName.toLowerCase().includes(query);
    
    // 2. Verificar Código (convertimos a minúsculas por si tiene letras)
    const matchCode = item.code?.toLowerCase().includes(query);
    
    // 3. Verificar Color (asegúrate de que el DTO traiga este campo)
    // Si el color viene dentro de categoryName o un campo 'colorName'
    const matchColor = item.color?.toLowerCase().includes(query);

    return matchName || matchCode || matchColor;
  });
});


const filteredClients = computed(() => {
  const query = searchClientQuery.value.toLowerCase().trim();
  
  if (!query) return [];

  return catalogClients.value.filter((client) => {
    // 1. Verificar Nombre
    const matchName = client.fullName.toLowerCase().includes(query);
    // 2. Verificar Email
    const matchEmail = client.email?.toLowerCase().includes(query);
    // 3. Verificar Teléfono Móvil
    const matchMobilePhone = client.mobilePhone?.toLowerCase().includes(query);
    // Retornar true si alguno de los campos coincide
    return matchName || matchEmail || matchMobilePhone;
  });
});


const addPaymentToEvent = () => {
  const paymentToAdd = {
    id: 0, // Generar un ID temporal único
    amount: newPayment.value.amount,
    comment: newPayment.value.comment,
    paymentDate: newPayment.value.paymentDate,
    typeId: newPayment.value.typeId,
    typeDescription: catalogTypePayments.value.find(tp => tp.id === newPayment.value.typeId)?.description || 'Desconocido'
  };
  eventDetailResponse.value.payments.push(paymentToAdd);

  newPayment.value.amount = 0;
  newPayment.value.comment = '';
  newPayment.value.typeId = 1;

  calculateTotals();
  closeModalNewPayment();
};

const selectClient = (client) => {
  eventDetailResponse.value.event.clienteId = client.id;
  eventDetailResponse.value.event.clienteNombre = client.fullName;

  searchClientQuery.value = '';
  showClientDropdown.value = false;
  showModalClients.value = false;
  getChoferes();
};

// 3. Función para seleccionar un artículo del catálogo
const selectProduct = (product) => {

  // 1. Validar si el producto ya existe en la lista de detalles
  // Comparamos el ID del producto con el 'itemId' que guardamos en la tabla
  const isDuplicate = eventDetailResponse.value.detail.some(
    (item) => item.itemId === product.id
  );

  if (isDuplicate) {
    // Puedes usar un toast o una alerta simple de navegador
    alert(`El artículo "${product.itemName}" ya ha sido agregado al evento.`);
    return; // Detenemos la ejecución
  }

  const newItem = {
    amount: 1,
    comment: '',
    discountPercentage: 0,
    id: 0,
    itemId: product.id,
    itemName: product.itemName,
    subtotal: 0,
    unitPrice: product.unitPrice
  };

  searchQuery.value = '';
  showDropdown.value = false;
  showModalNewItem.value = false;
  eventDetailResponse.value.detail.push(newItem);

  calculateTotals();

};

const toggleItemSection = () => {
  isSectionItemsVisible.value = !isSectionItemsVisible.value;
};

const togglePaymentSection = () => {
  isSectionPaymentsVisible.value = !isSectionPaymentsVisible.value;
};

const removePayment = (paymentIndex, paymentAmount) => {
  // Confirmación opcional para evitar borrados accidentales
  if (confirm(`¿Estás seguro de que deseas eliminar el pago de $${paymentAmount}?`)) {
    eventDetailResponse.value.payments.splice(paymentIndex, 1);
    calculateTotals();
  }
};

/**
 * Elimina un artículo del detalle del evento.
 * Al ser un objeto reactivo, el Total General se recalculará automáticamente.
 */
const removeItem = (itemIndex, itemName) => {
  // Confirmación opcional para evitar borrados accidentales
  if (confirm(`¿Estás seguro de que deseas eliminar "${itemName}"?`)) {
    eventDetailResponse.value.detail.splice(itemIndex, 1);
    calculateTotals();
  }
};


const initHourWrapper = (fieldName, part) => {
  return computed({
    get: () => {
      const val = eventDetailResponse.value.event[fieldName];
      if (typeof val !== 'string' || !val.includes(' a ')) {
        // Fallback: si no hay formato "a", devolvemos el valor o una hora default
        return part === 0 ? "09:00" : "10:00";
      }
      
      const horas = val.split(' a '); // ["09:00", "10:00"]
      return horas[part].trim().substring(0, 5); // Aseguramos formato HH:mm
    },
    set: (newVal) => {
      const valOriginal = eventDetailResponse.value.event[fieldName];
      const horas = valOriginal.split(' a ');
      
      // Actualizamos solo la parte que cambió y reconstruimos la cadena
      if (part === 0) {
        eventDetailResponse.value.event[fieldName] = `${newVal} a ${horas[1] || '10:00'}`;
      } else {
        eventDetailResponse.value.event[fieldName] = `${horas[0] || '09:00'} a ${newVal}`;
      }
    }
  });
};


const dateWrapper = (fieldName) => {
  return computed({
    get: () => {
      const val = eventDetailResponse.value.event[fieldName];
      if (typeof val !== 'string' || !val.includes('/')) return val;
      const [day, month, year] = val.split('/');
      return `${year}-${month}-${day}`; // Formato para el <input type="date">
    },
    set: (newVal) => {
      if (!newVal) return;
      const [year, month, day] = newVal.split('-');
      eventDetailResponse.value.event[fieldName] = `${day}/${month}/${year}`; // Formato DD/MM/YYYY
    }
  });
};

const fechaPedidoModel = dateWrapper('fechaPedido');
const fechaEntregaModel = dateWrapper('fechaEntrega');
const fechaDevolucionModel = dateWrapper('fechaDevolucion');

const initHourFechaEntrega = initHourWrapper('horaEntrega', 0);
const endHourFechaEntrega = initHourWrapper('horaEntrega', 1);

const initHourFechaDevolucion = initHourWrapper('horaDevolucion', 0);
const endHourFechaDevolucion = initHourWrapper('horaDevolucion', 1);


const cancelEdit = async () => {
  if (isNewEvent.value) {
    router.back();
    return;
  } 
  await fetchEventDetail(); 
  isEditing.value = false;
  // Aquí puedes agregar lógica adicional para revertir cambios si es necesario
};

const fetchEventDetail = async () => {
  try {
    // Llamada a tu API de Spring Boot
    eventDetailResponse.value = await EventService.fetchEventById(eventId.value);

    // Ordenar la tabla principal después de agregar
    eventDetailResponse.value.detail.sort((a, b) => 
      a.itemName.localeCompare(b.itemName)
    );

  } catch (error) {
    console.error("Error al cargar el detalle:", error);
  } finally {
    isLoading.value = false;
  }
};

const resetValuesInEventDetail = () => {

  newClient.value = {
    name: '',
    lastName: '',
    nickname: '',
    mobilePhone: '',
    landlinePhone: '',
    email: '',
    address: '',
    rfc: '',
    birthday: '',
    socialMediaContactId: null,
    isVip: false,

  };

  eventDetailResponse.value = {
      event: {
        id: 0,
        userName: '',
        tipoId: 2, // tipo evento: cotizacion
        estadoId: 3, // estado de evento: pendiente
        choferId: null,
        choferName: '',
        clienteNombre: '',
        fechaPedido: '',
        fechaEntrega: '',
        horaEntrega: '09:00 a 10:00',
        fechaDevolucion: '',
        horaDevolucion: '10:00 a 11:00',
        descripcion: '',
        comentario: '',
        porcentajeDescuento: 0,
        envioRecoleccion: 0,
        depositoGarantia: 0,
        iva: 0,
        estadoDescription: 'Nuevo'
      },
      detail: [],
      payments: [],
      totals: {
        totalItems: 0,
        totalDiscount: 0,
        totalIva: 0,
        totalPayments: 0,
        total: 0
      }
    };
};

const getCatalogClients = async () => {
  if (catalogClients.value.length > 0) return; // Ya cargado
  catalogClients.value = await ClientService.getAll();
};

const getCatalogSocialMediaContacts = async () => {
  if (catalogSocialMediaContacts.value.length > 0) return; // Ya cargado
  catalogSocialMediaContacts.value = await SocialMediaContactService.getAll();
};

onMounted(async () => {
  updateEventId(route.params.id);

  if (eventId.value === 0) {
    getCatalogClients();
    getCatalogSocialMediaContacts();
    // nuevo evento
    showModalClients.value = true;
    isNewEvent.value = true;
    isEditing.value = true;
    isLoading.value = false;
    resetValuesInEventDetail();
  } else {
    isNewEvent.value = false;
    fetchEventDetail();
  }
  if (window.innerWidth < 768) {
    isSectionItemsVisible.value = false;
    isSectionPaymentsVisible.value = false;
  }
});

// 2. Si la URL cambia (ej. vas de evento/1 a evento/2), actualizamos el ref
watch(() => route.params.id, (newId) => {
    updateEventId(newId);
});
</script>

<style scoped>

/** INIT SWITCH */

/* Contenedor del Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

/* Ocultar checkbox original */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* El fondo del Switch (Slider) */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0; /* Gris claro (tailwind gray-200) */
  transition: .4s;
  border-radius: 34px;
}

/* El círculo blanco */
.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Estado cuando está Activo (Checked) */
input:checked + .slider {
  background-color: #22c55e; /* Verde (tailwind green-500) */
}

input:focus + .slider {
  box-shadow: 0 0 1px #22c55e;
}

/* Movimiento del círculo */
input:checked + .slider:before {
  transform: translateX(22px);
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #f1f5f9;
}

.setting-row .text-info {
  display: flex;
  flex-direction: column;
  padding-right: 12px;
}

.setting-row .title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.setting-row .description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}


/** END SWITCH */

.edit-input {
  width: 60px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 5px;
  text-align: right;
  font-family: inherit;
  font-size: 0.9rem;
  background-color: #fff;
}

/* Quitar flechas del input number para que sea más limpio */
.edit-input::-webkit-inner-spin-button,
.edit-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


/*** INIT MODAL NEW CLIENT */
/* --- ESTILO BASE DE BOTONES --- */
.btn-primary, .btn-secondary {
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%; /* Ancho completo en móvil */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Botón Guardar */
.btn-primary {
  background-color: var(--primary-color, #2563eb);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.btn-primary:active {
  transform: scale(0.98);
  background-color: #1d4ed8;
}

/* Botón Cancelar */
.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
}

.btn-secondary:active {
  background-color: #e5e7eb;
}

/* Card del Modal */
.modal-card {
  background: white;
  width: 100%;
  max-height: 90vh;
  border-radius: 20px 20px 0 0; /* Bordes redondeados arriba */
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Header & Footer */
.modal-header, .modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header { border-bottom: 1px solid #eee; }
.modal-footer { 
  border-top: 1px solid #eee; 
  gap: 10px;
  background: #f9f9f9;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto; /* Scroll interno */
}

/* Grid del Formulario */
.client-form-grid {
  display: grid;
  grid-template-columns: 1fr; /* 1 columna en móvil */
  gap: 1.2rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
}

.form-field input, .form-field select {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem; /* Evita zoom automático en iPhone */
}

/* Buscador Autocomplete */
.search-section { margin-bottom: 1.5rem; }
.search-input-container { position: relative; }
.input-main {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--primary-color, #2563eb);
  border-radius: 10px;
}

.autocomplete-results {
  position: absolute;
  top: 100%; left: 0; right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0 0 10px 10px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

.autocomplete-results li {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

/* Divider decorativo */
.divider {
  text-align: center;
  margin: 1.5rem 0;
  border-bottom: 1px solid #eee;
  line-height: 0.1em;
}
.divider span { background: #fff; padding: 0 10px; color: #888; font-size: 0.8rem; }


/* Init modal */


/* Contenedor principal: Centrado perfecto */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  padding: 1rem; /* Reducido un poco para ganar espacio en mobile */
}

/* Caja del Modal */
.modal-content {
  background: #ffffff;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  /* CAMBIO CLAVE: Quitamos el overflow-y: auto de aquí 
     para que el dropdown no se corte. Si el contenido es 
     muy largo, el scroll debe ir en un contenedor interno. */
  position: relative; 
  animation: zoom-in 0.2s ease-out;
}

/* El contenedor de la búsqueda debe tener posición relativa */
.form-group-search {
  position: relative; /* Esto es el ancla para el dropdown */
  margin-bottom: 1rem;
}

/* Contenedor de la lista de autocompletado */
.autocomplete-results {
  position: absolute;
  top: calc(100% + 5px); /* Justo debajo del input con un pequeño gap */
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  z-index: 4000; /* Aseguramos que esté por encima de otros inputs */
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  /* Mejora para mobile: evitar que el scroll del modal se mueva al usar el dropdown */
  overscroll-behavior: contain; 
}

.autocomplete-results li {
  padding: 14px 16px; /* Un poco más de padding para dedos en mobile */
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s ease;
}

.autocomplete-results li:active {
  background-color: #f3f4f6; /* Feedback táctil para mobile */
}

/* End modal */

.btn-outline-sm {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
  /* Aumentamos el padding para cumplir con el Touch Target (mínimo 44px) */
  padding: 0.5rem; 
  border-radius: 8px;
  font-size: 0.9rem; /* Un poco más grande para legibilidad */
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Optimizaciones técnicas para mobile */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation; /* Elimina el retraso de 300ms en el tap */
  -webkit-tap-highlight-color: transparent; /* Quita el cuadro azul feo en iOS/Android */
  user-select: none; /* Evita que se seleccione el texto al dar taps rápidos */
}

/* Solo aplicar hover en dispositivos que tengan puntero (Mouse) */
@media (hover: hover) {
  .btn-outline-sm:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }
}

/* Feedback visual para mobile (al tocar) */
.btn-outline-sm:active {
  background-color: #e5e7eb;
  transform: scale(0.96); /* Efecto de pulsación */
}

/* Opcional: Una transición suave para que no desaparezca de golpe */
.section-wrapper {
  transition: opacity 0.3s ease;
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
.detalle-section { padding: 1.5rem; }


.table-section { width: 100%; border-collapse: collapse; }

.col-price {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* Vista Mobile: Tabla -> Tarjetas */
@media (max-width: 767px) {

  /** Init Modal */

  .modal-content {
    width: 95%;           /* Casi todo el ancho pero con aire a los lados */
    padding: 1.25rem;
    border-radius: 24px;  /* Bordes más redondeados tipo iOS/Android moderno */
  }
  /*** End modal */

  .table-section thead { display: none; }
  .table-section tr {
    display: block;
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    margin-bottom: 1rem;
    padding: 0.75rem;
  }
  .table-section td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f8fafc;
  }
  .table-section td:last-child { border-bottom: none; }
  .table-section td::before {
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

  .btn-primary, .btn-secondary {
    width: auto; /* Ancho automático según el texto */
    min-width: 120px;
    padding: 10px 25px;
  }

  .detalle-header { flex-direction: row; justify-content: space-between; padding: 2rem; }
  .detalle-header h1 { font-size: 2rem; }
  .detalle-info { grid-template-columns: repeat(2, 1fr); padding: 2rem; }
  .table-section th {
    background: #f8fafc;
    padding: 0.75rem;
    font-size: 0.75rem;
    color: #64748b;
    text-align: left;
    border-bottom: 2px solid #f1f5f9;
  }
  .table-section td { padding: 1rem 0.75rem; border-bottom: 1px solid #f1f5f9; }

  .modal-overlay { align-items: center; }
  .modal-card {
    width: 650px;
    border-radius: 12px;
    max-height: 80vh;
  }
  .client-form-grid {
    grid-template-columns: 1fr 1fr; /* 2 columnas en PC */
  }
  .full-width { grid-column: span 2; }

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
/* Animación de entrada */
@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>