// src/services/api.js (Instancia de Axios)
import axios from 'axios';
import { useErrorStore } from '@/stores/ErrorStore';
import {JWT_TOKEN_KEY} from "@/constants/config.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para agregar el token antes de cada solicitud
api.interceptors.request.use(config => {
    const method = config.method ? config.method.toUpperCase() : 'GET';
    const fullUrl = `${config.baseURL || ''}${config.url}`;

    const token = localStorage.getItem(JWT_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║ 📡 SOLICITUD SALIENTE (AXIOS INTERCEPTOR) 
╟───────────────────────────────────────────────────────────╢
║ ➡️ Método: ${method}
║ 🔗 URL Completa: ${fullUrl}
╟───────────────────────────────────────────────────────────╢
║ 🔑 HEADERS (Encabezados)
║ ${JSON.stringify(config.headers, null, 2).replace(/\n/g, '\n║ ')}
╟───────────────────────────────────────────────────────────╢
║ 📦 DATA (Cuerpo/Body)
║ ${config.data ? JSON.stringify(config.data, null, 2).replace(/\n/g, '\n║ ') : '(Sin cuerpo/Query Params)'}
╚═══════════════════════════════════════════════════════════╝
    `);

    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(error);
        const errorStore = useErrorStore(); // Obtener acceso al store
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || 'Error desconocido.';

        if (status >= 400) {
            errorStore.showError(status, errorMessage);
        }

        // Es importante devolver un Promise.reject para que el error se propague
        // y la función que hizo la llamada sepa que falló.
        return Promise.reject(error);
    }
);

export default api;