import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth';
import { isTokenExpired } from '@/utils/auth';
import { JWT_TOKEN_KEY,USER_DATA_KEY } from '@/constants/config.ts';

// El 'router map' es este array de objetos:
const routes = [
    // Ruta Raíz
    {
        path: '/',                 // La URL en el navegador
        name: 'home',              // Un nombre único para referenciar la ruta programáticamente
        component: HomeView,        // El componente que se cargará
        meta: { requiresAuth: true } // <-- Ruta protegida
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/eventos',
        name: 'RentasTable',
        component: () => import('../views/EventsTableView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/eventos/:id',
        name: 'DetailEventView',
        component: () => import('../views/DetailEventView.vue'),
        meta: { requiresAuth: true }
    },
    // Ruta Catch-all (404 Not Found)
    {
        path: '/:pathMatch(.*)*', // Captura cualquier ruta que no coincida
        name: 'NotFound',
        component: () => import('../views/NotFoundView.vue') // Lazy loading
    }
]

// Crea la instancia del router
const router = createRouter({
    // Define cómo el historial del navegador debe ser manejado (recomendado)
    history: createWebHistory(import.meta.env.BASE_URL),
    routes // Aquí se asigna el mapa de rutas
})

// Guardián global de navegación
router.beforeEach((to, from, next) => {

    const token = localStorage.getItem(JWT_TOKEN_KEY);
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    if (to.name === 'Login' && isAuthenticated) {
        return next('/');
    } else if (requiresAuth) {
        if (!token) {
            // No hay token: redirigir al login
            return next('/login');
        }

        if (isTokenExpired(token)) {
            // Token expirado: Eliminar token (limpieza) y redirigir al login
            localStorage.removeItem(JWT_TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
            alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            return next('/login');
        }
    }
    // 3. Si no requiere autenticación o es válido, continúa
    next();
});

export default router