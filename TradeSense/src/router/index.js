import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TradeAdvice from '../views/Dashboard.vue'
import QuantStrategy from '../views/QuantStrategy.vue'
import StrategyWiki from '../views/StrategyWiki.vue'

const routes = [
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

export default router
