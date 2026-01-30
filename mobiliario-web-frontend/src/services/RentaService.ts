// Asumimos que esta importación es tu instancia configurada de Axios
import api from '@/services/api.ts';

// Definición de las rutas de la API para los eventos
const EVENT_URL = '/event';

/**
 * Servicio para manejar todas las operaciones de la API relacionadas con Eventos.
 */
const RentaService = {

    /**
     * Obtiene la lista completa de eventos desde el backend.
     * Puede aceptar parámetros de paginación o filtrado opcionales.
     * * @param {Object} params - Parámetros de consulta (ej. { page: 1, limit: 10, category: 'tech' })
     * @returns {Promise<Array<Object>>} Una promesa que resuelve con la lista de eventos.
     */
    async getRentas(queryFilters: { initFechaEntrega: string; endFechaEntrega: string; }) {
        try {
            // Realiza la solicitud POST, enviando los parámetros como query strings
            const response = await api.post(EVENT_URL,queryFilters);

            // Retorna los datos de los eventos
            return response.data;
        } catch (error) {
            // Re-lanza el error para que el componente de la vista pueda manejarlo
            console.error("Error al obtener la lista de eventos:", error);
            // La función que llama a fetchAllEvents debe manejar el error
            throw error;
        }
    },

    /**
     * Obtiene los detalles de un evento específico por su ID.
     * * @param {number|string} eventId - El ID único del evento.
     * @returns {Promise<Object>} Una promesa que resuelve con los detalles del evento.
     */
    async fetchEventById(eventId: any) {
        if (!eventId) {
            throw new Error("Se requiere un ID de evento.");
        }

        try {
            const response = await api.get(`${EVENT_URL}/${eventId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener el evento ${eventId}:`, error);
            throw error;
        }
    },

    /**
     * Crea un nuevo evento en el backend.
     * Requiere que el usuario esté autenticado.
     * * @param {Object} eventData - Los datos del evento a crear.
     * @returns {Promise<Object>} La promesa que resuelve con el evento creado (incluyendo el ID).
     */
    async save(eventData: any) {
        try {
            const response = await api.post(EVENT_URL+"/save", eventData); // Devuelve el evento recién creado
            return response.data;
        } catch (error) {
            console.error("Error al crear o actualizar el evento:", error);
            throw error;
        }
    }

    // Aquí puedes añadir más funciones como updateEvent(id, data) o deleteEvent(id)
};

export default RentaService;