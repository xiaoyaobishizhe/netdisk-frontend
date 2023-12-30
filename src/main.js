import {createApp} from 'vue'
import pinia from '@/stores'
import router from '@/router'
import App from './App.vue'
import "normalize.css"
import "@/assets/css/base.scss"

createApp(App).use(pinia).use(router).mount('#app')
