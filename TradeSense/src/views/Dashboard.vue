<template>
  <section class="trade-advice">
    <el-card shadow="never" class="trade-advice__card">
      <div class="trade-advice__header">
        <div>
          <h2>开单辅助面板</h2>
          <p>结合市场信号与 AI 判断，为你提供实时的仓位建议。</p>
        </div>
        <el-button
          type="primary"
          :loading="loading"
          @click="runDecision"
        >
          {{ loading ? '分析中...' : '开始判断是否应开单' }}
        </el-button>
      </div>

      <el-alert
        v-if="loading"
        type="info"
        show-icon
        title="分析中，请稍候..."
        class="trade-advice__alert"
      />

      <div v-if="result" class="trade-advice__result">
        <el-descriptions title="AI 判断建议" :column="1" border>
          <el-descriptions-item label="建议操作">
            {{ result.action }}
          </el-descriptions-item>
          <el-descriptions-item label="信心指数">
            {{ result.confidence }}%
          </el-descriptions-item>
          <el-descriptions-item label="综合理由">
            <pre>{{ result.reason }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-empty
        v-else
        description="点击上方按钮开始一次新的判断"
        class="trade-advice__empty"
      />
    </el-card>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const result = ref(null)

function runDecision() {
  loading.value = true
  result.value = null

  // 模拟调用 AI 和市场数据判断，可替换为真实 API
  setTimeout(() => {
    result.value = {
      action: '开多单',
      confidence: 84,
      reason: `1. BTC 短期结构出现向上突破信号；
2. 市场情绪偏乐观，负面消息较少；
3. 成交量持续放大，资金流入明显；
4. 综合判断上涨动能充足，回撤风险较低，建议开多。`
    }
    loading.value = false
  }, 1200)
}
</script>

<style scoped>
.trade-advice {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.trade-advice__card {
  padding: 24px;
}

.trade-advice__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
}

.trade-advice__header h2 {
  margin: 0 0 4px;
  font-size: 24px;
}

.trade-advice__header p {
  margin: 0;
  color: #606266;
}

.trade-advice__alert {
  margin-bottom: 16px;
}

.trade-advice__result pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  color: #303133;
}

.trade-advice__empty {
  margin-top: 48px;
}
</style>
