import { createApp } from 'vue'

import '@/styles/tailwind.css'
import '@/styles/index.scss'

import App from './App.vue'
import router from './router'
import { initStore } from './stores'
import { setupDirectives } from './directives'

import SvgIcon from '@/components/Icon/index.vue'
import IconButton from '@/components/IconButton/index.vue'

const app = createApp(App)

app.component('SvgIcon', SvgIcon)
app.component('IconButton', IconButton)

initStore(app)
app.use(router)

// 注册全局指令
setupDirectives(app)

app.mount('#app')
