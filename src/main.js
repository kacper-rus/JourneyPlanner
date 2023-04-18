import { createApp } from 'vue/dist/vue.esm-bundler';
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './pages/Dashboard.vue'
import Login from './pages/Login.vue'
import JourneyPlanner from './pages/JourneyPlanner.vue'

const routes = [
  {path: '/', component: JourneyPlanner},
  {path: '/dashboard', component: Dashboard},
  {path: '/login', component: Login}
]

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})


const app = createApp(App)
app.use(router)
app.mount('#app')