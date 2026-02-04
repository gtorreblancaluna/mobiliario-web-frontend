// Asumimos que esta importación es tu instancia configurada de Axios
import api from '@/services/api.ts';

// Definición de las rutas de la API para los clientes
const URL = '/clients';

/**
 * Servicio para manejar todas las operaciones de la API relacionadas con Clientes.
 */
const ClientService = {


    async getAll() {
        try {
            // Realiza la solicitud GET, enviando los parámetros como query strings
            const response = await api.get(URL);

            // Retorna los datos de los eventos
            return response.data;
        } catch (error) {
            // Re-lanza el error para que el componente de la vista pueda manejarlo
            console.error("Error al obtener la lista de clientes:", error);
            // La función que llama a fetchAllEvents debe manejar el error
            throw error;
        }
    },

    async createClient(clientData: any) {
        try {
            // Realiza la solicitud POST para crear un nuevo cliente
            const response = await api.post(URL, clientData);

            // Retorna los datos del cliente creado
            return response.data;
        } catch (error) {
            // Re-lanza el error para que el componente de la vista pueda manejarlo
            console.error("Error al crear el cliente:", error);
            throw error;
        }
    },

};

export default ClientService;