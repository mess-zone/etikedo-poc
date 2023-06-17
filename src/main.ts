import devtools from '@vue/devtools'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) //use pinia
app.use(router) //use router
app.mount('#app')

if (process.env.NODE_ENV === 'development') {
    devtools.connect(/* host, port */)
}