import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import KeyCloakService from './config/keycloak-plugin'

const app = createApp(App)

KeyCloakService.CallLogin(() => app.mount('#app'));

if(app)
    app.use(router)


