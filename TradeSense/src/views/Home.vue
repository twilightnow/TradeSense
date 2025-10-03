<template>
  <section class="home">
    <header class="home__header">
      <h2>欢迎来到 TradeSense</h2>
      <p>快速概览主要功能，并通过左侧菜单导航到各业务模块。</p>
    </header>

    <div class="home__grid">
      <el-card shadow="hover" class="home__card">
        <template #header>
          <span>开单建议助手</span>
        </template>
        <p>基于 AI 的趋势分析和市场信号，帮助你判断多空方向。</p>
        <router-link to="/trade-advice" class="home__link">前往查看</router-link>
      </el-card>

      <el-card shadow="hover" class="home__card">
        <template #header>
          <span>量化策略分析</span>
        </template>
        <p>支持多币种、多策略的实时量化分析，生成入场提示。</p>
        <router-link to="/quant-strategy" class="home__link">查看策略</router-link>
      </el-card>

      <el-card shadow="hover" class="home__card">
        <template #header>
          <span>策略百科</span>
        </template>
        <p>了解常见量化策略的适用场景与要点，快速选择合适方法。</p>
        <router-link to="/strategy-wiki" class="home__link">查看攻略</router-link>
      </el-card>

      <el-card shadow="hover" class="home__card">
        <template #header>
          <span>AI 工具实验室</span>
        </template>
        <p>即将上线的实验功能，提供更多交易辅助工具与自动化能力。</p>
        <span class="home__tag">敬请期待</span>
      </el-card>
    </div>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home__header h2 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 600;
}

.home__header p {
  margin: 0;
  color: #606266;
}

.home__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.home__card {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.home__card p {
  margin: 0 0 16px;
  color: #606266;
}

.home__link {
  color: #409eff;
}

.home__tag {
  color: #909399;
}

@media (max-width: 768px) {
  .home {
    gap: 16px;
  }

  .home__header h2 {
    font-size: 22px;
  }

  .home__header p {
    font-size: 14px;
  }

  .home__grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .home__card {
    min-height: auto;
  }
}

</style>
