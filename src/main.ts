import { createApp } from 'vue'

import '@/styles/tailwind.css'
import '@/styles/index.scss'

import App from './App.vue'
import { initRouter } from './router'
import { initStore } from './stores'

import SvgIcon from '@/components/Icon/index.vue'

const app = createApp(App)
app.component('SvgIcon', SvgIcon)

initStore(app)
initRouter(app)

app.mount('#app')
