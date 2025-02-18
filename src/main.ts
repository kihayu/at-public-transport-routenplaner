import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import maskaPlugin from './plugins/maska'

const app = createApp(App)
app.use(maskaPlugin)
app.mount('#app')
