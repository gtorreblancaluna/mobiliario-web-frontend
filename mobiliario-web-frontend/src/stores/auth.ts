// src/stores/auth.js (Ejemplo Pinia Store)
import { defineStore } from 'pinia';
import axios from '@/services/api.js'; // Tu instancia de Axios configurada
import { JWT_TOKEN_KEY,USER_DATA_KEY } from '@/constants/config.ts';
import router from "@/router";

// 1. Define la interfaz de tu objeto de usuario
interface User {
    name: string;
    position: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem(JWT_TOKEN_KEY) || null,
        isAuthenticated: !!localStorage.getItem(JWT_TOKEN_KEY),
        user: JSON.parse(localStorage.getItem(USER_DATA_KEY) ?? 'null') as User | null // Podrías guardar la información decodificada del usuario
    }),
    actions: {
        async login(credentials: { username: string; password: string; }) {
            try {
                // 1. Llamada al endpoint de login
                const response = await axios.post('/authenticate', credentials);
                const token = response.data.jwt;

                console.log(response.data);

                // 2. Almacenar el token
                this.token = token;
                this.isAuthenticated = true;
                this.user = response.data.userData;

                localStorage.setItem(JWT_TOKEN_KEY, token);
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.userData));

                // 3. Configurar el token globalmente para futuras solicitudes
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                return true;
            } catch (error) {
                this.logout(); // Limpiar si falla el login
                throw error;
            }
        },
        logout() {
            // Limpiar todo el estado de autenticación
            this.token = null;
            this.isAuthenticated = false;
            this.user = null;
            localStorage.removeItem(JWT_TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);

            // Eliminar el encabezado de Axios
            delete axios.defaults.headers.common['Authorization'];

            router.push({ name: 'Login' }).then(() => {
                console.log("Redirección exitosa.");
            });

        },
        // Función para cargar la configuración al iniciar la app
        initialize() {
            if (this.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            }
        }
    },
});