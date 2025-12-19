import { defineStore } from 'pinia';

export const useErrorStore = defineStore('error', {
  state: () => ({
    // Controla si el modal debe estar visible
    isVisible: false,
    // Título del modal (ej: "Error de Servidor" o "Datos Inválidos")
    title: '',
    // Mensaje de error detallado
    message: '',
    // Código de estado HTTP (400, 500, etc.)
    statusCode: null,
  }),

  actions: {
    /**
     * Muestra el modal con la información del error.
     * @param {number} code - Código HTTP (400, 500).
     * @param {string} msg - Mensaje de error del backend.
     */
    showError(code: number | null, msg: string) {
      // @ts-ignore
      this.statusCode = code;
      this.message = msg;
      this.isVisible = true;

      // @ts-ignore
      if (code >= 500) {
        this.title = 'Error Interno del Servidor';
        // Podrías ofrecer un mensaje más amigable aquí
        this.message = 'Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.';
      } else { // @ts-ignore
        if (code >= 400) {
                this.title = 'Solicitud Inválida';
                // Para 400, generalmente mostramos el mensaje exacto del backend (ej. "Email ya registrado").
                this.message = msg;
              }
      }
    },

    // Oculta el modal y resetea el estado
    clearError() {
      this.isVisible = false;
      this.title = '';
      this.message = '';
      this.statusCode = null;
    }
  }
});