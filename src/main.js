import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Создаем экземпляр приложения
const app = createApp(App)

// Создаем и регистрируем Pinia
const pinia = createPinia()
app.use(pinia)

// Регистрируем маршрутизатор
app.use(router)

// Монтируем приложение
app.mount('#app')