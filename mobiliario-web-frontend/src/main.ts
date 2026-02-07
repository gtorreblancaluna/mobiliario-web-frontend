import './assets/main.css'
import './assets/base.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // <-- Importa la instancia del router
import { registerSW } from 'virtual:pwa-register'

// Registro automático de Service Worker
registerSW({ immediate: true })

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
