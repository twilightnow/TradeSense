<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { House, TrendCharts, DataLine, Collection } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)
const isLoginRoute = computed(() => route.name === 'Login')
const username = computed(() => localStorage.getItem('ts-username') || 'TradeSense User')

const handleLogout = () => {
  localStorage.removeItem('ts-authenticated')
  localStorage.removeItem('ts-username')
  router.replace({ name: 'Login' })
}
</script>

<template>
  <router-view v-if="isLoginRoute" />
  <el-container v-else class="app-shell">
    <el-aside width="220px" class="app-shell__aside">
      <div class="app-shell__brand">
        <span class="app-shell__brand-name">TradeSense</span>
        <p class="app-shell__brand-subtitle">Intelligent Trading Assistant</p>
      </div>
      <el-menu
        router
        :default-active="activeMenu"
        class="app-shell__menu"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>Home</span>
        </el-menu-item>
        <el-menu-item index="/trade-advice">
          <el-icon><TrendCharts /></el-icon>
          <span>Trade Advice</span>
        </el-menu-item>
        <el-menu-item index="/quant-strategy">
          <el-icon><DataLine /></el-icon>
          <span>Quant Strategy</span>
        </el-menu-item>
        <el-menu-item index="/strategy-wiki">
          <el-icon><Collection /></el-icon>
          <span>Strategy Wiki</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="app-shell__header">
        <h1>TradeSense Console</h1>
        <div class="app-shell__header-actions">
          <span class="app-shell__user">Welcome, {{ username }}</span>
          <el-button type="primary" link @click="handleLogout">Log out</el-button>
        </div>
      </el-header>
      <el-main class="app-shell__main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-shell {
  height: 100vh;
  background: #f5f7fa;
}

.app-shell__aside {
  border-right: 1px solid #e4e7ed;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 24px 0 16px;
}

.app-shell__brand {
  padding: 0 24px 24px;
  border-bottom: 1px solid #f2f2f2;
}

.app-shell__brand-name {
  font-size: 20px;
  font-weight: 600;
}

.app-shell__brand-subtitle {
  margin: 4px 0 0;
  color: #909399;
  font-size: 13px;
}

.app-shell__menu {
  border-right: none;
  flex: 1;
}

.app-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
}

.app-shell__header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.app-shell__header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-shell__user {
  color: #606266;
  font-size: 14px;
}

.app-shell__main {
  padding: 24px;
}
</style>
