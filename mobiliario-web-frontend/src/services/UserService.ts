// Asumimos que esta importación es tu instancia configurada de Axios
import api from '@/services/api.ts';

// Definición de las rutas de la API para los eventos
const URL = '/users';

/**
 * Servicio para manejar todas las operaciones de la API relacionadas con Usuarios.
 */
const UserService = {


    async getChoferes() {
        try {
            // Realiza la solicitud GET, enviando los parámetros como query strings
            const response = await api.get(URL + "/choferes");

            // Retorna los datos de los eventos
            return response.data;
        } catch (error) {
            // Re-lanza el error para que el componente de la vista pueda manejarlo
            console.error("Error al obtener la lista de choferes:", error);
            // La función que llama a fetchAllEvents debe manejar el error
            throw error;
        }
    },

};

export default UserService;