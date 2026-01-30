<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button @click="close" class="close-btn">&times;</button>
        </header>

            <section class="modal-body">
                <textarea 
                readonly 
                class="modal-textarea"
                :value="message"
                ></textarea>
            </section>

        <footer class="modal-footer">
          <button @click="close" class="btn-primary">Aceptar</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
// Definimos las propiedades que recibe el componente
const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Mensaje del Sistema' },
  message: String
});

// Definimos los eventos que puede disparar hacia el padre
const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>

.modal-textarea {
  width: 100%;
  height: 150px; /* Ajusta según necesites */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  resize: none; /* Evita que el usuario cambie el tamaño manualmente */
  font-family: inherit;
  font-size: 1rem;
  color: #333;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white; padding: 20px; border-radius: 8px;
  width: 90%; max-width: 450px; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.modal-body { padding: 20px 0; font-size: 1.1rem; }
.modal-footer { text-align: right; border-top: 1px solid #eee; padding-top: 10px; }
.btn-primary { background: #42b983; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
/* Animación simple */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>