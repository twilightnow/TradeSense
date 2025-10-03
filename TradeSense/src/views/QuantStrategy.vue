<template>
  <section class="quant-strategy">
    <el-card shadow="never" class="quant-strategy__card">
      <div class="quant-strategy__header">
        <div>
          <h2>量化策略实验室</h2>
          <p>选择币种与策略，按需拉取市场数据生成操作建议。</p>
          <div class="quant-strategy__badges">
            <el-tag effect="dark" type="info">{{ selectedAssetInfo.symbol }}</el-tag>
            <el-tooltip :content="currentStrategy.context" placement="top">
              <el-tag effect="plain">{{ currentStrategy.name }}</el-tag>
            </el-tooltip>
            <el-tooltip
              v-if="isAutoSelected && analysis?.recommendedStrategyName"
              :content="analysis.recommendation"
              placement="top"
            >
              <el-tag type="success" effect="dark">
                推荐：{{ analysis.recommendedStrategyName }}
              </el-tag>
            </el-tooltip>
          </div>
        </div>
        <div class="quant-strategy__actions">
          <el-button
            type="primary"
            :loading="loading"
            @click="runAnalysis()"
          >
            {{ loading ? '分析中...' : '开始分析' }}
          </el-button>
          <el-button
            text
            :disabled="loading"
            @click="runAnalysis({ force: true })"
          >
            刷新行情
          </el-button>
        </div>
      </div>

      <div class="quant-strategy__controls">
        <el-form inline class="quant-strategy__form">
          <el-form-item label="币种">
            <el-select v-model="selectedAsset" placeholder="选择币种" style="width: 220px">
              <el-option
                v-for="option in assetOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="策略">
            <el-select v-model="selectedStrategy" placeholder="选择策略" style="width: 260px">
              <el-option
                v-for="option in strategyOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="交易模式">
            <el-radio-group v-model="config.tradeType" size="small">
              <el-radio-button label="spot">现货</el-radio-button>
              <el-radio-button label="perpetual">永续合约</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="config.tradeType === 'perpetual'" label="杠杆倍数">
            <el-slider
              v-model="config.leverage"
              :min="1"
              :max="20"
              :step="1"
              show-input
              input-size="small"
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item label="交易周期">
            <el-select v-model="config.horizon" placeholder="选择周期" style="width: 220px">
              <el-option
                v-for="option in horizonOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="config.horizon === 'dca'" label="定投频率">
            <el-select v-model="config.dcaInterval" placeholder="选择频率" style="width: 220px">
              <el-option
                v-for="option in dcaOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="风险偏好">
            <el-radio-group v-model="config.riskLevel" size="small">
              <el-radio-button
                v-for="option in riskOptions"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计划仓位">
            <el-radio-group v-model="config.investmentSize" size="small">
              <el-radio-button
                v-for="option in investmentOptions"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <span class="quant-strategy__hint">{{ currentStrategy.description }}</span>
          </el-form-item>
        </el-form>
      </div>

      <el-alert
        v-if="error"
        type="error"
        show-icon
        :closable="false"
        class="quant-strategy__alert"
        :title="error"
      />

      <el-skeleton
        v-if="loading && !analysis"
        animated
        :rows="5"
      />

      <template v-else>
        <el-empty
          v-if="!analysis"
          description="请选择币种与策略后点击“开始分析”获取最新建议"
        />

        <div v-else class="quant-strategy__content">
          <el-descriptions :title="analysis.strategyName" :column="1" border>
            <el-descriptions-item v-if="analysis.trendSummary" label="走势判断">
              {{ analysis.trendSummary }}
            </el-descriptions-item>
            <el-descriptions-item v-if="analysis.configSummary" label="交易配置">
              {{ analysis.configSummary }}
            </el-descriptions-item>
            <el-descriptions-item v-if="analysis.recommendation" label="策略推荐">
              {{ analysis.recommendation }}
            </el-descriptions-item>
            <el-descriptions-item v-if="analysis.entryLevels?.length" label="关键价位">
              <p v-for="(line, idx) in analysis.entryLevels" :key="`level-${idx}`">
                {{ idx + 1 }}. {{ line }}
              </p>
            </el-descriptions-item>
            <el-descriptions-item label="建议操作">
              <el-tag :type="analysis.tagType" effect="dark">
                {{ analysis.action }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="信心指数">
              {{ analysis.confidence }}%
            </el-descriptions-item>
            <el-descriptions-item v-if="analysis.positionAdvice?.length" label="仓位建议">
              <p v-for="(line, idx) in analysis.positionAdvice" :key="`pos-${idx}`">
                {{ idx + 1 }}. {{ line }}
              </p>
            </el-descriptions-item>
            <el-descriptions-item label="策略解读">
              <p v-for="(line, idx) in analysis.reasons" :key="`reason-${idx}`">
                {{ idx + 1 }}. {{ line }}
              </p>
            </el-descriptions-item>
          </el-descriptions>

          <el-divider />

          <div class="quant-strategy__metrics">
            <el-card
              v-for="metric in analysis.metrics"
              :key="metric.label"
              shadow="hover"
              class="quant-strategy__metric"
            >
              <h3>{{ metric.label }}</h3>
              <p
                class="quant-strategy__metric-value"
                :class="metric.className"
              >
                {{ metric.value }}
              </p>
            </el-card>
          </div>

          <footer class="quant-strategy__footer">
            <span>
              数据来源：CoinGecko | 更新时间：{{ lastUpdated || '—' }}
              <template v-if="analysis.fromCache">（缓存）</template>
            </span>
            <span class="quant-strategy__asset-label">当前币种：{{ selectedAssetInfo.label }}</span>
          </footer>
        </div>
      </template>
    </el-card>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { fetchMarketChart } from '../services/market'

const AUTO_STRATEGY_KEY = 'auto'
const BOLLINGER_KEY = 'bollinger'
const DAYS_WINDOW = 7
const CACHE_TTL_MS = 5 * 60 * 1000

const assetOptions = [
  { label: '比特币 (BTC)', value: 'bitcoin', symbol: 'BTC', context: '市值最大、流动性最高，适合作为趋势参考。' },
  { label: '以太坊 (ETH)', value: 'ethereum', symbol: 'ETH', context: '智能合约龙头，波动率略高，适合多策略对比。' },
  { label: '索拉纳 (SOL)', value: 'solana', symbol: 'SOL', context: '新兴公链，波动较大，适合动量策略快速捕捉机会。' }
]

const assetMap = Object.fromEntries(assetOptions.map((item) => [item.value, item]))


const horizonOptions = [
  { label: '日内 (短线)', value: 'intraday' },
  { label: '波段 (1-3 日)', value: 'swing' },
  { label: '长线 (周线级)', value: 'position' },
  { label: '定投 (DCA)', value: 'dca' }
]

const dcaOptions = [
  { label: '每日', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '双周', value: 'biweekly' },
  { label: '每月', value: 'monthly' }
]

const riskOptions = [
  { label: '保守', value: 'low' },
  { label: '均衡', value: 'medium' },
  { label: '积极', value: 'high' }
]

const investmentOptions = [
  { label: '轻仓试探', value: 'small' },
  { label: '标准仓位', value: 'medium' },
  { label: '重仓布局', value: 'large' }
]
const strategyOptions = [
  {
    label: '自动推荐',
    value: AUTO_STRATEGY_KEY,
    description: '由系统评估多种策略表现，自动选出当前可信度最高的方案。',
    context: '当你不确定如何入场时使用，自动根据趋势与动能挑选策略。'
  },
  {
    label: '双均线交叉（12 vs 26）',
    value: 'double-ma',
    description: '比较 12 与 26 小时均线的金叉/死叉信号，识别趋势拐点。',
    context: '适用于稳健的趋势跟随或判断趋势反转。'
  },
  {
    label: 'RSI 震荡策略（14）',
    value: 'rsi',
    description: '关注 RSI 超买/超卖区间，提示顺势或逆势操作。',
    context: '适合震荡行情与短线高频调仓。'
  },
  {
    label: '动量突破（Rate of Change）',
    value: 'momentum',
    description: '评估 12/24 小时动量变化，判断趋势延续或转弱。',
    context: '适合把握行情加速阶段的顺势交易。'
  },
  {
    label: '布林带通道策略',
    value: BOLLINGER_KEY,
    description: '利用布林带上下轨识别超买超卖，并结合波动率布局仓位。',
    context: '适合震荡与趋势初期，关注价格对上/下轨的突破与回踩。'
  }
]

const strategyMap = {
  [AUTO_STRATEGY_KEY]: {
    name: '自动推荐模式',
    description: getStrategyDescription(AUTO_STRATEGY_KEY),
    context: getStrategyContext(AUTO_STRATEGY_KEY),
    analyze: null
  },
  'double-ma': {
    name: '双均线交叉策略',
    description: getStrategyDescription('double-ma'),
    context: getStrategyContext('double-ma'),
    analyze: analyzeDoubleMa
  },
  rsi: {
    name: 'RSI 震荡策略',
    description: getStrategyDescription('rsi'),
    context: getStrategyContext('rsi'),
    analyze: analyzeRsi
  },
  momentum: {
    name: '动量突破策略',
    description: getStrategyDescription('momentum'),
    context: getStrategyContext('momentum'),
    analyze: analyzeMomentum
  },
  [BOLLINGER_KEY]: {
    name: '布林带通道策略',
    description: getStrategyDescription(BOLLINGER_KEY),
    context: getStrategyContext(BOLLINGER_KEY),
    analyze: analyzeBollinger
  }
}

const config = reactive({
  tradeType: 'spot',
  leverage: 1,
  horizon: 'swing',
  dcaInterval: 'weekly',
  riskLevel: 'medium',
  investmentSize: 'medium'
})

const selectedAsset = ref(assetOptions[0].value)
const selectedStrategy = ref(AUTO_STRATEGY_KEY)
const loading = ref(false)
const error = ref('')
const analysis = ref(null)
const lastUpdated = ref('')
const dataCache = new Map()

const selectedAssetInfo = computed(() => assetMap[selectedAsset.value] ?? assetOptions[0])
const isAutoSelected = computed(() => selectedStrategy.value === AUTO_STRATEGY_KEY)
const currentStrategy = computed(() => strategyMap[selectedStrategy.value] ?? strategyMap[AUTO_STRATEGY_KEY])

let refreshTimer = null
let adjustingLeverage = false

function scheduleRefresh() {
  if (!analysis.value) {
    return
  }
  if (refreshTimer) {
    return
  }
  refreshTimer = setTimeout(() => {
    refreshTimer = null
    runAnalysis({ reuseOnly: true })
  }, 60)
}

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
})

watch(() => config.tradeType, (value) => {
  adjustingLeverage = true
  if (value === 'spot') {
    config.leverage = 1
  } else if (config.leverage <= 1) {
    config.leverage = 3
  }
  adjustingLeverage = false
  scheduleRefresh()
})

watch(() => config.leverage, () => {
  if (adjustingLeverage) {
    return
  }
  if (config.tradeType === 'spot' && config.leverage !== 1) {
    adjustingLeverage = true
    config.leverage = 1
    adjustingLeverage = false
    return
  }
  scheduleRefresh()
})

watch(() => config.horizon, (value, oldValue) => {
  if (value !== 'dca' && oldValue === 'dca') {
    config.dcaInterval = 'weekly'
  }
  scheduleRefresh()
})

watch(() => config.dcaInterval, () => {
  if (config.horizon === 'dca') {
    scheduleRefresh()
  }
})

watch(() => config.riskLevel, () => {
  scheduleRefresh()
})

watch(() => config.investmentSize, () => {
  scheduleRefresh()
})

async function runAnalysis({ force = false, reuseOnly = false } = {}) {
  error.value = ''
  if (!reuseOnly) {
    analysis.value = null
  }
  loading.value = true

  try {
    const entry = await loadMarketData({ force, reuseOnly })
    const base = prepareBase(entry.payload)

    if (!base) {
      analysis.value = null
      error.value = '暂无足够的市场数据，稍后重试。'
      lastUpdated.value = ''
      return
    }

    const trendSummary = deriveTrendSummary(base)

    if (isAutoSelected.value) {
      const recommendation = recommendStrategy(base)

      if (!recommendation) {
        analysis.value = null
        error.value = '暂未找到合适的策略信号，请稍后再试。'
        lastUpdated.value = ''
        return
      }

      const { key, meta, result, message, autoReason, trendSummary: recommendedTrend } = recommendation
      const normalized = normalizeResult(result, [autoReason])
      const decorated = decorateWithConfig(normalized)

      analysis.value = {
        ...decorated,
        strategyKey: key,
        strategyName: `推荐策略：${meta.name}`,
        asset: selectedAssetInfo.value,
        fromCache: entry.fromCache,
        trendSummary: recommendedTrend || trendSummary,
        recommendation: message,
        recommendedStrategyKey: key,
        recommendedStrategyName: meta.name
      }
    } else {
      const strategy = currentStrategy.value
      const result = strategy.analyze(base)

      if (!result) {
        analysis.value = null
        error.value = '数据不足，无法生成策略建议。'
        lastUpdated.value = ''
        return
      }

      const normalized = normalizeResult(result)
      const decorated = decorateWithConfig(normalized)

      analysis.value = {
        ...decorated,
        strategyKey: selectedStrategy.value,
        strategyName: strategy.name,
        asset: selectedAssetInfo.value,
        fromCache: entry.fromCache,
        trendSummary,
        recommendation: strategy.context ? `适用场景：${strategy.context}` : ''
      }
    }

    lastUpdated.value = formatDateTime(entry.fetchedAt)
  } catch (err) {
    analysis.value = null
    lastUpdated.value = ''
    error.value = err.message || '获取数据失败'
  } finally {
    loading.value = false
  }
}

async function loadMarketData({ force = false, reuseOnly = false } = {}) {
  const key = `${selectedAsset.value}|${DAYS_WINDOW}`
  const now = Date.now()
  const cached = dataCache.get(key)

  if (!force && cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return { ...cached, fromCache: true }
  }

  if (reuseOnly) {
    if (cached) {
      return { ...cached, fromCache: true }
    }
    throw new Error('当前组合暂无缓存数据，请先点击“刷新行情”。')
  }

  const payload = await fetchMarketChart({ coinId: selectedAsset.value, days: DAYS_WINDOW })
  const entry = { payload, fetchedAt: now }
  dataCache.set(key, entry)
  return { ...entry, fromCache: false }
}

watch(selectedAsset, () => {
  analysis.value = null
  lastUpdated.value = ''
  error.value = ''
})

watch(selectedStrategy, () => {
  error.value = ''
  if (!analysis.value) return
  runAnalysis({ reuseOnly: true })
})

function prepareBase(payload) {
  const series = (payload?.prices ?? [])
    .map(([timestamp, price]) => ({ timestamp: Number(timestamp), price: Number(price) }))
    .filter((point) => !Number.isNaN(point.timestamp) && !Number.isNaN(point.price))
    .sort((a, b) => a.timestamp - b.timestamp)

  if (!series.length) {
    return null
  }

  const closes = series.map((point) => point.price)
  const priceNow = closes.at(-1)
  const price12h = findPriceHoursAgo(series, 12)
  const price24h = findPriceHoursAgo(series, 24)
  const price48h = findPriceHoursAgo(series, 48)

  const change12h = price12h ? ((priceNow - price12h) / price12h) * 100 : 0
  const change24h = price24h ? ((priceNow - price24h) / price24h) * 100 : 0
  const change48h = price48h ? ((priceNow - price48h) / price48h) * 100 : 0

  return {
    series,
    closes,
    priceNow,
    price12h,
    price24h,
    price48h,
    change12h,
    change24h,
    change48h
  }
}

function findPriceHoursAgo(series, hours) {
  if (!series.length) return null
  const target = series.at(-1).timestamp - hours * 60 * 60 * 1000

  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i].timestamp <= target) {
      return series[i].price
    }
  }

  return series[0]?.price ?? null
}

function movingAverage(values, endIndex, period) {
  if (endIndex < period - 1) return null
  const start = endIndex - period + 1
  const slice = values.slice(start, endIndex + 1)
  if (!slice.length) return null
  const total = slice.reduce((sum, value) => sum + value, 0)
  return total / slice.length
}

function calculateRsi(values, period = 14) {
  if (!values || values.length <= period) return null

  let gains = 0
  let losses = 0

  for (let i = 1; i <= period; i += 1) {
    const diff = values[i] - values[i - 1]
    if (diff >= 0) {
      gains += diff
    } else {
      losses -= diff
    }
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  for (let i = period + 1; i < values.length; i += 1) {
    const diff = values[i] - values[i - 1]
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) - diff) / period
    }
  }

  if (avgLoss === 0) {
    return avgGain === 0 ? 50 : 100
  }

  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

function computeRoc(series, hours) {
  if (!series.length) return null
  const priceNow = series.at(-1)?.price
  const past = findPriceHoursAgo(series, hours)
  if (!priceNow || !past) return null
  return ((priceNow - past) / past) * 100
}

function calculateBollinger(values, period = 20, stdDevFactor = 2) {
  if (!values || values.length < period) return null
  const slice = values.slice(-period)
  const mean = slice.reduce((sum, value) => sum + value, 0) / period
  const variance = slice.reduce((sum, value) => sum + (value - mean) ** 2, 0) / period
  const stdDev = Math.sqrt(variance)
  return {
    middle: mean,
    upper: mean + stdDevFactor * stdDev,
    lower: mean - stdDevFactor * stdDev,
    stdDev
  }
}

function analyzeDoubleMa(base) {
  const { closes, priceNow, change24h } = base
  const latestIndex = closes.length - 1
  const shortPeriod = 12
  const longPeriod = 26

  const latestShort = movingAverage(closes, latestIndex, shortPeriod)
  const latestLong = movingAverage(closes, latestIndex, longPeriod)
  const prevShort = movingAverage(closes, latestIndex - 1, shortPeriod)
  const prevLong = movingAverage(closes, latestIndex - 1, longPeriod)

  if ([latestShort, latestLong, prevShort, prevLong].some((value) => value === null)) {
    return null
  }

  const maDiff = latestShort - latestLong
  const prevDiff = prevShort - prevLong
  const crossedUp = prevDiff <= 0 && maDiff > 0
  const crossedDown = prevDiff >= 0 && maDiff < 0

  let action = '保持观望'
  let tagType = 'info'
  const reasons = []

  if (crossedUp) {
    action = '考虑开多'
    tagType = 'success'
    reasons.push('短期均线刚刚上穿长期均线，出现金叉信号。')
  } else if (crossedDown) {
    action = '考虑开空'
    tagType = 'danger'
    reasons.push('短期均线下穿长期均线，出现死叉信号。')
  } else if (maDiff > 0) {
    action = '保持多头'
    tagType = 'success'
    reasons.push('短期均线仍位于长期均线上方，多头趋势延续。')
  } else if (maDiff < 0) {
    action = '谨慎观望'
    tagType = 'warning'
    reasons.push('短期均线位于长期均线下方，空头压力较大。')
  }

  const magnitude = Math.abs(maDiff) / latestLong
  const confidence = clamp(Math.round(magnitude * 220 + 35), 30, 92)

  if (change24h >= 1.5) {
    reasons.push('近 24 小时价格上涨明显，可关注回调节奏。')
  } else if (change24h <= -1.5) {
    reasons.push('近 24 小时价格下跌明显，空头动能尚未释放。')
  } else {
    reasons.push('近 24 小时波动温和，可结合均线信号分批建仓。')
  }

  reasons.push(`MA12 - MA26 差值为 ${maDiff >= 0 ? '+' : ''}${maDiff.toFixed(2)} USD。`)

  const entryLevels = [
    `分批买入区：回踩 MA12（约 ${formatPrice(latestShort)}）附近可分批进场。`,
    `风险控制：MA26（约 ${formatPrice(latestLong)}）下方 1-2% 设为防守止损。`
  ]

  const positionAdvice = [
    '建议最多投入计划仓位的 30%-40% 作为首仓，待回踩确认后再加仓。',
    '若金叉成立，可在每次回踩 MA12 时加仓 20%，同时逐步抬升止损位。'
  ]

  return {
    action,
    tagType,
    confidence,
    reasons,
    entryLevels,
    positionAdvice,
    metrics: [
      createPriceMetric(priceNow),
      createPercentMetric('24 小时涨跌幅', change24h),
      {
        label: '均线差值 (MA12 - MA26)',
        value: `${maDiff >= 0 ? '+' : ''}${maDiff.toFixed(2)} USD`,
        className: getSignClass(maDiff)
      }
    ]
  }
}

function analyzeRsi(base) {
  const { closes, priceNow, change24h, change12h } = base
  const rsi = calculateRsi(closes, 14)

  if (rsi === null) {
    return null
  }

  let action = '保持观望'
  let tagType = 'info'
  const reasons = []

  if (rsi >= 70) {
    action = '逢高减仓'
    tagType = 'warning'
    reasons.push('RSI 已进入超买区域 (>70)，回调风险提升。')
  } else if (rsi <= 30) {
    action = '关注抄底机会'
    tagType = 'success'
    reasons.push('RSI 跌入超卖区域 (<30)，短线反弹概率增加。')
  } else if (rsi >= 55) {
    action = '顺势持有多头'
    tagType = 'primary'
    reasons.push('RSI 位于 55 以上并继续抬升，多头动能良好。')
  } else if (rsi <= 45) {
    action = '保持谨慎'
    tagType = 'warning'
    reasons.push('RSI 跌破 45，动能转弱需控制仓位。')
  } else {
    reasons.push('RSI 位于 45-55 区间，市场处于震荡整理阶段。')
  }

  if (change24h >= 1.5) {
    reasons.push('近 24 小时价格上涨显著，需警惕过热引发的回调。')
  } else if (change24h <= -1.5) {
    reasons.push('近 24 小时价格下跌较深，若 RSI 继续走低可关注反弹窗口。')
  } else {
    reasons.push('价格波动有限，可结合 RSI 分批布仓。')
  }

  const rsiDeviation = Math.abs(rsi - 50) / 50
  const confidence = clamp(Math.round(rsiDeviation * 160 + 30), 30, 90)

  if (Math.abs(change12h) >= 1) {
    reasons.push(`近 12 小时价格变动为 ${formatPercent(change12h)}，可结合 RSI 做仓位调整。`)
  }

  const rsiClass = rsi >= 70 ? 'is-negative' : rsi <= 30 ? 'is-positive' : ''

  const entryLevels = [
    `低吸区域：RSI < 35 时关注 ${formatPercent(change24h)} 的回调机会。`,
    `减仓区域：RSI > 65 且价格接近前高时可分批减仓。`
  ]

  const positionAdvice = [
    '建议按 25%-25%-25%-25% 的节奏分批建仓，随 RSI 回归 50 上下灵活调整。',
    '明显超买时减仓 30%-50%，剩余仓位设置移动止盈。'
  ]

  return {
    action,
    tagType,
    confidence,
    reasons,
    entryLevels,
    positionAdvice,
    metrics: [
      createPriceMetric(priceNow),
      {
        label: 'RSI (14)',
        value: rsi.toFixed(2),
        className: rsiClass
      },
      createPercentMetric('24 小时涨跌幅', change24h)
    ]
  }
}

function analyzeMomentum(base) {
  const { series, priceNow, change24h, change48h } = base
  const roc12 = computeRoc(series, 12)
  const roc24 = computeRoc(series, 24)

  if (roc12 === null || roc24 === null) {
    return null
  }

  let action = '保持观望'
  let tagType = 'info'
  const reasons = []

  if (roc12 > 1 && roc24 > 1.5) {
    action = '跟随上涨动能'
    tagType = 'success'
    reasons.push('12 小时与 24 小时动量均处于强劲正值，趋势有望延续。')
  } else if (roc12 < -1 && roc24 < -1.5) {
    action = '控制仓位'
    tagType = 'danger'
    reasons.push('短中期动量均转负，需防止下跌加速。')
  } else if (roc12 > 0 && roc24 > 0) {
    action = '逢低布局'
    tagType = 'primary'
    reasons.push('动量保持正向，可待回调后逐步加仓。')
  } else if (roc12 < 0 && roc24 > 0) {
    action = '等待回调确认'
    tagType = 'warning'
    reasons.push('短期动量放缓但中期仍为正，等待新的上行动能。')
  } else if (roc12 > 0 && roc24 < 0) {
    action = '关注反转信号'
    tagType = 'warning'
    reasons.push('短期动量转正但中期仍为负，需确认反转有效性。')
  } else {
    reasons.push('动量指标分歧明显，建议观望。')
  }

  const avgMomentum = (Math.abs(roc12) + Math.abs(roc24)) / 2
  const confidence = clamp(Math.round(avgMomentum * 10 + 35), 30, 88)

  reasons.push(`12 小时动量为 ${formatPercent(roc12)}，24 小时动量为 ${formatPercent(roc24)}。`)

  if (Math.abs(change24h) >= 1.5) {
    reasons.push(`24 小时价格变动为 ${formatPercent(change24h)}，动能信号更加明显。`)
  }
  if (Math.abs(change48h) >= 2.5) {
    reasons.push(`48 小时累计变动达到 ${formatPercent(change48h)}，需关注趋势持续性。`)
  }

  const entryLevels = [
    `顺势加仓：当 12 小时动量维持正值且价格突破前高时可分批跟进。`,
    `防守止损：若动量快速回落至 0 附近，建议减仓并将止损设在前一波低点下方 1.5%。`
  ]

  const positionAdvice = [
    '初始入场不超过计划仓位的 30%，确认动量延续后再逐步放大仓位。',
    '设置追踪止盈：动量转弱或跌破关键支撑时减仓 50% 以上。'
  ]

  return {
    action,
    tagType,
    confidence,
    reasons,
    entryLevels,
    positionAdvice,
    metrics: [
      createPriceMetric(priceNow),
      createPercentMetric('12 小时动量', roc12),
      createPercentMetric('24 小时动量', roc24)
    ]
  }
}

function analyzeBollinger(base) {
  const { closes, priceNow, change24h } = base
  const bands = calculateBollinger(closes, 20, 2)
  if (!bands) {
    return null
  }

  const { upper, lower, middle } = bands
  const distanceToUpper = ((priceNow - upper) / upper) * 100
  const distanceToLower = ((priceNow - lower) / lower) * 100
  const bandwidth = ((upper - lower) / middle) * 100

  let action = '观察区间波动'
  let tagType = 'info'
  const reasons = []

  if (priceNow > upper) {
    action = '警惕回落'
    tagType = 'warning'
    reasons.push('价格突破上轨，存在短期回调风险，可等待回踩确认。')
  } else if (priceNow < lower) {
    action = '关注反弹机会'
    tagType = 'success'
    reasons.push('价格跌破下轨，超卖信号出现，可观察反弹企稳。')
  } else if (priceNow > middle) {
    action = '顺势持有'
    tagType = 'primary'
    reasons.push('价格位于中轨之上，趋势偏多，关注上轨压力。')
  } else {
    action = '谨慎观望'
    tagType = 'info'
    reasons.push('价格位于中轨下方，仍需关注下轨支撑是否失守。')
  }

  if (bandwidth <= 6) {
    reasons.push('布林带收窄，可能酝酿趋势性突破。')
  } else if (bandwidth >= 12) {
    reasons.push('布林带张口较大，波动率显著提升。')
  }

  if (change24h >= 1.5) {
    reasons.push('近 24 小时上涨明显，可等待回踩中轨再行加仓。')
  } else if (change24h <= -1.5) {
    reasons.push('近 24 小时下跌明显，跌破下轨后的反弹力度值得关注。')
  }

  const entryLevels = [
    `进场参考：价格回踩中轨（约 ${formatPrice(middle)}）且保持在上轨之上，可少量开仓。`,
    `抄底关注：若下轨（约 ${formatPrice(lower)}）附近出现止跌信号，可尝试小仓位试探。`
  ]

  const positionAdvice = [
    '初次入场建议控制在计划仓位的 20%-30%，随着价格站稳中轨再逐步加仓。',
    '止损建议设在下轨下方 1.5%-2%，若价格跌破则及时减仓或止损。'
  ]

  return {
    action,
    tagType,
    confidence: clamp(Math.round((100 - Math.abs(distanceToUpper) - Math.abs(distanceToLower)) / 2 + 35), 30, 88),
    reasons,
    entryLevels,
    positionAdvice,
    metrics: [
      createPriceMetric(priceNow),
      {
        label: '布林带上轨',
        value: formatPrice(upper),
        className: 'is-positive'
      },
      {
        label: '布林带下轨',
        value: formatPrice(lower),
        className: 'is-negative'
      },
      createPercentMetric('带宽 (Upper-Lower)', bandwidth)
    ]
  }
}

function deriveTrendSummary(base) {
  const { change12h, change24h, change48h, closes, series } = base
  const rsi = calculateRsi(closes, 14)
  const roc12 = computeRoc(series, 12)
  const roc24 = computeRoc(series, 24)

  let trend = '市场波动温和'
  let suggestion = '可结合策略信号分批建仓。'

  if (change24h >= 2 || (roc24 ?? 0) > 1.5) {
    trend = '上升趋势较为明显'
    suggestion = '趋势策略（动量、双均线）更容易捕捉上涨节奏。'
  } else if (change24h <= -2 || (roc24 ?? 0) < -1.5) {
    trend = '下行压力偏大'
    suggestion = '关注风险控制，可结合动量或均线策略顺势而为。'
  } else if (Math.abs(roc12 ?? 0) < 0.5 && Math.abs(change24h) < 0.5) {
    trend = '横盘震荡为主'
    suggestion = '震荡策略（RSI、布林带）对短线交易更有参考价值。'
  } else {
    trend = '短期节奏反复'
    suggestion = '建议结合双均线确认方向或参考 RSI 分批进场。'
  }

  if (typeof rsi === 'number') {
    if (rsi >= 70) {
      suggestion += ' 同时 RSI 提示超买，注意回调风险。'
    } else if (rsi <= 30) {
      suggestion += ' RSI 进入超卖区，可关注反弹机会。'
    }
  }

  if (Math.abs(change48h) >= 3 && Math.abs(change24h) < 1) {
    suggestion += ' 近期波动趋缓，可能进入整理阶段。'
  }

  return `${trend}：${suggestion}`
}

function recommendStrategy(base) {
  const candidates = Object.entries(strategyMap)
    .filter(([key]) => key !== AUTO_STRATEGY_KEY)
    .map(([key, meta]) => {
      const result = meta.analyze(base)
      return result ? { key, meta, result } : null
    })
    .filter(Boolean)

  if (!candidates.length) {
    return null
  }

  const best = candidates.reduce((prev, curr) => (curr.result.confidence > prev.result.confidence ? curr : prev))
  const trendSummary = deriveTrendSummary(base)
  const context = best.meta.context ? `适用场景：${best.meta.context}` : ''
  const message = `推荐使用${best.meta.name}（置信度 ${best.result.confidence}%）。${context}`
  const autoReason = best.result.reasons?.length
    ? `系统推荐理由：${best.result.reasons[0]}`
    : '系统判定该策略当前信号最清晰。'

  return {
    key: best.key,
    meta: best.meta,
    result: best.result,
    message,
    autoReason,
    trendSummary
  }
}

function normalizeResult(result, extraReasons = []) {
  const metrics = toArray(result.metrics).map((metric) => ({ ...metric }))
  const baseReasons = toArray(result.reasons)
  const prefix = Array.isArray(extraReasons) ? extraReasons.filter(Boolean) : extraReasons ? [extraReasons] : []

  return {
    ...result,
    metrics,
    reasons: [...prefix, ...baseReasons],
    entryLevels: toArray(result.entryLevels),
    positionAdvice: toArray(result.positionAdvice)
  }
}

function decorateWithConfig(result) {
  const entryLevels = [...result.entryLevels]
  const positionAdvice = [...result.positionAdvice]

  if (config.tradeType === 'perpetual') {
    entryLevels.push('合约模式：建议预留至少 30% 保证金缓冲，避免被动减仓。')
    positionAdvice.push(`杠杆建议：控制在 ${config.leverage}x 以内，明确触发止损与减仓规则。`)
  } else {
    positionAdvice.push('现货模式：建议以现金分批建仓，避免一次性追高。')
  }

  switch (config.horizon) {
    case 'intraday':
      positionAdvice.push('日内交易：持仓时间控制在当日内，重要数据发布前清仓或减仓。')
      break
    case 'swing':
      positionAdvice.push('波段交易：关注 1-3 日节奏，可在关键支撑阻力位分批调整仓位。')
      break
    case 'position':
      positionAdvice.push('长线持有：建议分层建仓，并结合周线级别的止损/减仓计划。')
      break
    case 'dca':
      entryLevels.push(`定投提示：以${getDcaLabel(config.dcaInterval)}为周期执行固定金额投入。`)
      positionAdvice.push('定投模式：保持固定投入比例，极端波动时可额外增减 10%-20%。')
      break
    default:
      break
  }

  const riskAdviceMap = {
    low: '风险偏好保守：单次投入不超过计划资金的 25%，严格执行 1.5%-2% 止损。',
    medium: '风险偏好均衡：按信号强弱分批加仓，配合移动止损动态管理风险。',
    high: '风险偏好积极：可提高仓位但需准备备用资金，出现剧烈波动时及时减仓。'
  }
  positionAdvice.push(riskAdviceMap[config.riskLevel])

  const investmentAdviceMap = {
    small: '仓位规划：以计划资金的 30% 以内轻仓试探，保留弹性应对突发行情。',
    medium: '仓位规划：在 50%-70% 区间动态调整，加减仓前确认信号有效性。',
    large: '仓位规划：分三至四次逐步建仓，并设置明确的止损线与减仓节奏。'
  }
  positionAdvice.push(investmentAdviceMap[config.investmentSize])

  return {
    ...result,
    entryLevels: dedupeStrings(entryLevels),
    positionAdvice: dedupeStrings(positionAdvice),
    configSummary: buildConfigSummary()
  }
}

function buildConfigSummary() {
  const tradeTypeText = config.tradeType === 'spot'
    ? '现货模式'
    : `永续合约 · 杠杆 ${config.leverage}x`
  const horizonText = horizonOptions.find((item) => item.value === config.horizon)?.label ?? '—'
  const riskText = riskOptions.find((item) => item.value === config.riskLevel)?.label ?? '—'
  const investmentText = investmentOptions.find((item) => item.value === config.investmentSize)?.label ?? '—'

  const parts = [tradeTypeText, `周期：${horizonText}`]

  if (config.horizon === 'dca') {
    parts.push(`定投频率：${getDcaLabel(config.dcaInterval)}`)
  }

  parts.push(`风险偏好：${riskText}`)
  parts.push(`计划仓位：${investmentText}`)

  return parts.join('；')
}

function getDcaLabel(value) {
  return dcaOptions.find((item) => item.value === value)?.label ?? value
}

function dedupeStrings(list) {
  const seen = new Set()
  const result = []
  list.forEach((item) => {
    if (!item) return
    if (seen.has(item)) return
    seen.add(item)
    result.push(item)
  })
  return result
}

function createPriceMetric(price) {
  return {
    label: '最新价格',
    value: formatPrice(price),
    className: ''
  }
}

function createPercentMetric(label, value) {
  return {
    label,
    value: formatPercent(value),
    className: getSignClass(value)
  }
}

function getSignClass(value) {
  if (!Number.isFinite(value) || value === 0) return ''
  return value > 0 ? 'is-positive' : 'is-negative'
}

function formatPrice(value) {
  if (!Number.isFinite(value)) return '—'
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function formatDateTime(timestamp) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString()
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getStrategyDescription(key) {
  return strategyOptions.find((item) => item.value === key)?.description ?? ''
}

function getStrategyContext(key) {
  return strategyOptions.find((item) => item.value === key)?.context ?? ''
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }
  return value ? [value] : []
}
</script>

<style scoped>
.quant-strategy {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.quant-strategy__card {
  padding: 24px;
}

.quant-strategy__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 16px;
}

.quant-strategy__header h2 {
  margin: 0 0 4px;
  font-size: 24px;
}

.quant-strategy__header p {
  margin: 0;
  color: #606266;
}

.quant-strategy__badges {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.quant-strategy__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.quant-strategy__controls {
  margin-bottom: 16px;
}

.quant-strategy__form {
  gap: 16px;
}

.quant-strategy__hint {
  color: #909399;
  font-size: 13px;
  white-space: nowrap;
}

.quant-strategy__alert {
  margin-bottom: 16px;
}

.quant-strategy__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quant-strategy__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.quant-strategy__metric h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.quant-strategy__metric-value {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.quant-strategy__metric-value.is-positive {
  color: #27ae60;
}

.quant-strategy__metric-value.is-negative {
  color: #c0392b;
}

.quant-strategy__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  color: #909399;
  font-size: 13px;
}

.quant-strategy__asset-label {
  white-space: nowrap;
}
</style>
