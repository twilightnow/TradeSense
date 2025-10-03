import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TradeAdvice from '../views/Dashboard.vue'
import QuantStrategy from '../views/QuantStrategy.vue'
import StrategyWiki from '../views/StrategyWiki.vue'
import Login from '../views/Login.vue'

const AUTH_STORAGE_KEY = 'ts-authenticated'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/trade-advice',
    name: 'TradeAdvice',
    component: TradeAdvice
  },
  {
    path: '/quant-strategy',
    name: 'QuantStrategy',
    component: QuantStrategy
  },
  {
    path: '/strategy-wiki',
    name: 'StrategyWiki',
    component: StrategyWiki
  }
]

const router = createRouter({
  history: createWebHashHistory('/TradeSense/'),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  const requiresAuth = to.meta.requiresAuth !== false

  if (!isAuthenticated && requiresAuth) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (isAuthenticated && to.name === 'Login') {
    next({ path: '/' })
    return
  }

  next()
})

export default router
