<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { House, TrendCharts, DataLine, Collection } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<template>
  <el-container class="app-shell">
    <el-aside width="220px" class="app-shell__aside">
      <div class="app-shell__brand">
        <span class="app-shell__brand-name">TradeSense</span>
        <p class="app-shell__brand-subtitle">智能交易助手</p>
      </div>
      <el-menu
        router
        :default-active="activeMenu"
        class="app-shell__menu"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>主页</span>
        </el-menu-item>
        <el-menu-item index="/trade-advice">
          <el-icon><TrendCharts /></el-icon>
          <span>开单建议</span>
        </el-menu-item>
        <el-menu-item index="/quant-strategy">
          <el-icon><DataLine /></el-icon>
          <span>量化策略</span>
        </el-menu-item>
        <el-menu-item index="/strategy-wiki">
          <el-icon><Collection /></el-icon>
          <span>策略百科</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="app-shell__header">
        <h1>TradeSense 控制台</h1>
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
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
}

.app-shell__header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.app-shell__main {
  padding: 24px;
}
</style>
