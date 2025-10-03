<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { House, TrendCharts, DataLine, Collection, Menu as MenuIcon } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)
const isLoginRoute = computed(() => route.name === 'Login')
const username = computed(() => localStorage.getItem('ts-username') || 'TradeSense User')

const isMobile = ref(false)
const isMenuOpen = ref(false)

const updateIsMobile = () => {
  const mobile = window.innerWidth <= 768
  if (!mobile) {
    isMenuOpen.value = false
  }
  isMobile.value = mobile
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})

watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})

const handleLogout = () => {
  localStorage.removeItem('ts-authenticated')
  localStorage.removeItem('ts-username')
  router.replace({ name: 'Login' })
}

const toggleMenu = (value = true) => {
  isMenuOpen.value = value
}
</script>

<template>
  <router-view v-if="isLoginRoute" />
  <el-container v-else class="app-shell" :class="{ 'app-shell--mobile': isMobile }">
    <el-drawer
      v-if="isMobile"
      v-model="isMenuOpen"
      direction="ltr"
      :with-header="false"
      class="app-shell__drawer"
    >
      <div class="app-shell__brand app-shell__brand--drawer">
        <span class="app-shell__brand-name">TradeSense</span>
        <p class="app-shell__brand-subtitle">Intelligent Trading Assistant</p>
      </div>
      <el-menu
        router
        :default-active="activeMenu"
        class="app-shell__menu"
        @select="() => toggleMenu(false)"
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
    </el-drawer>

    <el-aside v-else width="220px" class="app-shell__aside">
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
        <div class="app-shell__header-left">
          <el-button
            v-if="isMobile"
            class="app-shell__menu-toggle"
            type="primary"
            link
            @click="toggleMenu()"
          >
            <el-icon><MenuIcon /></el-icon>
          </el-button>
          <h1>TradeSense Console</h1>
        </div>
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

.app-shell--mobile {
  height: auto;
  min-height: 100vh;
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
  min-height: 64px;
}

.app-shell__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
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

.app-shell__menu-toggle {
  display: none;
  padding: 4px 0;
}

.app-shell__drawer :deep(.el-drawer__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-shell__brand--drawer {
  padding: 24px;
}

@media (max-width: 1024px) {
  .app-shell__main {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .app-shell__header {
    padding: 0 16px;
  }

  .app-shell__header h1 {
    font-size: 18px;
  }

  .app-shell__header-actions {
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .app-shell__main {
    padding: 16px;
  }

  .app-shell__menu-toggle {
    display: inline-flex;
  }

  .app-shell__user {
    font-size: 13px;
  }

  .app-shell__drawer {
    --el-drawer-width: 260px;
  }
}
</style>
