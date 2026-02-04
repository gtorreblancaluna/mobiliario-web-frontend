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
        const errorStore = useErrorStore();
        const status = error.response?.status;
        const data = error.response?.data;

        let errorMessage = 'Error desconocido.';

        if (status === 400 && data && typeof data === 'object') {
            // Si el backend nos mandó el mapa de errores por campo:
            // Convertimos { firstName: "msg", mobilePhone: "msg" } en una sola cadena
            errorMessage = Object.values(data).join(' | ');
        } else {
            errorMessage = data?.message || 'Error en el servidor.';
        }

        if (status >= 400) {
            errorStore.showError(status, errorMessage);
        }

        return Promise.reject(error);
    }
);

export default api;